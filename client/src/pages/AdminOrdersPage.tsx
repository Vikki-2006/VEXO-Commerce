import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Order } from '../types';
import { Badge } from '../components/ui/Badge';
import { formatCurrency, formatDate } from '../utils/formatters';

export const AdminOrdersPage: React.FC = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await api.getUserOrders();
        setOrders(data);
      } catch (e) {
        console.error(e);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 min-h-screen text-ink theme-transition">
      <div className="mb-8">
        <Badge variant="gold" className="mb-2">ADMIN DISPATCHES</Badge>
        <h1 className="text-3xl font-black text-ink tracking-tight font-serif">Global Fulfillment Telemetry</h1>
      </div>

      <div className="studio-card rounded-2xl p-6 border border-sand bg-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-sand text-stone uppercase font-extrabold text-[10px]">
              <th className="pb-3 px-2">Dispatch Ref #</th>
              <th className="pb-3 px-2">Customer</th>
              <th className="pb-3 px-2">Date</th>
              <th className="pb-3 px-2">Total Paid</th>
              <th className="pb-3 px-2">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {orders.map((ord) => (
              <tr key={ord.id} className="hover:bg-warm transition-colors">
                <td className="py-3.5 px-2 font-bold text-ink">{ord.orderNumber}</td>
                <td className="py-3.5 px-2 font-semibold text-ink">Astrid Lindqvist</td>
                <td className="py-3.5 px-2 text-stone">{formatDate(ord.createdAt)}</td>
                <td className="py-3.5 px-2 font-black text-ink">{formatCurrency(ord.totalAmount)}</td>
                <td className="py-3.5 px-2">
                  <Badge variant={ord.status === 'SHIPPED' ? 'success' : 'gold'}>{ord.status}</Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
