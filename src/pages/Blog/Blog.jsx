import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosSecure from "../../hooks/useAxiosSecure";

// Icon Heart (Trái tim) bằng SVG - đẹp và mượt hơn emoji ❤️
const HeartIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 20 20"
    fill="currentColor"
  >
    <path
      fillRule="evenodd"
      d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z"
      clipRule="evenodd"
    />
  </svg>
);

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const { user } = useAuth();

  // Tải danh sách bài viết (public)
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axiosSecure.get("/blog/posts");
        setPosts(response.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [axiosSecure]); // Bỏ 'axiosSecure' nếu không dùng

  // Xử lý khi nhấn "Like" (protected)
  const handleLike = async (postId) => {
    try {
      await axiosSecure.post(`/blog/posts/${postId}/like`);
      // Refresh posts
      const response = await axiosSecure.get("/blog/posts");
      setPosts(response.data);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen dark:text-white">
        Đang tải bài viết...
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Blog - Tin Tức & Cập Nhật | Nike Store Việt Nam</title>
        <meta
          name="description"
          content="Đọc các bài viết, tin tức và cập nhật mới nhất từ Nike Store Việt Nam. Khám phá các xu hướng và câu chuyện."
        />
      </Helmet>

      <div className="container mx-auto px-4 py-8 mt-20 pt-3">
        {/* === HEADER SECTION ĐÃ SỬA LẠI BỐ CỤC === */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-secondary mb-3">Blog Posts</h1>
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Khám phá các xu hướng, hướng dẫn và câu chuyện mới nhất.
          </p>
        </div>

        {/* Nút "Tạo bài viết" giờ nằm riêng */}
        {user && (
          <div className="flex justify-end mb-8">
            <Link
              to="/blog/create"
              className="px-5 py-3 text-white bg-secondary duration-300 rounded-lg hover:bg-red-700 font-semibold shadow-md"
            >
              Tạo bài viết mới
            </Link>
          </div>
        )}
        {/* === KẾT THÚC HEADER SECTION === */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            // === CARD BÀI VIẾT ĐÃ SỬA LẠI THẨM MỸ ===
            <div
              key={post._id}
              className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700 flex flex-col"
            >
              {/* 1. Phần hình ảnh */}
              <div className="overflow-hidden h-52">
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* 2. Phần nội dung (flex-grow để đẩy footer xuống) */}
              <div className="p-5 flex-grow flex flex-col">
                <h2 className="text-xl font-semibold mb-2 dark:text-white text-gray-900 truncate">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm h-16">
                  {post.content
                    ? `${post.content.substring(0, 120)}...`
                    : "Không có nội dung."}
                </p>

                {/* Phần này sẽ được đẩy xuống cuối card */}
                <div className="mt-auto">
                  {/* Đường gạch ngang thẩm mỹ */}
                  <div className="border-t border-gray-200 dark:border-gray-700 pt-4 mb-4 flex items-center justify-between">
                    {/* Nút like */}
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary transition-colors duration-200"
                    >
                      <HeartIcon />
                      <span className="font-medium text-sm">
                        {post.likes.length}
                      </span>
                    </button>
                    {/* Tên tác giả */}
                    <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                      bởi {post.author?.name || "Admin"}
                    </span>
                  </div>

                  {/* Nút Đọc thêm (full-width) */}
                  <Link
                    to={`/blog/${post._id}`}
                    className="block w-full text-center px-4 py-2 text-white bg-secondary duration-300 rounded-md hover:bg-red-700 font-semibold"
                  >
                    Đọc thêm
                  </Link>
                </div>
              </div>
              {/* === KẾT THÚC CARD === */}
            </div>
          ))}
        </div>

        {posts.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">Chưa có bài viết nào.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
