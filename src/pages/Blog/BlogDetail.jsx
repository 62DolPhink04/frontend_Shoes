import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const BlogDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [post, setPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(true);
  const [liked, setLiked] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await axiosSecure.get(
          `https://backend-shoes-79qb.onrender.com/posts/${id}`
        );
        const postData = response.data;

        setPost(postData);
        setComments(Array.isArray(postData.comments) ? postData.comments : []);

        if (user && Array.isArray(postData.likes)) {
          setLiked(postData.likes.includes(user._id));
        }
        setError(null);
      } catch (err) {
        console.error("Error fetching post:", err);
        setError("Failed to load post");
        setPost(null);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchPost();
    }
  }, [id, user, axiosSecure]);

  const handleLike = async () => {
    if (!user) {
      navigate("/login");
      return;
    }

    try {
      await axiosSecure.post(
        `https://backend-shoes-79qb.onrender.com/posts/${id}/like`
      );
      setLiked(!liked);

      const response = await axiosSecure.get(`/blog/posts/${id}`);
      setPost(response.data);
    } catch (error) {
      console.error("Error liking post:", error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();

    if (!user) {
      navigate("/login");
      return;
    }

    if (!newComment.trim()) return;

    try {
      const response = await axiosSecure.post(
        `https://backend-shoes-79qb.onrender.com/posts/${id}/comment`,
        {
          content: newComment,
        }
      );

      setComments(
        Array.isArray(response.data.comments) ? response.data.comments : []
      );
      setNewComment("");
    } catch (error) {
      console.error("Error commenting:", error);
    }
  };

  const handleShare = async (platform) => {
    const url = window.location.href;
    const title = post?.title || "Check out this blog post";

    switch (platform) {
      case "facebook":
        window.open(
          `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "twitter":
        window.open(
          `https://twitter.com/intent/tweet?url=${encodeURIComponent(
            url
          )}&text=${encodeURIComponent(title)}`,
          "_blank"
        );
        break;
      case "whatsapp":
        window.open(
          `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
          "_blank"
        );
        break;
      case "linkedin":
        window.open(
          `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
            url
          )}`,
          "_blank"
        );
        break;
      case "copy":
        navigator.clipboard.writeText(url);
        alert("Link copied to clipboard!");
        break;
      default:
        break;
    }

    try {
      await axiosSecure.post(
        `https://backend-shoes-79qb.onrender.com/posts/${id}/share`
      );
    } catch (error) {
      console.error("Error recording share:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">
            {error || "Post not found"}
          </div>
          <button
            onClick={() => navigate("/blog")}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          >
            Back to Blog
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <article className="bg-white rounded-lg shadow-lg overflow-hidden">
            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover"
            />

            <div className="p-8">
              <h1 className="text-4xl font-bold mb-4 text-gray-800">
                {post.title}
              </h1>

              <div className="flex items-center gap-4 mb-6 pb-6 border-b">
                <img
                  src={post.author?.avatar || "https://via.placeholder.com/50"}
                  alt={post.author?.name || "Author"}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-gray-800">
                    {post.author?.name || "Anonymous"}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>

              <div className="prose prose-lg max-w-none mb-8 text-gray-700 leading-relaxed">
                {post.content}
              </div>

              {post.tags &&
                Array.isArray(post.tags) &&
                post.tags.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-8">
                    {post.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}

              <div className="flex items-center gap-8 py-6 border-t border-b">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-2 font-semibold transition-colors ${
                    liked
                      ? "text-red-500 hover:text-red-600"
                      : "text-gray-600 hover:text-red-500"
                  }`}
                >
                  <span className="text-2xl">{liked ? "❤️" : "🤍"}</span>
                  <span>
                    {Array.isArray(post.likes) ? post.likes.length : 0} Likes
                  </span>
                </button>

                <div className="flex items-center gap-2 font-semibold text-gray-600">
                  <span className="text-2xl">💬</span>
                  <span>{comments.length} Comments</span>
                </div>

                <div className="flex items-center gap-2 font-semibold text-gray-600">
                  <span className="text-2xl">📤</span>
                  <span>{post.shares || 0} Shares</span>
                </div>
              </div>

              <div className="py-6 border-b">
                <p className="text-gray-600 font-semibold mb-3">Share:</p>
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => handleShare("facebook")}
                    className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                  >
                    Facebook
                  </button>
                  <button
                    onClick={() => handleShare("twitter")}
                    className="flex items-center gap-2 bg-blue-400 text-white px-4 py-2 rounded hover:bg-blue-500 transition"
                  >
                    Twitter
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 transition"
                  >
                    WhatsApp
                  </button>
                  <button
                    onClick={() => handleShare("linkedin")}
                    className="flex items-center gap-2 bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800 transition"
                  >
                    LinkedIn
                  </button>
                  <button
                    onClick={() => handleShare("copy")}
                    className="flex items-center gap-2 bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
                  >
                    Copy Link
                  </button>
                </div>
              </div>

              <div className="mt-12">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">
                  Comments ({comments.length})
                </h2>

                {user ? (
                  <form onSubmit={handleComment} className="mb-8">
                    <div className="flex gap-4">
                      <img
                        src={user.avatar || "https://via.placeholder.com/40"}
                        alt={user.name || "User"}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="flex-1">
                        <textarea
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Add a comment..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                          rows="3"
                        />
                        <button
                          type="submit"
                          className="mt-2 bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 transition font-semibold"
                        >
                          Post Comment
                        </button>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
                    <p className="text-gray-700">
                      <button
                        onClick={() => navigate("/login")}
                        className="text-blue-500 font-semibold hover:underline"
                      >
                        Sign in
                      </button>{" "}
                      to comment on this post.
                    </p>
                  </div>
                )}

                <div className="space-y-6">
                  {comments.length > 0 ? (
                    comments.map((comment, index) => (
                      <div
                        key={index}
                        className="border-l-4 border-blue-500 pl-4"
                      >
                        <div className="flex items-center gap-3 mb-2">
                          <img
                            src={
                              comment.user?.avatar ||
                              "https://via.placeholder.com/40"
                            }
                            alt={comment.user?.name || "User"}
                            className="w-10 h-10 rounded-full"
                          />
                          <div>
                            <p className="font-semibold text-gray-800">
                              {comment.user?.name || "Anonymous"}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(comment.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <p className="text-gray-700 bg-gray-50 p-3 rounded">
                          {comment.content}
                        </p>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-center py-8">
                      No comments yet. Be the first to comment!
                    </p>
                  )}
                </div>
              </div>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
};

export default BlogDetail;
