import { useState, useEffect } from "react"
import { FaSearch } from "react-icons/fa"
import { CiLocationOn } from "react-icons/ci"
import { IoIosSearch } from "react-icons/io"
import { useNavigate } from "react-router-dom"
import homeWalpaper from "../assets/homeWalpaper.avif"
import CustomerReview from "../components/CustomerReview"
import HowItWorks from "../components/HowItWorks"
import Categories from "../components/Categories"
import OfferBanner from "../components/OfferBanner"
import RecommendedListings from "../components/ListingCards/RecommendedListings"
import HighlyDemandedListings from "../components/ListingCards/HighlyDemandedListings"
import HomeBlogSection from "../components/HomeBlogSection"



const Home = () => {
const services = [
  { label: "Banquet Halls", path: "/venues/banquet-halls", categoryId: 6 },
  { label: "Banquet with Hotel Room", path: "/venues/banquet-with-room", categoryId: 9 },
  { label: "Marriage Halls", path: "/venues/marriage-halls", categoryId: 8 },
  { label: "Wedding Farmhouse", path: "/venues/wedding-farmhouse", categoryId: 13 },
  { label: "Party Halls", path: "/venues/party-halls", categoryId: 7 },
  { label: "5 Star Wedding Hotels", path: "/venues/5-star-wedding-hotels", categoryId: 11 },
  { label: "Destination Weddings", path: "/venues/destination-weddings", categoryId: 12 },
  { label: "Small Function Halls", path: "/venues/small-function-halls", categoryId: 14 },
  { label: "Engagement Venue", path: "/venues/engagement-venue", categoryId: 16 },
  { label: "Baby Shower", path: "/venues/baby-shower", categoryId: 18 },
  { label: "Sikh Wedding", path: "/venues/sikh-wedding", categoryId: 20 },
  { label: "Cocktail Venues", path: "/venues/cocktail-venues", categoryId: 5 },
  { label: "Party Lawn", path: "/venues/party-lawn", categoryId: 10 },
  { label: "Corporate Events", path: "/venues/corporate-events", categoryId: 15 },
  { label: "Ring Ceremony", path: "/venues/ring-ceremony", categoryId: 17 },
  { label: "Mehendi Ceremony", path: "/venues/mehendi-ceremony", categoryId: 21 },
  { label: "Retirement Party", path: "/venues/retirement-party", categoryId: 19 }
];

const categoryToSlug = {
  6: "banquet-hall",
  7: "party-hall",
  8: "marriage-hall",
  9: "banquet-with-room",
  10: "party-lawn",
  11: "5-star-wedding-hotel",
  12: "destination-wedding",
  13: "wedding-farmhouse",
  14: "small-function-hall",
  15: "corporate-event",
  16: "engagement-venue",
  17: "ring-ceremony",
  18: "baby-shower",
  19: "retirement-party",
  20: "sikh-wedding",
  21: "mehendi-ceremony",
  5: "cocktail-venue"
};


  const navigate = useNavigate();
  
  // search services state
  const [searchQuery, setSearchQuery] = useState("")
  const [filteredServices, setFilteredServices] = useState(services)
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [selectedService, setSelectedService] = useState(null)

  // search locations state
  const [locationQuery, setLocationQuery] = useState("")
  const [locations, setLocations] = useState([]) // full list from API
  const [filteredLocations, setFilteredLocations] = useState([])
  const [showLocationSuggestions, setShowLocationSuggestions] = useState(false)

  // Fetch locations once on mount
  useEffect(() => {
    fetch("http://localhost:5000/api/locations")
      .then((res) => res.json())
      .then((data) => {
        setLocations(data.data || [])
        setFilteredLocations(data.data || [])
      })
      .catch((err) => {
        console.error("Error fetching locations:", err)
        setLocations([])
        setFilteredLocations([])
      })
  }, [])

  // venues & services handlers
  const handleSearchChange = (e) => {
    const value = e.target.value
    setSearchQuery(value)

    const filtered = services.filter((service) =>
      service.label.toLowerCase().startsWith(value.toLowerCase())
    )
    setFilteredServices(filtered)
  }

const handleSelectService = (service) => {
  setSearchQuery(service.label)
  setSelectedService(service)
  setShowSuggestions(false)
}

  // location handlers
  const handleLocationChange = (e) => {
    const value = e.target.value
    setLocationQuery(value)

    // filter by label or city name (case-insensitive)
    const filtered = locations.filter((loc) => {
      const nameMatch = loc.name?.toLowerCase().includes(value.toLowerCase())
      const cityMatch = loc.city?.name
        ?.toLowerCase()
        .includes(value.toLowerCase())
      return nameMatch || cityMatch
    })
    setFilteredLocations(filtered)
  }

  const handleSelectLocation = (name) => {
    setLocationQuery(name)
    setShowLocationSuggestions(false)
  }

  // close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = () => {
      setShowSuggestions(false)
      setShowLocationSuggestions(false)
    }
    window.addEventListener("click", handleClickOutside)
    return () => window.removeEventListener("click", handleClickOutside)
  }, [])


