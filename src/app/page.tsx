import { ListingsTable } from '@/components/table/ListingsTable'
import { ImportButton } from '@/components/ImportButton'

export default function Home() {
  return (
    <div className="p-8 sm:p-12 max-w-[1400px] mx-auto">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
          Property Listings
        </h1>
        <ImportButton />
      </div>
      <ListingsTable />
    </div>
  )
}
