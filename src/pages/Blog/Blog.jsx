import { useEffect, useState } from "react";
import { Helmet } from "react-helmet-async"; // Thư viện SEO
import toast from "react-hot-toast"; // Thư viện thông báo
import { Link, useNavigate } from "react-router-dom";
import useAxiosFetch from "../../hooks/useAxiosFetch"; // Hook công khai
import useAxiosSecure from "../../hooks/useAxiosSecure"; // Hook bảo mật
import useUser from "../../hooks/useUser"; // Hook người dùng (thay cho useAuth)

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Khởi tạo các hook giống như file mẫu
  const axiosSecure = useAxiosSecure();
  const axiosFetch = useAxiosFetch();
  const { currentUser } = useUser(); // Lấy thông tin người dùng
  const navigate = useNavigate();

  // Tải danh sách bài viết (public)
  useEffect(() => {
    // Sử dụng axiosFetch cho
    axiosFetch
      .get("/posts") // Endpoint từ backend của bạn là /posts
      .then((res) => {
        setPosts(res.data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Lỗi khi tải bài viết:", error);
        setLoading(false);
      });
  }, [axiosFetch]);

  // Xử lý khi nhấn "Like" (protected)
  const handleLike = async (postId) => {
    // 1. Kiểm tra nếu chưa đăng nhập
    if (!currentUser) {
      toast.error("Vui lòng đăng nhập để thích bài viết.");
      navigate("/login");
      return;
    }

    // 2. Gửi yêu cầu "Like" (dùng axiosSecure)
    try {
      // Endpoint từ backend của bạn là /posts/:id/like
      await axiosSecure.post(`/posts/${postId}/like`);

      // 3. Tải lại danh sách bài viết để cập nhật số like
      // (Giống như logic gốc của bạn)
      const response = await axiosFetch.get("/posts");
      setPosts(response.data);
      toast.success("Đã cập nhật trạng thái Like!");
    } catch (error) {
      console.error("Lỗi khi like bài viết:", error);
      toast.error("Đã xảy ra lỗi khi thích bài viết.");
    }
  };

  if (loading) {
    return <div>Đang tải bài viết...</div>; // Thêm trạng thái tải
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

      {/* Thêm khoảng đệm giống file mẫu */}
      <div className="container mx-auto px-4 py-8 mt-20 pt-3">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-secondary">Blog Posts</h1>

          {/* Kiểm tra 'currentUser' (thay vì 'user') */}
          {currentUser && (
            <Link
              to="/blog/create" // Bạn sẽ cần tạo trang này
              // Dùng style nút giống file mẫu
              className="px-4 py-2 text-white bg-secondary duration-300 rounded hover:bg-red-700"
            >
              Tạo bài viết mới
            </Link>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {posts.map((post) => (
            <div
              key={post._id}
              // Thêm hiệu ứng hover giống file mẫu
              className="border rounded-lg overflow-hidden shadow-lg hover:-translate-y-2 duration-150"
            >
              <img
                src={post.image || "https://via.placeholder.com/400x200"} // Thêm ảnh dự phòng
                alt={post.title}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2">{post.title}</h2>
                <p className="text-gray-600 mb-4">
                  {/* Cắt ngắn nội dung */}
                  {post.content
                    ? `${post.content.substring(0, 150)}...`
                    : "Không có nội dung."}
                </p>
                <div className="flex items-center justify-between">
                  <button
                    onClick={() => handleLike(post._id)}
                    // Dùng màu 'secondary' giống file mẫu
                    className="text-secondary hover:text-red-700 font-bold flex items-center gap-1"
                  >
                    ❤️ <span>{post.likes.length}</span>
                  </button>
                  <Link
                    to={`/blog/${post._id}`} // Bạn sẽ cần tạo trang chi tiết
                    className="text-secondary font-semibold hover:text-red-700"
                  >
                    Đọc thêm →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
