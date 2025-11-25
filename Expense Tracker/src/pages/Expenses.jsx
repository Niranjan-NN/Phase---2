import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { PlusCircle, Search, Filter, Edit2, Trash2 } from 'lucide-react';
import axios from 'axios';

const Expenses = () => {
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [sortOrder, setSortOrder] = useState('newest');
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const categories = ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'];

  useEffect(() => {
    fetchExpenses();
  }, []);

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost:5000/api/expenses');
      setExpenses(response.data);
    } catch (err) {
      console.error('Error fetching expenses:', err);
      toast.error('Failed to load expenses');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm('Are you sure you want to delete this expense?')) {
      try {
        await axios.delete(`http://localhost:5000/api/expenses/${id}`);
        setExpenses(expenses.filter(expense => expense._id !== id));
        toast.success('Expense deleted successfully');
      } catch (err) {
        console.error('Error deleting expense:', err);
        toast.error('Failed to delete expense');
      }
    }
  };

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setDateRange({ start: '', end: '' });
    setSortOrder('newest');
  };

  // Filter and sort expenses
  const filteredExpenses = expenses
    .filter(expense => {
      // Search filter
      const matchesSearch = expense.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Category filter
      const matchesCategory = selectedCategory ? expense.category === selectedCategory : true;
      
      // Date range filter
      let matchesDateRange = true;
      if (dateRange.start) {
        matchesDateRange = matchesDateRange && new Date(expense.date) >= new Date(dateRange.start);
      }
      if (dateRange.end) {
        matchesDateRange = matchesDateRange && new Date(expense.date) <= new Date(dateRange.end);
      }
      
      return matchesSearch && matchesCategory && matchesDateRange;
    })
    .sort((a, b) => {
      // Sort by date
      if (sortOrder === 'newest') {
        return new Date(b.date) - new Date(a.date);
      } else if (sortOrder === 'oldest') {
        return new Date(a.date) - new Date(b.date);
      } 
      // Sort by amount
      else if (sortOrder === 'highest') {
        return b.amount - a.amount;
      } else if (sortOrder === 'lowest') {
        return a.amount - b.amount;
      }
      return 0;
    });

  const totalAmount = filteredExpenses.reduce((sum, expense) => sum + expense.amount, 0);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Expenses</h1>
        <Link
          to="/expenses/add"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Expense
        </Link>
      </div>

      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search expenses..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
              />
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            </div>
            
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
            >
              <Filter size={16} className="mr-2" />
              {showFilters ? 'Hide Filters' : 'Show Filters'}
            </button>
          </div>
          
          {showFilters && (
            <div className="mt-4 grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="">All Categories</option>
                  {categories.map(category => (
                    <option key={category} value={category}>{category}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Sort By</label>
                <select
                  value={sortOrder}
                  onChange={(e) => setSortOrder(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value="newest">Date (Newest First)</option>
                  <option value="oldest">Date (Oldest First)</option>
                  <option value="highest">Amount (Highest First)</option>
                  <option value="lowest">Amount (Lowest First)</option>
                </select>
              </div>
              
              <div className="flex flex-col md:flex-row gap-2">
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">From</label>
                  <input
                    type="date"
                    value={dateRange.start}
                    onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
                <div className="flex-1">
                  <label className="block text-sm font-medium text-gray-700 mb-1">To</label>
                  <input
                    type="date"
                    value={dateRange.end}
                    onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  />
                </div>
              </div>
              
              <div className="md:col-span-3 flex justify-end">
                <button
                  onClick={resetFilters}
                  className="px-4 py-2 text-indigo-600 bg-indigo-50 rounded-md hover:bg-indigo-100"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          )}
        </div>
        
        {loading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
          </div>
        ) : (
          <>
            {filteredExpenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {filteredExpenses.map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">{expense.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">${expense.amount.toFixed(2)}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Link to={`/expenses/edit/${expense._id}`} className="text-indigo-600 hover:text-indigo-900">
                              <Edit2 size={18} />
                            </Link>
                            <button onClick={() => handleDelete(expense._id)} className="text-red-600 hover:text-red-900">
                              <Trash2 size={18} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan="3" className="px-6 py-4 text-sm font-medium text-gray-900">Total</td>
                      <td className="px-6 py-4 text-right text-sm font-bold text-gray-900">${totalAmount.toFixed(2)}</td>
                      <td></td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-gray-500 mb-4">No expenses found</p>
                <Link to="/expenses/add" className="inline-flex items-center text-indigo-600 hover:text-indigo-800">
                  <PlusCircle size={16} className="mr-2" />
                  Add your first expense
                </Link>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Expenses;