import { useNavigate } from 'react-router-dom';
import { useApi } from '../hooks/useApi';
import { postAPI } from '../api/posts';
import PostForm from '../components/PostForm';

export default function CreatePost() {
  const navigate = useNavigate();
  const { loading, execute } = useApi(postAPI.create);

  const handleSubmit = async (formData) => {
    try {
      const post = await execute(formData);
      navigate(`/posts/${post.slug}`);
    } catch (error) {
      alert('Error creating post');
      console.error(error);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Create New Post</h1>
      <PostForm onSubmit={handleSubmit} loading={loading} />
    </div>
  );
}
