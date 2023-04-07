import csv
from fhirpathpy import evaluate

from app.logic.fhir_helper import is_bundle

DIR_PREFIX = "data/csv_files"


def fhir_to_csv(
    resources: dict | list, paths: list[str], output_file: str = "output.csv"
):
    if is_bundle(resources):  # is bundle
        resources = [entry["resource"] for entry in resources["entry"]]
    elif isinstance(resources, dict):
        resources = [resources]

    data = {p: [] for p in paths}

    for resource in resources:
        for p in paths:
            evaluate_res = evaluate(resource, p)
            if len(evaluate_res) == 1:
                evaluate_res = evaluate_res[0]
            elif len(evaluate_res) == 0:
                evaluate_res = ""
            data[p].append(evaluate_res)
    with open(output_file, "w", newline="") as csvfile:
        writer = csv.writer(csvfile)
        writer.writerow(data.keys())
        writer.writerows(zip(*data.values()))
    return data
