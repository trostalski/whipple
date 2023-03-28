from sqlalchemy.orm import Session
from typing import Union
import datetime
import statistics

from fhir.resources.patient import Patient


def calculate_age(birth_date: Union[str, datetime.datetime]) -> int:
    if isinstance(birth_date, datetime.datetime):
        birth_date = birth_date.strftime("%Y-%m-%d")
    elif isinstance(birth_date, datetime.date):
        birth_date = birth_date.strftime("%Y-%m-%d")
    birth_date = birth_date.split("-")
    birth_date = [int(x) for x in birth_date]
    today = datetime.date.today()
    age = (
        today.year
        - birth_date[0]
        - ((today.month, today.day) < (birth_date[1], birth_date[2]))
    )
    return age


class PatientDataComparator:
    def __init__(self, db: Session):
        self.db = db

    def compare(
        self,
        resources_a: Union[list[Patient], Patient],
        resources_b: Union[list[Patient], Patient],
    ) -> float:
        age_similarity = self._compare_age(resources_a, resources_b)
        gender_similarity = self._compare_gender(resources_a, resources_b)
        return statistics.mean([age_similarity, gender_similarity])

    def _compare_age(self, patient_a: Patient, patient_b: Patient) -> float:
        birthdate_a = patient_a.birthDate
        birthdate_b = patient_b.birthDate

        age_a = calculate_age(birthdate_a)
        age_b = calculate_age(birthdate_b)

        return 1 - abs(age_a - age_b) / max(age_a, age_b)

    def _compare_gender(self, patient_a: Patient, patient_b: Patient) -> float:
        gender_a = patient_a.gender
        gender_b = patient_b.gender

        return int(gender_a == gender_b)
