import * as resources from "fhir/r4";
import { ConnectionData } from "../../hooks/useConnections";
import { getDisplaysForResource } from "../../utils";

export function convertDataToVisTimeline(data: ConnectionData) {
  let timelineData = data.connections.map((resource: resources.Resource) => {
    return {
      id: resource.id,
      content: resource.resourceType,
      className: resource.resourceType,
      start: getDateForResource(resource),
    };
  });
  timelineData = timelineData.filter((item) => item.start !== undefined);
  return timelineData;
}

export function convertDataToVisNetwork(data: ConnectionData) {
  const nodes = data.connections.map((resource: resources.Resource) => {
    return {
      id: resource.id,
      label: resource.resourceType,
    };
  });
  const edges = data.edges?.map((edge) => {
    return {
      from: edge[0],
      to: edge[1],
    };
  });
  const networkData = {
    nodes: nodes,
    edges: edges,
  };
  return networkData;
}

function roundValue(value: number, decimals: number) {
  return Number(Math.round(Number(value + "e" + decimals)) + "e-" + decimals);
}

export function getDisplayForResource(resource: resources.Resource) {
  const resourceType = resource.resourceType;
  let display;
  let value;
  switch (resourceType) {
    case "Condition":
      const condition = resource as resources.Condition;
      if (condition.code?.text) {
        display = condition.code.text;
      } else if (condition.code?.coding) {
        display = condition.code.coding[0].display;
      }
      break;
    case "Observation":
      const observation = resource as resources.Observation;
      if (observation.valueQuantity) {
        if (observation.valueQuantity.value) {
          value = roundValue(observation.valueQuantity.value, 2);
          value = value + " " + observation.valueQuantity.unit;
        }
      }

      if (observation.code?.text) {
        display = observation.code.text;
      } else if (observation.code?.coding) {
        display = observation.code.coding[0].display;
      }
      if (value) {
        display = display + " (" + value + ")";
      }
      break;
    case "Procedure":
      const procedure = resource as resources.Procedure;
      if (procedure.code?.text) {
        display = procedure.code.text;
      } else if (procedure.code?.coding) {
        display = procedure.code.coding[0].display;
      }
      break;
    case "MedicationRequest":
      const medicationRequest = resource as resources.MedicationRequest;
      if (medicationRequest.medicationCodeableConcept) {
        display = medicationRequest.medicationCodeableConcept.text;
      }
      break;
    case "Encounter":
      const encounter = resource as resources.Encounter;
      if (encounter.type) {
        if (encounter.type[0].text) {
          display = encounter.type[0].text;
        } else if (encounter.type[0].coding) {
          display = encounter.type[0].coding[0].display;
        }
      }
      break;
    case "DiagnosticReport":
      const diagnosticReport = resource as resources.DiagnosticReport;
      if (diagnosticReport.code) {
        if (diagnosticReport.code.text) {
          display = diagnosticReport.code.text;
        } else if (diagnosticReport.code.coding) {
          display = diagnosticReport.code.coding[0].display;
        }
      }
      break;
    case "AllergyIntolerance":
      const allergyIntolerance = resource as resources.AllergyIntolerance;
      if (allergyIntolerance.code) {
        if (allergyIntolerance.code.text) {
          display = allergyIntolerance.code.text;
        } else if (allergyIntolerance.code?.coding) {
          display = allergyIntolerance.code.coding[0].display;
        }
      }
      break;
    case "Claim":
      const claim = resource as resources.Claim;
      if (claim.type) {
        display = claim.type.text;
      }
      break;
    case "Immunization":
      const immunization = resource as resources.Immunization;
      if (immunization.vaccineCode) {
        display = immunization.vaccineCode.text;
      }
      break;
    case "CarePlan":
      const carePlan = resource as resources.CarePlan;
      if (carePlan.category) {
        display = carePlan.category[0].text;
      }
      break;
    case "ExplanationOfBenefit":
      const explanationOfBenefit = resource as resources.ExplanationOfBenefit;
      if (explanationOfBenefit.type) {
        if (explanationOfBenefit.type.coding) {
          display = explanationOfBenefit.type.coding[0].display;
        } else if (explanationOfBenefit.type.text) {
          display = explanationOfBenefit.type.text;
        }
      }
      break;
    default:
      break;
  }
  return display;
}

