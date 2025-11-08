import { Helmet } from "react-helmet-async";

const Policy = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 pt-3">
      <Helmet>
        <title>Chính Sách Đổi Trả - Nike Store Việt Nam</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Chính Sách (Đổi Trả, Vận Chuyển...)
      </h1>
      <p className="text-center text-lg dark:text-gray-300">
        Nội dung chi tiết về chính sách đổi trả sẽ được cập nhật ở đây...
      </p>
    </div>
  );
};

export default Policy;
