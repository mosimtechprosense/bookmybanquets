import SearchFilter from "./SearchFilter"
import LocationFilter from "./LocationFilter"
import PriceRange from "./PriceRange"
import GuestRange from "./GuestRange"
import MealTypeFilter from "./MealTypeFilter"
import SortFilter from "./SortFilter"

export default function FiltersSidebar({
  filters,
  setFilters,
  initialVenue = "",
  initialLocation = ""
}) {

  
  return (
    <aside className="bg-white p-4 rounded-lg shadow md:w-72 select-none
    md:sticky md:top-4
    md:max-h-[calc(100vh-1rem)]
    overflow-y-auto scrollbar-thin no-scrollbar">
      {/* SearchFilter with pre-filled venue service */}
      <SearchFilter
        search={filters.search}
        setFilters={setFilters}
        initialVenue={initialVenue}
      />
      <hr className="my-4" />
      {/* LocationFilter with pre-filled location */}
      <LocationFilter
        setFilters={setFilters}
        value={filters.locality}
        initialLocation={filters.location || initialLocation}
      />
      <hr className="my-4" />

      <PriceRange
        value={[filters.minBudget, filters.maxBudget]}
        onChange={([minBudget, maxBudget]) =>
          setFilters({ minBudget, maxBudget, skip: 0 })
        }
      />
      <hr className="my-4" />

      <GuestRange
        value={[filters.minGuests ?? 0, filters.maxGuests ?? 1200]}
        onChange={([minGuests, maxGuests]) =>
          setFilters({ minGuests, maxGuests, skip: 0 })
        }
      />

      <hr className="my-4" />

      {/* hide temprerory */}
      {/* <VenueTypeFilter setFilters={setFilters} /> */}
      <hr className="my-4" />

      <MealTypeFilter filters={filters} setFilters={setFilters} />
      <hr className="my-4" />

      <SortFilter filters={filters} setFilters={setFilters} />
    </aside>
  )
}