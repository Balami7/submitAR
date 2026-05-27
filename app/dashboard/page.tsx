'use client';

import React, { useState, useEffect, useCallback } from 'react';
import Header from '@/components/Header';
import { FiSearch } from 'react-icons/fi';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

const STATUS_MAP: Record<string, string> = {
  PENDING: 'Pending', IN_PROGRESS: 'In Progress',
  COMPLETED: 'Completed', IN_TRANSIT: 'In Transit',
  DELIVERED: 'Delivered', CANCELLED: 'Cancelled',
};

export default function Dashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  const [orders, setOrders] = useState<any[]>([]);
  const [counts, setCounts] = useState<Record<string, number>>({});
  const [totalCount, setTotalCount] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilter, setActiveFilter] = useState('Total Order');
  const [loading, setLoading] = useState(true);

  // Redirect if not authenticated
  useEffect(() => {
    if (status === 'unauthenticated') router.push('/admin/login');
  }, [status]);

  const fetchOrders = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (activeFilter !== 'Total Order') params.set('status', activeFilter);
    if (searchTerm) params.set('search', searchTerm);

    const res = await fetch(`/api/orders?${params}`);
    const data = await res.json();

    setOrders(data.orders ?? []);
    setTotalCount(data.total ?? 0);

    // Build counts map
    const map: Record<string, number> = {};
    (data.counts ?? []).forEach((c: any) => {
      map[STATUS_MAP[c.status] ?? c.status] = c._count.status;
    });
    setCounts(map);
    setLoading(false);
  }, [activeFilter, searchTerm]);

  useEffect(() => { fetchOrders(); }, [fetchOrders]);

  const stats = [
    { label: 'Pending',     value: counts['Pending']     ?? 0, color: 'bg-yellow-100 text-yellow-800' },
    { label: 'In Progress', value: counts['In Progress'] ?? 0, color: 'bg-blue-100 text-blue-800' },
    { label: 'Completed',   value: counts['Completed']   ?? 0, color: 'bg-green-100 text-green-800' },
    { label: 'In Transit',  value: counts['In Transit']  ?? 0, color: 'bg-purple-100 text-purple-800' },
    { label: 'Delivered',   value: counts['Delivered']   ?? 0, color: 'bg-emerald-100 text-emerald-800' },
    { label: 'Cancelled',   value: counts['Cancelled']   ?? 0, color: 'bg-red-100 text-red-800' },
    { label: 'Total Order', value: totalCount,                  color: 'bg-gray-900 text-white' },
  ];

  const updateStatus = async (id: string, newStatus: string) => {
    await fetch(`/api/orders/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus.toUpperCase().replace(' ', '_') }),
    });
    fetchOrders();
  };

  if (status === 'loading') return <div className="min-h-screen flex items-center justify-center">Loading...</div>;

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-50 pt-6 pb-12 px-4 md:px-6">
        <div className="max-w-7xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-semibold text-gray-900">Orders</h1>
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 gap-4 mb-8">
            {stats.map((stat) => (
              <div key={stat.label} onClick={() => setActiveFilter(stat.label)}
                className={`rounded-2xl p-6 shadow-sm cursor-pointer transition-all ${stat.color} ${
                  activeFilter === stat.label ? 'ring-2 ring-offset-2 ring-blue-600 shadow-md scale-105' : 'hover:shadow'
                }`}>
                <p className="text-sm font-medium opacity-90">{stat.label}</p>
                <p className="text-4xl font-bold mt-3 tracking-tight">{stat.value}</p>
              </div>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-3xl shadow border border-gray-100 overflow-hidden">
            <div className="flex flex-col md:flex-row justify-between items-center gap-4 p-6 border-b">
              <h2 className="text-xl font-semibold text-gray-900">
                {activeFilter === 'Total Order' ? 'All Orders' : `${activeFilter} Orders`}
              </h2>
              <div className="relative w-full md:w-96">
                <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                <input type="text" placeholder="Search order ID, Name, Location..."
                  value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:outline-none focus:border-blue-500" />
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full min-w-[1100px]">
                <thead className="bg-gray-50">
                  <tr>
                    {['Order ID','Customer','Contact','Location','Service','Amount','Status','Date','Actions'].map(h => (
                      <th key={h} className="text-left py-5 px-6 font-semibold text-gray-700">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-gray-800">
                  {loading ? (
                    <tr><td colSpan={9} className="text-center py-16 text-gray-400">Loading orders...</td></tr>
                  ) : orders.length > 0 ? orders.map(order => (
                    <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-5 font-medium text-gray-900">{order.csn}</td>
                      <td className="px-6 py-5">{order.fullName}</td>
                      <td className="px-6 py-5 font-medium">{order.phone}</td>
                      <td className="px-6 py-5">{order.city}</td>
                      <td className="px-6 py-5 capitalize">{order.primaryService}</td>
                      <td className="px-6 py-5 font-semibold">₦{order.total?.toLocaleString()}</td>
                      <td className="px-6 py-5">
                        <select
                          value={STATUS_MAP[order.status] ?? order.status}
                          onChange={e => updateStatus(order.id, e.target.value)}
                          className={`text-sm font-medium px-3 py-1.5 rounded-full border-0 cursor-pointer ${
                            order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            ['COMPLETED','DELIVERED'].includes(order.status) ? 'bg-green-100 text-green-800' :
                            'bg-blue-100 text-blue-800'
                          }`}>
                          {Object.values(STATUS_MAP).map(s => <option key={s}>{s}</option>)}
                        </select>
                      </td>
                      <td className="px-6 py-5 text-gray-600">
                        {new Date(order.createdAt).toLocaleDateString('en-NG', { day: 'numeric', month: 'short' })}
                      </td>
                      <td className="px-6 py-5">
                        <button
                          onClick={() => router.push(`/admin/orders/${order.id}`)}
                          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-5 py-2 rounded-xl transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  )) : (
                    <tr><td colSpan={9} className="text-center py-16 text-gray-500">No orders found</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}