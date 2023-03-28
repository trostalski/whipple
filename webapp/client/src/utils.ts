import { Bundle, Resource } from "fhir/r4";
import { fetchUrl } from "./api/graph-data";
import { Row } from "./old/old_search/SearchTable";

export const encodeResourceId = (resourceId: string) => {
  return resourceId.replace("/", "_");
};

export const getMinDate = (dates: Date[]) => {
  let minDate = new Date();
  dates.forEach((date) => {
    if (date < minDate) {
      minDate = date;
    }
  });
  return minDate;
};

export const getTimeDiffInDays = (startDate: Date, endDate: Date) => {
  const diffMs = endDate.getTime() - startDate.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
};

export const isObject = (input: any) => {
  return typeof input === "object" && !Array.isArray(input) && input !== null;
};

export const isString = (input: any) => {
  return typeof input == "string";
};

export const stripTypeFromId = (resourceId: string) => {
  const splitId = resourceId.split("/");
  return splitId.at(-1);
};

export const formatDateString = (inputDate: string) => {
  const date = new Date(inputDate);
  const localDateString = date.toLocaleDateString();
  let result = undefined;

  if (!(localDateString === "Invalid Date")) {
    result = localDateString;
  }
  return result;
};

// any type here because of problems with react-select
export const arrayToOptions = (input: string[]) => {
  const result: any[] = [];
  input.map((item) => {
    const temp = { value: item, label: item };
    result.push(temp);
  });
  return result;
};

export const bundleToTableData = (bundle: Bundle) => {
  const data: Row[] = [];
  bundle.entry?.map((entry) => {
    const displayValues = getDisplaysForResource(entry.resource);
    data.push({
      id: entry.resource?.id!,
      resourceType: entry.resource?.resourceType!,
      display: displayValues,
    });
  });
  return data;
};

export function* getValuesForKeyGen(
  resource: any,
  target: string = "display"
): any {
  for (const key of Object.keys(resource)) {
    if (key === target && typeof resource[key] == "string") {
      yield resource[key];
    } else if (isObject(resource[key])) {
      yield* getValuesForKeyGen(resource[key], target);
    } else if (Array.isArray(resource[key])) {
      for (const item of resource[key]) {
        yield* getValuesForKeyGen(item, target);
      }
    }
  }
}

export const getDisplaysForResource = (resource: any) => {
  const displayValues: string[] = [];
  for (const value of getValuesForKeyGen(resource, "display")) {
    displayValues.push(value);
  }
  return displayValues.join(", ");
};

export const getBundleLinkByRelation = (bundle: Bundle, relation: string) => {
  const links = bundle.link;
  let result: string | undefined = undefined;
  links?.forEach((link) => {
    if (link.relation === relation) {
      result = link.url;
    }
  });
  return result;
};

export const getFullDataFromBundleUrl = async (url: string) => {
  console.log("downloading… ");
  let resultBundle: Bundle = await fetchUrl(url);
  let nextLink: string | undefined = getBundleLinkByRelation(
    resultBundle,
    "next"
  );

  while (nextLink) {
    const newBundle: Bundle = await fetchUrl(nextLink);
    nextLink = getBundleLinkByRelation(newBundle, "next");
    resultBundle.entry = resultBundle.entry!.concat(newBundle.entry!);
  }
  return resultBundle;
};

export const removeBlanksFromObject = (obj: any) => {
  return Object.fromEntries(
    Object.entries(obj).filter(([_, v]) => v != null && v !== undefined)
  );
};
