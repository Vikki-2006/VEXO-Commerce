import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, ArrowRight, X } from 'lucide-react';
import { useCompareStore } from '../store/useCompareStore';
import { MatteButton } from '../components/ui/MatteButton';
import { Badge } from '../components/ui/Badge';
import { EmptyState } from '../components/ui/EmptyState';
import { SEO } from '../components/common/SEO';
import { formatCurrency } from '../utils/formatters';


export const ComparePage: React.FC = () => {
  const navigate = useNavigate();
  const { items, toggleCompare, clearCompare } = useCompareStore();

  if (items.length === 0) {
    return (
      <div className="pt-32 pb-20 max-w-3xl mx-auto px-4 text-center text-ink">
        <SEO title="Compare Hardware Matrix | VEXO Systems" />
        <EmptyState
          type="generic"
          title="No devices selected for benchmarking"
          subtitle="Select products in the catalogue to compare side-by-side hardware specifications."
          actionText="Explore Index"
          actionPath="/shop"
        />
      </div>
    );
  }

  return (
    <div className="pt-28 pb-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 min-h-screen text-ink">
      <SEO title="Compare Hardware Matrix | VEXO Systems" />
      <div className="flex items-center justify-between mb-8">
        <div>
          <Badge variant="gold" className="mb-2">SPECIFICATION BENCHMARKS</Badge>
          <h1 className="text-3xl font-black text-ink tracking-tight font-serif">VEXO Hardware Matrix</h1>
        </div>
        <button
          onClick={clearCompare}
          className="text-xs font-bold text-danger hover:underline flex items-center gap-1 uppercase tracking-wider"
        >
          <Trash2 className="w-4 h-4" /> Clear All Devices
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {items.map((prod) => (
          <div key={prod.id} className="studio-card rounded-xl p-6 border border-sand bg-white flex flex-col justify-between">
            <div>
              <div className="relative aspect-square rounded-lg overflow-hidden bg-warm mb-4 border border-sand">
                <img src={prod.images[0]} alt={prod.title} className="w-full h-full object-cover" />
                <button
                  onClick={() => toggleCompare(prod)}
                  className="absolute top-3 right-3 p-1.5 rounded-full bg-ink text-white hover:bg-titanium"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <Badge variant="gold" className="mb-2">{prod.category?.name}</Badge>
              <h3 className="text-sm font-bold text-ink line-clamp-1">{prod.title}</h3>
              <p className="text-base font-black text-gold mt-1">{formatCurrency(prod.price)}</p>

              {/* Specs */}
              <div className="mt-6 space-y-3 border-t border-sand pt-4 text-xs">
                {prod.specs &&
                  Object.entries(prod.specs).map(([key, val]) => (
                    <div key={key}>
                      <span className="text-[9px] text-stone uppercase font-bold block">{key}</span>
                      <span className="font-semibold text-ink">{val}</span>
                    </div>
                  ))}
              </div>
            </div>

            <MatteButton
              onClick={() => navigate(`/product/${prod.slug}`)}
              variant="primary"
              size="sm"
              className="w-full mt-6"
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              View Full Specs
            </MatteButton>
          </div>
        ))}
      </div>
    </div>
  );
};
