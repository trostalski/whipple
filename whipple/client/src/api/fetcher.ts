import { removeBlanksFromObject } from "../utils";

export async function fetcher(url: string, params?: any) {
  let urlSearchParams = new URLSearchParams();
  if (params) {
    const queryParams: any = removeBlanksFromObject(params);
    urlSearchParams = new URLSearchParams(queryParams);
  }

  const response = await fetch(url + "?" + urlSearchParams, {
    credentials: "include",
  });
  if (!response.ok) {
    throw new Error("Network response was not OK");
  }
  const jsonData = await response.json();
  return jsonData;
}
