import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import api from '../../services/api';
import { Search, Plus, BookOpen, Trash2, BookmarkPlus } from 'lucide-react';

const Books = () => {
    const { role } = useSelector(state => state.auth);
    const [books, setBooks] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);
    const [newBook, setNewBook] = useState({
        title: '',
        isbn: '',
        description: '',
        publishedYear: '',
        totalCopies: 1
    });

    useEffect(() => {
        fetchBooks(search, currentPage);
    }, [currentPage]);

    const fetchBooks = async (searchQuery = '', page = 0) => {
        setLoading(true);
        try {
            const res = await api.get(`/books?page=${page}&size=6${searchQuery ? `&search=${searchQuery}` : ''}`);
            setBooks(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("Error fetching books", err);
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = (e) => {
        e.preventDefault();
        setCurrentPage(0); // Reset to first page on new search
        fetchBooks(search, 0);
    };

    const handleAddBook = async (e) => {
        e.preventDefault();
        try {
            await api.post('/books', {
                ...newBook,
                availableCopies: newBook.totalCopies
            });
            setShowModal(false);
            setNewBook({ title: '', isbn: '', description: '', publishedYear: '', totalCopies: 1 });
            fetchBooks(search, currentPage);
        } catch (err) {
            alert(err.response?.data || "Failed to add book");
        }
    };

    const handleDelete = async (id) => {
        if(window.confirm("Are you sure you want to delete this book?")) {
            try {
                await api.delete(`/books/${id}`);
                fetchBooks(search, currentPage);
            } catch (err) {
                alert("Failed to delete");
            }
        }
    };

    const handleBorrow = async (bookId) => {
        try {
            await api.post('/issues/borrow', { bookId });
            alert('Book borrowed successfully!');
            fetchBooks(); // Refresh to update available copies
        } catch (err) {
            alert(err.response?.data?.message || "Failed to borrow book");
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white dark:bg-gray-800 p-6 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800 dark:text-white flex items-center gap-2">
                        <BookOpen className="text-primary-600" />
                        Book Catalog
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Manage and search library inventory</p>
                </div>
                {(role === 'ROLE_ADMIN' || role === 'ROLE_LIBRARIAN') && (
                    <button 
                        onClick={() => setShowModal(true)}
                        className="bg-primary-600 hover:bg-primary-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition"
                    >
                        <Plus size={20} />
                        Add New Book
                    </button>
                )}
            </div>

            <div className="bg-white dark:bg-gray-800 p-4 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 flex gap-4">
                <form onSubmit={handleSearch} className="flex-1 flex gap-4">
                    <div className="relative flex-1">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input 
                            type="text" 
                            placeholder="Search books by title..." 
                            className="w-full pl-10 pr-4 py-2 border rounded-lg focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                    <button type="submit" className="bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 px-6 py-2 rounded-lg font-medium transition">
                        Search
                    </button>
                </form>
            </div>

            {loading ? (
                <div className="text-center py-20 text-gray-500">Loading catalog...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {books.map(book => (
                        <div key={book.id} className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition group relative flex flex-col h-full">
                            {(role === 'ROLE_ADMIN') && (
                                <button onClick={() => handleDelete(book.id)} className="absolute top-4 right-4 text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition">
                                    <Trash2 size={20} />
                                </button>
                            )}
                            <h3 className="text-xl font-bold text-gray-800 dark:text-white mb-2 pr-8 truncate">{book.title}</h3>
                            <p className="text-gray-500 text-sm mb-4 line-clamp-2">{book.description || "No description provided."}</p>
                            
                            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900 p-3 rounded-lg">
                                <div className="flex justify-between">
                                    <span className="font-medium">ISBN:</span>
                                    <span>{book.isbn}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="font-medium">Published:</span>
                                    <span>{book.publishedYear}</span>
                                </div>
                                <div className="flex justify-between items-center mt-2 pt-2 border-t dark:border-gray-700">
                                    <span className="font-medium">Availability:</span>
                                    <span className={`px-2 py-1 rounded-full text-xs font-bold ${book.availableCopies > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {book.availableCopies} / {book.totalCopies}
                                    </span>
                                </div>
                            </div>
                            
                            {/* Spacer to push button to bottom */}
                            <div className="flex-grow"></div>
                            
                            {role === 'ROLE_STUDENT' && (
                                <div className="mt-4 pt-4 border-t dark:border-gray-700">
                                    <button 
                                        onClick={() => handleBorrow(book.id)}
                                        disabled={book.availableCopies <= 0}
                                        className={`w-full py-2 rounded-lg flex items-center justify-center gap-2 transition ${book.availableCopies > 0 ? 'bg-primary-50 text-primary-600 hover:bg-primary-100' : 'bg-gray-100 text-gray-400 cursor-not-allowed'}`}
                                    >
                                        <BookmarkPlus size={18} />
                                        {book.availableCopies > 0 ? 'Borrow Book' : 'Out of Stock'}
                                    </button>
                                </div>
                            )}
                        </div>
                    ))}
                    {books.length === 0 && (
                        <div className="col-span-full text-center py-20 text-gray-500">
                            No books found matching your criteria.
                        </div>
                    )}
                </div>
            )}

            {/* Pagination Controls */}
            {!loading && totalPages > 1 && (
                <div className="flex justify-center items-center mt-8 gap-4">
                    <button 
                        onClick={() => setCurrentPage(p => Math.max(0, p - 1))}
                        disabled={currentPage === 0}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg disabled:opacity-50 transition"
                    >
                        Previous
                    </button>
                    <span className="text-gray-600 dark:text-gray-300">
                        Page {currentPage + 1} of {totalPages}
                    </span>
                    <button 
                        onClick={() => setCurrentPage(p => Math.min(totalPages - 1, p + 1))}
                        disabled={currentPage === totalPages - 1}
                        className="px-4 py-2 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg disabled:opacity-50 transition"
                    >
                        Next
                    </button>
                </div>
            )}

            {/* Add Book Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md shadow-2xl">
                        <h3 className="text-2xl font-bold mb-4 dark:text-white">Add New Book</h3>
                        <form onSubmit={handleAddBook} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Title</label>
                                <input required type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600" value={newBook.title} onChange={e => setNewBook({...newBook, title: e.target.value})} />
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">ISBN</label>
                                <input required type="text" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600" value={newBook.isbn} onChange={e => setNewBook({...newBook, isbn: e.target.value})} />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Published Year</label>
                                    <input required type="number" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600" value={newBook.publishedYear} onChange={e => setNewBook({...newBook, publishedYear: e.target.value})} />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium mb-1 dark:text-gray-300">Total Copies</label>
                                    <input required type="number" min="1" className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600" value={newBook.totalCopies} onChange={e => setNewBook({...newBook, totalCopies: e.target.value})} />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-medium mb-1 dark:text-gray-300">Description</label>
                                <textarea className="w-full border p-2 rounded dark:bg-gray-700 dark:border-gray-600" rows="3" value={newBook.description} onChange={e => setNewBook({...newBook, description: e.target.value})}></textarea>
                            </div>
                            <div className="flex gap-4 pt-4">
                                <button type="button" onClick={() => setShowModal(false)} className="flex-1 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 p-2 rounded transition">Cancel</button>
                                <button type="submit" className="flex-1 bg-primary-600 text-white hover:bg-primary-700 p-2 rounded transition">Save Book</button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Books;
