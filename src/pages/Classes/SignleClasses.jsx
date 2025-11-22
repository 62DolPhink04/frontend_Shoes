import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { useLoaderData } from "react-router-dom";

import toast from "react-hot-toast";
import Breadcrumbs from "../../components/Breadcrumbs/Breadcrumbs";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";

// Đổi tên component thành SingleClass nếu bạn muốn chuẩn hóa
const SingleClasses = () => {
  const axiosSecure = useAxiosSecure();
  const course = useLoaderData();
  const { currentUser } = useUser();
  const role = currentUser?.role;
  // ✅ ĐÃ CHUẨN HÓA: Đổi tên biến (nếu bạn muốn)
  const [enrolledClasses, setEnrolledClasses] = useState([]);
  const axiosFetch = useAxiosFetch();

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

  const handleSelect = async (id) => {
    if (!currentUser) {
      showWarningToast("Please Login First");
      // Dùng navigate từ hook nếu chưa có
      // navigate("/login");
      return;
    }

    try {
      // Kiểm tra xem người dùng đã đăng ký các lớp học chưa
      const enrolledClassesRes = await axiosSecure.get(
        `/enrolled-classes/${currentUser?.email}`
      );
      setEnrolledClasses(enrolledClassesRes.data);

      // Kiểm tra xem lớp học đã có trong danh sách đăng ký chưa
      if (enrolledClassesRes.data.find((item) => item.Classes._id === id)) {
        toast.success("Already enrolled");
        return;
      }

      // Kiểm tra xem lớp học đã có trong giỏ hàng chưa
      const cartItemRes = await axiosSecure.get(
        `/cart-item/${id}?email=${currentUser?.email}`
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

      const addToCartRes = await axiosSecure.post("/add-to-cart", data);
      toast.success("Successfully added to cart!");
      console.log(addToCartRes.data);
    } catch (err) {
      console.log(err);
      toast.error("An error occurred while processing your request.");
    }
  };

  // === 3. ĐỊNH NGHĨA CRUMBS DỰA TRÊN DATA SẢN PHẨM ===
  const crumbs = course.categoryPath || [
    { name: "Trang chủ", path: "/" },
    { name: "Tất cả Giày", path: "/classes" },
    { name: course.name, path: null }, // Trang hiện tại
  ];

  return (
    <>
      <Helmet>
        {/* ... (Helmet code giữ nguyên) ... */}
        <title>{course?.name} | Nike</title>
        <meta
          name="description"
          content={
            course?.description
              ? course.description.replace(/<[^>]*>?/gm, "").substring(0, 155)
              : `Mua ngay ${course?.name} tại Tên Shop Của Bạn.`
          }
        />

        <meta property="og:title" content={`${course?.name} | Nike`} />
        <meta property="og:image" content={course?.image} />
        <meta
          property="og:description"
          content={
            course?.description
              ? course.description.replace(/<[^>]*>?/gm, "").substring(0, 155)
              : `Mua ngay ${course?.name} tại Tên Shop Của Bạn.`
          }
        />
      </Helmet>
      <div>
        {/* ... (phần còn lại của JSX giữ nguyên) ... */}
        <div
          className="font-gilroy font-medium text-gray dark:text-white text-lg leading-[27%] w-[90%] mx-auto"
          data-new-gr-c-s-check-loaded="14.1157.0"
          data-gr-ext-installed=""
        >
          {/* THÊM BREADCRUMBS */}
          <div className="mt-20 pt-3">
            <Breadcrumbs crumbs={crumbs} />
          </div>

          <div className="nav-tab-wrapper tabs section-padding mt-8">
            <div className="container">
              <div className="grid grid-cols-12 md:gap-[30px]">
                {/* Left side  */}
                <div className="lg:col-span-8 col-span-12">
                  <div className="single-course-detailts">
                    {/* ... (phần nội dung giữ nguyên) ... */}
                  </div>
                </div>
                {/*right side*/}
                <div className="lg:col-span-4 col-span-12 mt-8 md:mt-0">
                  <div className="sidebarWrapper space-y-[30px]">
                    {/* ... (Sidebar giữ nguyên) ... */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SingleClasses; // Đổi tên export
