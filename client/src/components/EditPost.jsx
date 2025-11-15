import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { postAPI } from '../api/posts';
import { useApi } from '../hooks/useApi';
import PostForm from '../components/PostForm';

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const { loading, execute } = useApi(postAPI.update);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const res = await postAPI.getOne(id);
        setPost({
          title: res.data.title,
          content: res.data.content,
          excerpt: res.data.excerpt,
          category: res.data.category._id,
          tags: res.data.tags?.join(', ') || '',
        });
      } catch (error) {
        console.error('Error fetching post:', error);
      }
    };
    fetchPost();
  }, [id]);

  const handleSubmit = async (formData) => {
    try {
      await execute(id, formData);
      navigate(`/posts/${id}`);
    } catch (error) {
      alert('Error updating post');
      console.error(error);
    }
  };

  if (!post) return <p>Loading...</p>;

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Edit Post</h1>
      <PostForm initialData={post} onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
