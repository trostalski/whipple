import React, { ChangeEvent, useEffect, useState } from "react";
import { getSearchParamsForResource } from "../../utils";
import { SearchAction, SearchState, SearchTypes } from "./SearchReducer";

type AvailableParams = {
  name: string;
  value: string;
  comparators?: string[];
};

interface SearchParamsSelectionProps {
  dispatch: React.Dispatch<SearchAction>;
  searchState: SearchState;
  id: number;
}

enum ParamKeys {
  name = "name",
  value = "value",
  modifier = "modifier",
  comparator = "comparator",
}

const ParamSelection = (props: SearchParamsSelectionProps) => {
  const [paramName, setParamName] = useState(""); // This is used to get the available comparators
  const [availableParams, setAvailableParams] = useState<AvailableParams[]>([]);
  const [searchState, setSearchState] = useState<SearchState>(
    props.searchState
  );
  const [availableComparators, setAvailableComparators] = useState<
    string[] | undefined
  >(undefined);

  const handleChange = (
    e: React.ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>,
    paramKey: ParamKeys
  ) => {
    const newState = searchState;
    newState.params.map((param) => {
      if (param.id === props.id) {
        return (param[paramKey] = e.currentTarget.value);
      } else return param;
    });

    setSearchState(newState);
    setParamName(e.currentTarget.value);

    props.dispatch({
      type: SearchTypes.change,
      payload: { searchState: newState },
    });
  };

  //   get available search params for resource type
  useEffect(() => {
    if (props.searchState.resourceType) {
      const searchParams = getSearchParamsForResource(
        props.searchState.resourceType
      );
      setAvailableParams(searchParams);
    }
  }, [props.searchState.resourceType]);

  useEffect(() => {
    availableParams.forEach((availableParam) => {
      if (availableParam.name === paramName) {
        setAvailableComparators(availableParam.comparators);
      }
    });
  }, [paramName]);
  return (
    <div>
      <div className="grid grid-cols-6 gap-2 mb-1 items-center">
        <select
          className="text-xs p-2 border-2 rounded-md col-start-1 col-end-3"
          defaultValue={""}
          onChange={(e) => handleChange(e, ParamKeys.name)}
        >
          <option value={""} disabled>
            Parameter
          </option>
          {availableParams?.map((item) => (
            <option key={item.name} value={item.name}>
              {item.name}
            </option>
          ))}
        </select>
        <input
          name="modifier"
          placeholder="modifier"
          className={`text-xs p-2 border-2 rounded-md col-start-3 ${
            !availableComparators ? "col-end-5" : "col-end-3"
          }`}
          defaultValue={""}
          onChange={(e) => {
            handleChange(e, ParamKeys.modifier);
          }}
        />
        {!availableComparators ? null : (
          <select
            className="text-xs p-2  rounded-md col-start-4 col-end-4"
            defaultValue={""}
            onChange={(e) => handleChange(e, ParamKeys.comparator)}
          >
            <option value={""} disabled>
              Comparator
            </option>
            {availableComparators.map((comparator) => (
              <option key={comparator} value={comparator}>
                {comparator}
              </option>
            ))}
          </select>
        )}
        <input
          name="value"
          placeholder="Value"
          className="text-xs p-2 border-2 rounded-md col-start-5 col-end-7"
          defaultValue={""}
          onChange={(e) => {
            handleChange(e, ParamKeys.value);
          }}
        />
      </div>
    </div>
  );
};

export default ParamSelection;
