const mapFoodPrices = (foodCategories = []) => {
  let vegPrice = null
  let nonVegPrice = null

  for (const row of foodCategories) {
    if (row.food_category_id === 1n || row.food_category_id === 1) {
      vegPrice = row.price ? Number(row.price) : null
    }

    if (row.food_category_id === 2n || row.food_category_id === 2) {
      nonVegPrice = row.price ? Number(row.price) : null
    }
  }

  return { vegPrice, nonVegPrice }
}

module.exports = {
  mapFoodPrices
}
