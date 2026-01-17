import React from "react";
import { MessageSquare, Image, Menu, X, Zap, Sun, Moon } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, mode, setMode, theme, toggleTheme }) => {
    const menuItems = [
        { id: "chat", icon: <MessageSquare size={20} />, label: "💬 Chat" },
        { id: "image", icon: <Image size={20} />, label: "🎨 Images" },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-[var(--bg-sidebar)] border-r border-[var(--border-color)] transition-all duration-300 ease-in-out z-50 transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full p-6">
                    <div className="flex items-center gap-4 mb-12 px-2 mt-2">
                        <img
                            src="/logo.jpg"
                            alt="Cortex Logo"
                            className="w-12 h-12 rounded-2xl object-cover shadow-lg border-2 border-primary-blue"
                        />
                        <div>
                            <h1 className="text-xl font-bold tracking-tight text-[var(--text-main)]">
                                Cortex IA
                            </h1>
                            <p className="text-[10px] text-gray-500 uppercase tracking-widest font-bold">Smart Assistant</p>
                        </div>
                    </div>

                    <nav className="flex-1 space-y-3">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setMode(item.id);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl transition-all duration-200 group
                  ${mode === item.id
                                        ? "bg-blue-500 text-white shadow-xl shadow-blue-500/20"
                                        : "text-gray-500 hover:bg-gray-200 dark:hover:bg-gray-800 hover:text-[var(--text-main)]"}`}
                            >
                                <span className={`${mode === item.id ? "text-white" : "group-hover:text-blue-500"}`}>
                                    {item.icon}
                                </span>
                                <span className="font-semibold">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto space-y-4">
                        <button
                            onClick={toggleTheme}
                            className="w-full flex items-center justify-between px-5 py-4 rounded-2xl bg-gray-200 dark:bg-gray-800 text-[var(--text-main)] transition-all hover:scale-[1.02]"
                        >
                            <span className="text-sm font-semibold">{theme === "light" ? "Mode Sombre" : "Mode Clair"}</span>
                            {theme === "light" ? <Moon size={18} /> : <Sun size={18} />}
                        </button>

                        <div className="bg-gradient-to-br from-primary-blue via-primary-yellow to-primary-pink p-px rounded-2xl">
                            <div className="bg-[var(--bg-sidebar)] p-4 rounded-[15px]">
                                <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Profil</p>
                                <p className="text-sm font-bold text-[var(--text-main)]">Expert Senior</p>
                            </div>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
