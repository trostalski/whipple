import React, { useEffect, useState } from "react";
import Select from "react-select";
import { resourceOptions } from "../../constants";
import DeleteIcon from "../icons/DeleteIcon";
import ParamSelection from "./ParamSelection";
import {
  JoinOptions,
  SearchAction,
  SearchState,
  SearchTypes,
} from "./SearchReducer";

interface ResourceSelectionProps {
  dispatch: React.Dispatch<SearchAction>;
  searchState: SearchState;
  index: number;
}

const ResourceSelection = (props: ResourceSelectionProps) => {
  const initalstateId = 1;
  const [paramSelectionId, setParamSelectionId] =
    useState<number>(initalstateId);
  const [searchState, setSearchState] = useState(props.searchState);
  const [joinOption, setJoinOption] = useState<string>(JoinOptions.or);
  const [resourceType, setResourceType] = useState<string>("");

  const handleRemoveResource = () => {
    props.dispatch({
      type: SearchTypes.removeResource,
      payload: { id: props.searchState.id },
    });
  };

  const handleAddParam = () => {
    setParamSelectionId(paramSelectionId + 1);
    props.dispatch({
      type: SearchTypes.createParam,
      payload: {
        id: paramSelectionId,
        resourceId: props.searchState.id,
      },
    });
  };

  const handleChangeState = () => {
    const newState = searchState;
    newState.resourceType = resourceType;
    newState.join = joinOption;
    setSearchState(newState);

    props.dispatch({
      type: SearchTypes.change,
      payload: { searchState: searchState },
    });
  };

  const handleRemoveParam = () => {
    props.dispatch({
      type: SearchTypes.removeParam,
      payload: {
        resourceId: props.searchState.id,
      },
    });
  };

  useEffect(() => {
    handleChangeState();
  }, [resourceType, joinOption]);

  return (
    <div className="text-xs">
      {props.index >= 1 ? (
        <div className="flex justify-evenly mb-2">
          <div>
            <input
              checked={joinOption === JoinOptions.or}
              type={"radio"}
              value={JoinOptions.or}
              onChange={(e) => {
                setJoinOption(e.currentTarget.value);
              }}
            />
            <label>OR</label>
          </div>
          <div>
            <input
              checked={joinOption === JoinOptions.cascade}
              value={JoinOptions.cascade}
              type={"radio"}
              onChange={(e) => {
                setJoinOption(e.currentTarget.value);
              }}
            />
            <label>CASCADE</label>
          </div>
        </div>
      ) : null}
      <div className="flex">
        <Select
          defaultValue={"Patient"}
          placeholder="Resource Type"
          options={resourceOptions}
          className="w-96"
          onChange={(e: any) => {
            setResourceType(e.value);
            props.dispatch({
              type: SearchTypes.reset,
            });
          }}
        ></Select>
        <button
          // Delete Resource Selection
          onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            handleRemoveResource();
          }}
        >
          <DeleteIcon />
        </button>
      </div>
      <div className="flex mt-8 flex-col">
        <div className="flex items-center gap-4 mb-1">
          <p className="font-bold">Parameters</p>
          <button
            className="bg-blue-400 rounded-xl shadow-md py-2 px-6 hover:bg-blue-600 text-white"
            onClick={() => {
              handleAddParam();
            }}
          >
            Add
          </button>
          <button
            className="w-24 self-end bg-red-200 rounded-xl p-2 hover:bg-red-400"
            onClick={() => {
              handleRemoveParam();
            }}
          >
            Remove
          </button>
        </div>
        <div>
          {!props.searchState.params
            ? null
            : props.searchState.params.map((param) => (
                <ParamSelection
                  key={param.id}
                  id={param.id}
                  dispatch={props.dispatch}
                  searchState={searchState}
                />
              ))}
        </div>
      </div>
      <hr className="my-2 bg-black border-2" />
    </div>
  );
};

export default ResourceSelection;
