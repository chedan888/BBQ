import React, { useState, useEffect } from 'react';
import { MenuGrid } from './components/MenuGrid';
import { BillView } from './components/BillView';
import { AdminPanel } from './components/AdminPanel';
import { INITIAL_MENU_DATA } from './constants';
import { MenuData, MenuItem, ViewState } from './types';

const App: React.FC = () => {
  const [menuData, setMenuData] = useState<MenuData>(INITIAL_MENU_DATA);
  const [cart, setCart] = useState<{ [key: string]: number }>({});
  const [view, setView] = useState<ViewState>(ViewState.MENU);
  
  // Admin Password State
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordInput, setPasswordInput] = useState('');
  const [passwordError, setPasswordError] = useState(false);

  // Load menu from local storage on mount
  useEffect(() => {
    const savedMenu = localStorage.getItem('bbq_menu_data');
    if (savedMenu) {
      try {
        setMenuData(JSON.parse(savedMenu));
      } catch (e) {
        console.error("Failed to parse saved menu");
      }
    }
  }, []);

  // Save menu to local storage whenever it changes
  useEffect(() => {
    localStorage.setItem('bbq_menu_data', JSON.stringify(menuData));
  }, [menuData]);

  const handleUpdateCart = (item: MenuItem, delta: number) => {
    setCart(prev => {
      const currentQty = prev[item.id] || 0;
      const newQty = Math.max(0, currentQty + delta);
      
      const newCart = { ...prev };
      if (newQty === 0) {
        delete newCart[item.id];
      } else {
        newCart[item.id] = newQty;
      }
      return newCart;
    });
  };

  const handleUpdateMenu = (newData: MenuData) => {
    setMenuData(newData);
  };

  const checkPasswordAndEnterAdmin = () => {
    if (passwordInput === '8888') {
      setShowPasswordModal(false);
      setPasswordInput('');
      setPasswordError(false);
      setView(ViewState.ADMIN);
    } else {
      setPasswordError(true);
    }
  };

  const scrollToCategory = (category: string) => {
    const element = document.getElementById(`category-${category}`);
    if (element) {
        const headerOffset = 140; 
        const elementPosition = element.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        window.scrollTo({
            top: offsetPosition,
            behavior: "smooth"
        });
    }
  };

  const getCategoryColor = (cat: string) => {
    // Cleaner style: just text color and bottom border for active state could be better, 
    // but user liked the pills, let's make them cleaner/smaller.
    return 'bg-white text-stone-600 border-stone-200 hover:bg-stone-50';
  };

  const totalItems = (Object.values(cart) as number[]).reduce((a, b) => a + b, 0);
  const totalPrice = (Object.entries(cart) as [string, number][]).reduce((sum, [id, qty]) => {
    const item = menuData.items.find(i => i.id === id);
    return sum + (item ? item.price * qty : 0);
  }, 0);

  // Admin view
  if (view === ViewState.ADMIN) {
    return (
      <AdminPanel 
        menuData={menuData} 
        onUpdateMenu={handleUpdateMenu} 
        onClose={() => setView(ViewState.MENU)} 
      />
    );
  }

  // Screenshot Bill View
  if (view === ViewState.BILL) {
    return (
      <BillView 
        cart={cart} 
        items={menuData.items} 
        onBack={() => setView(ViewState.MENU)} 
      />
    );
  }

  // Default Menu View
  return (
    <div className="min-h-screen bg-[#f8f9fa] font-sans text-stone-900">
      {/* Sticky Header Area - Redesigned */}
      <div className="sticky top-0 z-30 bg-white shadow-sm border-b border-stone-100">
        <div className="container mx-auto max-w-5xl px-3 py-2">
            
            {/* Top Bar: Logo + Title + Categories inline if possible */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                <div className="flex items-center justify-between w-full md:w-auto">
                    <div className="flex items-center space-x-3">
                        {/* Logo Icon - Adjusted size for cleaner look */}
                        <div className="w-10 h-10 bg-red-600 rounded-lg flex items-center justify-center shadow-red-200 shadow-md flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
                            </svg>
                        </div>
                        {/* Title Horizontal */}
                        <h1 className="text-xl font-black text-stone-800 tracking-tight whitespace-nowrap">大森林炭火烧烤</h1>
                    </div>

                     <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="text-stone-400 hover:text-stone-600 p-2 md:hidden"
                        aria-label="Admin Settings"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </div>

                {/* Categories Scrollable Row */}
                <nav className="flex items-center space-x-2 overflow-x-auto hide-scrollbar flex-1 md:justify-end">
                    {menuData.categories.map((cat) => (
                        <button
                            key={cat}
                            onClick={() => scrollToCategory(cat)}
                            className={`px-4 py-2 rounded-lg text-sm font-bold whitespace-nowrap border transition-all ${getCategoryColor(cat)} shadow-sm`}
                        >
                            {cat}
                        </button>
                    ))}
                     <button 
                        onClick={() => setShowPasswordModal(true)}
                        className="text-stone-400 hover:text-stone-600 p-2 hidden md:block"
                        aria-label="Admin Settings"
                    >
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                    </button>
                </nav>
            </div>
        </div>
      </div>

      {/* Main Menu Grid */}
      <main className="container mx-auto p-3 max-w-5xl">
        <MenuGrid 
          categories={menuData.categories} 
          items={menuData.items} 
          cart={cart}
          onUpdateCart={handleUpdateCart}
        />
      </main>

      {/* Sticky Footer */}
      {totalItems > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-stone-200 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.1)] z-30 px-4 py-3 safe-area-bottom">
          <div className="container mx-auto max-w-5xl flex justify-between items-center">
            <div className="flex flex-col">
              <span className="text-stone-500 text-xs">已选 {totalItems} 件</span>
              <span className="text-2xl font-black text-red-600">¥ {totalPrice}</span>
            </div>
            
            <button 
              onClick={() => setView(ViewState.BILL)}
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-full shadow-lg transform transition active:scale-95 flex items-center"
            >
              <span className="text-lg">去结算</span>
            </button>
          </div>
        </div>
      )}

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-sm transform transition-all scale-100">
                <h3 className="text-lg font-bold text-stone-900 mb-4 text-center">管理员验证</h3>
                <p className="text-sm text-stone-500 mb-4 text-center">请输入后台管理密码</p>
                <input 
                    type="password"
                    autoFocus
                    value={passwordInput}
                    onChange={(e) => setPasswordInput(e.target.value)}
                    className={`w-full p-3 border rounded-lg outline-none text-center text-lg tracking-widest mb-2 
                        ${passwordError ? 'border-red-500 bg-red-50' : 'border-stone-300 focus:border-red-500'}`}
                    placeholder="••••"
                />
                {passwordError && <p className="text-red-500 text-xs text-center mb-4">密码错误，请重试</p>}
                
                <div className="flex gap-3 mt-4">
                    <button 
                        onClick={() => {
                            setShowPasswordModal(false);
                            setPasswordInput('');
                            setPasswordError(false);
                        }}
                        className="flex-1 py-2 text-stone-600 font-bold bg-stone-100 rounded-lg hover:bg-stone-200"
                    >
                        取消
                    </button>
                    <button 
                        onClick={checkPasswordAndEnterAdmin}
                        className="flex-1 py-2 text-white font-bold bg-red-600 rounded-lg hover:bg-red-700 shadow-md"
                    >
                        确认
                    </button>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};

export default App;
