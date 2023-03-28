import "react-data-grid/lib/styles.css";
import DataGrid, { Column } from "react-data-grid";

export interface Row {
  id: string;
  resourceType: string;
  display: string;
}

const rowKeyGetter = (row: Row) => {
  return row.id;
};

const columns = [
  { key: "id", name: "ID" },
  { key: "resourceType", name: "Resource Type" },
  { key: "display", name: "Keywords" },
];

interface SearchTableProps {
  tableData: Row[];
}

const SearchTable = (props: SearchTableProps) => {
  return (
    <DataGrid
      className="overflow-scroll"
      style={{ height: "95%", width: "100%", fontSize: 12 }}
      columns={columns}
      rows={props.tableData}
      rowKeyGetter={rowKeyGetter}
      onRowClick={(e: any) => {
        console.log("ROW CLICK", e);
      }}
    />
  );
};

export default SearchTable;
