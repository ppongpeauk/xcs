import { ColumnDef } from "@tanstack/react-table"

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type Location = {
  id: string,
  name: string,
  organization: string,
  owner: string,
  lastModified: string,
}

export const columns: ColumnDef<Location>[] = [
  {
    accessorKey: "name",
    header: "Name",
  },
  
  {
    accessorKey: "organization",
    header: "Organization",
  },
  {
    accessorKey: "owner",
    header: "Location Owner",
  },
  {
    accessorKey: "lastModified",
    header: "Last Modified",
  },
]
