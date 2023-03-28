from typing import Iterable, Generator, List
from urllib.parse import urlparse
from uuid import UUID

from fhir.resources.reference import Reference
from fhir.resources.observation import Observation
from fhir.resources.resource import Resource
from fhir.resources.condition import Condition
from fhir.resources.observation import Observation
from fhir.resources.medicationrequest import MedicationRequest
from fhir.resources.procedure import Procedure
from fhir.resources.immunization import Immunization
from fhir.resources.encounter import Encounter
from fhir.resources.allergyintolerance import AllergyIntolerance
from fhir.resources.careplan import CarePlan
from fhir.resources.claim import Claim
from fhir.resources.diagnosticreport import DiagnosticReport
from fhir.resources.explanationofbenefit import ExplanationOfBenefit


from .constants import RESOURCE_LIST


def get_references_generator(input: Iterable) -> Generator[Reference, None, None]:
    """Returns a generator for all values in a dictionary of the specified key.
    E.g. this is used to extract all references of a FHIR resource."""

    target_key = "reference"
    if isinstance(input, list):
        for item in input:
            yield from get_references_generator(item)

    if isinstance(input, dict):
        for k, v in input.items():
            if k == target_key:
                yield Reference(**input)
            else:
                yield from get_references_generator(v)


def is_absolute_or_relative(id: str):
    """Checks if the provided id is a relative id (e.g. Patient/123)"""
    result = False
    id = urlparse(id).path  # extract path from url
    path_elements = id.split("/")
    if len(path_elements) >= 2:  # format [RESOURCE]/[ID]
        resource_type = path_elements[-2].capitalize()
        if resource_type in RESOURCE_LIST:
            result = True
    return result


def is_uuid(id: str):
    try:
        UUID(id)
        return True
    except ValueError:
        return False


def get_id_from_uuid(uuid: str) -> str:
    """Extracts the id from a uuid"""
    return uuid.split(":")[-1]


def gather_references(resource: dict) -> List[tuple[Reference]]:
    result = []
    for reference in get_references_generator(resource):
        if is_absolute_or_relative(reference.reference):
            reference_id = reference.reference.split("/")
            reference_id = (
                reference_id[-2].capitalize() + "/" + reference_id[-1]
            )  # -2 is the resource, -1 is the id
        elif is_uuid(reference.reference):
            reference_id = get_id_from_uuid(reference.reference)

        elif reference.type:
            reference_id = reference.type + "/" + reference.reference
        else:
            continue
        reference.reference = reference_id
        result.append(reference)
    return result


def parse_patient_id(patient_id: str):
    """Parse patient id to be in the format Patient/1234"""
    if is_uuid(patient_id):
        patient_id = "Patient/" + get_id_from_uuid(patient_id)
    elif len(patient_id.split("/")) == 1:
        patient_id = "Patient/" + patient_id
    return patient_id


def get_value_and_unit_for_observation(observation) -> tuple[str, str]:
    """Extracts the value from an observation resource"""
    value = None
    unit = None
    if "issued" in observation:
        del observation["issued"]  # TODO: problem with issued date
    if not isinstance(observation, Observation):
        observation = Observation(**observation)
    if observation.valueQuantity:
        value = observation.valueQuantity.value
        unit = observation.valueQuantity.unit
    elif observation.valueCodeableConcept:
        value = observation.valueCodeableConcept.text
    elif observation.valueString:
        value = observation.valueString
    elif observation.valueBoolean:
        value = observation.valueBoolean
    elif observation.valueInteger:
        value = observation.valueInteger
    elif observation.valueRange:
        value = observation.valueRange.low
    elif observation.valueRatio:
        value = observation.valueRatio.denominator
    elif observation.valueSampledData:
        value = observation.valueSampledData.data
    elif observation.valueTime:
        value = observation.valueTime
    elif observation.valueDateTime:
        value = observation.valueDateTime
    elif observation.valuePeriod:
        value = observation.valuePeriod.start

    return value, unit


