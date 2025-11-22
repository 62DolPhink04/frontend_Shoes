import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";

const MyClasses = () => {
  const [classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchClasses = async () => {
      if (!currentUser?.email) return;
      try {
        // ✅ ĐÃ SỬA: Gọi đúng URL mới
        const res = await axiosSecure.get(
          `/instructor/classes/${currentUser.email}`
        );
        setClasses(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchClasses();
  }, [currentUser, axiosSecure]);

  if (loading) return <div>Loading...</div>;

  return (
    <div>
      <Helmet>
        <title>My Classes</title>
      </Helmet>
      <div className="my-16 w-[90%] mx-auto grid grid-cols-3 gap-8">
        {classes.map((cls) => (
          <div key={cls._id} className="bg-white p-4 rounded shadow">
            <img
              src={cls.image}
              alt={cls.name}
              className="h-48 w-full object-cover"
            />
            <h3 className="font-bold mt-2">{cls.name}</h3>
            <p className="text-sm text-gray-500">Status: {cls.status}</p>
            {/* Link đúng tới route Dashboard có loader */}
            <Link to={`/dashboard/class/${cls.slug}`}>
              <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded">
                Details
              </button>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};
export default MyClasses;
