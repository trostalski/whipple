from sqlalchemy import func
from sqlalchemy.orm import Session
import numpy as np

from app import models, schemas
from app.logic.constants import ALL_CODE


def create_dashboard_card(
    db: Session,
    dashboard_card: schemas.DashboardCardIn,
    workspace_id: int,
):
    db_dashboard_card = models.DashboardCard(
        title=dashboard_card.title,
        info=dashboard_card.info,
        subject=dashboard_card.subject,
        targets=dashboard_card.targets,
        content=dashboard_card.content,
        specimen=dashboard_card.specimen,
        chart_type=dashboard_card.chart_type,
        workspace_id=workspace_id,
    )
    db.add(db_dashboard_card)
    db.commit()
    db.refresh(db_dashboard_card)
    return db_dashboard_card


def get_dashboard_card_by_id(db: Session, dashboard_card_id: int):
    return (
        db.query(models.DashboardCard)
        .filter(models.DashboardCard.id == dashboard_card_id)
        .first()
    )


def get_dashboard_cards(
    db: Session, workspace_id: int, skip: int = 0, limit: int = 100
):
    return (
        db.query(models.DashboardCard)
        .filter(models.DashboardCard.workspace_id == workspace_id)
        .offset(skip)
        .limit(limit)
        .all()
    )


def delete_dashboard_card(db: Session, dashboard_card: models.DashboardCard):
    db.delete(dashboard_card)
    db.commit()
    return dashboard_card


def update_dashboard_card(
    db: Session,
    dashboard_card_in: models.DashboardCard,
    db_dashboard_card: schemas.DashboardCardIn,
):
    for key, value in dashboard_card_in:
        if value is not None:
            setattr(db_dashboard_card, key, value)
    db.add(db_dashboard_card)
    db.commit()
    return db_dashboard_card


def get_dashboard_card_data(db: Session, dashboard_card: schemas.DashboardCardIn):
    if dashboard_card.content == "Observation":
        data = get_observation_data(db, dashboard_card)
    elif dashboard_card.content == "Condition":
        data = get_condition_data(db, dashboard_card)
    return data


def get_observation_data(db: Session, dashboard_card: schemas.DashboardCardIn):
    if dashboard_card.chart_type == "boxplot":
        return get_observation_data_for_boxplot(db, dashboard_card)
    if dashboard_card.subject == "dataset":
        db_data = get_observation_data_for_datasets(
            db, dashboard_card.targets, dashboard_card.specimen
        )
    elif dashboard_card.subject == "patient":
        db_data = get_observation_data_for_patients(
            db, dashboard_card.targets, dashboard_card.specimen
        )
    return transform_observation_data_for_chartjs(db_data, dashboard_card.subject)


def transform_observation_data_for_chartjs(
    observation_data_list: list[models.ObservationData], subject: str
):
    unit = None
    datasets = []
    labels = []
    for observation_data in observation_data_list:
        if len(observation_data) == 0:
            continue
        if subject == "dataset":
            label = observation_data[0].dataset_id
        elif subject == "patient":
            label = observation_data[0].patient_id
        data = [d.value for d in observation_data]
        labels.extend([d.date for d in observation_data])
        units = [
            d.unit for d in observation_data if d.unit is not None and unit is None
        ]
        if len(units) > 0:
            unit = units[0]
        datasets.append({"label": label, "data": data})
    return {
        "labels": labels,
        "unit": unit,
        "datasets": datasets,
    }


def get_condition_data(db: Session, dashboard_card: schemas.DashboardCardIn):
    if dashboard_card.subject == "dataset":
        db_data = get_condition_data_for_datasets(db, dashboard_card.targets)
    elif dashboard_card.subject == "patient":
        db_data = get_condition_data_for_patients(db, dashboard_card.targets)
    else:
        raise ValueError("Invalid subject")
    labels = []
    data = []
    for d in db_data:
        labels.append(d[0])
        data.append(d[1])
    return {"labels": labels, "datasets": [{"data": data}]}


def get_observation_data_for_datasets(
    db: Session, dataset_ids, specimen
) -> list[models.ObservationData]:
    db_data = []
    for dataset_id in dataset_ids:
        target_data = (
            db.query(models.ObservationData)
            .filter(models.ObservationData.display == specimen)
            .filter(models.ObservationData.dataset_id == dataset_id)
            .all()
        )
        db_data.append(target_data)
    return db_data


def get_observation_data_for_patients(
    db: Session, patient_ids, specimen
) -> list[models.ObservationData]:
    db_data = []
    for patient_id in patient_ids:
        target_data = (
            db.query(models.ObservationData)
            .filter(models.ObservationData.display == specimen)
            .filter(models.ObservationData.patient_id == patient_id)
            .all()
        )
        db_data.append(target_data)
    return db_data


def get_observation_data_for_boxplot(
    db: Session, dashboard_card: schemas.DashboardCardIn
):
    db_data = []
    for target in dashboard_card.targets:
        target_data = db.query(models.ObservationData).filter(
            models.ObservationData.display == dashboard_card.specimen
        )
        if dashboard_card.subject == "dataset":
            target_data = target_data.filter(
                models.ObservationData.dataset_id == target
            )
        elif dashboard_card.subject == "patient":
            target_data = target_data.filter(
                models.ObservationData.patient_id == target
            )
        target_data = target_data.all()
        db_data.append(target_data)
    unit = None
    datasets = [{"data": []}]
    labels = []
    for items, target in zip(db_data, dashboard_card.targets):
        labels.append(target)
        if len(items) == 0:
            datasets[0]["data"].append({})
            continue
        values = np.asarray(
            [
                float(d.value)
                for d in items
                if d.value is not None and d.value.isnumeric()
            ]
        )
        if len(values) == 0:
            datasets[0]["data"].append({})
            continue
        min_value = np.min(values)
        max_value = np.max(values)
        q1 = np.percentile(values, 25)
        q2 = np.percentile(values, 50)
        q3 = np.percentile(values, 75)
        mean = np.mean(values)
        data = {
            "min": min_value,
            "max": max_value,
            "q1": q1,
            "median": q2,
            "q3": q3,
            "mean": mean,
        }
        datasets[0]["data"].append(data)
        units = [d.unit for d in items if d.unit is not None and unit is None]
        if len(units) > 0:
            unit = units[0]
    return {"labels": labels, "datasets": datasets, "unit": unit}


def get_condition_data_for_datasets(db: Session, dataset_ids):
    db_data = []
    for dataset_id in dataset_ids:
        target_data = (
            db.query(
                models.ConditionData.display, func.count(models.ConditionData.display)
            )
            .filter(models.ConditionData.dataset_id == dataset_id)
            .group_by(models.ConditionData.display)
            .order_by(func.count(models.ConditionData.display).desc())
            .all()
        )
        db_data.extend(target_data)
    return db_data


def get_condition_data_for_patients(db: Session, patient_ids):
    db_data = []
    for patient_id in patient_ids:
        target_data = (
            db.query(
                models.ConditionData.display, func.count(models.ConditionData.display)
            )
            .filter(models.ConditionData.patient_id == patient_id)
            .group_by(models.ConditionData.display)
            .order_by(func.count(models.ConditionData.display).desc())
            .all()
        )
        db_data.extend(target_data)
    return db_data
