export const avaliableChartTypes = [
  { value: "bar", label: "Bar Chart", contents: ["Condition"] },
  {
    value: "line",
    label: "Line Chart",
    contents: ["Observation"],
  },
  { value: "pie", label: "Pie Chart", contents: ["Condition"] },
  { value: "boxplot", label: "Boxplot", contents: ["Observation"] },
];

export const contentOptions = [
  { value: "Condition", label: "Condition" },
  { value: "Observation", label: "Observation" },
];

export const subjectOptions = [
  { value: "patient", label: "Single Patients" },
  { value: "dataset", label: "Datasets" },
];

export const defaultInputData = {
  title: "",
  info: "",
  subject: subjectOptions[0].value,
  targets: [""],
  content: contentOptions[0].value,
  specimen: "",
  chart_type: "",
};
