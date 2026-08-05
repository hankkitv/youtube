/* js/filters.js */

function filterRestaurants(keyword) {
  if (!keyword) return restaurants;

  keyword = keyword.toLowerCase();

  return restaurants.filter((row) => {
    return [row.name, row.alias, row.addr, row.menu]
      .join(" ")
      .toLowerCase()
      .includes(keyword);
  });
}
