from dotenv import load_dotenv
from sqlalchemy.orm import Session
import statistics
from typing import Union

from fhir.resources.observation import Observation
from fhir.resources.condition import Condition

from app.logic.similarity.base_comparator import BaseComparator
from app.logic.similarity.observation_comparator import ObservationLoincComparator
from app.logic.similarity.snomed_comparator import SnomedComparator
from app.logic.fhir_helper import get_date_for_resource
from app.logic.fhir_helper import gather_references

load_dotenv()


class ClinicalEpisode:
    relevant_resources = [
        "Condition",
        "Observation",
        "AllergyIntolerance",
        "DiagnosticReport",
        "FamilyMemberHistory",
        "Procedure",
        "MedicationStatement",
        "MedicationRequest",
        "MedicationDispense",
        "MedicationAdministration",
        "Medication",
        "Immunization",
        "Encounter",
        "Specimen",
    ]

    def __init__(self, start, end, resources, prev_conditions=None, for_patient=None):
        self.start = start
        self.end = end
        self.resources = [
            resource
            for resource in resources
            if resource["resourceType"] in self.relevant_resources
        ]
        self.prev_conditions = prev_conditions
        self.for_patient = for_patient

    @property
    def observations(self):
        observations = [o for o in self.resources if o["resourceType"] == "Observation"]
        for o in observations:
            if "issued" in o:
                o.pop("issued")  # TODO: Problem with issued date
        return [Observation(**o) for o in observations]

    @property
    def conditions(self):
        conditions = [
            Condition(**r) for r in self.resources if r["resourceType"] == "Condition"
        ]
        return conditions

    @property
    def conditions_with_previous(self, with_previous: bool = False):
        conditions = [
            Condition(**r) for r in self.resources if r["resourceType"] == "Condition"
        ]
        previous_conditions = [
            Condition(**r)
            for r in self.prev_conditions
            if r["resourceType"] == "Condition"
        ]
        conditions.extend(previous_conditions)
        return conditions

    @classmethod
    def from_resources(cls, resources: list[dict], for_patient=None):
        """
        Creates a list of clinical episodes from a list of resources based on Conditions.
        """

        clinical_episodes = []
        resources = [r for r in resources if get_date_for_resource(r) is not None]
        sorted_resources = sorted(resources, key=lambda x: get_date_for_resource(x))
        encounters = gather_encounters(sorted_resources)

        episode_start = None
        episode_resources = []
        prev_conditions = []

        # Loop through the sorted resources
        for encounter in encounters:
            for index, resource in enumerate(encounter):
                resource_date = get_date_for_resource(resource)
                if episode_start is None:
                    episode_start = resource_date

                if resource["resourceType"] == "Condition":
                    episode_resources.extend(
                        encounter[index:]
                    )  # add entire encounter to episode

                    prev_episode = ClinicalEpisode(  # create episode
                        start=episode_start,
                        end=resource_date,  # date of condition is end of episode
                        resources=episode_resources,
                        prev_conditions=prev_conditions,
                        for_patient=for_patient,
                    )

                    prev_conditions.append(resource)
                    clinical_episodes.append(prev_episode)  # add episode to list

                    # reset episode
                    episode_resources = []
                    episode_start = resource_date
                    break  # break out of encounter loop
                else:
                    episode_resources.append(resource)

        # deal with resources that are not in an encounter
        flatten_encounters = [item["id"] for sublist in encounters for item in sublist]
        for resource in sorted_resources:
            if resource["id"] not in flatten_encounters:
                for episode in clinical_episodes:
                    if episode.start <= get_date_for_resource(resource) <= episode.end:
                        episode.resources.append(resource)
        return clinical_episodes


class ClinicalEpisodeComparator(BaseComparator):
    def __init__(self, db: Session):
        self.db = db

    def compare(
        self,
        patients_a: Union[list[ClinicalEpisode], ClinicalEpisode],
        patients_b,
        *args,
        **kwargs
    ) -> float:
        if isinstance(patients_a, list) or isinstance(patients_b, list):
            return self._compare_set(patients_a, patients_b)
        else:
            return self._compare_pair(patients_a, patients_b)

    def _compare_pair(
        self,
        episode_a: ClinicalEpisode,
        episode_b: ClinicalEpisode,
        aggregate: str = "mean",
    ) -> float:
        observation_comparator = ObservationLoincComparator(db=self.db)
        condition_comparator = SnomedComparator(db=self.db)

        observation_similarity = observation_comparator._compare_set(
            episode_a.observations, episode_b.observations
        )

        condition_similarity = condition_comparator._compare_set(
            episode_a.conditions_with_previous, episode_b.conditions_with_previous
        )

        similarity = statistics.mean([observation_similarity, condition_similarity])
        return similarity

    def _compare_set(self, clinical_episodes_a, clinical_episodes_b) -> float:
        similarities = []
        for episode_a in clinical_episodes_a:
            similarities_a = []
            for episode_b in clinical_episodes_b:
                similarity = self._compare_pair(episode_a, episode_b)
                if similarity is not None:
                    similarities_a.append(similarity)
            if len(similarities_a) > 0:
                similarities.append(max(similarities_a))
        if len(similarities) == 0:
            return 0
        else:
            return statistics.mean(similarities)


def gather_encounters(resources: list[dict]) -> list[list[dict]]:
    """Creates lists of resources that are in the same encounter

    Args:
        resources (list[dict]): List of resources

    Returns:
        list[list[dict]]: List of lists of resources that are in the same encounter.
        The first resource in each list is the encounter resource.
    """
    encounters = [[r] for r in resources if r["resourceType"] == "Encounter"]
    for resource in resources:
        if resource["resourceType"] == "Encounter":
            continue
        references = gather_references(resource)
        for reference in references:
            for encounter in encounters:
                if reference.reference == encounter[0]["id"]:
                    encounter.append(resource)
    return encounters
