import { useState } from "react";
import { useNavigate } from "react-router-dom";
import useAuth from "../../hooks/useAuth";
import useAxiosSecure from "../../hooks/useAxiosSecure";

const CreatePost = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [axiosSecure] = useAxiosSecure();
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    image: "",
    tags: "",
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axiosSecure.post("/blog/posts", {
        ...formData,
        tags: formData.tags.split(",").map((tag) => tag.trim()),
      });
      navigate("/blog");
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  if (!user) {
    navigate("/login");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Create New Blog Post</h1>
      <form onSubmit={handleSubmit} className="max-w-2xl mx-auto">
        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Title</label>
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Content</label>
          <textarea
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2 h-48"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Image URL</label>
          <input
            type="url"
            name="image"
            value={formData.image}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">
            Tags (comma-separated)
          </label>
          <input
            type="text"
            name="tags"
            value={formData.tags}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
            placeholder="shoes, nike, running"
          />
        </div>

        <button
          type="submit"
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
        >
          Create Post
        </button>
      </form>
    </div>
  );
};

export default CreatePost;
