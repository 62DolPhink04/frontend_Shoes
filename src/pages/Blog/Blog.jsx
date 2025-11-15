import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const Blog = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          "https://backend-shoes-79qb.onrender.com/posts"
        );

        // Đảm bảo posts luôn là array
        if (Array.isArray(response.data)) {
          setPosts(response.data);
        } else if (response.data?.posts && Array.isArray(response.data.posts)) {
          setPosts(response.data.posts);
        } else {
          setPosts([]);
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching posts:", err);
        setError("Failed to load posts");
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, [axiosSecure]);

  const handleLike = async (postId) => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.post(
        `https://backend-shoes-79qb.onrender.com/posts/${postId}/like`
      );
      // Refresh posts
      const response = await axiosSecure.get("/blog/posts");
      if (Array.isArray(response.data)) {
        setPosts(response.data);
      } else if (response.data?.posts) {
        setPosts(response.data.posts);
      }
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800">Blog Posts</h1>
          {user && (
            <Link
              to="/blog/create"
              className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition font-semibold"
            >
              Create New Post
            </Link>
          )}
        </div>

        {posts && posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition"
              >
                <img
                  src={post.image}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h2 className="text-xl font-bold text-gray-800 mb-3 line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {post.content}
                  </p>

                  <div className="flex items-center justify-between text-sm text-gray-500 mb-4 pb-4 border-b">
                    <span>By {post.author?.name || "Anonymous"}</span>
                    <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <button
                      onClick={() => handleLike(post._id)}
                      className="flex items-center gap-1 text-red-500 hover:text-red-600 font-semibold"
                    >
                      ❤️ {post.likes?.length || 0}
                    </button>
                    <div className="flex items-center gap-1 text-blue-500 font-semibold">
                      💬 {post.comments?.length || 0}
                    </div>
                  </div>

                  <Link
                    to={`/blog/${post._id}`}
                    className="inline-block bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition font-semibold"
                  >
                    View More →
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg">No posts found yet.</p>
            {user && (
              <Link
                to="/blog/create"
                className="inline-block mt-4 bg-blue-500 text-white px-6 py-3 rounded hover:bg-blue-600"
              >
                Create the first post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Blog;
