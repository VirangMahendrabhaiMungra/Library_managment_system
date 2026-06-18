import React from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { logout } from './redux/slices/authSlice';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import Books from './pages/librarian/Books';
import MyBooks from './pages/student/MyBooks';
import MyFines from './pages/student/MyFines';

function App() {
  const { token, user, role } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <div className="min-h-screen">
      <header className="bg-primary-600 text-white p-4 shadow-md sticky top-0 z-50">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold tracking-tight">Smart Library</h1>
          <nav>
            <ul className="flex space-x-6 items-center font-medium">
              <li><Link to="/" className="hover:text-primary-100 transition">Home</Link></li>
              
              {token ? (
                <>
                  <li><Link to="/dashboard" className="hover:text-primary-100 transition">Dashboard</Link></li>
                  <li><Link to="/books" className="hover:text-primary-100 transition">Catalog</Link></li>
                  {role === 'ROLE_STUDENT' && (
                    <>
                      <li><Link to="/my-books" className="hover:text-primary-100 transition">My Books</Link></li>
                      <li><Link to="/my-fines" className="hover:text-primary-100 transition">My Fines</Link></li>
                    </>
                  )}
                  <li className="text-primary-100 border-l border-primary-400 pl-6 flex flex-col">
                      <span>Hello, {user}</span>
                      <span className="text-xs opacity-75">{role === 'ROLE_ADMIN' ? 'Admin' : role === 'ROLE_LIBRARIAN' ? 'Librarian' : 'Student'}</span>
                  </li>
                  <li>
                    <button 
                      onClick={handleLogout}
                      className="bg-red-500 hover:bg-red-600 px-4 py-2 rounded-lg transition"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li><Link to="/login" className="hover:text-primary-100 transition">Login</Link></li>
                  <li>
                    <Link to="/register" className="bg-white text-primary-600 hover:bg-gray-100 px-4 py-2 rounded-lg transition font-semibold">
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </nav>
        </div>
      </header>

      <main className="container mx-auto p-4 mt-4">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/books" element={<Books />} />
          <Route path="/my-books" element={<MyBooks />} />
          <Route path="/my-fines" element={<MyFines />} />
        </Routes>
      </main>
    </div>
  );
}

const Home = () => (
  <div className="text-center py-20 animate-fade-in-up">
    <h2 className="text-5xl font-extrabold mb-6 text-gray-900 dark:text-white">Discover the Future of Learning</h2>
    <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-10">
      Access thousands of books, track your reading, and manage your library seamlessly with our Enterprise-Grade Smart Library Management System.
    </p>
    <Link to="/register" className="bg-primary-600 text-white px-8 py-4 rounded-full text-lg font-bold shadow-lg hover:bg-primary-700 transition transform hover:-translate-y-1">
      Get Started Today
    </Link>
  </div>
);

const Dashboard = () => {
    const { user, role } = useSelector((state) => state.auth);
    const [stats, setStats] = React.useState({
        totalBooks: 0,
        borrowedBooks: 0,
        pendingFines: 0,
        overdueBooks: 0
    });
    const [loading, setLoading] = React.useState(true);

    React.useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await api.get('/dashboard/stats');
                setStats(response.data);
            } catch (err) {
                console.error("Failed to fetch stats", err);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);
    
    if (loading) return <div className="text-center mt-10">Loading dashboard...</div>;

    return (
      <div className="space-y-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Welcome back, {user}!</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition">
                <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Total Books in Catalog</h3>
                <p className="text-4xl font-bold text-primary-600 mt-3">{stats.totalBooks}</p>
            </div>
            
            {role === 'ROLE_STUDENT' && (
                <>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition">
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Your Borrowed Books</h3>
                        <p className="text-4xl font-bold text-green-500 mt-3">{stats.borrowedBooks}</p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition">
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Overdue Books</h3>
                        <p className={`text-4xl font-bold mt-3 ${stats.overdueBooks > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            {stats.overdueBooks}
                        </p>
                    </div>
                    <div className="p-6 bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 text-center hover:shadow-md transition">
                        <h3 className="text-lg font-semibold text-gray-600 dark:text-gray-400">Pending Fines</h3>
                        <p className={`text-4xl font-bold mt-3 ${stats.pendingFines > 0 ? 'text-red-500' : 'text-gray-400'}`}>
                            ${stats.pendingFines.toFixed(2)}
                        </p>
                    </div>
                </>
            )}
        </div>
      </div>
    );
};

export default App;
