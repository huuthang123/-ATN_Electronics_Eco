<<<<<<< HEAD
// src/pages/Dashboard.jsx - Professional Admin Dashboard with Dark Sidebar
import { useState, useEffect, useRef } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';
import { getAllOrders, updateOrderStatus } from '../services/adminService';
import { getRevenue } from '../services/orderService';
import { Chart } from 'chart.js/auto';
import ProductsPage from './ProductsPage';

const Dashboard = () => {
  // Tab switching state
  const [activeTab, setActiveTab] = useState('dashboard');

  // Existing stats state (PRESERVED)
=======
// src/pages/Dashboard.jsx - Professional Admin Dashboard
import { useState, useEffect } from 'react';
import ProtectedRoute from '../components/ProtectedRoute';

const Dashboard = () => {
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  const [stats, setStats] = useState({
    totalOrders: 0,
    totalRevenue: 0,
    totalProducts: 0,
    totalCustomers: 0
  });

<<<<<<< HEAD
  // Existing orders state (PRESERVED)
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [activeStatus, setActiveStatus] = useState(() => {
    return localStorage.getItem("activeStatus") || "All";
  });

  // Revenue state (for doanh thu tab)
  const [revenueData, setRevenueData] = useState([]);
  const [startDate, setStartDate] = useState('2025-01-01');
  const [endDate, setEndDate] = useState('2025-05-28');
  const [groupBy, setGroupBy] = useState('month');
  const chartRef = useRef(null);

  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // EXISTING useEffect - PRESERVED
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        
=======
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        // Initialize with empty data
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
        setStats({
          totalOrders: 0,
          totalRevenue: 0,
          totalProducts: 0,
          totalCustomers: 0
        });

        setRecentOrders([]);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

<<<<<<< HEAD
  // EXISTING fetchOrders function - PRESERVED
  useEffect(() => {
    if (activeTab === 'don hang') {
      fetchOrders();
    }
  }, [activeTab]);

  useEffect(() => {
    localStorage.setItem("activeStatus", activeStatus);
    filterOrdersByStatus(activeStatus);
  }, [activeStatus, orders]);

  const fetchOrders = async () => {
    try {
      const data = await getAllOrders();
      const sortedOrders = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setOrders(sortedOrders);
      filterOrdersByStatus(activeStatus);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách đơn hàng:", error);
    }
  };

  const filterOrdersByStatus = (status) => {
    setActiveStatus(status);
    if (status === "All") {
      setFilteredOrders(orders);
    } else {
      const filtered = orders.filter((order) => order.status === status);
      setFilteredOrders(filtered);
    }
    setSelectedOrder(null);
  };

  // Revenue fetching - for doanh thu tab
  useEffect(() => {
    if (activeTab === 'dashboard' || activeTab === 'doanh thu') {
      fetchRevenue();
    }
  }, [activeTab, startDate, endDate, groupBy]);

  const fetchRevenue = async () => {
    try {
      const data = await getRevenue({ startDate, endDate, groupBy });
      setRevenueData(data.revenue || []);
    } catch (error) {
      console.error('Lỗi khi lấy dữ liệu doanh thu:', error.response ? error.response.data : error.message);
      setRevenueData([]);
    }
  };

  // Chart rendering for revenue
  useEffect(() => {
    if ((activeTab === 'dashboard' || activeTab === 'doanh thu') && chartRef.current && revenueData.length) {
      const ctx = chartRef.current.getContext('2d');
      let chartInstance = Chart.getChart(ctx);
      if (chartInstance) chartInstance.destroy();

      chartInstance = new Chart(ctx, {
        type: 'bar',
        data: {
          labels: revenueData.map(item => item.date),
          datasets: [{
            label: 'Doanh thu (VNĐ)',
            data: revenueData.map(item => item.totalRevenue),
            backgroundColor: '#007bff',
            borderColor: '#0056b3',
            borderWidth: 1,
          }],
        },
        options: {
          scales: {
            x: { title: { display: true, text: groupBy === 'day' ? 'Ngày' : 'Tháng' } },
            y: { title: { display: true, text: 'Doanh thu (VNĐ)' }, beginAtZero: true },
          },
          plugins: { legend: { display: true } },
        },
      });
    }
  }, [revenueData, groupBy, activeTab]);

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await updateOrderStatus(orderId, newStatus);
      fetchOrders();
      if (selectedOrder && selectedOrder._id === orderId) {
        setSelectedOrder({ ...selectedOrder, status: newStatus });
      }
    } catch (error) {
      alert("Lỗi khi cập nhật trạng thái: " + error.message);
    }
  };

  const toggleOrderDetails = (order) => {
    if (selectedOrder && selectedOrder._id === order._id) {
      setSelectedOrder(null);
    } else {
      setSelectedOrder(order);
    }
  };

