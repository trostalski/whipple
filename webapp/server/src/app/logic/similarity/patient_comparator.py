from sqlalchemy.orm import Session
import requests
import math

from fhir.resources.condition import Condition
from fhir.resources.observation import Observation
from fhir.resources.patient import Patient

from app.logic.similarity.clinical_episode import (
    ClinicalEpisode,
    ClinicalEpisodeComparator,
)
from app.logic.similarity.observation_comparator import ObservationLoincComparator
from app.logic.similarity.snomed_comparator import SnomedComparator
from app.models.condition_data import ConditionData
from app.logic.similarity.base_comparator import BaseComparator
from app.logic.similarity.patient_data_comparator import PatientDataComparator
from app.logic.resource import get_connections
from app.logic.fhir_helper import parse_patient_id


class PatientComparator:
    def __init__(self, db: Session, workspace_id: int):
        self.db = db
        self.workspace_id = workspace_id

    def compare_patient_data(self, patient_a: Patient, patient_b: Patient):
        patient_data_comparator = PatientDataComparator(self.db)
        simmilarity = patient_data_comparator.compare(patient_a, patient_b)
        return simmilarity

    def compare_observations(self, patient_a: Patient, patient_b: Patient):
        observation_comparator = ObservationLoincComparator(self.db)
        observations_a = get_connections(
            db=self.db,
            resource=patient_a,
            resource_types=["Observation"],
            workspace_id=self.workspace_id,
        )
        observations_b = get_connections(
            db=self.db,
            resource=patient_b,
            resource_types=["Observation"],
            workspace_id=self.workspace_id,
        )
        observations_a = [Observation(**o) for o in observations_a]
        observations_b = [Observation(**o) for o in observations_b]
        simmilarity = observation_comparator.compare(observations_a, observations_b)
        return simmilarity

    def compare_conditions(self, patient_a: Patient, patient_b: Patient):
        condition_comparator = SnomedComparator(self.db)
        conditions_a = get_connections(
            db=self.db,
            resource=patient_a,
            resource_types=["Condition"],
            workspace_id=self.workspace_id,
        )
        conditions_b = get_connections(
            db=self.db,
            resource=patient_b,
            resource_types=["Condition"],
            workspace_id=self.workspace_id,
        )
        conditions_a = [Condition(**c) for c in conditions_a]
        conditions_b = [Condition(**c) for c in conditions_b]
        simmilarity = condition_comparator.compare(conditions_a, conditions_b)
        return simmilarity

    def compare_episodes(self, patient_a: Patient, patient_b: Patient):
        episode_comparator = ClinicalEpisodeComparator(self.db)
        resources_a = get_connections(
            db=self.db,
            resource=patient_a,
            workspace_id=self.workspace_id,
        )
        resources_b = get_connections(
            db=self.db,
            resource=patient_b,
            workspace_id=self.workspace_id,
        )
        episodes_a = ClinicalEpisode.from_resources(resources_a)
        episodes_b = ClinicalEpisode.from_resources(resources_b)
        simmilarity = episode_comparator.compare(episodes_a, episodes_b)  # TODO
        return simmilarity

    def get_condition_tfid(self, condition: Condition):
        code = condition.code.coding[0].code

        if not code:
            raise ValueError("No code found.")

        patient_id = parse_patient_id(condition.subject.reference)
        patient_conditions = self.db.query(ConditionData.code).filter(
            ConditionData.patient_id == patient_id
        )
        patient_condition_count = patient_conditions.count()
        patient_code_count = patient_conditions.filter(
            ConditionData.code == code
        ).count()
        tf = patient_code_count / patient_condition_count
        total_patients_count = (
            self.db.query(ConditionData.patient_id).distinct().count()
        )
        patients_with_code_count = (
            self.db.query(ConditionData.patient_id)
            .filter(ConditionData.code == code)
            .distinct()
            .count()
        )
        idf = math.log(total_patients_count / patients_with_code_count)
        return tf * idf
