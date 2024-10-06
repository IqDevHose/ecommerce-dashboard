import { DataTable } from "../components/DataTable";
import PageTitle from "../components/PageTitle";
import { ColumnDef } from "@tanstack/react-table";
import { cn } from "../lib/utils";

type Setting = {
  category: string;
  value: string | number | boolean;
};

const columns: ColumnDef<Setting>[] = [
  {
    accessorKey: "category",
    header: "Category",
  },
  {
    accessorKey: "value",
    header: "Value",
  },
];

const data: Setting[] = [
  {
    category: "Account",
    value: true,
  },
  {
    category: "Notifications",
    value: false,
  },
  {
    category: "Language",
    value: "English",
  },
  {
    category: "Theme",
    value: "Dark",
  },
];

export default function SettingsPage() {
  return (
    <div className="flex flex-col p-10 gap-5 w-full">
      <PageTitle title="Settings" />
      <DataTable columns={columns} data={data} />
    </div>
  );
}
