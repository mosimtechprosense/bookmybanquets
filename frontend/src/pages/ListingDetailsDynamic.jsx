import { useNavigate, useParams, useLocation } from "react-router-dom"
import { useEffect, useState, useContext } from "react"
import { fetchListingById, fetchSimilarListings } from "../api/listingsApi"
import { LuArrowLeft, LuArrowRight, LuX } from "react-icons/lu"
import { UIContext } from "../store/UIContext"
import SimilarListingsSection from "../components/ListingCards/SimilarListing"
import HallCapacities from "../components/listingsDetails/HallCapacities"
import AboutSection from "../components/listingsDetails/AboutSection"
import FeaturesSection from "../components/listingsDetails/FeaturesSection"
import PoliciesSection from "../components/listingsDetails/PoliciesSection"
import FaqSection from "../components/ListingCards/FaqSection"
import CheckDiscountPrice from "../components/listingsDetails/CheckDiscountPrice"
import ScheduleVisit from "../components/listingsDetails/ScheduleVisit"
import ListingDetailsSidebar from "../components/listingsDetails/ListingDetailsSidebar"
import { categoryToSlug, categoryToVenuePath } from "../utils/slugMaps"

export default function ListingDetailsDynamic() {
  const { id, serviceSlug } = useParams()
    const navigate = useNavigate()
  const location = useLocation();

  const [listing, setListing] = useState(null)
  const [similarListings, setSimilarListings] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAllKeywords, setShowAllKeywords] = useState(false)
  const { setPopupOpen } = useContext(UIContext)


  // Image modal
  const [activeImageIndex, setActiveImageIndex] = useState(null)
  useEffect(() => {
      // 🚨 STOP invalid cases BEFORE API calls
  if (
    location.pathname.startsWith("/admin") ||
    !id ||
    isNaN(Number(id))
  ) {
    setLoading(false);
    return;
  }

    let isMounted = true
    setLoading(true)

    Promise.all([fetchListingById(id), fetchSimilarListings(id)])
      .then(([listingRes, similarRes]) => {
        if (!isMounted) return

        const listingData = listingRes?.data?.data || listingRes?.data || null

        setListing(listingData)
        setSimilarListings(similarRes?.data || [])
      })
      .catch(() => {
        setListing(null)
        setSimilarListings([])
      })
      .finally(() => {
        if (isMounted) setLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [id, location.pathname])

if (loading) return <div className="py-20 text-center">Loading…</div>;

if (
  location.pathname.startsWith("/admin") ||
  !id ||
  isNaN(Number(id))
) {
  return null;
}

if (!listing) {
  return <div className="py-20 text-center">Listing not found</div>;
}


  const images = listing.venue_images ?? []
  const keywordsArray = listing.keywords?.split(",") ?? []
  const desc = listing.description ?? ""
  const faqs = Array.isArray(listing?.faqs) ? listing.faqs : []
  const hallCapacities = Array.isArray(listing?.hall_capacities)
    ? listing.hall_capacities
    : []

  // breadcrumb logic (inline) //* seprate this as a component in future
  const serviceSlugResolved =
    serviceSlug || categoryToSlug[listing.category_id] || "banquet-hall"
  const categoryId = listing.category_id || 6
  const venueMeta = categoryToVenuePath[categoryId]

  // Breadcrumbs
  const breadcrumbItems = [
    { label: "Home", type: "home", path: "/" },
    {
      label: venueMeta?.label || "Banquet Halls",
      type: "service",
      path: `/venues/banquet-halls?category=${categoryId}&serviceLabel=${encodeURIComponent(
        venueMeta?.label || "Banquet Halls"
      )}`
    }
  ]

  if (listing.locality) {
    const localitySlug = listing.locality.replace(/\s+/g, "-").toLowerCase()
    breadcrumbItems.push({
      label: `${venueMeta?.label || "Banquet Halls"} in ${listing.locality}`,
      type: "locality",
      path: `/${serviceSlugResolved}-in/${localitySlug}?category=${categoryId}&locality=${localitySlug}`
    })
  }

  breadcrumbItems.push({
    label: listing.title,
    type: "current"
  })

  const pushUrl = ({ category, citySlug }) => {
    const qs = new URLSearchParams()
    if (category) qs.set("category", category)
    if (citySlug) qs.set("locality", citySlug)

    const slug = citySlug ? citySlug.replace(/\s+/g, "-").toLowerCase() : ""
    const serviceSlug = categoryToSlug[Number(category)] || "banquet-hall"
    const path = slug ? `/${serviceSlug}-in/${slug}` : `/${serviceSlug}-in`

    navigate(`${path}?${qs.toString()}`)
  }

  return (
    <div className="container mx-auto px-4 py-8 ">
      {/* Breadcrumb */}
      <nav
        aria-label="Breadcrumb"
        className="py-3 px-4 mb-3 text-sm text-red-600"
      >
        <ol className="flex flex-wrap items-center gap-1">
          {breadcrumbItems.map((item, idx) => {
            const isLast = item.type === "current"
            return (
              <li key={idx} className="flex items-center gap-1 truncate">
                {!isLast ? (
                  <>
                    <span
                      className="cursor-pointer font-medium hover:text-gray-800 whitespace-nowrap"
                      onClick={() => {
                        if (!item.path) return

                        //  HOME breadcrumb
                        if (item.type === "home") {
                          navigate("/")
                          return
                        }

                        //  SERVICE breadcrumb (/venues/banquet-halls)
                        if (item.type === "service") {
                          navigate(item.path)
                          return
                        }

                        //  LOCALITY breadcrumb
                        const url = new URL(item.path, window.location.origin)
                        const params = Object.fromEntries(
                          url.searchParams.entries()
                        )

                        pushUrl({
                          category: params.category,
                          citySlug: params.locality
                        })
                      }}
                    >
                      {item.label}
                    </span>

                    <span className="mx-1">/</span>
                  </>
                ) : (
                  <span className="text-gray-600 truncate">{item.label}</span>
                )}
              </li>
            )
          })}
        </ol>
      </nav>

      {/* ================= IMAGE GALLERY (RECOMMENDED STYLE) ================= */}
      <div key={id} className="relative mb-12">
        {Array.isArray(images) && images.length > 3 && (
          <button
            onClick={() =>
              document
                .getElementById("imageScroll")
                ?.scrollBy({ left: -400, behavior: "smooth" })
            }
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-5 z-20 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
          >
            <LuArrowLeft className="h-6 w-6 cursor-pointer text-red-600" />
          </button>
        )}

        <div
          id="imageScroll"
          className="flex gap-4 overflow-x-hidden scroll-smooth no-scrollbar"
        >
          {images.map((img, i) => (
            <div
              key={img.id}
              onClick={() => setActiveImageIndex(i)}
              className="min-w-[600px] h-[300px] rounded-md overflow-hidden shadow cursor-pointer"
            >
              <img
                src={img.image_url}
                alt={listing.title}
                className="h-full w-full object-cover hover:scale-110 transition duration-500"
              />
            </div>
          ))}
        </div>

        {images.length > 3 && (
          <button
            onClick={() =>
              document
                .getElementById("imageScroll")
                ?.scrollBy({ left: 400, behavior: "smooth" })
            }
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white shadow rounded-full p-5 z-20 cursor-pointer transition duration-300 ease-in-out transform hover:scale-125"
          >
            <LuArrowRight className="h-6 w-6 cursor-pointer text-red-600" />
          </button>
        )}
      </div>

      {/* ================= IMAGE MODAL ================= */}
      {activeImageIndex !== null && (
        <div className="fixed inset-0 bg-black/80 z-1100 flex items-center justify-center">
          <button
            className="absolute top-6 right-6 text-white text-3xl"
            onClick={() => setActiveImageIndex(null)}
          >
            <LuX />
          </button>

          <button
            className="absolute left-6 bg-white text-3xl shadow rounded-full p-5 z-20 cursor-pointer hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-125"
            onClick={() =>
              setActiveImageIndex(
                activeImageIndex === 0
                  ? images.length - 1
                  : activeImageIndex - 1
              )
            }
          >
            <LuArrowLeft className="h-6 w-6" />
          </button>

          <img
            src={images[activeImageIndex].image_url}
            className="max-h-[90vh] max-w-[90vw] rounded-lg"
          />

          <button
            className="absolute right-6 bg-white text-3xl shadow rounded-full p-5 z-20 cursor-pointer hover:text-red-600 transition duration-300 ease-in-out transform hover:scale-125"
            onClick={() =>
              setActiveImageIndex(
                activeImageIndex === images.length - 1
                  ? 0
                  : activeImageIndex + 1
              )
            }
          >
            <LuArrowRight className="h-6 w-6" />
          </button>
        </div>
      )}

      {/* ================= TITLE ================= */}
      <h1 className="text-3xl font-bold mb-2">
        {listing.title}, {listing.locality}, {listing.city}
      </h1>
      <p className="text-gray-600 mb-4">
        {listing.address},{listing.locality}, {listing.city}, {listing.state}
      </p>

      {/* ================= TAGS ================= */}
      <div className="flex flex-wrap gap-2 mb-8">
        {keywordsArray
          .slice(0, showAllKeywords ? undefined : 5)
          .map((tag, i) => (
            <span key={i} className="bg-gray-200 px-3 py-1 rounded text-sm">
              {tag.trim()}
            </span>
          ))}
        {keywordsArray.length > 5 && (
          <button
            className="text-blue-600"
            onClick={() => setShowAllKeywords(!showAllKeywords)}
          >
            {showAllKeywords ? "Read Less" : "Read More"}
          </button>
        )}
      </div>

      {/* ===== SIDEBAR (MOBILE ONLY) ===== */}
      <div className="block lg:hidden mb-10">
        <ListingDetailsSidebar listing={listing} setPopupOpen={setPopupOpen} />
      </div>

      {/* ================= MAIN CONTENT ================= */}
      <div className="grid lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-10">
          {/* ABOUT */}
          <AboutSection description={desc} />

          {/* HALL CAPACITY */}
          <HallCapacities hallCapacities={hallCapacities} />

          {/* CHECK DISCOUNT PRICES */}
          <CheckDiscountPrice />

          {/* FEATURES */}
          <FeaturesSection features={listing.features} />

          {/* POLICIES */}
          <PoliciesSection policies={listing.policies} />

          {/* POLICIES */}
          <ScheduleVisit policies={listing.policies} />

          {/* MAP */}
          <section>
            <h2 className="text-2xl font-semibold mb-2">Location</h2>
            <iframe
              title="map"
              width="100%"
              height="350"
              loading="lazy"
              className="rounded-lg shadow"
              src={`https://www.google.com/maps?q=${listing.lat},${listing.long}&output=embed`}
            />
          </section>

          {/* FAQ */}
          <FaqSection faqs={faqs} />
        </div>

        {/* RIGHT SIDEBAR (DESKTOP ONLY) */}
        <div className="hidden lg:block">
          <ListingDetailsSidebar
            listing={listing}
            setPopupOpen={setPopupOpen}
          />
        </div>
      </div>

      {/* SIMILAR LISTINGS */}
      <SimilarListingsSection listings={similarListings} />
    </div>
  )
}