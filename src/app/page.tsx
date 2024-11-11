import { ListingsTable } from '@/components/table/ListingsTable'
import { ImportButton } from '@/components/ImportButton'
import { ExportButton } from '@/components/ExportButton'
import { GeocodeAllButton } from "@/components/GeocodeAllButton"

export default function Home() {
  return (
    <main className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Brillow</h1>
        <div className="flex gap-2">
          <GeocodeAllButton />
          <ImportButton />
          <ExportButton />
        </div>
      </div>
      <ListingsTable />
    </main>
  )
}
