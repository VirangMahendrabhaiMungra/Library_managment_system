import React, { useState, useEffect } from 'react';
import api from '../../services/api';

const MyFines = () => {
    const [fines, setFines] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchMyFines();
    }, []);

    const fetchMyFines = async () => {
        try {
            const response = await api.get('/fines/my-fines');
            setFines(response.data);
            setError('');
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to fetch fines');
        } finally {
            setLoading(false);
        }
    };

    const handlePay = async (fineId) => {
        try {
            await api.post(`/fines/${fineId}/pay`);
            fetchMyFines(); // Refresh the list
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to pay fine');
        }
    };

    const unpaidFines = fines.filter(f => f.status === 'UNPAID');
    const totalUnpaid = unpaidFines.reduce((sum, f) => sum + parseFloat(f.amount), 0);

    if (loading) return <div className="text-center mt-10">Loading...</div>;

    return (
        <div className="max-w-6xl mx-auto mt-8">
            <h2 className="text-3xl font-bold mb-6 text-gray-800 dark:text-white">My Fines</h2>
            
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <div className="mb-6 p-6 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-800 rounded-xl flex justify-between items-center">
                <div>
                    <h3 className="text-lg font-medium text-red-800 dark:text-red-200">Total Outstanding Balance</h3>
                    <p className="text-red-600 dark:text-red-300 text-sm mt-1">Please pay any outstanding fines promptly.</p>
                </div>
                <div className="text-3xl font-bold text-red-600 dark:text-red-400">
                    ${totalUnpaid.toFixed(2)}
                </div>
            </div>

            {fines.length === 0 ? (
                <div className="bg-white p-8 rounded-lg shadow-sm text-center">
                    <p className="text-gray-500 text-lg">You have no fines currently. Great job!</p>
                </div>
            ) : (
                <div className="bg-white shadow-md rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Book</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {fines.map((fine) => (
                                <tr key={fine.id}>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="font-medium text-gray-900">{fine.bookTitle}</div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap font-semibold text-gray-900">
                                        ${fine.amount.toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {fine.reason}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {new Date(fine.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {fine.status === 'PAID' ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                                                Paid
                                            </span>
                                        ) : fine.status === 'WAIVED' ? (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-gray-100 text-gray-800">
                                                Waived
                                            </span>
                                        ) : (
                                            <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                                                Unpaid
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                        {fine.status === 'UNPAID' && (
                                            <button 
                                                onClick={() => handlePay(fine.id)}
                                                className="text-white bg-red-500 hover:bg-red-600 px-3 py-1 rounded-md transition"
                                            >
                                                Pay Now
                                            </button>
                                        )}
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

export default MyFines;
