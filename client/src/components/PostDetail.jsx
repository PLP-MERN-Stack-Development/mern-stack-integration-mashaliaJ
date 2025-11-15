import { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { postAPI } from '../api/posts';
import { useAuth } from '../hooks/useAuth';

export default function PostDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const { data } = await postAPI.getOne(id);
        setPost(data);
      } catch (error) {
        console.error('Error loading post:', error);
      } finally {
        setLoading(false);
      }
    };
    loadPost();
  }, [id]);

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await postAPI.delete(post._id);
        navigate('/');
      } catch (error) {
        alert('Error deleting post');
      }
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const { data } = await postAPI.addComment(post._id, comment);
      setPost({ ...post, comments: [...post.comments, data] });
      setComment('');
    } catch (error) {
      alert('Error adding comment');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (!post) return <p>Post not found</p>;

  const canEdit = user && (user._id === post.author._id || user.role === 'admin');

  return (
    <div className="max-w-3xl mx-auto p-4 space-y-4">
      {/* Featured Image */}
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-64 object-cover rounded"
        />
      )}

      {/* Title */}
      <h1 className="text-3xl font-bold">{post.title}</h1>

      {/* Author, Date, Category */}
      <p className="text-sm text-gray-500">
        By {post.author.username} • {new Date(post.createdAt).toLocaleDateString()} •{' '}
        {post.category.name}
      </p>

      {/* Edit/Delete */}
      {canEdit && (
        <div className="flex gap-2">
          <Link
            to={`/edit/${post._id}`}
            className="px-3 py-1 bg-yellow-400 rounded hover:bg-yellow-500"
          >
            Edit
          </Link>
          <button
            onClick={handleDelete}
            className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600"
          >
            Delete
          </button>
        </div>
      )}

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
            >
              #{tag}
            </span>
          ))}
        </div>
      )}

      {/* Content */}
      <div className="mt-4 space-y-2">
        {post.content.split('\n').map((para, i) => (
          <p key={i}>{para}</p>
        ))}
      </div>

      {/* Comments Section */}
      <div className="mt-6">
        <h2 className="text-xl font-semibold mb-2">
          Comments ({post.comments?.length || 0})
        </h2>

        {user ? (
          <form onSubmit={handleCommentSubmit} className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Add a comment..."
              className="w-full border rounded px-3 py-2 mb-2"
              rows={3}
              required
            />
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              disabled={submitting}
            >
              {submitting ? 'Posting...' : 'Post Comment'}
            </button>
          </form>
        ) : (
          <p>
            <Link to="/login" className="text-blue-600 hover:underline">
              Login
            </Link>{' '}
            to comment
          </p>
        )}

        {/* Display Comments */}
        <div className="space-y-4">
          {post.comments?.map((c) => (
            <div key={c._id} className="border rounded p-2">
              <p className="text-sm text-gray-500">
                {c.author.username} • {new Date(c.createdAt).toLocaleDateString()}
              </p>
              <p>{c.content}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
