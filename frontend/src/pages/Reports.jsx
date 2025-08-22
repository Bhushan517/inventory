import { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import api from '../utils/api';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  ResponsiveContainer
} from 'recharts';

const Reports = () => {
  const [stockData, setStockData] = useState([]);
  const [topProductsData, setTopProductsData] = useState([]);
  const [transactionsByDate, setTransactionsByDate] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dateFilter, setDateFilter] = useState({
    startDate: '',
    endDate: ''
  });

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  useEffect(() => {
    fetchReportsData();
  }, []);

  const fetchReportsData = async () => {
    try {
      // Fetch stock IN vs OUT data
      try {
        const stockResponse = await api.get('/reports/stock-movements');
        setStockData(stockResponse.data);
      } catch (error) {
        console.error('Stock movements error:', error);
        setStockData([{ name: 'Stock IN', value: 0 }, { name: 'Stock OUT', value: 0 }]);
      }

      // Fetch top 5 most moved products
      try {
        const topProductsResponse = await api.get('/reports/top-products');
        setTopProductsData(topProductsResponse.data);
      } catch (error) {
        console.error('Top products error:', error);
        setTopProductsData([]);
      }

      // Fetch transactions by date
      try {
        const transactionsResponse = await api.get('/reports/transactions-by-date');
        setTransactionsByDate(transactionsResponse.data);
      } catch (error) {
        console.error('Transactions by date error:', error);
        setTransactionsByDate([]);
      }
    } catch (error) {
      console.error('Error fetching reports data:', error);
      // Set mock data for demonstration
      setStockData([
        { name: 'Stock IN', value: 150 },
        { name: 'Stock OUT', value: 120 }
      ]);
      setTopProductsData([
        { name: 'Product A', movements: 45 },
        { name: 'Product B', movements: 38 },
        { name: 'Product C', movements: 32 },
        { name: 'Product D', movements: 28 },
        { name: 'Product E', movements: 25 }
      ]);
      setTransactionsByDate([
        { date: '2024-01-01', transactions: 12 },
        { date: '2024-01-02', transactions: 15 },
        { date: '2024-01-03', transactions: 8 },
        { date: '2024-01-04', transactions: 22 },
        { date: '2024-01-05', transactions: 18 }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleDateFilterChange = (e) => {
    setDateFilter({
      ...dateFilter,
      [e.target.name]: e.target.value
    });
  };

  const applyDateFilter = async () => {
    if (!dateFilter.startDate || !dateFilter.endDate) {
      alert('Please select both start and end dates');
      return;
    }

    try {
      const response = await api.get('/reports/transactions-by-date', {
        params: {
          startDate: dateFilter.startDate,
          endDate: dateFilter.endDate
        }
      });
      setTransactionsByDate(response.data);
    } catch (error) {
      console.error('Error applying date filter:', error);
    }
  };

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-64">
          <div className="text-lg">Loading reports...</div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Reports & Analytics</h1>
          <p className="text-gray-600">Overview of inventory movements and trends</p>
        </div>

        {/* Stock IN vs OUT Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Stock IN vs Stock OUT</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stockData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}`}
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
              >
                {stockData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Top 5 Most Moved Products */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Top 5 Most Moved Products</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={topProductsData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="movements" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Transactions by Date */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Transactions by Date</h2>
            <div className="flex space-x-2">
              <input
                type="date"
                name="startDate"
                value={dateFilter.startDate}
                onChange={handleDateFilterChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
              <input
                type="date"
                name="endDate"
                value={dateFilter.endDate}
                onChange={handleDateFilterChange}
                className="border border-gray-300 rounded-md px-3 py-1 text-sm"
              />
              <button
                onClick={applyDateFilter}
                className="bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-md text-sm"
              >
                Filter
              </button>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={transactionsByDate}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="transactions" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3">
          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📈</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Stock IN
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockData.find(item => item.name === 'Stock IN')?.value || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📉</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Total Stock OUT
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {stockData.find(item => item.name === 'Stock OUT')?.value || 0}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white overflow-hidden shadow rounded-lg">
            <div className="p-5">
              <div className="flex items-center">
                <div className="flex-shrink-0">
                  <div className="text-2xl">📊</div>
                </div>
                <div className="ml-5 w-0 flex-1">
                  <dl>
                    <dt className="text-sm font-medium text-gray-500 truncate">
                      Net Stock Movement
                    </dt>
                    <dd className="text-lg font-medium text-gray-900">
                      {(stockData.find(item => item.name === 'Stock IN')?.value || 0) - 
                       (stockData.find(item => item.name === 'Stock OUT')?.value || 0)}
                    </dd>
                  </dl>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Reports;
