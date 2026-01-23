import { useContext, useState } from "react"
import bookmybanquetsLogo from "../assets/bookmybanquet.png"
import { IoMdArrowDropdown } from "react-icons/io"
import { useNavigate, useLocation } from "react-router-dom"
import VenuesDropdown from "./VenuesDropdown"
import { UIContext } from "../store/UIContext"

const HeroSection = () => {
  const [venuesOpen, setVenuesOpen] = useState(false)
  const { menuOpen, setMenuOpen } = useContext(UIContext)
  const navigate = useNavigate()
  const location = useLocation()

  const links = [
    { id: "home", label: "Home", path: "/" },
    { id: "venues", label: "Venues", path: null },
    { id: "services", label: "Services", path: "/services" },
    { id: "about", label: "About", path: "/about" },
    { id: "why-us", label: "Why Us?", path: "/why-us" },
    { id: "blog", label: "Blog", path: "/blogs" },
    { id: "contact", label: "Contact Us", path: "/contact" }
  ]

  //  Lock scroll when menu is open  (Temprory paused)
  // useEffect(() => {
  //   document.body.style.overflow = menuOpen ? "hidden" : "auto";
  // }, [menuOpen]);

  // Auto-close dropdown when popup is open

  const handleLogo = () => {
    navigate("/")
    setMenuOpen(false)
  }

  const handleNavClick = (id, path) => {
    navigate(path)
    setMenuOpen(false)
  }

  return (
    <div className="w-full bg-[#dc2626] shadow-md overflow-visible px-4 sm:py-0 md:py-0 lg:py-0 sm:px-6 md:px-6 lg:px-14 xl:px-20 flex items-center justify-between gap-6 relative z-100 py-2 select-none">
      {/* Logo */}
      <div className="flex items-center">
        <img
          src={bookmybanquetsLogo}
          alt="bookmybanquetsLogo"
          className="h-9 sm:h-10 md:h-11 lg:h-12 w-auto cursor-pointer"
          onClick={handleLogo}
        />
      </div>

      {/* Mobile Menu Button */}
      <div
        className="md:hidden text-white text-3xl cursor-pointer select-none"
        onClick={(e) => {
          e.stopPropagation()
          setMenuOpen(!menuOpen)
          setVenuesOpen(false)
        }}
      >
        {menuOpen ? "✕" : "☰"}
      </div>

      {/* Navigation Menu */}
      <div
        className={`
    md:flex flex-col md:flex-row md:items-center gap-3 sm:gap-6 md:gap-8 lg:gap-10
    absolute md:static top-full left-0 w-full md:w-auto
    bg-[#dc2626] md:bg-transparent px-6 md:px-0 py-4 md:py-0
    shadow-md md:shadow-none whitespace-nowrap z-50
    transform transition-all duration-500 ease-in-out overflow-visible
    ${
      menuOpen
        ? "translate-y-0 opacity-100"
        : "-translate-y-5 opacity-0 md:opacity-100 md:translate-y-0"
    }
    ${menuOpen ? "flex" : "hidden md:flex"}
  `}
        onClick={(e) => e.stopPropagation()}
      >
        {links.map((link) => (
          <div
            key={link.id}
            className={`relative ${link.id === "venues" ? "group" : ""}`}
          >
            <button
              onClick={() => {
                if (link.id === "venues") {
                  if (window.innerWidth < 768) setVenuesOpen(!venuesOpen)
                } else {
                  handleNavClick(link.id, link.path)
                }
              }}
              className={`relative flex items-center gap-1 text-base font-semibold py-3 md:py-4
          transition-all duration-300 ease-in-out cursor-pointer
          ${
            location.pathname === link.path ||
            (link.id === "venues" && location.pathname.startsWith("/venues"))
              ? "text-[#000000] after:scale-x-100 after:origin-left"
              : "text-white hover:text-[#09122C]"
          }
          after:content-[''] after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full
          after:bg-[#09122C] after:scale-x-0 hover:after:scale-x-100 after:origin-right hover:after:origin-left
          after:transition-transform after:duration-300
        `}
              onMouseEnter={() =>
                window.innerWidth >= 768 &&
                link.id === "venues" &&
                setVenuesOpen(true)
              }
              onMouseLeave={() =>
                window.innerWidth >= 768 &&
                link.id === "venues" &&
                setVenuesOpen(false)
              }
            >
              {link.label}
              {link.id === "venues" && (
                <IoMdArrowDropdown
                  className={`text-lg transition-transform duration-300 ${
                    venuesOpen ? "rotate-180" : "rotate-0"
                  }`}
                />
              )}
            </button>

            {/* Mobile Inline Dropdown */}
            {link.id === "venues" && window.innerWidth < 768 && venuesOpen && (
              <div
                className={`pl-4 py-2 text-white bg-[#dc2626] overflow-visible
              transition-all duration-300 ease-in-out transform
              ${
                venuesOpen
                  ? "opacity-100 translate-y-0"
                  : "opacity-0 -translate-y-2"
              }`}
              >
                <VenuesDropdown
                  isOpen={venuesOpen}
                  onSelect={() => {
                    setVenuesOpen(false)
                    setMenuOpen(false)
                  }}
                />
              </div>
            )}

            {/* Desktop Hover Dropdown */}
            {link.id === "venues" && window.innerWidth >= 768 && (
              <div
                className={`absolute top-full left-0 mt-0 w-[460px] bg-white shadow-lg rounded-lg 
                            p-3 text-[0.85rem] overflow-hidden grid grid-cols-1 md:grid-cols-2  duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] z-50 transform
                          ${
                            venuesOpen
                              ? "opacity-100 translate-y-0 visible"
                              : "opacity-0 translate-y-2 invisible"
                          }`}
                onMouseEnter={() => setVenuesOpen(true)}
                onMouseLeave={() => setVenuesOpen(false)}
              >
                <VenuesDropdown
                  isOpen={venuesOpen}
                  onSelect={() => {
                    setMenuOpen(false)
                    setVenuesOpen(false)
                  }}
                />
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Transparent Overlay */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-transparent bg-opacity-20 md:hidden z-30"
          onClick={() => setMenuOpen(false)}
        ></div>
      )}
    </div>
  )
}

export default HeroSection
