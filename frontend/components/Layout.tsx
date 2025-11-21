import React, { useState } from 'react';
import { LayoutDashboard, ListTodo, ClipboardList, BrainCircuit, User, Timer, ChevronLeft, BookOpen, Settings, Menu, ChevronsLeft, ChevronsRight } from 'lucide-react';

interface LayoutProps {
  children: React.ReactNode;
  currentTab: string;
  setTab: (tab: string) => void;
}

export const Layout: React.FC<LayoutProps> = ({ children, currentTab, setTab }) => {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'tasks', label: 'Task Manager', icon: ListTodo },
    { id: 'pomodoro', label: 'Focus Timer', icon: Timer },
    { id: 'routine', label: 'Routine Logger', icon: ClipboardList },
    { id: 'ai', label: 'AI Insights', icon: BrainCircuit },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  return (
    <div className="h-screen overflow-hidden bg-slate-50/50 dark:bg-slate-900 flex flex-col md:flex-row font-sans text-slate-900 dark:text-slate-100 transition-colors duration-300">
      
      {/* Mobile Header */}
      <div className="md:hidden bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-4 flex items-center justify-between sticky top-0 z-30 flex-shrink-0">
         <div className="flex items-center gap-3">
            <div className="bg-[var(--primary-600)] text-white p-1.5 rounded-lg shadow-sm">
              <BookOpen size={20} strokeWidth={3} />
            </div>
            <span className="font-bold text-lg text-slate-800 dark:text-white">StudentFlow</span>
         </div>
         <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} className="p-2 text-slate-600 dark:text-slate-300">
            <Menu size={24} />
         </button>
      </div>

      {/* Sidebar */}
      <aside 
        className={`
            fixed inset-y-0 left-0 z-40 bg-white dark:bg-slate-800 border-r border-slate-200/60 dark:border-slate-700/60 shadow-xl md:shadow-none
            transform transition-transform duration-300 ease-in-out
            ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} 
            md:relative md:translate-x-0 
            flex flex-col
            ${isCollapsed ? 'md:w-20' : 'md:w-72'} 
            w-64
        `}
      >
        <div className={`p-6 h-20 hidden md:flex items-center ${isCollapsed ? 'justify-center' : 'justify-between'}`}>
          {!isCollapsed ? (
            <div className="flex items-center gap-3 animate-fade-in">
              <div className="bg-[var(--primary-600)] text-white p-1.5 rounded-lg shadow-lg shadow-[var(--primary-200)]">
                <BookOpen size={20} strokeWidth={3} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-slate-800 dark:text-white tracking-tight leading-none">
                  StudentFlow
                </h1>
                <p className="text-[10px] font-bold text-[var(--primary-600)] tracking-wider uppercase mt-1">AI Productivity</p>
              </div>
            </div>
          ) : (
             <div className="bg-[var(--primary-600)] text-white p-2 rounded-xl shadow-lg">
                <BookOpen size={24} strokeWidth={2.5} />
              </div>
          )}
        </div>

        {/* Close button for mobile */}
        <div className="md:hidden p-4 flex justify-end">
            <button onClick={() => setMobileMenuOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <ChevronLeft size={24} />
            </button>
        </div>

        <nav className="p-4 space-y-1.5 flex-1 overflow-y-auto custom-scrollbar">
          <div className={!isCollapsed ? "px-4 mb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider" : "hidden"}>
            Menu
          </div>
          {navItems.map(item => {
            const Icon = item.icon;
            const active = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                    setTab(item.id);
                    setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative ${
                  active 
                    ? 'bg-[var(--primary-50)] dark:bg-[var(--primary-600)]/20 text-[var(--primary-700)] dark:text-[var(--primary-200)] font-semibold shadow-sm' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200'
                }`}
                title={isCollapsed ? item.label : ''}
              >
                <Icon 
                  size={22} 
                  strokeWidth={active ? 2.5 : 2}
                  className={`transition-colors ${active ? 'text-[var(--primary-600)] dark:text-[var(--primary-400)]' : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'}`} 
                />
                
                {(!isCollapsed || mobileMenuOpen) && <span className="tracking-tight">{item.label}</span>}
                
                {/* Active Indicator Strip */}
                {active && !isCollapsed && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[var(--primary-600)] rounded-r-full"></div>
                )}

                {/* Tooltip for collapsed state (Desktop Only) */}
                {isCollapsed && (
                  <div className="hidden md:block absolute left-16 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all shadow-xl translate-x-2 group-hover:translate-x-0">
                    {item.label}
                  </div>
                )}
              </button>
            );
          })}

          <div className="my-2 border-t border-slate-100 dark:border-slate-700/50 mx-2 hidden md:block"></div>

          <button
            onClick={toggleSidebar}
            className={`hidden md:flex w-full items-center ${isCollapsed ? 'justify-center' : 'justify-start'} gap-3.5 px-4 py-3.5 rounded-xl transition-all duration-200 group relative text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-900 dark:hover:text-slate-200`}
            title={isCollapsed ? "Expand" : "Collapse"}
          >
            {isCollapsed ? <ChevronsRight size={22} strokeWidth={2} /> : <ChevronsLeft size={22} strokeWidth={2} />}
            
            {!isCollapsed && <span className="tracking-tight">Collapse</span>}

            {isCollapsed && (
                <div className="hidden md:block absolute left-16 ml-2 px-3 py-1.5 bg-slate-800 text-white text-xs font-medium rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-all shadow-xl translate-x-2 group-hover:translate-x-0">
                {isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
                </div>
            )}
          </button>
        </nav>
      </aside>

      {/* Overlay for mobile sidebar */}
      {mobileMenuOpen && (
        <div 
            className="fixed inset-0 bg-black/50 z-30 md:hidden backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
        ></div>
      )}

      {/* Main Content */}
      <main className={`flex-1 p-4 md:p-10 overflow-y-auto transition-all duration-300 ${isCollapsed ? '' : ''}`}>
        <div className="max-w-6xl mx-auto pb-20">
           {children}
        </div>
      </main>
    </div>
  );
};