// handleSearchClick
const handleSearchClick = () => {
  if (!selectedService || !locationQuery) return;

  const localitySlug = locationQuery
    .toLowerCase()
    .replace(/\s+/g, "-")
    .trim();

  // extract service slug from path
const serviceSlug = categoryToSlug[selectedService.categoryId] || "banquet-hall";
  const params = new URLSearchParams();
  params.set("search", selectedService.label);
  params.set("locality", locationQuery);
  params.set("category", selectedService.categoryId);

  navigate(`/${serviceSlug}-in/${localitySlug}?${params.toString()}`);
};



  return (
    <div className="w-full select-none">

      
      {/*  Hero Section */}
      <div
        className="h-[70vh] sm:h-[80vh] lg:h-[90vh] bg-cover bg-center flex flex-col items-center justify-center relative"
        style={{ backgroundImage: `url(${homeWalpaper})` }}
      >
        {/*  Hero Text */}
        <div className="text-center px-4 sm:px-6 mb-6">
          <h1
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white max-w-4xl mx-auto leading-snug select-none"
            style={{
              textShadow: "2px 2px 10px rgba(0,0,0,0.8)"
            }}
          >
            Your Dream Wedding Starts Here — Explore Venues, Decor & More!
          </h1>
        </div>

        {/*  Search Bar */}
        <div className="flex items-center justify-center w-full px-6">
          <div className="relative flex flex-col sm:flex-row  bg-white border border-[#b4b4be] rounded-md shadow-md w-[98%] sm:w-[90%] md:w-[85%] lg:w-[80%] xl:w-[70%] max-w-[1100px]">
            {/*  Venues & Services Input */}
            <div className="relative flex items-center gap-2 w-full sm:w-[60%] py-4 px-5 text-[15px] border-b sm:border-b-0 sm:border-r border-gray-300">
              <IoIosSearch className="text-gray-700 text-xl cursor-default" />
              <input
                type="text"
                placeholder="Search for venues, decor, services..."
                className="w-full text-gray-700 placeholder-gray-500 outline-none cursor-pointer select-none"
                value={searchQuery}
                onChange={handleSearchChange}
                onFocus={() => {
                  setShowSuggestions(true)
                  setShowLocationSuggestions(false)
                }}
                onClick={(e) => e.stopPropagation()}
              />

              {showSuggestions && (
                <div
                  className="absolute top-full left-0 w-full bg-white border border-gray-300 max-h-[225px] sm:max-h-[165px] overflow-y-auto z-50 shadow-md rounded scrollbar-hide"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredServices.length > 0 ? (
                    filteredServices.map((item, idx) => (
                      <div
                        key={idx}
                        onClick={() => handleSelectService(item)}
                        className="flex items-center px-3.5 py-3 text-gray-700 text-sm border-b border-gray-100 hover:bg-gray-100 cursor-pointer"
                      >
                        <div className="mr-3 p-2 rounded-full bg-gray-100">
                          <IoIosSearch className="text-gray-500" />
                        </div>
                        <span className="text-[#414146]">{item.label}</span>
                      </div>
                    ))
                  ) : (
                    <div className="px-4 py-2 text-gray-400 text-sm">
                      No results found
                    </div>
                  )}
                </div>
              )}
            </div>

            {/*  Location Input */}
            <div className="relative flex items-center gap-1.5 w-full sm:w-[40%] py-4 px-5 text-[14px] bg-white rounded-r-xs">
              <CiLocationOn className="text-gray-700 text-xl cursor-default" />
              <input
                type="text"
                placeholder="Enter your location"
                className="w-full text-gray-700 placeholder-gray-500 outline-none cursor-pointer select-none"
                value={locationQuery}
                onChange={handleLocationChange}
                onFocus={() => {
                  setShowLocationSuggestions(true)
                  setShowSuggestions(false)
                }}
                onClick={(e) => e.stopPropagation()}
              />

              {showLocationSuggestions && filteredLocations.length > 0 && (
                <div
                  className="absolute top-[98%] left-0 w-full bg-white border border-gray-300 max-h-[225px] sm:max-h-[170px] overflow-y-auto z-200 shadow-lg rounded-b-sm scrollbar-hide"
                  onClick={(e) => e.stopPropagation()}
                >
                  {filteredLocations.map((loc, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleSelectLocation(loc.name)}
                      className="flex items-center px-3 py-2.5 z-100 text-black text-sm outline-none border-b border-gray-100 hover:bg-gray-100 cursor-pointer"
                    >
                      <div className="mr-3 p-2 rounded-full bg-gray-100">
                        <CiLocationOn className="text-gray-500" />
                      </div>

                      <div>
                        <h5 className="text-m text-[#414146]">{loc.name}</h5>
                        {loc.city?.name && (
                          <h6 className="text-xs text-[#787887]">
                            {loc.city.name}
                          </h6>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>


            {/*  Search Button */}
            <button onClick={handleSearchClick} className="bg-[#dc2626] text-white px-7 py-4 z-0 rounded-r-md flex items-center justify-center cursor-pointer hover:bg-[#b91c1c] transition-all w-full sm:w-auto text-base font-semibold">
              {/* Show icon on larger screens, text on small screens */}
              <span className="block sm:hidden">Search</span>
              <FaSearch className="hidden sm:block w-6 h-6" />
            </button>
          </div>
        </div>
      </div>


       {/* why us section removed as per instructions ( delete this on final production) */}
      {/*  Why Us Section */}
      {/* <WhyUsSection />  */}

      {/*  Offer Banner */}
      <OfferBanner/>

      {/*  Category section */}
      <Categories />

      {/*Recommended listing Section*/}
      <RecommendedListings/>

      {/*Highly Demanded listing Section*/}
      <HighlyDemandedListings/>

      {/* Customer Review Section */}
      <CustomerReview />

      {/*How It Works Section*/}
      <HowItWorks />

      <HomeBlogSection />


    </div>
  )
}

export default Home
