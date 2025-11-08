import { useEffect, useState } from "react";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const MenShoes = () => {
  const [menShoes, setMenShoes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    const fetchShoes = async () => {
      try {
        const response = await axiosSecure.get("/shoes/men");
        setMenShoes(response.data);
      } catch (error) {
        console.error("Error fetching men shoes:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchShoes();
  }, []);

  if (loading) return <div>Loading...</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Men's Shoes</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {menShoes.map((shoe) => (
          <div key={shoe._id} className="border rounded-lg shadow-lg">
            <img
              src={shoe.image}
              alt={shoe.name}
              className="w-full h-48 object-cover rounded-t-lg"
            />
            <div className="p-4">
              <h3 className="font-semibold text-xl mb-2">{shoe.name}</h3>
              <p className="text-gray-600 mb-2">{shoe.description}</p>
              <div className="flex justify-between items-center">
                <span className="text-xl font-bold">${shoe.price}</span>
                <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MenShoes;
