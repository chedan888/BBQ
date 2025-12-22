import React from 'react';
import { MenuItem } from '../types';

interface MenuGridProps {
  categories: string[];
  items: MenuItem[];
  cart: { [key: string]: number };
  onUpdateCart: (item: MenuItem, delta: number) => void;
}

export const MenuGrid: React.FC<MenuGridProps> = ({ categories, items, cart, onUpdateCart }) => {
  return (
    <div className="pb-24">
      {categories.map((category) => {
        const categoryItems = items.filter(item => item.category === category);
        if (categoryItems.length === 0) return null;

        return (
          <div key={category} id={`category-${category}`} className="mb-6 scroll-mt-36">
             <div className="flex items-center mb-3 border-l-4 border-red-600 pl-3">
                <h2 className="text-lg font-black text-stone-800">
                {category}
                </h2>
            </div>
            
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
              {categoryItems.map((item) => {
                const quantity = cart[item.id] || 0;
                return (
                  <div 
                    key={item.id} 
                    className={`
                        relative bg-white rounded-xl p-3 shadow-sm transition-all flex flex-col justify-between min-h-[90px]
                        ${quantity > 0 ? 'border border-red-500 ring-1 ring-red-500 bg-red-50/10' : 'border border-transparent'}
                    `}
                  >
                    
                    {/* Item Name - Top */}
                    <div className="mb-6">
                      <h3 className="font-bold text-stone-800 text-base leading-tight break-words">{item.name}</h3>
                    </div>
                    
                    {/* Bottom Area: Price left, Controls right */}
                    <div className="flex justify-between items-end">
                        <div className="font-black text-red-600 text-lg">
                            <span className="text-xs">¥</span>{item.price}
                        </div>

                        {/* Controls */}
                        <div>
                        {quantity === 0 ? (
                            <button 
                                onClick={() => onUpdateCart(item, 1)}
                                className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white shadow-sm active:bg-red-700 active:scale-95 transition-all"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                </svg>
                            </button>
                        ) : (
                            <div className="flex items-center space-x-2">
                                <button 
                                    onClick={() => onUpdateCart(item, -1)}
                                    className="w-7 h-7 flex items-center justify-center rounded border border-stone-300 text-stone-500 bg-white active:bg-stone-100 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                                <span className="font-bold text-stone-900 text-base min-w-[10px] text-center">{quantity}</span>
                                <button 
                                    onClick={() => onUpdateCart(item, 1)}
                                    className="w-7 h-7 flex items-center justify-center rounded bg-red-600 text-white shadow-sm active:bg-red-700 active:scale-95 transition"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                        )}
                        </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
};
