import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async";
import toast from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../hooks/useAxiosFetch";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import useUser from "../../hooks/useUser";

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
  const { currentUser } = useUser();
  const navigate = useNavigate();

  // Tải danh sách bài viết (public)
  useEffect(() => {
    axiosFetch
      .get("https://backend-shoes-79qb.onrender.com/posts")
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải bài viết:", error);
        setLoading(false);
      });
  }, [axiosFetch, axiosSecure]); // Thêm axiosSecure vào dependency array

  // Xử lý khi nhấn "Like" (protected)
  const handleLike = async (postId) => {
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thích bài viết.");
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.post(`/posts/${postId}/like`);

      // 3. Tải lại danh sách bài viết để cập nhật số like
      const response = await axiosFetch.get("/posts");
      setPosts(response.data);
      toast.success("Đã cập nhật trạng thái Like!");
    } catch (error) {
      console.error("Lỗi khi like bài viết:", error);
      toast.error("Đã xảy ra lỗi khi thích bài viết.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
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
        {/* --- PHẦN HEADER ĐÃ SỬA --- */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-secondary">Blog Posts</h1>
        </div>
        <div className="flex justify-between items-center mb-12">
          <p className="text-lg text-gray-500 dark:text-gray-400">
            Khám phá các xu hướng, hướng dẫn và câu chuyện mới nhất.
          </p>
          {currentUser && (
            <Link
              to="/blog/create"
              className="px-4 py-2 text-white bg-secondary duration-300 rounded hover:bg-red-700 whitespace-nowrap"
            >
              Tạo bài viết mới
            </Link>
          )}
        </div>
        {/* --- KẾT THÚC HEADER --- */}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            // --- THẺ BÀI VIẾT (CARD) ĐÃ LÀM ĐẸP ---
            <div
              key={post._id}
              className="group bg-white dark:bg-slate-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow duration-300 border border-gray-200 dark:border-gray-700"
            >
              {/* Thêm hiệu ứng zoom ảnh */}
              <div className="overflow-hidden h-48">
                <img
                  src={post.image || "https://via.placeholder.com/400x200"}
                  alt={post.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Tăng padding lên p-5 cho thoáng */}
              <div className="p-5">
                <h2 className="text-xl font-semibold mb-2 dark:text-white truncate">
                  {post.title}
                </h2>
                <p className="text-gray-600 dark:text-gray-300 mb-4 text-sm h-16">
                  {/* Rút ngắn nội dung tóm tắt */}
                  {post.content
                    ? `${post.content.substring(0, 120)}...`
                    : "Không có nội dung."}
                </p>

                {/* --- PHẦN FOOTER CARD ĐÃ SỬA --- */}
                <div className="flex items-center justify-between mb-4">
                  {/* Nút like đã làm đẹp */}
                  <button
                    onClick={() => handleLike(post._id)}
                    className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 hover:text-secondary dark:hover:text-secondary transition-colors duration-200"
                  >
                    <HeartIcon />
                    {/* Backend của bạn đã có 'likesCount' */}
                    <span className="font-medium text-sm">
                      {post.likesCount !== undefined
                        ? post.likesCount
                        : post.likes.length}
                    </span>
                  </button>
                  {/* Hiển thị tên tác giả */}
                  <span className="text-sm text-gray-500 dark:text-gray-400 italic">
                    bởi {post.author?.name || "Admin"}
                  </span>
                </div>

                {/* Nút "Đọc thêm" được style giống hệt nút "View" bên trang Classes */}
                <Link
                  to={`/blog/${post._id}`}
                  className="block w-full text-center px-4 py-2 text-white bg-secondary duration-300 rounded hover:bg-red-700 font-semibold"
                >
                  Đọc thêm
                </Link>
                {/* --- KẾT THÚC FOOTER CARD --- */}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
