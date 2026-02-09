const {
  createLocalityContentDB,
  getAllLocalityContentDB,
  getLocalityContentByIdDB,
  getLocalityContentBySlugDB,
  updateLocalityContentDB,
  deleteLocalityContentDB
} = require("../../services/public/localityContent.service.js")

// CREATE
const createLocalityContent = async (req, res) => {
  try {
    const data = await createLocalityContentDB(req.body)
    res.status(201).json({ success: true, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Create failed" })
  }
}

// READ ALL
const getAllLocalityContent = async (req, res) => {
  const data = await getAllLocalityContentDB()
  res.json({ success: true, data })
}

// READ BY ID
const getLocalityContentById = async (req, res) => {
  const data = await getLocalityContentByIdDB(req.params.id)

  if (!data) {
    return res.status(404).json({ message: "Not found" })
  }

  res.json({ success: true, data })
}

// READ BY SLUG (SEO)
const getLocalitySeoBySlug = async (req, res) => {
  try {
    const data = await getLocalityContentBySlugDB(req.params.slug)

    if (!data) {
      return res
        .status(404)
        .json({ success: false, message: "Locality not found" })
    }

    res.json({ success: true, data })
  } catch (error) {
    console.error(error)
    res.status(500).json({ success: false, message: "Server error" })
  }
}

// UPDATE
const updateLocalityContent = async (req, res) => {
  const data = await updateLocalityContentDB(
    req.params.id,
    req.body
  )

  res.json({ success: true, data })
}

// DELETE
const deleteLocalityContent = async (req, res) => {
  await deleteLocalityContentDB(req.params.id)
  res.json({ success: true, message: "Deleted successfully" })
}

module.exports = {
  createLocalityContent,
  getAllLocalityContent,
  getLocalityContentById,
  getLocalitySeoBySlug,
  updateLocalityContent,
  deleteLocalityContent
}
