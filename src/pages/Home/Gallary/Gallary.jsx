import axios from "axios"; // Thư viện axios để gọi API
import { useEffect, useState } from "react";

const Gallary = () => {
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

  if (loading) {
    return <div>Đang tải dữ liệu...</div>;
  }

  if (!siteSettings) {
    return <div>Lỗi khi lấy dữ liệu.</div>;
  }
  return (
    <div className="md:w-[80%] mx-auto my-28">
      <div>
        <h1 className="text-5xl font-bold text-center mb-8">
          Premium <span className="text-secondary">Designs - The Hottest</span>{" "}
          Styles.
        </h1>
      </div>

      {/* show img container */}
      <div className="md:grid grid-cols-2 items-center justify-center gap-4">
        <div className="mb-4 md:mb-0">
          <img
            src={siteSettings.imgGallary3}
            alt="Bộ sưu tập giày 1"
            className="md:h-[720px] w-full mx-auto rounded-sm"
            title="Top 10 Mẫu Giày Sneaker Đáng Mua Nhất 2025 (Mục tiêu: SEO, thu hút người đang tìm mua)"
          />
        </div>
        <div className="gap-4 grid grid-cols-2 items-start">
          <div>
            <img
              src={siteSettings.imgGallary1}
              alt="Bộ sưu tập giày 2"
              className="md:h-[350px] rounded-sm"
              title="Hướng Dẫn Phân Biệt Giày Thật (Auth) và Giày Giả (Fake) Chỉ Trong 5 Phút (Mục tiêu: Giải quyết vấn đề, xây dựng uy tín)"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary2}
              alt="Bộ sưu tập giày 3"
              className="md:h-[350px] rounded-sm"
              title="5 Xu Hướng Giày Thể Thao Sẽ Làm Mưa Làm Gió Mùa - Này (Mục tiêu: Bắt trend, thời trang)"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary4}
              alt="Bộ sưu tập giày 4"
              className="md:h-[350px] rounded-sm"
              title="Bí Quyết Chọn Giày Chạy Bộ Hoàn Hảo Cho Người Mới Bắt Đầu (Mục tiêu: Hướng dẫn, nhắm vào đối tượng cụ thể)"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary5}
              alt="Bộ sưu tập giày 5"
              className="md:h-[350px] rounded-sm"
              title="Bạn Đã Biết Cách Vệ Sinh Giày Trắng Đúng Cách Chưa? (Mục tiêu: Gây tò mò, giải quyết vấn đề phổ biến)"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Gallary;