export function getDateForResource(resource: resources.Resource) {
  const resourceType = resource.resourceType;
  let date;
  switch (resourceType) {
    case "Condition":
      const condition = resource as resources.Condition;
      if (condition.recordedDate) {
        date = condition.recordedDate;
      } else if (condition.onsetDateTime) {
        date = condition.onsetDateTime;
      } else if (condition.onsetPeriod) {
        date = condition.onsetPeriod.start;
      } else if (condition.onsetRange) {
        date = condition.onsetRange.low;
      } else if (condition.onsetString) {
        date = condition.onsetString;
      } else if (condition.onsetAge) {
        date = condition.onsetAge.value;
      } else {
        date = undefined;
      }
      break;
    case "Observation":
      const observation = resource as resources.Observation;
      if (observation.effectiveDateTime) {
        date = observation.effectiveDateTime;
      } else if (observation.effectivePeriod) {
        date = observation.effectivePeriod.start;
      } else if (observation.effectiveTiming) {
        if (observation.effectiveTiming.event) {
          date = observation.effectiveTiming.event[0];
        }
      } else if (observation.effectiveInstant) {
        date = observation.effectiveInstant;
      } else {
        date = undefined;
      }
      break;
    case "MedicationRequest":
      const medicationRequest = resource as resources.MedicationRequest;
      if (medicationRequest.authoredOn) {
        date = medicationRequest.authoredOn;
      } else {
        date = undefined;
      }
      break;
    case "Procedure":
      const procedure = resource as resources.Procedure;
      if (procedure.performedDateTime) {
        date = procedure.performedDateTime;
      } else if (procedure.performedPeriod) {
        date = procedure.performedPeriod.start;
      } else {
        date = undefined;
      }
      break;
    case "Immunization":
      const immunization = resource as resources.Immunization;
      if (immunization.occurrenceDateTime) {
        date = immunization.occurrenceDateTime;
      } else {
        date = undefined;
      }
      break;
    case "Encounter":
      const encounter = resource as resources.Encounter;
      if (encounter.period) {
        date = encounter.period.start;
      } else {
        date = undefined;
      }
      break;
    case "AllergyIntolerance":
      const allergyIntolerance = resource as resources.AllergyIntolerance;
      if (allergyIntolerance.recordedDate) {
        date = allergyIntolerance.recordedDate;
      } else if (allergyIntolerance.onsetDateTime) {
        date = allergyIntolerance.onsetDateTime;
      } else if (allergyIntolerance.onsetPeriod) {
        date = allergyIntolerance.onsetPeriod.start;
      } else if (allergyIntolerance.onsetRange) {
        date = allergyIntolerance.onsetRange.low;
      } else if (allergyIntolerance.onsetString) {
        date = allergyIntolerance.onsetString;
      } else {
        date = undefined;
      }
      break;
    case "CarePlan":
      const carePlan = resource as resources.CarePlan;
      if (carePlan.period) {
        date = carePlan.period.start;
      } else {
        date = undefined;
      }
      break;
    case "Claim":
      const claim = resource as resources.Claim;
      if (claim.created) {
        date = claim.created;
      } else {
        date = undefined;
      }
      break;
    case "DiagnosticReport":
      const diagnosticReport = resource as resources.DiagnosticReport;
      if (diagnosticReport.effectiveDateTime) {
        date = diagnosticReport.effectiveDateTime;
      } else if (diagnosticReport.effectivePeriod) {
        date = diagnosticReport.effectivePeriod.start;
      } else {
        date = undefined;
      }
      break;
    default:
      break;
  }
  if (date !== undefined && date !== null) {
    return date as string;
  }
}
