class NavDropdowns extends HTMLElement {
    constructor() {
        super();
    }

    connectedCallback() {
        this.innerHTML = `
        <div class="flex items-center justify-end gap-2 border-outline-variant/20 mx-2 relative">
            <!-- Notifications Dropdown -->
            <div class="relative">
                <button onclick="toggleDropdown('dropdown-notifications', event)" class="dropdown-trigger p-2 text-on-surface-variant hover:bg-neutral-800/50 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm active:scale-95 duration-200 transition-all relative">
                    <span class="material-symbols-outlined" data-icon="notifications">notifications</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm border border-black hidden"></span>
                </button>
                <div id="dropdown-notifications" class="dropdown-menu absolute top-full right-0 mt-2 w-80 glass-panel border-r-blue-400 border-b-blue-400 border-r border-b border border-blue-500/20 rounded-sm opacity-0 invisible transform scale-95 translate-y-2 transition-all duration-200 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[70] overflow-hidden">
                    <div class="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-black/40">
                        <h4 class="font-bold font-headline text-sm tracking-widest text-neutral-200">Notifications</h4>
                        <span class="text-xs text-primary cursor-pointer hover:underline font-medium">Mark all read</span>
                    </div>
                    <div class="max-h-80 overflow-y-auto custom-scrollbar bg-surface-container-highest/50">
                        <div class="p-4 border-b border-outline-variant/10 hover:bg-white/5 cursor-pointer transition-colors flex gap-4">
                            <div class="w-10 h-10 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm bg-primary/20 flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-primary text-[20px]">rocket_launch</span>
                            </div>
                            <div>
                                <p class="text-sm text-neutral-200 font-medium mb-1">Portfolio v2 deployed</p>
                                <p class="text-xs text-neutral-400">Deployed successfully to production environment.</p>
                                <p class="text-[10px] text-neutral-500 mt-2 font-mono">2 hours ago</p>
                            </div>
                        </div>
                        <div class="p-4 hover:bg-white/5 cursor-pointer transition-colors flex gap-4 opacity-70">
                            <div class="w-10 h-10 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm bg-tertiary/20 flex items-center justify-center shrink-0">
                                <span class="material-symbols-outlined text-tertiary text-[20px]">smart_toy</span>
                            </div>
                            <div>
                                <p class="text-sm text-neutral-200 font-medium mb-1">Ketib-AI models updated</p>
                                <p class="text-xs text-neutral-400">New training weights applied for architectural responses.</p>
                                <p class="text-[10px] text-neutral-500 mt-2 font-mono">1 day ago</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 text-center border-t border-outline-variant/20 bg-black/40 cursor-pointer hover:bg-white/10 transition-colors">
                        <span class="text-xs font-semibold text-primary">View All Notifications</span>
                    </div>
                </div>
            </div>

            <!-- Messages Dropdown -->
            <div class="relative">
                <button onclick="toggleDropdown('dropdown-messages', event)" class="dropdown-trigger p-2 text-on-surface-variant hover:bg-neutral-800/50 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm active:scale-95 duration-200 transition-all relative">
                    <span class="material-symbols-outlined" data-icon="mail">mail</span>
                    <span class="absolute top-2 right-2 w-2 h-2 bg-tertiary rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm shadow-[0_0_8px_rgba(250,176,255,0.8)]"></span>
                </button>
                <div id="dropdown-messages" class="dropdown-menu absolute top-full right-0 mt-2 w-80 glass-panel border-r-blue-400 border-b-blue-400 border-r border-b border border-blue-500/20 rounded-sm opacity-0 invisible transform scale-95 translate-y-2 transition-all duration-200 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[70] overflow-hidden">
                    <div class="p-4 border-b border-outline-variant/20 flex justify-between items-center bg-black/40">
                        <h4 class="font-bold font-headline text-sm tracking-widest text-neutral-200">Messages</h4>
                        <button class="text-on-surface-variant hover:text-white transition-colors w-6 h-6 flex items-center justify-center hover:bg-white/10 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm"><span class="material-symbols-outlined text-[16px]">edit_square</span></button>
                    </div>
                    <div class="max-h-80 overflow-y-auto custom-scrollbar bg-surface-container-highest/50">
                        <div onclick="openChat('tkien')" class="p-4 border-b border-outline-variant/10 hover:bg-white/5 cursor-pointer transition-colors flex gap-3">
                            <div class="w-12 h-12 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm primary-gradient flex items-center justify-center shrink-0 shadow-lg relative">
                                <span class="material-symbols-outlined text-on-primary-fixed text-[24px]">person</span>
                                <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#262626] rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm"></span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-sm font-semibold text-neutral-100">TKien</p>
                                    <p class="text-xs text-primary font-bold px-1.5 py-0.5 bg-primary/10 rounded-sm">New</p>
                                </div>
                                <p class="text-xs text-neutral-400 truncate">Hey, let's discuss the architecture of the new gateway!</p>
                            </div>
                        </div>
                        <div onclick="openChat('ai')" class="p-4 hover:bg-white/5 cursor-pointer transition-colors flex gap-3">
                            <div class="w-12 h-12 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm bg-gradient-to-br from-tertiary to-pink-500 flex items-center justify-center shrink-0 shadow-lg relative">
                                <span class="material-symbols-outlined text-black text-[24px]">smart_toy</span>
                                <span class="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#262626] rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm"></span>
                            </div>
                            <div class="flex-1 min-w-0">
                                <div class="flex justify-between items-center mb-1">
                                    <p class="text-sm font-semibold text-neutral-200">Ketib-AI</p>
                                    <p class="text-[10px] text-neutral-500 font-mono">Yesterday</p>
                                </div>
                                <p class="text-xs text-neutral-400 truncate">I've analyzed your database requests. Check out the results.</p>
                            </div>
                        </div>
                    </div>
                    <div class="p-3 text-center border-t border-outline-variant/20 bg-black/40 cursor-pointer hover:bg-white/10 transition-colors">
                        <span class="text-xs font-semibold text-tertiary">Open Inbox</span>
                    </div>
                </div>
            </div>

            <!-- Profile Dropdown -->
            <div class="relative">
                <button onclick="toggleDropdown('dropdown-profile', event)" class="dropdown-trigger p-1 ml-2 text-on-surface-variant hover:bg-neutral-800/50 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm active:scale-95 duration-200 transition-all border border-transparent hover:border-blue-500/20">
                    <div class="w-8 h-8 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-sm shadow-inner cursor-pointer relative">
                        K
                        <div class="absolute inset-0 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm ring-1 ring-inset ring-white/20"></div>
                    </div>
                </button>
                <div id="dropdown-profile" class="dropdown-menu absolute top-full right-0 mt-2 w-64 glass-panel border-r-blue-400 border-b-blue-400 border-r border-b bg-/95 border border-blue-500/20 rounded-sm opacity-0 invisible transform scale-95 translate-y-2 transition-all duration-200 shadow-[0_20px_40px_rgba(0,0,0,0.5)] z-[70] overflow-hidden">
                    <div class="px-5 py-4 border-b border-outline-variant/20 bg-black/40 flex items-center gap-3">
                        <div class="w-10 h-10 rounded-bl-xl rounded-tr-xl rounded-tl-sm rounded-br-sm bg-gradient-to-tr from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold text-lg shadow-inner">
                            K
                        </div>
                        <div>
                            <p class="text-sm font-bold text-white font-headline">Guest User</p>
                            <p class="text-[11px] text-neutral-400">guest@ketib.io</p>
                        </div>
                    </div>
                    
                    <div class="p-2 flex flex-col gap-1">
                        <a class="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-sm cursor-pointer transition-colors group">
                            <span class="material-symbols-outlined text-[18px] text-neutral-400 group-hover:text-primary transition-colors">person</span> 
                            My Profile
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-sm cursor-pointer transition-colors group">
                            <span class="material-symbols-outlined text-[18px] text-neutral-400 group-hover:text-primary transition-colors">settings</span> 
                            Settings
                        </a>
                        <a class="flex items-center gap-3 px-3 py-2 text-sm text-neutral-300 hover:bg-white/10 hover:text-white rounded-sm cursor-pointer transition-colors group">
                            <span class="material-symbols-outlined text-[18px] text-neutral-400 group-hover:text-primary transition-colors">dark_mode</span> 
                            Appearance
                        </a>
                    </div>
                
                    <div class="p-2 border-t border-outline-variant/20 bg-black/20">
                        <a class="flex items-center gap-3 px-3 py-2 text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 rounded-sm cursor-pointer transition-colors group">
                            <span class="material-symbols-outlined text-[18px] text-red-400/70 group-hover:text-red-400 transition-colors">logout</span> 
                            Sign Out
                        </a>
                    </div>
                </div>
            </div>
        </div>
        `;
    }
}

if (!customElements.get('nav-dropdowns')) {
    customElements.define('nav-dropdowns', NavDropdowns);
}



window.toggleDropdown = window.toggleDropdown || function(id, event) {
    if (event) {
        event.stopPropagation();
    }

    const dropdown = document.getElementById(id);
    const isClosed = dropdown.classList.contains('opacity-0');

    // Đóng tất cả dropdowns trước
    document.querySelectorAll('.dropdown-menu').forEach(menu => {
        menu.classList.add('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
        menu.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0');
    });

    if (isClosed) {
        // Mở dropdown được chọn
        dropdown.classList.remove('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
        dropdown.classList.add('opacity-100', 'visible', 'scale-100', 'translate-y-0');
    }
};

// Đóng dropdown khi click ra ngoài vùng menu
document.addEventListener('click', (e) => {
    if (!e.target.closest('.dropdown-menu') && !e.target.closest('.dropdown-trigger')) {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.classList.add('opacity-0', 'invisible', 'scale-95', 'translate-y-2');
            menu.classList.remove('opacity-100', 'visible', 'scale-100', 'translate-y-0');
        });
    }
});
