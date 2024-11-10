import { ListingsTable } from '@/components/table/ListingsTable'
import { ImportButton } from '@/components/ImportButton'
import { ExportButton } from '@/components/ExportButton'

export default function Home() {
  return (
    <main>
      <div className="header-container">
        <h1 className="app-title">Brillow</h1>
        <div className="button-group">
          <ImportButton />
          <ExportButton />
        </div>
      </div>
      <ListingsTable />
    </main>
  )
}
