// Orders.js
import React, { useState, useEffect } from 'react';
import axiosInstance from '../../utils/AxiosInstance'; // Adjust the import path

const Orders = () => {
  const [users, setUsers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [selectedUser, setSelectedUser] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('');

  const orderStatuses = ["PENDING", "SHIPPED", "DELIVERED", "CANCELLED"];

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axiosInstance.get('users');
        setUsers(response.data);
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };

    const fetchOrders = async () => {
      try {
        const response = await axiosInstance.get('order');
        setOrders(response.data);
      } catch (error) {
        console.error('Error fetching orders:', error);
      }
    };

    fetchUsers();
    fetchOrders();
  }, []);

  useEffect(() => {
    // Filter orders based on selected user and status
    const filtered = orders.filter(order => {
      const userMatch = selectedUser ? order.userId === selectedUser : true;
      const statusMatch = selectedStatus ? order.status === selectedStatus : true;
      return userMatch && statusMatch;
    });
    setFilteredOrders(filtered);
  }, [selectedUser, selectedStatus, orders]);

  // Function to update order status
  const updateOrderStatus = async (orderId, newStatus) => {
    try {
      await axiosInstance.patch(`order/${orderId}`, { status: newStatus });
      // Update the local orders state to reflect the change
      setOrders(orders.map(order =>
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } catch (error) {
      console.error('Error updating order status:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-4">Orders</h1>
      <div className='flex flex-row gap-4'>
        <div className="mb-4">
          <select
            id="userSelect"
            value={selectedUser}
            onChange={(e) => setSelectedUser(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Users</option>
            {users.map(user => (
              <option key={user.id} value={user.id}>
                {user.name}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <select
            id="statusSelect"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="p-2 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Statuses</option>
            {orderStatuses.map(status => (
              <option key={status} value={status}>
                {status}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="overflow-x-auto shadow-md rounded-lg">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border-b border-gray-300 p-4 text-left">User Name</th>
              <th className="border-b border-gray-300 p-4 text-left">Order Items</th>
              <th className="border-b border-gray-300 p-4 text-left">Current Status</th>
              <th className="border-b border-gray-300 p-4 text-left">Created At</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map(order => (
              <tr key={order.id} className="hover:bg-gray-50 transition">
                <td className="border-b border-gray-300 p-4">
                  {users.find(user => user.id === order.userId)?.name}
                </td>
                <td className="border-b border-gray-300 p-4">
                  {order.orderItems.map(item => (
                    <div key={item.id}>{item.name}</div>
                  ))}
                </td>
                <td className="border-b border-gray-300 p-4">
                  <select
                    value={order.status}
                    onChange={(e) => updateOrderStatus(order.id, e.target.value)}
                    className="p-1 border border-gray-300 rounded shadow focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {orderStatuses.map(status => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="border-b border-gray-300 p-4">
                  {new Date(order.createdAt).toLocaleString()}
                </td>
              </tr>
            ))}
            {filteredOrders.length === 0 && (
              <tr>
                <td colSpan="4" className="border-b border-gray-300 p-4 text-center">No orders found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Orders;
