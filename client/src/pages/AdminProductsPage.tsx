import React, { useState, useEffect } from 'react';
import { Plus, Search, Edit2, Trash2 } from 'lucide-react';
import { api } from '../services/api';
import { Product } from '../types';
import { MatteButton } from '../components/ui/MatteButton';
import { MinimalInput } from '../components/ui/MinimalInput';
import { Badge } from '../components/ui/Badge';
import { Modal } from '../components/ui/Modal';
import { useToastStore } from '../store/useToastStore';
import { formatCurrency } from '../utils/formatters';

export const AdminProductsPage: React.FC = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('50');
  const [image, setImage] = useState('');

  const addToast = useToastStore((s) => s.addToast);

  const fetchProducts = async () => {
    try {
      const res = await api.getProducts({ search });
      setProducts(res.products);
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, [search]);

  const handleOpenCreateModal = () => {
    setTitle('');
    setSubtitle('');
    setDescription('');
    setPrice('');
    setStock('50');
    setImage('https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&q=80&w=800');
    setModalOpen(true);
  };

  const handleSaveProduct = async (e: React.FormEvent) => {
    e.preventDefault();
    addToast({
      type: 'success',
      title: 'Device Saved',
      message: `${title} updated in inventory index.`,
    });
    setModalOpen(false);
    fetchProducts();
  };

  return (
    <div className="pt-28 pb-20 max-w-[1700px] 3xl:max-w-[2000px] mx-auto px-4 sm:px-8 lg:px-12 min-h-screen text-ink theme-transition">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <Badge variant="gold" className="mb-2">ADMIN INVENTORY</Badge>
          <h1 className="text-3xl font-black text-ink tracking-tight font-serif">VEXO Device Catalogue</h1>
        </div>

        <MatteButton
          onClick={handleOpenCreateModal}
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
        >
          Add New Hardware
        </MatteButton>
      </div>

      <div className="mb-6">
        <MinimalInput
          placeholder="Filter devices by title or category..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          leftIcon={<Search className="w-4 h-4" />}
          className="max-w-md text-xs"
        />
      </div>

      {/* Table */}
      <div className="studio-card rounded-2xl p-6 border border-sand bg-card overflow-x-auto">
        <table className="w-full text-left border-collapse text-xs">
          <thead>
            <tr className="border-b border-sand text-stone uppercase font-extrabold text-[10px]">
              <th className="pb-3 px-2">Hardware Device</th>
              <th className="pb-3 px-2">Category</th>
              <th className="pb-3 px-2">Price</th>
              <th className="pb-3 px-2">Inventory Stock</th>
              <th className="pb-3 px-2 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-sand">
            {products.map((p) => (
              <tr key={p.id} className="hover:bg-warm transition-colors">
                <td className="py-3.5 px-2 font-bold text-ink flex items-center gap-3">
                  <img src={p.images[0]} alt="" className="w-10 h-10 rounded-lg object-cover border border-sand shrink-0 bg-card" />
                  <div>
                    <span className="block text-xs font-bold text-ink">{p.title}</span>
                    <span className="text-stone text-[10px] font-semibold">{p.subtitle}</span>
                  </div>
                </td>
                <td className="py-3.5 px-2 text-stone font-semibold">{p.category?.name}</td>
                <td className="py-3.5 px-2 font-black text-ink">{formatCurrency(p.price)}</td>
                <td className="py-3.5 px-2">
                  <Badge variant={p.stock > 20 ? 'success' : 'warning'}>{p.stock} units</Badge>
                </td>
                <td className="py-3.5 px-2 text-right">
                  <button className="p-1.5 text-stone hover:text-ink transition-colors">
                    <Edit2 className="w-4 h-4" />
                  </button>
                  <button className="p-1.5 text-stone hover:text-danger transition-colors ml-1">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title="Add New VEXO Device"
      >
        <form onSubmit={handleSaveProduct} className="space-y-4">
          <MinimalInput label="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
          <MinimalInput label="Subtitle" value={subtitle} onChange={(e) => setSubtitle(e.target.value)} />
          <div className="grid grid-cols-2 gap-4">
            <MinimalInput label="Price ($)" type="number" value={price} onChange={(e) => setPrice(e.target.value)} required />
            <MinimalInput label="Stock Units" type="number" value={stock} onChange={(e) => setStock(e.target.value)} required />
          </div>
          <MinimalInput label="Image URL" value={image} onChange={(e) => setImage(e.target.value)} required />
          <div>
            <label className="text-[10px] font-bold text-stone uppercase block mb-1">Description</label>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="minimal-input w-full p-3 rounded-lg text-xs text-ink"
            />
          </div>
          <MatteButton type="submit" variant="primary" className="w-full">
            Save Device to Index
          </MatteButton>
        </form>
      </Modal>
    </div>
  );
};
