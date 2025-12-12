import React, { useState } from 'react';
import { Product, University } from '../types';
import { generateProductDescription } from '../services/geminiService';
import { Sparkles, PlusCircle, Image as ImageIcon, Loader2 } from 'lucide-react';

interface SellerDashboardProps {
  sellerName: string;
  onAddProduct: (product: Omit<Product, 'id' | 'timestamp'>) => void;
}

const SellerDashboard: React.FC<SellerDashboardProps> = ({ sellerName, onAddProduct }) => {
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('Electronics');
  const [uni, setUni] = useState<University>(University.UNILAG);
  const [desc, setDesc] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateDesc = async () => {
    if (!title) return;
    setIsGenerating(true);
    const generated = await generateProductDescription(title, category);
    setDesc(generated);
    setIsGenerating(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAddProduct({
      title,
      price: Number(price),
      category,
      university: uni,
      description: desc,
      sellerName,
      image: `https://picsum.photos/seed/${title.replace(/\s/g, '')}/400/300`, // Auto-generate consistent random image
      sellerId: 'current-user' // Mock ID
    });
    // Reset
    setTitle('');
    setPrice('');
    setDesc('');
    alert("Product Listed Successfully!");
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
            <PlusCircle size={28} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">List New Item</h2>
            <p className="text-sm text-gray-500">Welcome back, {sellerName}. Sell fast, cash out.</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Item Title</label>
              <input 
                required
                type="text" 
                value={title} 
                onChange={e => setTitle(e.target.value)}
                placeholder="e.g. MacBook Pro 2020"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price (₦)</label>
              <input 
                required
                type="number" 
                value={price} 
                onChange={e => setPrice(e.target.value)}
                placeholder="50000"
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
              <select 
                value={category}
                onChange={e => setCategory(e.target.value)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                <option>Electronics</option>
                <option>Fashion</option>
                <option>Books</option>
                <option>Furniture</option>
                <option>Food & Snacks</option>
                <option>Services</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">University Location</label>
              <select 
                value={uni}
                onChange={e => setUni(e.target.value as University)}
                className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none"
              >
                {Object.values(University).map(u => (
                  <option key={u} value={u}>{u}</option>
                ))}
              </select>
            </div>
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="block text-sm font-medium text-gray-700">Description</label>
              <button 
                type="button"
                onClick={handleGenerateDesc}
                disabled={!title || isGenerating}
                className="text-xs flex items-center gap-1 text-purple-600 font-bold hover:text-purple-800 disabled:opacity-50"
              >
                {isGenerating ? <Loader2 size={12} className="animate-spin"/> : <Sparkles size={12} />}
                Generate with AI
              </button>
            </div>
            <textarea 
              required
              rows={4}
              value={desc} 
              onChange={e => setDesc(e.target.value)}
              placeholder="Describe your item..."
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-purple-500 outline-none resize-none"
            />
          </div>

          <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg border border-dashed border-gray-300 text-gray-500">
            <ImageIcon />
            <span className="text-sm">Image will be auto-generated based on title (Simulation)</span>
          </div>

          <button 
            type="submit"
            className="w-full bg-purple-600 text-white py-3 rounded-lg font-bold hover:bg-purple-700 transition shadow-lg hover:shadow-xl"
          >
            Post Item to Market
          </button>
        </form>
      </div>
    </div>
  );
};

export default SellerDashboard;