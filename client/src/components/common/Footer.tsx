import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2, Globe, Share2, MessageCircle } from 'lucide-react';
import { MinimalInput } from '../ui/MinimalInput';
import { MatteButton } from '../ui/MatteButton';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="relative bg-warm border-t border-sand pt-20 pb-12 overflow-hidden mt-32 text-ink transition-colors duration-500">
      <div className="max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 relative z-10">
        {/* Top Newsletter Card */}
        <div className="bg-card rounded-2xl p-8 sm:p-12 mb-16 border border-sand shadow-subtle">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            <div className="lg:col-span-7">
              <span className="text-[10px] font-bold text-gold uppercase tracking-[0.2em] block mb-2">
                VEXO SYSTEMS DISPATCH
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-ink tracking-tight font-serif">
                Join the Hardware Catalogue Journal
              </h3>
              <p className="text-stone text-xs mt-2 max-w-xl leading-relaxed">
                Receive private dispatches on limited hardware iterations, acoustic engineering papers, and architectural releases.
              </p>
            </div>

            <div className="lg:col-span-5">
              {subscribed ? (
                <div className="flex items-center gap-3 p-4 rounded-xl bg-success/10 border border-success/20 text-success">
                  <CheckCircle2 className="w-5 h-5 shrink-0" />
                  <div>
                    <h4 className="text-xs font-bold">Registration Confirmed</h4>
                    <p className="text-[11px] text-success/80">Welcome to VEXO Systems Private Index.</p>
                  </div>
                </div>
              ) : (
                <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row gap-2">
                  <MinimalInput
                    type="email"
                    placeholder="enter@your-email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="flex-1 text-xs"
                  />
                  <MatteButton type="submit" variant="primary" size="md" rightIcon={<ArrowRight className="w-4 h-4" />}>
                    Subscribe
                  </MatteButton>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* Footer Navigation Columns */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 mb-16">
          {/* Brand Info */}
          <div className="col-span-2 space-y-4">
            <Link to="/" className="flex flex-col">
              <span className="text-2xl font-black tracking-[0.15em] text-ink font-serif uppercase">
                VEXO
              </span>
              <span className="text-[9px] font-bold tracking-[0.25em] text-stone uppercase -mt-1">
                SYSTEMS • EST. 2026
              </span>
            </Link>
            <p className="text-stone text-xs leading-relaxed max-w-sm">
              Handcrafted industrial technology, planar acoustic systems, and optical displays designed in Stockholm and engineered for international technologists.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-card border border-sand text-[10px] font-bold text-stone uppercase tracking-wider">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              SYSTEM TELEMETRY • 100% OPERATIONAL
            </div>
          </div>

          {/* Links 1 */}
          <div>
            <h4 className="text-[11px] font-extrabold text-ink uppercase tracking-[0.2em] mb-4">Hardware</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-stone">
              <li><Link to="/shop?category=acoustic-architecture" className="hover:text-ink transition-colors">Planar Acoustics</Link></li>
              <li><Link to="/shop?category=visual-displays" className="hover:text-ink transition-colors">4K Master Displays</Link></li>
              <li><Link to="/shop?category=tactile-inputs" className="hover:text-ink transition-colors">Haptic Keydecks</Link></li>
              <li><Link to="/shop?category=carry-apparel" className="hover:text-ink transition-colors">Field Pack Carry</Link></li>
            </ul>
          </div>

          {/* Links 2 */}
          <div>
            <h4 className="text-[11px] font-extrabold text-ink uppercase tracking-[0.2em] mb-4">Platform</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-stone">
              <li><Link to="/shop" className="hover:text-ink transition-colors">Full Index</Link></li>
              <li><Link to="/compare" className="hover:text-ink transition-colors">Spec Matrix</Link></li>
              <li><Link to="/account" className="hover:text-ink transition-colors">Dispatch Tracking</Link></li>
              <li><Link to="/account?tab=addresses" className="hover:text-ink transition-colors">Global Logistics</Link></li>
            </ul>
          </div>

          {/* Links 3 */}
          <div>
            <h4 className="text-[11px] font-extrabold text-ink uppercase tracking-[0.2em] mb-4">Systems</h4>
            <ul className="space-y-2.5 text-xs font-semibold text-stone">
              <li><a href="#" className="hover:text-ink transition-colors">Manifesto</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Dieter Rams Legacy</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Material Ethics</a></li>
              <li><a href="#" className="hover:text-ink transition-colors">Press Archives</a></li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-sand flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone font-semibold">
          <p>© {new Date().getFullYear()} VEXO Systems AB. All Rights Reserved.</p>
          <div className="flex items-center gap-6 text-[11px]">
            <a href="#" className="hover:text-ink transition-colors">Privacy Policy</a>
            <a href="#" className="hover:text-ink transition-colors">Terms of Dispatch</a>
            <a href="#" className="hover:text-ink transition-colors">Security</a>
          </div>
          <div className="flex items-center gap-3">
            <a href="#" className="p-2 rounded-full bg-card border border-sand hover:text-ink transition-colors" title="Global Network"><Globe className="w-3.5 h-3.5" /></a>
            <a href="#" className="p-2 rounded-full bg-card border border-sand hover:text-ink transition-colors" title="Community"><MessageCircle className="w-3.5 h-3.5" /></a>
            <a href="#" className="p-2 rounded-full bg-card border border-sand hover:text-ink transition-colors" title="Share"><Share2 className="w-3.5 h-3.5" /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};
