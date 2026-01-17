import React from "react";
import { MessageSquare, Image, Menu, X, Sun, Moon, User, PlusCircle } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, mode, setMode, theme, toggleTheme, onNewChat }) => {
    const menuItems = [
        { id: "chat", icon: <MessageSquare size={18} />, label: "Conversation" },
        { id: "image", icon: <Image size={18} />, label: "Génération Studio" },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/20 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-all duration-500 ease-[cubic-bezier(0.4, 0, 0.2, 1)] z-50 transform 
          ${isOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full p-6">
                    {/* Header Branding */}
                    <div className="flex items-center gap-3 mb-8 px-2 mt-2">
                        <div className="relative group">
                            <div className="absolute -inset-1 bg-gradient-to-tr from-[var(--accent-blue)] to-blue-600 rounded-xl blur opacity-25 group-hover:opacity-50 transition duration-1000"></div>
                            <img
                                src="/logo.jpg"
                                alt="Logo"
                                className="relative w-10 h-10 rounded-xl object-cover border border-white/10"
                            />
                        </div>
                        <div>
                            <h1 className="text-xl font-black font-montserrat tracking-tighter text-[var(--text-main)]">
                                Cortex IA
                            </h1>
                            <p className="text-[9px] text-[var(--text-secondary)] uppercase tracking-[0.3em] font-bold">Quantum v1.2</p>
                        </div>
                        <button onClick={toggleSidebar} className="ml-auto p-2 lg:hidden text-[var(--text-secondary)]">
                            <X size={20} />
                        </button>
                    </div>

                    {/* New Chat Button */}
                    <button
                        onClick={() => {
                            onNewChat();
                            if (window.innerWidth < 1024) toggleSidebar();
                        }}
                        className="flex items-center gap-3 w-full px-5 py-3.5 mb-8 rounded-2xl border-2 border-[var(--accent-blue)]/30 text-[var(--accent-blue)] font-bold hover:bg-[var(--accent-soft)] transition-all duration-300 group shadow-lg shadow-[#00E5FF]/5"
                    >
                        <PlusCircle size={20} className="group-hover:rotate-90 transition-transform duration-500" />
                        <span className="text-sm">Nouvelle Discussion</span>
                    </button>

                    {/* Navigation */}
                    <nav className="flex-1 space-y-2">
                        <p className="px-4 text-[10px] font-bold text-[var(--text-secondary)] uppercase tracking-[0.2em] mb-4 opacity-50">Exploration</p>
                        {menuItems.map((item) => {
                            const isActive = mode === item.id;
                            return (
                                <button
                                    key={item.id}
                                    onClick={() => {
                                        setMode(item.id);
                                        if (window.innerWidth < 1024) toggleSidebar();
                                    }}
                                    className={`w-full flex items-center gap-4 px-5 py-3.5 rounded-2xl transition-all duration-300 group relative overflow-hidden
                    ${isActive
                                            ? "text-[var(--accent-blue)] font-bold bg-[var(--accent-soft)]"
                                            : "text-[var(--text-secondary)] hover:bg-slate-200/50 dark:hover:bg-slate-800/50 hover:text-[var(--text-main)]"}`}
                                >
                                    {isActive && (
                                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-[var(--accent-blue)] rounded-r-full shadow-[0_0_12px_rgba(0,229,255,0.5)]" />
                                    )}
                                    <span className={`${isActive ? "text-[var(--accent-blue)]" : "group-hover:scale-110 transition-transform"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="text-sm tracking-tight">{item.label}</span>
                                </button>
                            );
                        })}
                    </nav>

                    {/* Footer Sidebar */}
                    <div className="mt-auto pt-6 border-t border-[var(--border-color)] space-y-6">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-5 py-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800/50 text-[var(--text-main)] transition-all hover:bg-slate-200 dark:hover:bg-slate-800 group"
                        >
                            <div className="flex items-center gap-3">
                                {theme === "light" ? <Moon size={16} className="text-slate-500" /> : <Sun size={16} className="text-yellow-400 animate-pulse" />}
                                <span className="text-xs font-bold tracking-tight">{theme === "light" ? "Mode Sombre" : "Mode Clair"}</span>
                            </div>
                            <div className={`w-8 h-4 rounded-full relative transition-colors ${theme === "dark" ? "bg-blue-600" : "bg-slate-300"}`}>
                                <div className={`absolute top-1 w-2 h-2 rounded-full bg-white transition-all ${theme === "dark" ? "right-1" : "left-1"}`} />
                            </div>
                        </button>

                        <div className="flex items-center gap-3 px-2">
                            <div className="w-10 h-10 rounded-full bg-[var(--accent-soft)] flex items-center justify-center border border-[var(--accent-blue)]/20 shadow-inner">
                                <User size={18} className="text-[var(--accent-blue)]" />
                            </div>
                            <div className="min-w-0">
                                <p className="text-xs font-black text-[var(--text-main)] truncate">Expert Senior</p>
                                <p className="text-[10px] text-[var(--text-secondary)] font-bold">Lead Designer</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