def get_date_for_resource(resource: dict):
    if "issued" in resource:
        resource.pop("issued")  # TODO: sth wrong with issued date
    resource_type = resource["resourceType"]
    date = None
    if resource_type == "Condition":
        condition = Condition(**resource)
        if condition.recordedDate:
            date = condition.recordedDate
        elif condition.onsetDateTime:
            date = condition.onsetDateTime
        elif condition.onsetPeriod:
            date = condition.onsetPeriod.start
        elif condition.onsetRange:
            date = condition.onsetRange.low
        elif condition.onsetString:
            date = condition.onsetString
        elif condition.onsetAge:
            date = condition.onsetAge.value
        else:
            date = None
    elif resource_type == "Observation":
        observation = Observation(**resource)
        if observation.effectiveDateTime:
            date = observation.effectiveDateTime
        elif observation.effectivePeriod:
            date = observation.effectivePeriod.start
        elif observation.effectiveTiming:
            date = observation.effectiveTiming.event[0]
        elif observation.effectiveInstant:
            date = observation.effectiveInstant
        elif observation.effectivePeriod:
            date = observation.effectivePeriod.start
        elif observation.effectiveRange:
            date = observation.effectiveRange.low
        else:
            date = None
    elif resource_type == "MedicationRequest":
        medication_request = MedicationRequest(**resource)
        if medication_request.authoredOn:
            date = medication_request.authoredOn
        elif medication_request.authoredOnDateTime:
            date = medication_request.authoredOnDateTime
        elif medication_request.authoredOnPeriod:
            date = medication_request.authoredOnPeriod.start
        else:
            date = None
    elif resource_type == "Procedure":
        procedure = Procedure(**resource)
        if procedure.performedDateTime:
            date = procedure.performedDateTime
        elif procedure.performedPeriod:
            date = procedure.performedPeriod.start
        elif procedure.performedString:
            date = procedure.performedString
        elif procedure.performedAge:
            date = procedure.performedAge.value
        elif procedure.performedRange:
            date = procedure.performedRange.low
        else:
            date = None
    elif resource_type == "Immunization":
        immunization = Immunization(**resource)
        if immunization.occurrenceDateTime:
            date = immunization.occurrenceDateTime
        elif immunization.occurrencePeriod:
            date = immunization.occurrencePeriod.start
        elif immunization.occurrenceTiming:
            date = immunization.occurrenceTiming.event[0]
        elif immunization.occurrenceString:
            date = immunization.occurrenceString
        elif immunization.occurrenceAge:
            date = immunization.occurrenceAge.value
        elif immunization.occurrenceRange:
            date = immunization.occurrenceRange.low
        else:
            date = None
    elif resource_type == "Encounter":
        encounter = Encounter(**resource)
        if encounter.period:
            date = encounter.period.start
        else:
            date = None
    elif resource_type == "AllergyIntolerance":
        allergy_intolerance = AllergyIntolerance(**resource)
        if allergy_intolerance.onsetDateTime:
            date = allergy_intolerance.onsetDateTime
        elif allergy_intolerance.onsetPeriod:
            date = allergy_intolerance.onsetPeriod.start
        elif allergy_intolerance.onsetString:
            date = allergy_intolerance.onsetString
        elif allergy_intolerance.onsetAge:
            date = allergy_intolerance.onsetAge.value
        elif allergy_intolerance.onsetRange:
            date = allergy_intolerance.onsetRange.low
        else:
            date = None
    elif resource_type == "CarePlan":
        care_plan = CarePlan(**resource)
        if care_plan.period:
            date = care_plan.period.start
        else:
            date = None
    elif resource_type == "Claim":
        claim = Claim(**resource)
        if claim.billablePeriod:
            date = claim.billablePeriod.start
        else:
            date = None
    elif resource_type == "DiagnosticReport":
        diagnostic_report = DiagnosticReport(**resource)
        if diagnostic_report.effectiveDateTime:
            date = diagnostic_report.effectiveDateTime
        elif diagnostic_report.effectivePeriod:
            date = diagnostic_report.effectivePeriod.start
        elif diagnostic_report.effectiveTiming:
            date = diagnostic_report.effectiveTiming.event[0]
        elif diagnostic_report.effectiveInstant:
            date = diagnostic_report.effectiveInstant
        elif diagnostic_report.effectivePeriod:
            date = diagnostic_report.effectivePeriod.start
        elif diagnostic_report.effectiveRange:
            date = diagnostic_report.effectiveRange.low
        else:
            date = None
    elif resource_type == "ExplanationOfBenefit":
        explanation_of_benefit = ExplanationOfBenefit(**resource)
        if explanation_of_benefit.billablePeriod:
            date = explanation_of_benefit.billablePeriod.start
        else:
            date = None
    else:
        date = None
    return date
