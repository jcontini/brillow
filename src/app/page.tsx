import { ListingsTable } from '@/components/table/ListingsTable'

export default function Home() {
  return (
    <div className="p-8 sm:p-12 max-w-[1400px] mx-auto">
      <h1 className="text-3xl font-bold mb-8 bg-gradient-to-r from-blue-400 to-purple-400 text-transparent bg-clip-text">
        Property Listings
      </h1>
      <ListingsTable />
    </div>
  )
}
