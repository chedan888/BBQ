import React from 'react';
import { MenuItem } from '../types';

interface BillViewProps {
  cart: { [key: string]: number };
  items: MenuItem[];
  onBack: () => void;
}

export const BillView: React.FC<BillViewProps> = ({ cart, items, onBack }) => {
  const cartItems = Object.entries(cart)
    .map(([id, quantity]) => {
      const item = items.find(i => i.id === id);
      return item ? { ...item, quantity } : null;
    })
    .filter((i): i is (MenuItem & { quantity: number }) => i !== null && i.quantity > 0);

  const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const now = new Date();
  const dateStr = now.toLocaleDateString('zh-CN');
  const timeStr = now.toLocaleTimeString('zh-CN', { hour: '2-digit', minute: '2-digit' });

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <div className="p-4 bg-red-800 text-white flex justify-between items-center shadow-md print:hidden">
        <button onClick={onBack} className="text-sm font-bold flex items-center">
          ← 返回修改 (Back)
        </button>
        <span className="font-bold">账单预览 (Bill)</span>
        <div className="w-16"></div> 
      </div>

      <div className="flex-1 p-4 overflow-y-auto">
        <div className="bg-white p-6 rounded-none shadow-xl max-w-md mx-auto border-t-8 border-red-800">
            {/* Header */}
            <div className="text-center border-b-2 border-dashed border-stone-300 pb-4 mb-4">
                <h1 className="text-2xl font-black text-stone-900 mb-1">大森林炭火烧烤</h1>
                <p className="text-stone-500 text-sm">点单详情</p>
                <div className="mt-2 text-xs text-stone-400 flex justify-between px-4">
                    <span>{dateStr}</span>
                    <span>{timeStr}</span>
                </div>
            </div>

            {/* Items List */}
            <div className="space-y-3 mb-6">
                {cartItems.map((item) => (
                    <div key={item.id} className="flex justify-between items-baseline text-stone-800">
                        <div className="flex-1">
                            <span className="font-bold text-lg">{item.name}</span>
                        </div>
                        <div className="text-right w-24">
                            <span className="text-stone-500 text-sm mr-2">x{item.quantity}</span>
                            <span className="font-bold">¥{item.price * item.quantity}</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Totals */}
            <div className="border-t-2 border-dashed border-stone-300 pt-4">
                <div className="flex justify-between text-stone-600 mb-2">
                    <span>总数量</span>
                    <span>{totalCount} 串/份</span>
                </div>
                <div className="flex justify-between text-2xl font-black text-red-700 mt-2 items-end">
                    <span>总计 (Total)</span>
                    <span>¥{total}</span>
                </div>
            </div>

            {/* Footer Message */}
            <div className="mt-8 text-center text-stone-400 text-sm">
                <p>请截图发给老板下单</p>
                <p>Please screenshot this page</p>
            </div>
        </div>
      </div>
      
      <div className="p-4 text-center text-stone-500 text-xs print:hidden">
        提示: 请直接对当前屏幕进行截图
      </div>
    </div>
  );
};
