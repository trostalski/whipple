import { toastError } from "../toasts";
import { InputData } from "./CardModal";

export const generateColorPallete = (size: number) => {
  const colors = [];

  for (let i = 0; i < size; i++) {
    colors.push(
      `rgba(${Math.floor(Math.random() * 255)}, ${Math.floor(
        Math.random() * 255
      )}, ${Math.floor(Math.random() * 255)}, 0.5)`
    );
  }
  return colors;
};

export function isNonEmptyObject(obj: any) {
  return Object.keys(obj).length === 0;
}

export const cardInputIsValid = (inputData: InputData) => {
  let result = true;
  if (inputData.title === "") {
    toastError("Please enter a title");
    result = false;
  }
  if (inputData.content === "Observation" && inputData.specimen === null) {
    toastError("Please select a value");
    result = false;
  }
  if (inputData.chart_type === null) {
    toastError("Please select a chart type");
    result = false;
  }
  if (inputData.targets.length === 0) {
    toastError("Please select a target");
    result = false;
  }
  if (inputData.specimen === "" && inputData.content === "Observation") {
    toastError("Please select a value");
    result = false;
  }
  if (inputData.chart_type === "") {
    toastError("Please select a chart type");
    result = false;
  }
  return result;
};
