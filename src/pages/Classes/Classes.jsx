import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";

import { Helmet } from "react-helmet-async";

// Đây là component MyClasses (dành cho Instructor xem các lớp của mình)
const MyClasses = () => {
  const navigate = useNavigate();
  const [Classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  // === FETCH CLASSES CỦA INSTRUCTOR ===
  useEffect(() => {
    // ⚠️ LỜI GỌI API BỊ XUNG ĐỘT ĐÃ ĐƯỢC KHẮC PHỤC
    const fetchInstructorClasses = async () => {
      if (!currentUser?.email) return;

      try {
        const response = await axiosSecure.get(
          // URL ĐÃ ĐƯỢC ĐỔI TÊN Ở BACKEND TỪ /classes/:email SANG /instructor/classes/:email
          `/instructor/classes/${currentUser.email}`
        );
        setClasses(response.data);
      } catch (err) {
        console.error("Error fetching instructor classes:", err);
        toast.error("Failed to load your classes.");
      } finally {
        setLoading(false);
      }
    };
    fetchInstructorClasses();
  }, [currentUser, axiosSecure]); // Depend on currentUser và axiosSecure

  // ... (Phần còn lại của logic như handleSelect, handleHover, v.v. cần được điều chỉnh
  // để khớp với MyClasses, nhưng tôi tập trung vào lỗi Routing/API)

  const crumbs = [
    { name: "Dashboard", path: "/dashboard" },
    { name: "My Classes", path: null },
  ];

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <p>Loading your classes...</p>
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>My Classes | Instructor Dashboard</title>
      </Helmet>

      <div className="mt-20 pt-3">
        <Breadcrumbs crumbs={crumbs} />
        <h1 className="text-4xl font-bold text-center text-secondary mt-4">
          My Classes
        </h1>
      </div>

      <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
        {Classes.length === 0 ? (
          <p className="col-span-4 text-center text-lg text-gray-500">
            You have not created any classes yet.
          </p>
        ) : (
          Classes.map((cls, index) => (
            // ... (Phần render card sản phẩm giữ nguyên)
            <div
              key={index}
              className="relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 h-[360px] mx-auto bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer"
            >
              <div className="relative h-48">
                <img
                  src={cls.image}
                  alt={cls.name}
                  className="object-cover w-full h-full"
                />
              </div>
              <div className="px-6 py-2">
                <h3 className="font-semibold mb-1">{cls.name}</h3>
                <p className="text-gray-500 text-xs">Status: {cls.status}</p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 text-xs">
                    Seats: {cls.availableSeats}
                  </span>
                  <span className="text-green-500 font-semibold">
                    ${cls.price}
                  </span>
                </div>
                {/* Link to view detail (using class/:slug) */}
                <Link to={`/dashboard/class/${cls.slug}`}>
                  <button className="px-4 py-2 my-4 w-full mx-auto text-white bg-secondary duration-300 hover:bg-red-700">
                    Update Details
                  </button>
                </Link>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
export default MyClasses;
