import { Helmet } from "react-helmet-async";

const About = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 pt-3">
      <Helmet>
        <title>Về Chúng Tôi - Nike Store Việt Nam</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Về Chúng Tôi
      </h1>
      <p className="text-center text-lg dark:text-gray-300">
        Câu chuyện về thương hiệu (cửa hàng) của bạn sẽ ở đây...
      </p>
    </div>
  );
};

export default About;
