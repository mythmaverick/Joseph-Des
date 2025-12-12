import React, { useState } from 'react';
import { Product, University } from '../types';
import { MapPin, MessageSquare } from 'lucide-react';

interface ProductListProps {
  products: Product[];
  onChatStart: (product: Product) => void;
}

const ProductList: React.FC<ProductListProps> = ({ products, onChatStart }) => {
  const [filterUni, setFilterUni] = useState<string>('ALL');

  const filteredProducts = filterUni === 'ALL' 
    ? products 
    : products.filter(p => p.university === filterUni);

  return (
    <div className="p-4 sm:p-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto">
        
        {/* Header & Filter */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <h2 className="text-3xl font-extrabold text-gray-900">Fresh Drops 🔥</h2>
          
          <select 
            className="block w-full md:w-64 pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-green-500 focus:border-green-500 sm:text-sm rounded-md shadow-sm"
            value={filterUni}
            onChange={(e) => setFilterUni(e.target.value)}
          >
            <option value="ALL">All Universities</option>
            {Object.values(University).map(u => (
              <option key={u} value={u}>{u}</option>
            ))}
          </select>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <div key={product.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 group">
              <div className="relative h-48 w-full overflow-hidden bg-gray-200">
                <img 
                  src={product.image} 
                  alt={product.title} 
                  className="w-full h-full object-cover group-hover:scale-110 transition duration-500"
                />
                <div className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-md text-xs font-bold text-gray-800 shadow">
                  {product.category}
                </div>
              </div>
              
              <div className="p-5">
                <div className="flex justify-between items-start">
                  <h3 className="text-lg font-bold text-gray-900 line-clamp-1">{product.title}</h3>
                  <span className="text-lg font-extrabold text-green-600">₦{product.price.toLocaleString()}</span>
                </div>
                
                <p className="mt-2 text-sm text-gray-600 line-clamp-2 min-h-[40px]">
                  {product.description}
                </p>
                
                <div className="mt-4 flex items-center text-xs text-gray-500">
                  <MapPin size={14} className="mr-1 text-gray-400" />
                  <span className="truncate">{product.university}</span>
                </div>

                <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                  <span className="text-xs text-gray-500">Sold by {product.sellerName}</span>
                  <button 
                    onClick={() => onChatStart(product)}
                    className="flex items-center space-x-1 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-800 transition"
                  >
                    <MessageSquare size={16} />
                    <span>Haggle</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredProducts.length === 0 && (
          <div className="text-center py-20">
            <p className="text-xl text-gray-500">No goods found here yet. Be the first to post!</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductList;