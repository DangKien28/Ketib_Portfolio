document.addEventListener('DOMContentLoaded', () => {
    const contentArea = document.getElementById('admin-main-content');
    
    window.loadAdminPage = async function(pageName, pushHistory = true) {
        if (pushHistory) {
            window.history.pushState({ page: pageName }, '', '?page=' + pageName);
        }

        try {
            // Start exit transition
            contentArea.classList.remove('opacity-100', 'translate-y-0');
            contentArea.classList.add('opacity-0', 'translate-y-4');
            
            await new Promise(r => setTimeout(r, 200)); // wait for fade out
            
            let htmlData = "";
            try {
                // If running locally (file://), this API will fail due to CORS
                const response = await fetch(`pages/admin/${pageName}.html`);
                if (response.ok) {
                    htmlData = await response.text();
                } else {
                    htmlData = `<div class="p-8 text-center text-error"><h2 class="text-2xl font-bold text-red-400">404 - Page Not Found</h2><p>The page ${pageName} could not be loaded.</p></div>`;
                }
            } catch (e) {
                // local file error handling
                htmlData = `<div class="p-8 text-center"><h2 class="text-2xl font-bold text-red-400">Fetch Error</h2><p>Could not fetch ${pageName}.html. Are you running a local server?</p></div>`;
            }
            
            contentArea.innerHTML = htmlData;
            
            document.querySelectorAll('.admin-sidebar-link').forEach(link => {
                link.classList.remove('bg-blue-500/10', 'text-blue-400', 'border-r-2', 'border-blue-500');
                if(link.dataset.page === pageName) {
                    link.classList.add('bg-blue-500/10', 'text-blue-400', 'border-r-2', 'border-blue-500');
                    link.classList.remove('text-gray-500');
                } else {
                    link.classList.add('text-gray-500');
                }
            });
            
            // Allow DOM to process innerHTML before transitioning back
            requestAnimationFrame(() => {
                contentArea.classList.remove('opacity-0', 'translate-y-4');
                contentArea.classList.add('opacity-100', 'translate-y-0');
            });
            
        } catch (error) {
            console.error('Error loading page:', error);
            contentArea.innerHTML = `<div class="p-8 text-center text-red-500"><h2 class="text-2xl font-bold">Error</h2><p>Could not load ${pageName}.</p></div>`;
            contentArea.classList.remove('opacity-0', 'translate-y-4');
            contentArea.classList.add('opacity-100', 'translate-y-0');
        }
    };

    // Handle back/forward navigation in the browser history
    window.addEventListener('popstate', (event) => {
        if (event.state && event.state.page) {
            loadAdminPage(event.state.page, false);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const page = urlParams.get('page') || 'overview';
            loadAdminPage(page, false);
        }
    });

    // Load initial page based on URL or default
    const urlParams = new URLSearchParams(window.location.search);
    const initialPage = urlParams.get('page') || 'overview';
    loadAdminPage(initialPage, false);
});