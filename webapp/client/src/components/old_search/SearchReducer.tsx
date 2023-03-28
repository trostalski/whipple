import React, { createContext, Reducer, useReducer } from "react";

export enum JoinOptions {
  or = "OR",
  and = "AND",
  cascade = "CASCADE",
}

export type SearchState = {
  id: number;
  resourceType: string;
  join?: string;
  params: {
    id: number;
    name: string;
    value: string;
    modifier?: string;
    comparator?: string;
  }[];
};

export type SearchAction =
  | { type: "create-resource"; payload: { id: number } }
  | { type: "remove-resource"; payload: { id: number } }
  | { type: "create-param"; payload: { id: number; resourceId: number } }
  | { type: "remove-param"; payload: { resourceId: number } }
  | { type: "change"; payload: { searchState: SearchState } }
  | { type: "reset" };

export enum SearchTypes {
  createResource = "create-resource",
  removeResource = "remove-resource",
  createParam = "create-param",
  removeParam = "remove-param",
  change = "change",
  reset = "reset",
}

const searchReducer: Reducer<SearchState[], SearchAction> = (
  searchState: SearchState[],
  action: SearchAction
) => {
  switch (action.type) {
    case "create-resource": {
      return [
        ...searchState,
        {
          resourceType: "",
          id: action.payload.id,
          params: [
            { id: 0, name: "", value: "", modifier: "", comparator: "" },
          ],
        },
      ];
    }
    case "remove-resource": {
      return searchState.filter((item) => item.id !== action.payload.id);
    }
    case "create-param": {
      return searchState.map((item) => {
        if (item.id === action.payload.resourceId) {
          item.params = item.params.concat([
            {
              id: action.payload.id,
              name: "",
              value: "",
              modifier: "",
              comparator: "",
            },
          ]);
          return item;
        } else {
          return item;
        }
      });
    }
    case "remove-param": {
      return searchState.map((item) => {
        if (item.id == action.payload.resourceId) {
          item.params = item.params.filter(
            (param, index) => index < item.params.length - 1
          );
          return item;
        } else {
          return item;
        }
      });
    }
    case "change": {
      return searchState.map((item) => {
        if (item.id === action.payload.searchState.id) {
          return action.payload.searchState;
        } else {
          return item;
        }
      });
    }
    case "reset": {
      return [
        {
          id: 0,
          resourceType: "",
          join: JoinOptions.or,
          params: [
            { id: 0, name: "", value: "", modifier: "", comparator: "" },
          ],
        },
      ];
    }
  }
};

export default searchReducer;
