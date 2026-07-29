import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, User as UserIcon } from 'lucide-react';
import { StudioCard } from '../components/ui/StudioCard';
import { MatteButton } from '../components/ui/MatteButton';
import { MinimalInput } from '../components/ui/MinimalInput';
import { useAuthStore } from '../store/useAuthStore';
import { useToastStore } from '../store/useToastStore';
import { SEO } from '../components/common/SEO';
import { api } from '../services/api';


export const AuthPage: React.FC = () => {
  const navigate = useNavigate();
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuthStore();
  const addToast = useToastStore((s) => s.addToast);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (isRegister) {
        const res = await api.register(name, email, password);
        login(res.user, res.token);
        addToast({ type: 'success', title: 'Welcome to VEXO Systems', message: 'Account created successfully.' });
      } else {
        const res = await api.login(email, password);
        login(res.user, res.token);
        addToast({ type: 'success', title: 'Signed In', message: `Welcome back, ${res.user.name}` });
      }
      navigate('/account');
    } catch (err: any) {
      addToast({ type: 'error', title: 'Authentication Failed', message: err.message });
    } finally {
      setLoading(false);
    }
  };

  const loginAsDemo = async (role: 'USER' | 'ADMIN') => {
    setLoading(true);
    try {
      const demoEmail = role === 'ADMIN' ? 'admin@vexo.systems' : 'user@vexo.systems';
      const demoPassword = role === 'ADMIN' ? 'admin123' : 'user123';
      const res = await api.login(demoEmail, demoPassword);
      login(res.user, res.token);
      addToast({ type: 'success', title: 'Demo Access Activated', message: `Logged in as ${res.user.role}` });
      if (role === 'ADMIN') navigate('/admin');
      else navigate('/account');
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="pt-32 pb-20 max-w-md mx-auto px-4 min-h-screen flex flex-col justify-center text-ink">
      <SEO
        title="Authentication Portal | VEXO Systems"
        description="Sign in or register for VEXO Systems private hardware index, orders, and telemetry."
      />
      <StudioCard className="p-8 border border-sand bg-card space-y-6 shadow-card theme-transition">
        <div className="text-center">
          <span className="text-2xl font-black tracking-[0.15em] text-ink font-serif uppercase block">
            VEXO
          </span>
          <span className="text-[9px] font-bold tracking-[0.2em] text-stone uppercase block -mt-1 mb-4">
            SYSTEMS PORTAL
          </span>
          <h2 className="text-xl font-bold text-ink">{isRegister ? 'Create VEXO Account' : 'Sign In to VEXO Index'}</h2>
          <p className="text-xs text-stone mt-1 font-semibold">Access private hardware telemetry and orders</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <MinimalInput
              label="Full Name"
              placeholder="e.g. Astrid Lindqvist"
              value={name}
              onChange={(e) => setName(e.target.value)}
              leftIcon={<UserIcon className="w-4 h-4" />}
              required
            />
          )}

          <MinimalInput
            label="Email Address"
            type="email"
            placeholder="user@vexo.systems"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            leftIcon={<Mail className="w-4 h-4" />}
            required
          />

          <MinimalInput
            label="Password"
            type="password"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            leftIcon={<Lock className="w-4 h-4" />}
            required
          />

          <MatteButton type="submit" variant="primary" size="lg" className="w-full" isLoading={loading}>
            {isRegister ? 'Create Account' : 'Sign In'}
          </MatteButton>
        </form>

        {/* One-Click Demo Access */}
        <div className="pt-4 border-t border-sand space-y-2">
          <span className="text-[10px] font-bold text-stone uppercase block text-center mb-2">
            One-Click Demo Access
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => loginAsDemo('USER')}
              className="flex-1 py-2 px-3 rounded-lg bg-warm border border-sand text-xs font-bold text-ink hover:border-ink transition-all"
            >
              Demo Customer
            </button>
            <button
              onClick={() => loginAsDemo('ADMIN')}
              className="flex-1 py-2 px-3 rounded-lg bg-ink text-white text-xs font-bold hover:bg-titanium transition-all flex items-center justify-center gap-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-gold" /> Demo Admin
            </button>
          </div>
        </div>

        <div className="text-center pt-2">
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-xs text-gold hover:underline font-bold uppercase tracking-wider"
          >
            {isRegister ? 'Already registered? Sign In' : "Don't have an account? Create one"}
          </button>
        </div>
      </StudioCard>
    </div>
  );
};
