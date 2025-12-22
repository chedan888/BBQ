import React, { useState } from 'react';
import { MenuItem, MenuData } from '../types';

interface AdminPanelProps {
  menuData: MenuData;
  onUpdateMenu: (newData: MenuData) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({ menuData, onUpdateMenu, onClose }) => {
  const [items, setItems] = useState<MenuItem[]>(menuData.items);
  const [categories, setCategories] = useState<string[]>(menuData.categories);
  
  // Edit Mode State
  const [newItemName, setNewItemName] = useState('');
  const [newItemPrice, setNewItemPrice] = useState('');
  const [newItemCategory, setNewItemCategory] = useState(categories[0] || '');

  const handleAddItem = () => {
    if (!newItemName || !newItemPrice || !newItemCategory) return;
    const newItem: MenuItem = {
      id: Date.now().toString(),
      name: newItemName,
      price: Number(newItemPrice),
      category: newItemCategory
    };
    const updatedItems = [...items, newItem];
    setItems(updatedItems);
    onUpdateMenu({ categories, items: updatedItems });
    setNewItemName('');
    setNewItemPrice('');
  };

  const handleDeleteItem = (id: string) => {
    const updatedItems = items.filter(i => i.id !== id);
    setItems(updatedItems);
    onUpdateMenu({ categories, items: updatedItems });
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 pb-24">
      <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-white border-b border-stone-200 p-4 flex justify-between items-center">
          <h2 className="text-xl font-bold text-stone-800">后台管理 (Admin)</h2>
          <button onClick={onClose} className="bg-stone-200 text-stone-700 px-4 py-2 rounded-lg hover:bg-stone-300 text-sm font-bold">
            退出 (Exit)
          </button>
        </div>

        <div className="p-6">
            {/* Add New Item */}
            <div className="bg-stone-50 p-6 rounded-xl mb-8 border border-stone-200 shadow-sm">
                <h3 className="font-bold text-stone-800 mb-4 text-lg">添加新品 (Add New)</h3>
                <div className="flex flex-wrap gap-4">
                    <div className="flex-1 min-w-[150px]">
                        <label className="block text-xs font-bold text-stone-500 mb-1">分类 (Category)</label>
                        <select 
                            value={newItemCategory}
                            onChange={(e) => setNewItemCategory(e.target.value)}
                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        >
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="flex-1 min-w-[150px]">
                         <label className="block text-xs font-bold text-stone-500 mb-1">菜名 (Name)</label>
                        <input 
                            type="text" 
                            placeholder="例如：羊肉串"
                            value={newItemName}
                            onChange={(e) => setNewItemName(e.target.value)}
                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                    <div className="w-32">
                        <label className="block text-xs font-bold text-stone-500 mb-1">价格 (Price)</label>
                        <input 
                            type="number" 
                            placeholder="0"
                            value={newItemPrice}
                            onChange={(e) => setNewItemPrice(e.target.value)}
                            className="w-full p-3 border border-stone-300 rounded-lg focus:ring-2 focus:ring-red-500 outline-none"
                        />
                    </div>
                    <div className="flex items-end">
                        <button 
                            onClick={handleAddItem}
                            className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 shadow-md active:scale-95 transition"
                        >
                            添加
                        </button>
                    </div>
                </div>
            </div>

            {/* List Items */}
            <div className="space-y-8">
                {categories.map(cat => (
                    <div key={cat}>
                        <h4 className="font-bold text-lg text-stone-800 border-l-4 border-red-600 pl-3 mb-4">{cat}</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                            {items.filter(i => i.category === cat).map(item => (
                                <div key={item.id} className="flex justify-between items-center bg-white p-4 border border-stone-100 rounded-lg shadow-sm hover:shadow-md transition">
                                    <div>
                                        <div className="font-bold text-stone-800">{item.name}</div>
                                        <div className="text-red-600 font-bold mt-1">¥{item.price}</div>
                                    </div>
                                    <button 
                                        onClick={() => handleDeleteItem(item.id)}
                                        className="text-stone-400 hover:text-red-600 p-2 transition"
                                        title="Delete"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                        </svg>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
      </div>
    </div>
  );
};
