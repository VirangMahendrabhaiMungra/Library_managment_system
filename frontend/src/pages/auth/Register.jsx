import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, clearError } from '../../redux/slices/authSlice';

const Register = () => {
    const [userData, setUserData] = useState({ username: '', email: '', password: '' });
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { loading, error, token } = useSelector((state) => state.auth);

    useEffect(() => {
        if (token) {
            navigate('/dashboard');
        }
        return () => dispatch(clearError());
    }, [token, navigate, dispatch]);

    const handleChange = (e) => {
        setUserData({ ...userData, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        dispatch(register(userData));
    };

    return (
        <div className="flex items-center justify-center min-h-[80vh]">
            <div className="w-full max-w-md p-8 space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700">
                <div className="text-center">
                    <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">Create Account</h2>
                    <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">Join the Smart Library</p>
                </div>
                
                {error && (
                    <div className="p-3 text-sm text-red-500 bg-red-100 border border-red-200 rounded">
                        {error}
                    </div>
                )}

                <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Username</label>
                            <input
                                name="username"
                                type="text"
                                required
                                value={userData.username}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Choose a username"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Email Address</label>
                            <input
                                name="email"
                                type="email"
                                required
                                value={userData.email}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Enter your email"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Password</label>
                            <input
                                name="password"
                                type="password"
                                required
                                minLength="6"
                                value={userData.password}
                                onChange={handleChange}
                                className="w-full px-4 py-2 mt-1 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                                placeholder="Create a password"
                            />
                        </div>
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full px-4 py-2 font-semibold text-white transition-colors duration-200 bg-primary-600 rounded-lg hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50"
                    >
                        {loading ? 'Creating Account...' : 'Sign up'}
                    </button>
                </form>

                <p className="text-center text-sm text-gray-600 dark:text-gray-400">
                    Already have an account?{' '}
                    <Link to="/login" className="font-medium text-primary-600 hover:text-primary-500">
                        Sign in
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Register;
