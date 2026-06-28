"use client";

import ErrorBox from "@/components/Error/ErrorBox";
import { PageLoader } from "@/components/Loadingspinner";
import { Edit, Eye, Plus, Trash, Loader2 } from "lucide-react";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import Swal from "sweetalert2";

const BlogPage = () => {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/private/posts`,
        {
          method: "GET",
          headers: {
            "content-type": "application/json",
          },
          credentials: "include",
        },
      );

      const data = await res.json();

      if (data.success) {
        setPosts(Array.isArray(data.data) ? data.data : []);
      } else {
        setError(data.error || data.message || "Something went wrong");
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePost = async (id) => {
    const confirm = await Swal.fire({
      title: "Are you sure?",
      text: "This post will be deleted permanently.",
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes, delete it",
      cancelButtonText: "Cancel",
    });

    if (!confirm.isConfirmed) return;

    try {
      setDeletingId(id);

      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/post/${id}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (data.success) {
        setPosts((prevPosts) => prevPosts.filter((post) => post._id !== id));

        Swal.fire({
          title: "Post Deleted",
          text: data.message,
          icon: "success",
        });
      } else {
        Swal.fire({
          title: "Delete Failed",
          text: data.message || "Something went wrong",
          icon: "error",
        });
      }
    } catch (error) {
      Swal.fire({
        title: "Error",
        text: error.message,
        icon: "error",
      });
    } finally {
      setDeletingId(null);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  if (loading) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center">
        <PageLoader
          section="Blog Engine"
          title="Blog Posts"
          message="Loading posts..."
        />
        <br />
        <p>Post Scanning...</p>
      </div>
    );
  }

  return (
    <div className="h-full w-full">
      {error ? (
        <div className="w-full h-full flex items-center justify-center">
          <ErrorBox error={error} />
        </div>
      ) : (
        <div className="w-full h-full p-8">
          <section className="flex items-center justify-between mb-5">
            <span className="text-2xl font-bold text-gray-700">Blog Page</span>

            <input
              type="text"
              placeholder="Search posts..."
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500"
            />

            <Link
              href="/blog/new"
              className="bg-orange-500 hover:bg-orange-600 transition-colors text-white px-4 py-2 text-sm rounded-lg flex items-center gap-2"
            >
              <Plus size={18} /> Add Post
            </Link>
          </section>

          <div className="overflow-x-auto bg-white rounded-xl shadow-md border border-gray-200">
            <table className="w-full text-left border-collapse whitespace-nowrap">
              <thead className="bg-[#235056] text-white text-sm uppercase tracking-wider">
                <tr>
                  <th className="px-6 py-4 text-center">Sr. No.</th>
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Author</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created At</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>

              <tbody className="text-gray-700 text-sm">
                {posts.length > 0 ? (
                  posts.map((post, index) => (
                    <tr
                      key={post._id}
                      className="border-b border-gray-100 hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 text-center">{index + 1}</td>

                      <td className="px-6 py-4 font-medium text-gray-900 truncate max-w-xs">
                        {post.title || "Untitled"}
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {post.author?.name || "Unknown"}
                      </td>

                      <td className="px-6 py-4">
                        <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">
                          {post.status || "Draft"}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-gray-500">
                        {post.createdAt
                          ? new Date(post.createdAt).toLocaleDateString()
                          : "N/A"}
                      </td>

                      <td className="px-6 py-4">
                        <div className="flex justify-center items-center gap-4">
                          <Link
                            href={`/blog/view/${post.slug}`}
                            className="hover:scale-110 transition-all duration-300 text-blue-600"
                          >
                            <Eye size={18} />
                          </Link>

                          <button className="hover:scale-110 transition-all duration-300 text-green-600">
                            <Edit size={18} />
                          </button>

                          <button
                            onClick={() => handleDeletePost(post._id)}
                            disabled={deletingId === post._id}
                            className="hover:scale-110 transition-all duration-300 text-red-600 disabled:opacity-50"
                          >
                            {deletingId === post._id ? (
                              <Loader2 className="animate-spin" size={18} />
                            ) : (
                              <Trash size={18} />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-8 text-center text-gray-500"
                    >
                      No posts found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default BlogPage;
