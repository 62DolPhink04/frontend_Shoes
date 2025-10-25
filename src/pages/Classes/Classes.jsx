import { Transition } from "@headlessui/react";
import axios from "axios";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";

import { Helmet } from "react-helmet-async";
const Classes = () => {
  const navigate = useNavigate();
  const [Classes, setClasses] = useState([]);
  const { currentUser } = useUser();
  const role = currentUser?.role;
  const [errolledClasses, setErrolledClasses] = useState([]);
  const [hoveredCard, setHoveredCard] = useState(null);
  const axiosFetch = useAxiosFetch();
  const axiosSecure = useAxiosSecure();

  const [siteSettings, setSiteSettings] = useState(null); // Để lưu trữ dữ liệu từ API
  const [loading, setLoading] = useState(true); // Để kiểm soát trạng thái loading

  useEffect(() => {
    // Lấy dữ liệu từ API khi component được render lần đầu tiên
    axios
      .get("https://backend-shoes-79qb.onrender.com/site-settings")
      .then((response) => {
        setSiteSettings(response.data); // Cập nhật dữ liệu vào state
        setLoading(false); // Thay đổi trạng thái loading sau khi có dữ liệu
      })
      .catch((error) => {
        console.error("Có lỗi khi lấy dữ liệu:", error);
        setLoading(false); // Dù có lỗi cũng phải set loading là false
      });
  }, []); // []

  // if (loading) {
  //   return <div>Đang tải dữ liệu...</div>;
  // }

  // if (!siteSettings) {
  //   return <div>Lỗi khi lấy dữ liệu.</div>;
  // }

  // const { user } = useContext(AuthProvider);
  // console.log(user);
  // message
  const showWarningToast = (message) => {
    toast(message, {
      icon: "⚠️",
      style: {
        borderRadius: "8px",
        background: "#fff4e5",
        color: "#ff9900",
      },
      duration: 3000,
    });
  };

  const handleHover = (index) => {
    setHoveredCard(index);
  };
  useEffect(() => {
    axiosFetch
      .get("/classes")
      .then((res) => setClasses(res.data))
      .catch((err) => console.log(err));
  }, []);
  // console.log(Classes);

  // handle add to cart
  const handleSelect = async (id) => {
    if (!currentUser) {
      showWarningToast("Please Login First");
      navigate("/login"); // Chuyển hướng sang trang login
      return;
    }

    try {
      // Kiểm tra xem lớp đã được đăng ký chưa
      const enrolledClassesRes = await axiosSecure.get(
        `/enrolled-classes/${currentUser?.email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo gửi token trong header
          },
        }
      );

      setErrolledClasses(enrolledClassesRes.data);

      // Kiểm tra xem lớp đã được đăng ký chưa
      const isEnrolled = enrolledClassesRes.data.find(
        (item) => item.Classes._id === id
      );
      if (isEnrolled) {
        toast.success("Already enrolled");
        return;
      }

      // Kiểm tra xem lớp đã có trong giỏ hàng chưa
      const cartItemRes = await axiosSecure.get(
        `/cart-item/${id}?email=${currentUser?.email}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo gửi token trong header
          },
        }
      );

      if (cartItemRes.data.classId === id) {
        toast.success("Already Selected!");
        return;
      }

      // Nếu chưa có trong giỏ hàng, tiến hành thêm vào giỏ hàng
      const data = {
        classId: id,
        useMail: currentUser?.email,
        data: new Date(),
      };

      const addToCartRes = await axiosSecure.post("/add-to-cart", data, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`, // Đảm bảo gửi token trong header
        },
      });

      toast.success("Successfully added to cart!");
      console.log(addToCartRes.data);
    } catch (err) {
      console.log(err); // In lỗi nếu có
      toast.error("An error occurred while processing your request.");
    }
  };
  return (
    <div>
      <Helmet>
        <title>
          Tất Cả Giày Thể Thao Nam Nữ Chính Hãng | Nike Store Việt Nam
        </title>
        <meta
          name="description"
          content="Khám phá tất cả các mẫu giày thể thao Nike chính hãng dành cho nam và nữ. Cập nhật các bộ sưu tập mới nhất 2025, miễn phí vận chuyển, bảo hành 1 đổi 1."
        />
      </Helmet>
      <div className="mt-20 pt-3">
        <h1 className="text-4xl font-bold text-center text-secondary">Shoes</h1>
      </div>
      <div className="w-[40%] text-center mx-auto my-4">
        <p className="text-gray-500">
          {siteSettings?.titlePopularClasses || "Wellcome to back Classes"}{" "}
        </p>
      </div>
      {/* set numbers items layout  */}
      <div className="my-16 w-[90%] mx-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4  gap-8 ">
        {Classes.map((cls, index) => (
          <div
            onMouseLeave={() => handleHover(null)}
            key={index}
            className={`relative hover:-translate-y-2 duration-150 hover:ring-[2px] hover:ring-secondary w-64 h-[360px] mx-auto ${
              cls.availableSeats < 1 ? "bg-red-300" : "bg-white"
            } dark:bg-slate-600 rounded-lg shadow-lg overflow-hidden cursor-pointer`}
            onMouseEnter={() => handleHover(index)}
          >
            <div className="relative h-48">
              <div
                className={`absolute inset-0 bg-black opacity-0 transition-opacity duration-300 ${
                  hoveredCard === index ? "opacity-60" : ""
                }`}
              />
              <img
                src={cls.image}
                alt={cls.name}
                className="object-cover w-full h-full"
              />
              <Transition
                show={hoveredCard === index}
                enter="transition-opacity duration-300"
                enterFrom="opacity-0"
                enterTo="opacity-100"
                leave="transition-opacity duration-300"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <div className="absolute inset-0 flex items-center justify-center">
                  <button
                    onClick={() => handleSelect(cls._id)}
                    title={
                      role === "admin" || role == "instructor"
                        ? "Instructor/Admin Can not be able to Select"
                          ? cls.availableSeats < 1
                          : "No Seat Availble"
                        : "You can Select Classes"
                    }
                    disabled={
                      role === "admin" ||
                      role === "instructor" ||
                      cls.availableSeats < 1
                    }
                    className="px-1 py-2 text-white disabled:bg-red-300 bg-secondary duration-300 rounded hover:bg-red-700"
                  >
                    Add to cart
                  </button>
                </div>
              </Transition>
              {/* details  classes */}
              <div className="px-6 py-2">
                <h3 className="font-semibold mb-1">{cls.name}</h3>
                <p className="text-gray-500 text-xs">
                  Instructors: {cls.instructorName}
                </p>
                <div className="flex items-center justify-between mt-4">
                  <span className="text-gray-600 text-xs">
                    Available Seats: {cls.availableSeats}
                  </span>
                  <span className="text-green-500 font-semibold">
                    ${cls.price}
                  </span>
                </div>
                <Link to={`/classes/${cls._id}`}>
                  <button className="px-4 py-2 my-4 w-full mx-auto text-white disabled:bg-red-300 bg-secondary duration-300 hover:bg-red-700">
                    View
                  </button>
                </Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
export default Classes;
