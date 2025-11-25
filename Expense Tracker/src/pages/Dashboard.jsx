import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Bar, Pie, Line } from 'react-chartjs-2';
import { Chart, registerables } from 'chart.js';
import { format } from 'date-fns';
import { PlusCircle, TrendingUp, IndianRupee, CreditCard, ArrowUpRight } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../contexts/AuthContext';

// Register Chart.js components
Chart.register(...registerables);

const Dashboard = () => {
  const { currentUser } = useAuth();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [stats, setStats] = useState({
    thisMonth: 0,
    lastMonth: 0,
    percentChange: 0
  });

  useEffect(() => {
    const fetchExpenses = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/expenses');
        setExpenses(response.data);
        
        // Calculate total spent
        const total = response.data.reduce((sum, expense) => sum + expense.amount, 0);
        setTotalSpent(total);
        
        // Calculate month stats
        const now = new Date();
        const thisMonth = now.getMonth();
        const lastMonth = thisMonth === 0 ? 11 : thisMonth - 1;
        const thisYear = now.getFullYear();
        const lastMonthYear = thisMonth === 0 ? thisYear - 1 : thisYear;
        
        const thisMonthExpenses = response.data.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === thisMonth && expenseDate.getFullYear() === thisYear;
        });
        
        const lastMonthExpenses = response.data.filter(expense => {
          const expenseDate = new Date(expense.date);
          return expenseDate.getMonth() === lastMonth && expenseDate.getFullYear() === lastMonthYear;
        });
        
        const thisMonthTotal = thisMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        const lastMonthTotal = lastMonthExpenses.reduce((sum, expense) => sum + expense.amount, 0);
        
        let percentChange = 0;
        if (lastMonthTotal > 0) {
          percentChange = ((thisMonthTotal - lastMonthTotal) / lastMonthTotal) * 100;
        }
        
        setStats({
          thisMonth: thisMonthTotal,
          lastMonth: lastMonthTotal,
          percentChange
        });
      } catch (err) {
        console.error('Error fetching expenses:', err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchExpenses();
  }, []);

  // Prepare data for charts
  const categoryData = {
    labels: ['Food', 'Transport', 'Entertainment', 'Utilities', 'Shopping', 'Other'],
    datasets: [{
      data: [300, 150, 200, 250, 400, 100],
      backgroundColor: [
        '#8B5CF6',
        '#10B981',
        '#F97316',
        '#3B82F6',
        '#EC4899',
        '#6B7280'
      ],
      borderWidth: 1
    }]
  };
  
  const monthlyData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    datasets: [{
      label: 'Monthly Expenses',
      data: [500, 700, 600, 800, 650, 750, 900, 850, 600, 550, 700, 650],
      fill: false,
      borderColor: '#3B82F6',
      tension: 0.1
    }]
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <Link
          to="/expenses/add"
          className="flex items-center bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 transition-colors"
        >
          <PlusCircle size={16} className="mr-2" />
          Add Expense
        </Link>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-10">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-indigo-600"></div>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Total Expenses</p>
                  <h2 className="text-3xl font-bold text-gray-800">${totalSpent.toFixed(2)}</h2>
                </div>
                <div className="p-3 bg-indigo-100 rounded-full">
                  <IndianRupee size={24} className="text-indigo-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                From all recorded expenses
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">This Month</p>
                  <h2 className="text-3xl font-bold text-gray-800">${stats.thisMonth.toFixed(2)}</h2>
                </div>
                <div className="p-3 bg-green-100 rounded-full">
                  <CreditCard size={24} className="text-green-600" />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                {stats.percentChange > 0 ? (
                  <span className="text-red-500 flex items-center">
                    <ArrowUpRight size={16} className="mr-1" />
                    {Math.abs(stats.percentChange).toFixed(1)}% from last month
                  </span>
                ) : (
                  <span className="text-green-500 flex items-center">
                    <TrendingUp size={16} className="mr-1" />
                    {Math.abs(stats.percentChange).toFixed(1)}% from last month
                  </span>
                )}
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-sm text-gray-500">Last Month</p>
                  <h2 className="text-3xl font-bold text-gray-800">${stats.lastMonth.toFixed(2)}</h2>
                </div>
                <div className="p-3 bg-purple-100 rounded-full">
                  <TrendingUp size={24} className="text-purple-600" />
                </div>
              </div>
              <div className="mt-4 text-sm text-gray-500">
                {format(new Date(new Date().setMonth(new Date().getMonth() - 1)), 'MMMM yyyy')}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Expenses by Category</h3>
              <div className="h-64">
                <Pie data={categoryData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Trend</h3>
              <div className="h-64">
                <Line data={monthlyData} options={{ maintainAspectRatio: false }} />
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Expenses</h3>
            {expenses.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                      <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {expenses.slice(0, 5).map((expense) => (
                      <tr key={expense._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{expense.description}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                          <span className="px-2 py-1 text-xs rounded-full bg-indigo-100 text-indigo-800">{expense.category}</span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{format(new Date(expense.date), 'MMM dd, yyyy')}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-medium text-gray-900">{expense.amount.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-4 text-gray-500">
                No expenses recorded yet. Click on "Add Expense" to get started.
              </div>
            )}
            
            {expenses.length > 5 && (
              <div className="mt-4 text-center">
                <Link to="/expenses" className="text-indigo-600 hover:text-indigo-800 font-medium">
                  View all expenses
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default Dashboard;