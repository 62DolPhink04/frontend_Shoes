import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const KidsShoes = () => {
  const [kidsShoes, setKidsShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [axiosSecure] = useAxiosSecure();
  const [filters, setFilters] = useState({
    ageGroup: "all",
    priceRange: "all",
  });

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await axiosSecure.get("/shoes/kids");
        setKidsShoes(response.data);
      } catch (error) {
        console.error("Error fetching kids shoes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, []);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Kids' Shoes</h1>

      {/* Filters */}
      <div className="mb-6 flex gap-4">
        <select
          name="ageGroup"
          value={filters.ageGroup}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Ages</option>
          <option value="toddler">Toddler (1-4 years)</option>
          <option value="little-kids">Little Kids (4-7 years)</option>
          <option value="big-kids">Big Kids (8-12 years)</option>
        </select>

        <select
          name="priceRange"
          value={filters.priceRange}
          onChange={handleFilterChange}
          className="border rounded px-3 py-2"
        >
          <option value="all">All Prices</option>
          <option value="under-30">Under $30</option>
          <option value="30-50">$30 - $50</option>
          <option value="over-50">Over $50</option>
        </select>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {kidsShoes.map((shoe) => (
          <div key={shoe._id} className="border rounded-lg shadow-lg">
            <div className="relative">
              <img
                src={shoe.image}
                alt={shoe.name}
                className="w-full h-48 object-cover rounded-t-lg"
              />
              {shoe.onSale && (
                <span className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded">
                  SALE
                </span>
              )}
            </div>
            <div className="p-4">
              <h3 className="font-semibold text-xl mb-2">{shoe.name}</h3>
              <p className="text-gray-600 mb-2">Age: {shoe.ageGroup}</p>
              <p className="text-gray-600 mb-2">{shoe.description}</p>
              <div className="flex justify-between items-center">
                <div>
                  {shoe.onSale ? (
                    <div className="flex items-center gap-2">
                      <span className="text-xl font-bold text-red-500">
                        ${shoe.salePrice}
                      </span>
                      <span className="text-gray-500 line-through">
                        ${shoe.regularPrice}
                      </span>
                    </div>
                  ) : (
                    <span className="text-xl font-bold">${shoe.price}</span>
                  )}
                </div>
                <button className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Empty State */}
      {kidsShoes.length === 0 && (
        <div className="text-center py-8">
          <p className="text-gray-600">No shoes found matching your filters</p>
        </div>
      )}
    </div>
  );
};

export default KidsShoes;
