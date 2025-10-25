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
          />
        </div>
        <div className="gap-4 grid grid-cols-2 items-start">
          <div>
            <img
              src={siteSettings.imgGallary1}
              alt="Bộ sưu tập giày 2"
              className="md:h-[350px] rounded-sm"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary2}
              alt="Bộ sưu tập giày 3"
              className="md:h-[350px] rounded-sm"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary4}
              alt="Bộ sưu tập giày 4"
              className="md:h-[350px] rounded-sm"
            />
          </div>
          <div>
            <img
              src={siteSettings.imgGallary5}
              alt="Bộ sưu tập giày 5"
              className="md:h-[350px] rounded-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default Gallary;
