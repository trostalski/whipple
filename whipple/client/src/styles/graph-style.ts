export const GetGraphStyle = (resourceId: string) => {
  return [
    {
      selector: "node",
      style: {
        backgroundColor: "#000080",
        label: "data(id)",
      },
    },
    {
      selector: "edge",
      style: {
        opacity: (edge: any) => {
          let opacity = 1;
          let inputIsSource = edge.data("source") == resourceId;
          let inputIsTarget = edge.data("target") == resourceId;
          if (inputIsSource || inputIsTarget) {
            opacity = 0.1;
          }
          return opacity;
        },
      },
    },
  ];
};
