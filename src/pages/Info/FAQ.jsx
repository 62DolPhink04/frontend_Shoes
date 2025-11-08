import { Helmet } from "react-helmet-async";

const FAQ = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 pt-3">
      <Helmet>
        <title>Câu Hỏi Thường Gặp (FAQ) - Nike Store Việt Nam</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Câu Hỏi Thường Gặp (FAQ)
      </h1>
      <p className="text-center text-lg dark:text-gray-300">
        Nội dung các câu hỏi (ví dụ: "Giày có chính hãng không?") sẽ ở đây...
      </p>
    </div>
  );
};

export default FAQ;
