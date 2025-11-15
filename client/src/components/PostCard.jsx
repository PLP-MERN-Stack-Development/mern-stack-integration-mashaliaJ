import { Link } from 'react-router-dom';

export default function PostCard({ post }) {
  return (
    <div className="border rounded shadow p-4 flex flex-col gap-2">
      {/* Featured Image */}
      {post.featuredImage && (
        <img
          src={post.featuredImage}
          alt={post.title}
          className="w-full h-48 object-cover rounded mb-2"
        />
      )}

      {/* Title */}
      <h2 className="text-xl font-bold">
        <Link to={`/posts/${post._id}`} className="hover:underline">
          {post.title}
        </Link>
      </h2>

      {/* Excerpt */}
      <p className="text-gray-700">{post.excerpt}</p>

      {/* Author and Date */}
      <p className="text-sm text-gray-500">
        By {post.author?.username || 'Unknown'} •{' '}
        {new Date(post.createdAt).toLocaleDateString()}
      </p>

      {/* Tags */}
      {post.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mt-2">
          {post.tags.map((tag, index) => (
            <span
              key={index}
              className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}
