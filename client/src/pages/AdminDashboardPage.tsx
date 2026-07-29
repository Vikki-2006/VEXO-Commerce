import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  DollarSign,
  ShoppingBag,
  Users,
  TrendingUp,
  Plus,
  ArrowUpRight,
  ShieldCheck,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { api } from '../services/api';
import { StudioCard } from '../components/ui/StudioCard';
import { MatteButton } from '../components/ui/MatteButton';
import { Badge } from '../components/ui/Badge';
import { formatCurrency } from '../utils/formatters';
import { useThemeStore } from '../store/useThemeStore';

export const AdminDashboardPage: React.FC = () => {
  const [metrics, setMetrics] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const theme = useThemeStore((s) => s.theme);
  const isDark = theme === 'dark';

  useEffect(() => {
    const fetchMetrics = async () => {
      try {
        const data = await api.getAdminMetrics();
        setMetrics(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchMetrics();
  }, []);

  if (loading || !metrics) {
    return (
      <div className="pt-32 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-6 text-center">
        <div className="w-8 h-8 border-2 border-gold border-t-transparent rounded-full animate-spin mx-auto" />
        <p className="text-xs text-stone mt-3 font-bold">Loading VEXO Systems telemetry...</p>
      </div>
    );
  }

  const kpis = [
    { title: 'Gross Revenue', value: formatCurrency(metrics.metrics.totalRevenue), icon: <DollarSign className="w-4 h-4 text-emerald-500" />, change: '+24.8% vs last mo' },
    { title: 'Dispatches', value: metrics.metrics.totalOrders, icon: <ShoppingBag className="w-4 h-4 text-ink" />, change: '+18.2% vs last mo' },
    { title: 'Registered Users', value: metrics.metrics.totalUsers, icon: <Users className="w-4 h-4 text-stone" />, change: '+12.5% vs last mo' },
    { title: 'Conversion Rate', value: metrics.metrics.conversionRate, icon: <TrendingUp className="w-4 h-4 text-gold" />, change: '+0.6% vs last mo' },
  ];

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 min-h-screen text-ink theme-transition">
      {/* Admin Header */}
      <div className="mb-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-1">
            EXECUTIVE TELEMETRY
          </span>
          <h1 className="text-3xl font-black text-ink tracking-tight font-serif flex items-center gap-2">
            VEXO Command Center <ShieldCheck className="w-5 h-5 text-gold" />
          </h1>
        </div>

        <div className="flex items-center gap-3">
          <Link to="/admin/products">
            <MatteButton variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
              Manage Devices
            </MatteButton>
          </Link>
          <Link to="/admin/orders">
            <MatteButton variant="secondary" size="sm">
              Manage Dispatches
            </MatteButton>
          </Link>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {kpis.map((kpi, idx) => (
          <StudioCard key={idx} hoverEffect className="p-6 bg-card border border-sand">
            <div className="flex items-center justify-between mb-3">
              <span className="text-[10px] font-extrabold text-stone uppercase tracking-wider">{kpi.title}</span>
              <div className="p-2 rounded-lg bg-warm border border-sand">{kpi.icon}</div>
            </div>
            <div className="text-2xl font-black text-ink">{kpi.value}</div>
            <span className="text-[11px] text-emerald-500 font-bold mt-1 block flex items-center gap-1">
              <ArrowUpRight className="w-3.5 h-3.5" /> {kpi.change}
            </span>
          </StudioCard>
        ))}
      </div>

      {/* Revenue Analytics Chart */}
      <div className="studio-card rounded-2xl p-6 sm:p-8 border border-sand bg-card mb-8">
        <h3 className="text-base font-bold text-ink mb-6 uppercase tracking-wider">
          Revenue Performance (2026 Telemetry)
        </h3>
        <div className="h-80 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={metrics.monthlySales}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor={isDark ? "#D4AF37" : "#C5A059"} stopOpacity={0.35} />
                  <stop offset="95%" stopColor={isDark ? "#D4AF37" : "#C5A059"} stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="name" stroke={isDark ? "#A3A09A" : "#64625E"} fontSize={11} tickLine={false} />
              <YAxis stroke={isDark ? "#A3A09A" : "#64625E"} fontSize={11} tickLine={false} tickFormatter={(v) => `$${v / 1000}k`} />
              <Tooltip
                contentStyle={{
                  backgroundColor: isDark ? '#1F1E1C' : '#FFFFFF',
                  borderColor: isDark ? '#282624' : '#E5E2DC',
                  borderRadius: '8px',
                  color: isDark ? '#F5F3EF' : '#0F0E0D'
                }}
                formatter={(value: any) => [formatCurrency(Number(value)), 'Gross Revenue']}
              />
              <Area
                type="monotone"
                dataKey="revenue"
                stroke={isDark ? "#D4AF37" : "#C5A059"}
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#colorRevenue)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top Performing Devices */}
      <div className="studio-card rounded-2xl p-6 border border-sand bg-card">
        <h3 className="text-base font-bold text-ink mb-4 uppercase tracking-wider">Top Performing Hardware</h3>
        <div className="space-y-3">
          {metrics.topProducts.map((p: any) => (
            <div key={p.id} className="flex items-center justify-between p-3.5 rounded-xl bg-warm border border-sand text-xs">
              <div>
                <h4 className="font-bold text-ink">{p.title}</h4>
                <span className="text-stone font-semibold">Rating: ★ {p.rating}</span>
              </div>
              <div className="text-right">
                <span className="font-bold text-ink block">{formatCurrency(p.price)}</span>
                <span className="text-emerald-500 font-bold">{p.stock} in stock</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
