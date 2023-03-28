import { Bundle } from "fhir/r4";
import React, { useReducer, useState } from "react";
import { fetchSearchServer, fetchUrl } from "../api/graph-data";
import ResourceSelection from "../components/old_search/ResourceSelection";
import searchReducer, {
  JoinOptions,
  SearchState,
  SearchTypes,
} from "../components/old_search/SearchReducer";
import SearchTable, { Row } from "../components/old_search/SearchTable";
import Wrapper from "../components/Wrapper";
import {
  bundleToTableData,
  getBundleLinkByRelation,
  getFullDataFromBundleUrl,
} from "../utils";

interface SearchResponse {
  data: Bundle;
  url: string;
}

const initialSearchState: SearchState[] = [
  {
    id: 0,
    resourceType: "",
    join: JoinOptions.or,
    params: [{ id: 0, name: "", value: "", modifier: "", comparator: "" }],
  },
];

const Cohorts = () => {
  const initalstateId = 1;

  const [selectionId, setSelectionId] = useState<number>(initalstateId);
  const [nextLinks, setNextLinks] = useState<string[]>([]);
  const [prevLinks, setPrevLinks] = useState<string[]>([]);
  const [tableData, setTableData] = useState<Row[]>([]);
  const [generatedUrls, setGeneratedUrls] = useState<string[]>([]);
  const [searchStates, dispatch] = useReducer(
    searchReducer,
    initialSearchState
  );

  const handleAddResource = () => {
    setSelectionId(selectionId + 1);
    dispatch({
      type: SearchTypes.createResource,
      payload: {
        id: selectionId,
      },
    });
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setNextLinks([]);
    setPrevLinks([]);
    setGeneratedUrls([]);

    const response: SearchResponse[] = await fetchSearchServer(searchStates);
    let newTableData: Row[] = [];
    let newGeneratedUrls: string[] = [];
    response.forEach((res) => {
      const data = bundleToTableData(res.data);
      newTableData = newTableData.concat(data);
      // url to display
      newGeneratedUrls = newGeneratedUrls.concat(res.url);

      // next and previous link for pagination
      const newNextLink: string | undefined = getBundleLinkByRelation(
        res.data,
        "next"
      );

      if (newNextLink) {
        setNextLinks([...nextLinks, newNextLink]);
      }

      const newPrevLink: string | undefined = getBundleLinkByRelation(
        res.data,
        "previous"
      );
      if (newPrevLink) {
        setPrevLinks([...prevLinks, newPrevLink]);
      }
    });

    setTableData(newTableData);
    setGeneratedUrls(newGeneratedUrls);
  };

  const handlePagination = async (direction: string) => {
    let paginationUrl = undefined;

    if (direction === "next") {
      paginationUrl = nextLinks[0];
    } else if (direction === "previous") {
      paginationUrl = prevLinks[0];
    }

    if (paginationUrl) {
      const bundle = await fetchUrl(paginationUrl);
      const data = bundleToTableData(bundle);
      setTableData(data);

      const newNextLink: string | undefined = getBundleLinkByRelation(
        bundle,
        "next"
      );
      nextLinks.shift();
      if (newNextLink) {
        setNextLinks([newNextLink, ...nextLinks]);
      }

      const newPrevLink: string | undefined = getBundleLinkByRelation(
        bundle,
        "previous"
      );
      prevLinks.shift();
      if (newPrevLink) {
        setPrevLinks([newPrevLink, ...prevLinks]);
      }
    }
  };

  const handleDownload = async () => {
    let resultBundle: Bundle;
    const fileName = "data.json";

    for (let index = 0; index < generatedUrls.length; index++) {
      const url = generatedUrls[index];
      const newBundle = await getFullDataFromBundleUrl(url);
      if (index == 0) {
        resultBundle = newBundle;
      } else {
        resultBundle!.entry = resultBundle!.entry?.concat(newBundle.entry!);
      }
    }

    const data = new Blob([JSON.stringify(resultBundle!)], {
      type: "text/json",
    });
    const jsonURL = window.URL.createObjectURL(data);
    const link = document.createElement("a");
    document.body.appendChild(link);
    link.href = jsonURL;
    link.setAttribute("download", fileName);
    link.click();
    document.body.removeChild(link);
  };

  // create a dateset for each resource and store it in the mongodb via the api
  const handleCreateDataset = async () => {
    console.log(tableData);
  };

  return (
    <Wrapper>
      <div className="flex flex-col bg-white h-full text-xs rounded-xl shadow-md p-4">
        <section className="h-full">
          <div className="flex h-full justify-between">
            <div className="flex h-full w-1/3 flex-col">
              <div className="h-full w-full p-6 rounded-t-md overflow-scroll">
                {/* <div>
                <p className="text-xl mb-4">Search Settings</p>
              </div> */}
                <div className="flex items-center gap-4">
                  <p className="font-bold">Select Resources</p>
                  <button
                    className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
                    onClick={handleAddResource}
                  >
                    Add
                  </button>
                </div>
                <div className="flex flex-col mt-2 gap-1 w-full">
                  {!searchStates
                    ? null
                    : searchStates.map((searchState, index) => (
                        <ResourceSelection
                          key={searchState.id}
                          index={index}
                          dispatch={dispatch}
                          searchState={searchState}
                        />
                      ))}
                </div>
                <div className="">
                  Generated URLs:
                  {!generatedUrls
                    ? null
                    : generatedUrls.map((url, index) => (
                        <div key={index}>
                          <a
                            href={`${url}`}
                            key={index}
                            className="hover:underline"
                          >
                            {url}
                          </a>
                        </div>
                      ))}
                </div>
              </div>
              <button
                className="flex bg-blue-400 rounded-xl shadow-md px-6 w-full justify-center items-center h-12 bottom-0 text-white text-lg hover:bg-blue-600"
                onClick={handleSubmit}
              >
                Submit
              </button>
            </div>
            <div className="w-3/4 h-full">
              <SearchTable tableData={tableData ? tableData : []} />
              <div className="flex w-full text-xs justify-between">
                <div className="flex p-2 gap-4 font-extralight">
                  <button onClick={handleDownload}>Download</button>
                  {/* TODO: Create a dataset from the search results */}
                  {/* <button onClick={handleCreateDataset}>Create Dataset</button> */}
                </div>
                <div className="flex gap-4">
                  <button
                    className="p-2 font-extralight"
                    onClick={() => handlePagination("previous")}
                  >
                    Previous
                  </button>
                  <button
                    className="p-2 font-extralight"
                    onClick={() => handlePagination("next")}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </div>
        </section>
      </div>
    </Wrapper>
  );
};

export default Cohorts;
