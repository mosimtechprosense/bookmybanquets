const {
  createListingDB,
  getAllListingDB,
  getListingByIdDB,
  updateListingDB,
  deleteListingDB,
  getRecommendedListingsDB,
  getHighDemandListingsDB,
  getSimilarListingsDB,
} = require("../../services/public/listing.service");


// todo: CREATE LISTING
const createListing = async (req, res) => {
  try {
    const listing = await createListingDB(req.body);

    res.status(201).json({
      success: true,
      message: "Listing created successfully",
      data: listing,
    });
  } catch (error) {
    console.error("Listing created successfully", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//* GET ALL LISTINGS (WITH FILTERS + PAGINATION)
const getAllListing = async (req, res) => {
  try {
    const filters = req.query;

    // FRONTEND PAGINATION SUPPORT
    const skip = Number(filters.skip) || 0;
    const take = Number(filters.take) || 10;

    // Remove pagination params from filters
    delete filters.skip;
    delete filters.take;

    const { listings, totalCount } = await getAllListingDB(filters, skip, take);

    res.status(200).json({
      success: true,
      total: totalCount,
      skip,
      take,
      data: listings,
    });
  } catch (error) {
    console.error("Get All Listings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//* GET RECOMMENDED LISTINGS
const getRecommendedListings = async (req, res) => {
  try {
    const { limit, city, locality } = req.query;

    const listings = await getRecommendedListingsDB(
      limit ? Number(limit) : undefined,
      city,
      locality
    );

    const result = listings.map(l => ({
      id: l.id,
      title: l.title,
      excerpt: l.excerpt,
      description: l.description,
      images: l.venue_images?.map(img => img.image_url) || [],
      capacityFrom: l.min_guest,
      capacityTo: l.max_guest,
      city: l.city,
      locality: l.locality,
      vegPrice: l.vegPrice,
      nonVegPrice: l.nonVegPrice,
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get Recommended Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//* GET HIGH DEMAND LISTINGS
const getHighDemandListings = async (req, res) => {
  try {
    const { limit = 10, city, locality } = req.query;

    const listings = await getHighDemandListingsDB(Number(limit), city);

    const result = listings.map(l => ({
      id: l.id,
      title: l.title,
      excerpt: l.excerpt,
      description: l.description,
      locality: l.locality,
      city: l.city,
      images: l.venue_images.map(img => img.image_url),
      capacityFrom: l.min_guest,
      capacityTo: l.max_guest,
      vegPrice: l.vegPrice,
      nonVegPrice: l.nonVegPrice,
    }));

    res.status(200).json({
      success: true,
      count: result.length,
      data: result,
    });
  } catch (error) {
    console.error("Get High Demanded Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//* GET SINGLE LISTING
const getListingById = async (req, res) => {
  try {
    const id = req.params.id;

    const listing = await getListingByIdDB(id);

    if (!listing || listing.status === false) {
      return res.status(404).json({
        success: false,
        message: "Listings not found",
      });
    }

    res.status(200).json({
      success: true,
      data: listing,
    });
  } catch (error) {
    console.error("Get Listing By ID Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//* GET SIMILAR LISTINGS
const getSimilarListings = async (req, res) => {
  try {
    const { id } = req.params;
    console.log("Received listing ID for similar:", id);

    const similarListings = await getSimilarListingsDB(id);

    console.log(
      "Number of similar listings fetched:",
      similarListings.length
    );

    res.status(200).json({
      success: true,
      count: similarListings.length,
      data: similarListings,
    });
  } catch (error) {
    console.error("Get Similar Listings Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//? UPDATE LISTING
const updateListing = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({
        success: false,
        message: "Listing ID is required",
      });
    }

    const existing = await getListingByIdDB(id);

    if (!existing || existing.status === false) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    const updated = await updateListingDB(id, req.body);

    res.status(200).json({
      success: true,
      message: "Listing updated successfully",
      data: updated,
    });
  } catch (error) {
    console.error("Update Listing Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


//! DELETE LISTING (SOFT DELETE)
const deleteListing = async (req, res) => {
  try {
    const id = req.params.id;

    const listing = await getListingByIdDB(id);
    if (!listing) {
      return res.status(404).json({
        success: false,
        message: "Listing not found",
      });
    }

    await deleteListingDB(id);

    res.status(200).json({
      success: true,
      message: "Listing deleted (status = false)",
    });
  } catch (error) {
    console.error("Delete Listing Error:", error);
    res.status(500).json({
      success: false,
      message: "Server Error",
    });
  }
};


module.exports = {
  createListing,
  getAllListing,
  getRecommendedListings,
  getHighDemandListings,
  getListingById,
  getSimilarListings,
  updateListing,
  deleteListing,
};
