import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyBooks = () => {
    const [books, setBooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyBooks();
    }, []);

    const fetchMyBooks = async () => {
        try {
            const response = await api.get('/issues/my-books');
            setBooks(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch borrowed books');
        } finally {
            setLoading(false);
        }
    };

    const handleReturn = async (issueId) => {
        try {
            await api.post(`/issues/${issueId}/return`);
            fetchMyBooks(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to return book');
        }
    };

    const isOverdue = (dueDateStr) => {
        return new Date(dueDateStr) < new Date();
    };

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Borrowed Books</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {books.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500 text-lg">You haven't borrowed any books currently.</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Issue Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Due Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {books.map((issue) => (
                                <tr key={issue.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{issue.bookTitle}</div>
                                        <div className="text-sm text-gray-500">ISBN: {issue.isbn}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(issue.issueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(issue.dueDate).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {isOverdue(issue.dueDate) ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Overdue
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Active
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        <button 
                                            onClick={() => handleReturn(issue.id)}
                                            className="text-primary-600 hover:text-primary-900 bg-primary-50 px-3 py-1 rounded-md transition"
                                        >
                                            Return Book
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default MyBooks;
