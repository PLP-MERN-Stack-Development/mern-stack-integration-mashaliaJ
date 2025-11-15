import { useState, useEffect } from 'react';
import { postAPI, categoryAPI } from '../api/posts';
import PostCard from '../components/PostCard';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [filters, setFilters] = useState({ category: '', search: '' });

  useEffect(() => {
    loadPosts();
  }, [page, filters]);

  useEffect(() => {
    // Load categories once
    categoryAPI.getAll().then(res => setCategories(res.data));
  }, []);

  const loadPosts = async () => {
    setLoading(true);
    try {
      const { data } = await postAPI.getAll({ page, ...filters });
      setPosts(data.posts);
      setTotalPages(data.totalPages);
    } catch (error) {
      console.error('Error loading posts:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Latest Posts</h1>

      <div className="flex gap-2 mb-4">
        <input
          type="text"
          placeholder="Search posts..."
          value={filters.search}
          onChange={(e) =>
            setFilters({ ...filters, search: e.target.value, page: 1 })
          }
          className="flex-1 border rounded px-4 py-2"
        />
        <select
          value={filters.category}
          onChange={(e) =>
            setFilters({ ...filters, category: e.target.value, page: 1 })
          }
          className="border rounded px-4 py-2"
        >
          <option value="">All Categories</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat.name}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : (
        <div className="space-y-4">
          {posts.length === 0 && <p>No posts found.</p>}

          {posts.map((post) => (
            <PostCard key={post._id} post={post} />
          ))}

          {totalPages > 1 && (
            <div className="flex gap-2 mt-4 items-center">
              <button
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Previous
              </button>
              <span>
                Page {page} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="px-4 py-2 border rounded disabled:opacity-50"
              >
                Next
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
