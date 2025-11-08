import React from 'react';
import { Helmet } from 'react-helmet-async';

const Contact = () => {
  return (
    <div className="container mx-auto px-4 py-8 mt-20 pt-3">
      <Helmet>
        <title>Liên hệ - Nike Store Việt Nam</title>
      </Helmet>
      <h1 className="text-4xl font-bold text-center mb-8 dark:text-white">
        Trang Liên Hệ
      </h1>
      <p className="text-center text-lg dark:text-gray-300">
        Nội dung trang liên hệ sẽ được cập nhật ở đây...
      </p>
      {/* Bạn có thể thêm Form liên hệ vào đây sau */}
    </div>
  );
};

export default Contact;