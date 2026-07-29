import React from 'react';
import { useNavigate } from 'react-router-dom';
import { SlidersHorizontal, X, Trash2, ArrowRight } from 'lucide-react';
import { useCompareStore } from '../../store/useCompareStore';
import { Modal } from '../ui/Modal';
import { MatteButton } from '../ui/MatteButton';
import { formatCurrency } from '../../utils/formatters';

export const CompareDrawer: React.FC = () => {
  const navigate = useNavigate();
  const { items, isOpen, closeCompare, toggleCompare, clearCompare } = useCompareStore();

  if (items.length === 0) return null;

  return (
    <Modal isOpen={isOpen} onClose={closeCompare} maxWidth="4xl" title="Side-by-Side Spec Matrix">
      <div className="space-y-6">
        <div className="flex items-center justify-between text-xs">
          <p className="text-stone font-semibold">
            Benchmarking <strong className="text-ink">{items.length}</strong> of 4 hardware devices
          </p>
          <button onClick={clearCompare} className="font-bold text-danger hover:underline flex items-center gap-1">
            <Trash2 className="w-3.5 h-3.5" /> Clear All
          </button>
        </div>

        {/* Matrix Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {items.map((product) => (
            <div key={product.id} className="p-4 rounded-xl bg-warm border border-sand flex flex-col justify-between">
              <div>
                <div className="relative aspect-square rounded-lg overflow-hidden bg-white border border-sand mb-3">
                  <img src={product.images[0]} alt={product.title} className="w-full h-full object-cover" />
                  <button
                    onClick={() => toggleCompare(product)}
                    className="absolute top-2 right-2 p-1 rounded-full bg-ink/70 text-white hover:bg-ink"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <h4 className="text-xs font-bold text-ink line-clamp-1">{product.title}</h4>
                <p className="text-xs font-black text-gold mt-0.5">{formatCurrency(product.price)}</p>

                {/* Specs List */}
                <div className="mt-4 space-y-2 border-t border-sand pt-3 text-[11px]">
                  <div>
                    <span className="text-stone block font-bold uppercase text-[9px]">Category</span>
                    <span className="font-semibold text-ink">{product.category?.name}</span>
                  </div>
                  <div>
                    <span className="text-stone block font-bold uppercase text-[9px]">Rating</span>
                    <span className="font-bold text-ink">★ {product.rating}</span>
                  </div>
                  <div>
                    <span className="text-stone block font-bold uppercase text-[9px]">Stock</span>
                    <span className="font-semibold text-emerald-700">{product.stock} units</span>
                  </div>
                </div>
              </div>

              <MatteButton
                onClick={() => {
                  closeCompare();
                  navigate(`/product/${product.slug}`);
                }}
                variant="outline"
                size="sm"
                className="w-full mt-4"
              >
                View Details
              </MatteButton>
            </div>
          ))}
        </div>
      </div>
    </Modal>
  );
};
