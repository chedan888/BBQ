import React, { useState } from 'react';
import { MenuItem } from '../types';

interface BillViewProps {
  cart: { [key: string]: number };
  items: MenuItem[];
  onBack: () => void;
}

export const BillView: React.FC<BillViewProps> = ({ cart, items, onBack }) => {
  const [spiciness, setSpiciness] = useState('正常辣');
  
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

  const handleCopy = () => {
    const text = [
        `【大森林炭火烧烤】订单`,
        `时间: ${dateStr} ${timeStr}`,
        `口味: ${spiciness}`,
        `----------------`,
        ...cartItems.map(item => `${item.name} x${item.quantity}   ¥${item.price * item.quantity}`),
        `----------------`,
        `总数量: ${totalCount}`,
        `总计: ¥${total}`
    ].join('\n');

    navigator.clipboard.writeText(text).then(() => {
        alert('订单文字已复制！请粘贴发送给老板。');
    }).catch(() => {
        alert('复制失败，请手动截图。');
    });
  };

  const spicinessOptions = ['不辣', '微辣', '正常辣', '加辣'];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col">
      <div className="p-4 bg-red-800 text-white flex justify-between items-center shadow-md print:hidden sticky top-0 z-10">
        <button onClick={onBack} className="text-sm font-bold flex items-center hover:bg-red-700 px-3 py-1 rounded transition">
          ← 返回 (Back)
        </button>
        <span className="font-bold">账单预览 (Bill)</span>
        <div className="w-16"></div> 
      </div>

      <div className="flex-1 p-4 overflow-y-auto pb-36">
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

            {/* Spiciness Selection (Inside receipt for screenshot visibility) */}
             <div className="border-t-2 border-dashed border-stone-300 py-4">
                <label className="block text-stone-500 text-xs font-bold mb-2 text-center">- 口味选择 -</label>
                <div className="flex justify-center gap-2">
                    {spicinessOptions.map(opt => (
                        <button
                            key={opt}
                            onClick={() => setSpiciness(opt)}
                            className={`px-3 py-1.5 rounded-lg text-sm font-bold border transition-all
                                ${spiciness === opt 
                                    ? 'bg-red-600 text-white border-red-600 shadow-md' 
                                    : 'bg-white text-stone-500 border-stone-200 hover:border-stone-300'}`}
                        >
                            {opt}
                        </button>
                    ))}
                </div>
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
            
            {/* Footer Message within Card */}
            <div className="mt-6 text-center">
                 <div className="inline-block bg-stone-100 text-stone-500 text-xs px-3 py-1 rounded-full">
                    已选口味: {spiciness}
                 </div>
            </div>
        </div>
      </div>
      
      {/* Bottom Action Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-20 print:hidden safe-area-bottom">
         <div className="max-w-md mx-auto flex flex-col gap-3">
            <button 
                onClick={handleCopy}
                className="w-full bg-stone-800 hover:bg-stone-900 text-white font-bold py-3.5 px-4 rounded-xl shadow-lg flex items-center justify-center transition active:scale-95"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m2 4h6a2 2 0 012 2v6a2 2 0 01-2 2h-6a2 2 0 01-2-2v-6a2 2 0 012-2z" />
                </svg>
                复制订单文字 (Copy Text)
            </button>
            <div className="text-center text-stone-400 text-xs">
                或者直接截图上面的订单详情发送
            </div>
         </div>
      </div>
    </div>
  );
};