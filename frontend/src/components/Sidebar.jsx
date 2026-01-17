import React from "react";
import { MessageSquare, Image, Menu, X, Zap } from "lucide-react";

const Sidebar = ({ isOpen, toggleSidebar, mode, setMode }) => {
    const menuItems = [
        { id: "chat", icon: <MessageSquare size={20} />, label: "💬 Chat" },
        { id: "image", icon: <Image size={20} />, label: "🎨 Images" },
    ];

    return (
        <>
            {/* Mobile Backdrop */}
            {isOpen && (
                <div
                    className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
                    onClick={toggleSidebar}
                />
            )}

            {/* Sidebar Container */}
            <aside
                className={`fixed inset-y-0 left-0 w-72 bg-black border-right border-gray-800 transition-transform duration-300 ease-in-out z-50 transform 
          ${isOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
            >
                <div className="flex flex-col h-full p-4">
                    <div className="flex items-center gap-3 mb-10 px-2 mt-2">
                        <div className="bg-gradient-to-tr from-blue-600 to-cyan-400 p-2 rounded-xl">
                            <Zap size={24} className="text-white fill-white" />
                        </div>
                        <h1 className="text-xl font-bold tracking-tight bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
                            Cortex IA
                        </h1>
                    </div>

                    <nav className="flex-1 space-y-2">
                        {menuItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => {
                                    setMode(item.id);
                                    if (window.innerWidth < 1024) toggleSidebar();
                                }}
                                className={`w-full flex items-center gap-4 px-4 py-3.5 rounded-xl transition-all duration-200 group
                  ${mode === item.id
                                        ? "bg-gray-800 text-white shadow-lg shadow-black/50"
                                        : "text-gray-400 hover:bg-gray-900 hover:text-gray-200"}`}
                            >
                                <span className={`${mode === item.id ? "text-blue-400" : "group-hover:text-gray-300"}`}>
                                    {item.icon}
                                </span>
                                <span className="font-medium">{item.label}</span>
                            </button>
                        ))}
                    </nav>

                    <div className="mt-auto border-t border-gray-800 pt-4 px-2">
                        <div className="bg-gray-900/50 p-4 rounded-2xl border border-gray-800/50">
                            <p className="text-xs text-gray-500 mb-1 uppercase tracking-widest font-bold">Plan</p>
                            <p className="text-sm font-semibold text-gray-200">Ultimate Expert</p>
                        </div>
                    </div>
                </div>
            </aside>
        </>
    );
};

export default Sidebar;
