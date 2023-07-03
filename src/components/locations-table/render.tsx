import { Location, columns } from "./columns"
import { DataTable } from "./data-table"

function getData(): Location[] {
  // Fetch data from your API here.
  return [
    {
      id: "728ed52f",
      name: "Test Location",
      organization: "EVE",
      owner: "m@example.com",
      lastModified: "2021-08-01",
    },
    // ...
  ]
}

export default function DemoPage() {
  const data = getData()

  return (
    <div className="container mx-auto py-10">
      <DataTable columns={columns} data={data} />
    </div>
  )
}