=======
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const getStatusBadge = (status) => {
    const statusMap = {
      completed: { label: 'Hoàn thành', class: 'badge-success' },
      pending: { label: 'Chờ xử lý', class: 'badge-warning' },
      processing: { label: 'Đang xử lý', class: 'badge-neutral' },
      cancelled: { label: 'Đã hủy', class: 'badge-error' }
    };
    
    const statusInfo = statusMap[status] || { label: status, class: 'badge-neutral' };
    return <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>;
  };

<<<<<<< HEAD
  const getStatusLabel = (status) => {
    switch (status) {
      case "All": return "Tất cả";
      case "Pending": return "Chờ xác nhận";
      case "Processing": return "Đã xác nhận";
      case "Confirmed": return "Đã đóng gói";
      case "Shipped": return "Đang giao hàng";
      case "Delivered": return "Giao thành công";
      case "Cancelled": return "Đã hủy";
      default: return status;
    }
  };

  const statuses = ["All", "Pending", "Processing", "Confirmed", "Shipped", "Delivered", "Cancelled"];

  if (loading && activeTab === 'dashboard') {
    return (
      <div className="admin-dashboard-layout">
        <aside className="admin-sidebar">
          <div className="admin-sidebar-menu">
            <button className={`admin-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
              <span>Dashboard</span>
            </button>
            <button className={`admin-sidebar-item ${activeTab === 'doanh thu' ? 'active' : ''}`} onClick={() => setActiveTab('doanh thu')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <line x1="18" y1="20" x2="18" y2="10"/>
                <line x1="12" y1="20" x2="12" y2="4"/>
                <line x1="6" y1="20" x2="6" y2="14"/>
              </svg>
              <span>Doanh thu</span>
            </button>
            <button className={`admin-sidebar-item ${activeTab === 'san pham' ? 'active' : ''}`} onClick={() => setActiveTab('san pham')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                <line x1="9" y1="3" x2="9" y2="21"/>
              </svg>
              <span>Sản phẩm</span>
            </button>
            <button className={`admin-sidebar-item ${activeTab === 'don hang' ? 'active' : ''}`} onClick={() => setActiveTab('don hang')}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="9" cy="21" r="1"/>
                <circle cx="20" cy="21" r="1"/>
                <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
              </svg>
              <span>Đơn hàng</span>
            </button>
          </div>
        </aside>
        <main className="admin-main-content">
          <div className="admin-dashboard-loading">
            <div className="spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </main>
=======
  if (loading) {
    return (
      <div className="admin-dashboard">
        <div className="admin-dashboard-loading">
          <div className="spinner"></div>
          <p>Đang tải dữ liệu...</p>
        </div>
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
      </div>
    );
  }

  return (
<<<<<<< HEAD
    <ProtectedRoute>
      <div className="admin-dashboard-layout">
      {/* Dark Sidebar */}
      <aside className="admin-sidebar">
        <div className="admin-sidebar-menu">
          <button className={`admin-sidebar-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
            <span>Dashboard</span>
          </button>
          <button className={`admin-sidebar-item ${activeTab === 'doanh thu' ? 'active' : ''}`} onClick={() => setActiveTab('doanh thu')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <line x1="18" y1="20" x2="18" y2="10"/>
              <line x1="12" y1="20" x2="12" y2="4"/>
              <line x1="6" y1="20" x2="6" y2="14"/>
            </svg>
            <span>Doanh thu</span>
          </button>
          <button className={`admin-sidebar-item ${activeTab === 'san pham' ? 'active' : ''}`} onClick={() => setActiveTab('san pham')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <line x1="9" y1="3" x2="9" y2="21"/>
            </svg>
            <span>Sản phẩm</span>
          </button>
          <button className={`admin-sidebar-item ${activeTab === 'don hang' ? 'active' : ''}`} onClick={() => setActiveTab('don hang')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <circle cx="9" cy="21" r="1"/>
              <circle cx="20" cy="21" r="1"/>
              <path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
            </svg>
            <span>Đơn hàng</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="admin-main-content">
        {(activeTab === 'dashboard' || activeTab === 'doanh thu') && (
          <div className="admin-dashboard">
            <div className="admin-dashboard-header">
              <h1>{activeTab === 'dashboard' ? 'Dashboard' : 'Doanh Thu'}</h1>
              <p>{activeTab === 'dashboard' ? 'Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.' : 'Phân tích doanh thu theo thời gian'}</p>
            </div>

            {/* Stats Cards */}
            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="admin-stat-icon admin-stat-icon-primary">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L18 21H6L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.totalOrders.toLocaleString()}</h3>
                  <p>Tổng đơn hàng</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon admin-stat-icon-success">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <h3>{formatCurrency(stats.totalRevenue)}</h3>
                  <p>Tổng doanh thu</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon admin-stat-icon-warning">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.totalProducts}</h3>
                  <p>Sản phẩm</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="admin-stat-icon admin-stat-icon-error">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
                <div className="admin-stat-content">
                  <h3>{stats.totalCustomers.toLocaleString()}</h3>
                  <p>Khách hàng</p>
                </div>
              </div>
            </div>

            {/* Revenue Chart - Show for both dashboard and doanh thu */}
            {activeTab === 'doanh thu' && (
              <div className="admin-dashboard-section">
                <div className="admin-section-header">
                  <h2>Biểu đồ doanh thu</h2>
                </div>
                <div className="revenue-filters">
                  <label>Nhóm theo: </label>
                  <select value={groupBy} onChange={e => setGroupBy(e.target.value)}>
                    <option value="day">Ngày</option>
                    <option value="month">Tháng</option>
                  </select>
                  <label>Ngày bắt đầu: </label>
                  <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)} />
                  <label>Ngày kết thúc: </label>
                  <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)} />
                </div>
                <div className="card">
                  <canvas ref={chartRef} id="revenueChart" style={{ maxHeight: '400px' }} />
                </div>
                <div className="card" style={{ marginTop: '1rem' }}>
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>{groupBy === 'day' ? 'Ngày' : 'Tháng'}</th>
                          <th>Doanh thu (VNĐ)</th>
                          <th>Số đơn hàng</th>
                        </tr>
                      </thead>
                      <tbody>
                        {revenueData.length === 0 ? (
                          <tr><td colSpan="3">Không có dữ liệu doanh thu hoặc lỗi kết nối</td></tr>
                        ) : (
                          revenueData.map(item => (
                            <tr key={item.date}>
                              <td>{item.date}</td>
                              <td>{item.totalRevenue.toLocaleString()}</td>
                              <td>{item.orderCount}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Recent Orders - Only for dashboard */}
            {activeTab === 'dashboard' && (
              <div className="admin-dashboard-section">
                <div className="admin-section-header">
                  <h2>Đơn hàng gần đây</h2>
                  <button className="btn btn-secondary btn-sm">Xem tất cả</button>
                </div>
                
                <div className="card">
                  <div className="table-container">
                    <table className="table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Khách hàng</th>
                          <th>Sản phẩm</th>
                          <th>Số tiền</th>
                          <th>Trạng thái</th>
                          <th>Ngày</th>
                        </tr>
                      </thead>
                      <tbody>
                        {recentOrders.map((order) => (
                          <tr key={order.id}>
                            <td className="font-mono text-sm">#{order.id}</td>
                            <td>{order.customer}</td>
                            <td>{order.product}</td>
                            <td className="font-semibold">{formatCurrency(order.amount)}</td>
                            <td>{getStatusBadge(order.status)}</td>
                            <td className="text-neutral">{order.date}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'don hang' && (
          <div className="admin-dashboard">
            <div className="admin-dashboard-header">
              <h1>Quản Lý Đơn Hàng</h1>
            </div>

            <div className="status-filter">
              {statuses.map((status) => (
                <button
                  key={status}
                  className={activeStatus === status ? "active" : ""}
                  onClick={() => filterOrdersByStatus(status)}
                >
                  {getStatusLabel(status)}
                </button>
              ))}
            </div>

            <div className="card">
              <div className="table-container">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID Đơn Hàng</th>
                      <th>Khách Hàng</th>
                      <th>Tổng Tiền</th>
                      <th>Trạng Thái</th>
                      <th>Ngày Tạo</th>
                      <th>Hành Động</th>
                      <th>Chi Tiết</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredOrders.map((order) => (
                      <>
                        <tr key={order._id}>
                          <td>{order._id}</td>
                          <td>{order.userId?.username || "Không xác định"}</td>
                          <td>{order.totalPrice}</td>
                          <td>{getStatusLabel(order.status)}</td>
                          <td>{new Date(order.createdAt).toLocaleString()}</td>
                          <td>
                            <select
                              value={order.status}
                              onChange={(e) => handleStatusChange(order._id, e.target.value)}
                            >
                              <option value="Pending">Chờ xác nhận</option>
                              <option value="Processing">Đã xác nhận</option>
                              <option value="Confirmed">Đã đóng gói</option>
                              <option value="Shipped">Đang giao hàng</option>
                              <option value="Delivered">Giao thành công</option>
                              <option value="Cancelled">Đã hủy</option>
                            </select>
                          </td>
                          <td>
                            <button onClick={() => toggleOrderDetails(order)}>
                              {selectedOrder && selectedOrder._id === order._id ? "Ẩn" : "Xem chi tiết"}
                            </button>
                          </td>
                        </tr>
                        {selectedOrder && selectedOrder._id === order._id && (
                          <tr>
                            <td colSpan="7">
                              <div className="order-details">
                                <h3>Chi Tiết Đơn Hàng</h3>
                                <div className="order-info">
                                  <p><strong>Tên người nhận:</strong> {selectedOrder.address.fullName}</p>
                                  <p><strong>Số điện thoại:</strong> {selectedOrder.address.phone}</p>
                                  <p><strong>Địa chỉ giao hàng:</strong> {selectedOrder.address.address}</p>
                                </div>
                                <h4>Chi Tiết Sản Phẩm</h4>
                                <table className="product-details-table">
                                  <thead>
                                    <tr>
                                      <th>Tên Sản Phẩm</th>
                                      <th>Số Lượng</th>
                                      <th>Giá</th>
                                      <th>Kích Thước</th>
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {selectedOrder.products.map((product, index) => (
                                      <tr key={index}>
                                        <td>{product.productId?.name || "Không xác định"}</td>
                                        <td>{product.quantity}</td>
                                        <td>{product.price}</td>
                                        <td>{product.size}g</td>
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                            </td>
                          </tr>
                        )}
                      </>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {/* Products Tab */}
        {activeTab === 'san pham' && (
          <ProductsPage />
        )}
      </main>
    </div>
    </ProtectedRoute>
  );
};

export default Dashboard;
=======
    <div className="admin-dashboard">
      <div className="admin-dashboard-header">
        <h1>Dashboard</h1>
        <p>Chào mừng trở lại! Đây là tổng quan về cửa hàng của bạn.</p>
      </div>

      {/* Stats Cards */}
      <div className="admin-stats-grid">
        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-primary">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L18 21H6L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalOrders.toLocaleString()}</h3>
            <p>Tổng đơn hàng</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-success">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2V22M17 5H9.5C8.11929 5 7 6.11929 7 7.5S8.11929 10 9.5 10H14.5C15.8807 10 17 11.1193 17 12.5S15.8807 15 14.5 15H7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="admin-stat-content">
            <h3>{formatCurrency(stats.totalRevenue)}</h3>
            <p>Tổng doanh thu</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-warning">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 7L9 18L4 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalProducts}</h3>
            <p>Sản phẩm</p>
          </div>
        </div>

        <div className="admin-stat-card">
          <div className="admin-stat-icon admin-stat-icon-error">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21M16 7C16 9.20914 14.2091 11 12 11C9.79086 11 8 9.20914 8 7C8 4.79086 9.79086 3 12 3C14.2091 3 16 4.79086 16 7Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="admin-stat-content">
            <h3>{stats.totalCustomers.toLocaleString()}</h3>
            <p>Khách hàng</p>
          </div>
        </div>
      </div>

      {/* Recent Orders */}
      <div className="admin-dashboard-section">
        <div className="admin-section-header">
          <h2>Đơn hàng gần đây</h2>
          <button className="btn btn-secondary btn-sm">Xem tất cả</button>
        </div>
        
        <div className="card">
          <div className="table-container">
            <table className="table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Khách hàng</th>
                  <th>Sản phẩm</th>
                  <th>Số tiền</th>
                  <th>Trạng thái</th>
                  <th>Ngày</th>
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((order) => (
                  <tr key={order.id}>
                    <td className="font-mono text-sm">#{order.id}</td>
                    <td>{order.customer}</td>
                    <td>{order.product}</td>
                    <td className="font-semibold">{formatCurrency(order.amount)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td className="text-neutral">{order.date}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="admin-dashboard-section">
        <div className="admin-section-header">
          <h2>Thao tác nhanh</h2>
        </div>
        
        <div className="admin-quick-actions">
          <button className="admin-quick-action-btn">
            <div className="admin-quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M12 5V19M5 12H19" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </div>
            <div className="admin-quick-action-content">
              <h4>Thêm sản phẩm</h4>
              <p>Tạo sản phẩm mới</p>
            </div>
          </button>

          <button className="admin-quick-action-btn">
            <div className="admin-quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M9 12L11 14L15 10M21 12C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C16.9706 3 21 7.02944 21 12Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="admin-quick-action-content">
              <h4>Xem báo cáo</h4>
              <p>Phân tích doanh thu</p>
            </div>
          </button>

          <button className="admin-quick-action-btn">
            <div className="admin-quick-action-icon">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M16 11V7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7V11M5 9H19L18 21H6L5 9Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="admin-quick-action-content">
              <h4>Quản lý đơn hàng</h4>
              <p>Xử lý đơn hàng mới</p>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
>>>>>>> ae0593a67756b636735aa87496db449960755e2a
