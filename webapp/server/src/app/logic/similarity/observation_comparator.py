from sqlalchemy.orm import Session
import statistics
from scipy.stats import norm
import pint
from typing import Union

from fhir.resources.observation import Observation

from app.logic.fhir_helper import get_value_and_unit_for_observation
from app.logic.similarity.base_comparator import BaseComparator
from app.models.observation_data import ObservationData


class ObservationLoincComparator(BaseComparator):
    def __init__(self, db: Session):
        self.db = db

    def compare(
        self,
        observations_a: Union[list[Observation], Observation],
        observations_b: Union[list[Observation], Observation],
    ):
        if isinstance(observations_a, list) or isinstance(observations_b, list):
            return self._compare_set(observations_a, observations_b)
        else:
            return self._compare_pair(observations_a, observations_b)

    def _get_mean_std_for_loinc_code(self, code: str, out_unit: str):
        observations = (
            self.db.query(ObservationData).filter(ObservationData.code == code).all()
        )
        values = [o.value for o in observations]
        units = [o.unit for o in observations]
        uniform_values = self._get_uniform_values(
            values=values, units=units, out_unit=out_unit
        )  # convert values to same unit
        if len(uniform_values) < 2:
            return None
        mean = statistics.mean(uniform_values)
        std = statistics.stdev(uniform_values)
        return mean, std

    def _compare_pair(
        self,
        observation_a: Observation,
        observation_b: Observation,
        scale_by_percentile: bool = False,
    ) -> float:
        code_a = observation_a.code.coding[0].code
        code_b = observation_b.code.coding[0].code

        if code_a != code_b:
            raise ValueError("Observations must have the same code")

        value_1, unit_1 = get_value_and_unit_for_observation(observation_a)
        value_2, unit_2 = get_value_and_unit_for_observation(observation_b)

        out_unit = unit_1
        uniform_values = self._get_uniform_values(
            [value_1, value_2], [unit_1, unit_2], out_unit=out_unit
        )

        if len(uniform_values) < 2:
            return None

        value_1 = uniform_values[0]
        value_2 = uniform_values[1]

        mean, std = self._get_mean_std_for_loinc_code(code=code_a, out_unit=out_unit)
        z_1 = norm.cdf((value_1 - mean) / std)
        z_2 = norm.cdf((value_2 - mean) / std)
        if z_1 >= z_2:
            similarity = z_2 / z_1
        else:
            similarity = z_1 / z_2
        if scale_by_percentile:
            similarity *= (z_1 + z_2) / 2
        return similarity

    def _compare_set(
        self,
        observation_set_a: list[Observation],
        observation_set_b: list[Observation],
        out_unit: str = None,
        aggregation: str = "mean",
    ) -> float:
        similarities = []
        for observation_a in observation_set_a:
            similarities_a = []
            code_a = observation_a.code.coding[0].code
            for observation_b in observation_set_b:
                code_b = observation_b.code.coding[0].code
                if code_a == code_b:
                    similarity = self._compare_pair(
                        observation_a=observation_a,
                        observation_b=observation_b,
                    )
                    if similarity is not None:
                        similarities_a.append(similarity)
            if len(similarities_a) > 0:
                similarities.append(max(similarities_a))
        if len(similarities) == 0:
            return 0
        else:
            return statistics.mean(similarities)

    def _get_uniform_values(self, values: list, units: list, out_unit: str):
        if len(values) != len(units):
            raise ValueError("values and units must be same length")
        uniform_values = []
        for value, unit in zip(values, units):
            try:
                value = float(value)
            except Exception:
                continue  # TODO: handle non-numeric values
            if unit is not None:
                try:
                    new_value = value * pint.Unit(unit)
                except ValueError:
                    factor, unit = self._handle_unit_with_factor(
                        unit
                    )  # handle unit with factor
                    new_value = factor * value * pint.Unit(unit)
                except pint.UndefinedUnitError as e:  # unit not defined in pint, skip
                    print(e)
                    unit = None
                    new_value = value
                if unit is not None:
                    try:
                        new_value = new_value.to(out_unit).magnitude
                    except ValueError:
                        factor, out_unit = self._handle_unit_with_factor(out_unit)
                        new_value = factor * new_value.to(out_unit).magnitude
                else:
                    new_value = new_value
                uniform_values.append(new_value)
            else:
                uniform_values.append(value)
        return uniform_values

    def _parse_factor(self, factor: str):
        if "**" in factor:
            return eval(factor)
        elif "*" in factor:
            split_factor = factor.split("*")
            return float(split_factor[0]) ** float(split_factor[1])

    def _handle_unit_with_factor(self, unit: str):
        factor = None
        if "/" in unit:
            split_unit = unit.split("/")
            factor = split_unit[0]
            factor = self._parse_factor(factor)
            unit = f"1/{split_unit[1]}"
        elif "%" in unit:
            factor = 0.01
            unit = ""
        return float(factor), unit
