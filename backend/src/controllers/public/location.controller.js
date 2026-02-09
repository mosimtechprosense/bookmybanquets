const {
  getAllLocationsDB,
  createLocationDB,
  updateLocationDB,
  deleteLocationDB
} = require("../../services/public/location.service.js")

const getAllLocations = async (req, res) => {
  try {
    console.log("REQ QUERY:", req.query)

    if (req.query.city) {
      console.log(
        "CITY SEARCH:",
        `%${req.query.city.replace(/-/g, " ")}%`
      )
    }

    const locations = await getAllLocationsDB(req.query)

    res.json({ success: true, data: locations })
  } catch (err) {
    console.error("Error fetching locations:", err)
    res.status(500).json({ success: false, message: "Server Error" })
  }
}

const createLocation = async (req, res) => {
  try {
    const { name, cityName } = req.body
    const newLoc = await createLocationDB(name, cityName)

    res.json({
      newLoc,
      success: true,
      message: "Location added successfully"
    })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const updateLocation = async (req, res) => {
  try {
    const { id } = req.params
    const { name } = req.body

    const updated = await updateLocationDB(id, name)
    res.json(updated)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

const deleteLocation = async (req, res) => {
  try {
    const { id } = req.params
    await deleteLocationDB(id)

    res.json({ message: "Location deleted successfully" })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

module.exports = {
  getAllLocations,
  createLocation,
  updateLocation,
  deleteLocation
}
