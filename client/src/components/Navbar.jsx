import { Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

export default function Navbar() {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-blue-600 text-white px-4 py-3 flex justify-between items-center">
      {/* Logo / Brand */}
      <div className="text-xl font-bold">
        <Link to="/">My Blog</Link>
      </div>

      {/* Navigation Links */}
      <div className="flex gap-4 items-center">
        <Link to="/" className="hover:underline">
          Home
        </Link>

        {user ? (
          <>
            <Link to="/create" className="hover:underline">
              Create Post
            </Link>
            <span>{user.username}</span>
            <button
              onClick={logout}
              className="bg-white text-blue-600 px-3 py-1 rounded hover:bg-gray-100"
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="hover:underline">
              Login
            </Link>
            <Link to="/register" className="hover:underline">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
