document.addEventListener('DOMContentLoaded', function() {
    lucide.createIcons();
    const sidebar = document.querySelector('.sidebar');
    const collapseBtn = document.querySelector('.collapse-btn');
    const sidebarTrigger = document.querySelector('.sidebar-trigger');
    const overlay = document.querySelector('.sidebar-overlay');
    const submenuButtons = document.querySelectorAll('.sidebar-menu-button.has-submenu');
    const sidebarRail = document.querySelector('.sidebar-rail');
    const navLinks = document.querySelectorAll('.sidebar-menu-button:not(.has-submenu), .sidebar-menu-sub-button');
    const contentContainer = document.getElementById('content-container');
    const SIDEBAR_STATE_KEY = 'sidebar-state';
    const SUBMENU_STATE_KEY = 'submenu-states';
    let currentPath = ''; // Para evitar recargas repetitivas
    function initSidebar() {
        const sidebarState = localStorage.getItem(SIDEBAR_STATE_KEY);
        if (sidebarState === 'collapsed' && window.innerWidth >= 768) {
            sidebar.setAttribute('data-state', 'collapsed');
        }
        const submenuStates = JSON.parse(localStorage.getItem(SUBMENU_STATE_KEY) || '{}');
        submenuButtons.forEach(button => {
            const menuText = button.querySelector('span').textContent.trim();
            button.setAttribute('aria-expanded', submenuStates[menuText] ? 'true' : 'false');
        });
        navLinks.forEach(button => {
            if (button.querySelector('span')) {
                button.setAttribute('data-tooltip', button.querySelector('span').textContent.trim());
            }
        });
    }
    function toggleSidebar() {
        const isMobile = window.innerWidth < 768;
        if (isMobile) {
            sidebar.classList.toggle('mobile-open');
            overlay.classList.toggle('active');
        } else {
            const isCollapsed = sidebar.getAttribute('data-state') === 'collapsed';
            sidebar.setAttribute('data-state', isCollapsed ? 'expanded' : 'collapsed');
            localStorage.setItem(SIDEBAR_STATE_KEY, isCollapsed ? 'expanded' : 'collapsed');
        }
    }
    function toggleSubmenu(button) {
        const isExpanded = button.getAttribute('aria-expanded') === 'true';
        button.setAttribute('aria-expanded', !isExpanded);
        const submenuStates = JSON.parse(localStorage.getItem(SUBMENU_STATE_KEY) || '{}');
        const menuText = button.querySelector('span').textContent.trim();
        submenuStates[menuText] = !isExpanded;
        localStorage.setItem(SUBMENU_STATE_KEY, JSON.stringify(submenuStates));
    }
    function setActiveLink(link) {
        navLinks.forEach(navLink => navLink.classList.remove('active'));
        link.classList.add('active');
        if (link.classList.contains('sidebar-menu-sub-button')) {
            const parentItem = link.closest('.sidebar-menu-item');
            const parentButton = parentItem.querySelector('.sidebar-menu-button');
            parentButton.setAttribute('aria-expanded', 'true');
        }
    }
    function loadContent(url) {
        if (!url || url === '#' || url === currentPath) return; // Evitar recarga si ya está cargado
        console.log(`Intentando cargar la ruta relativa: ${url}`);
        contentContainer.innerHTML = '<div class="loading-indicator"><div class="spinner"></div><p>Cargando...</p></div>';
        const iframe = document.createElement('iframe');
        iframe.src = url;
        // Agregar el iframe al DOM inmediatamente
        contentContainer.innerHTML = ''; // Limpiar el contenedor primero
        contentContainer.appendChild(iframe);
        iframe.onload = function() {
            console.log(`Cargado exitosamente: ${url}`);
            currentPath = url; // Actualizar la ruta actual
            try {
                const iframeTitle = iframe.contentDocument.title;
                document.title = iframeTitle || getFallbackTitle(url);
            } catch (e) {
                console.error('Error al acceder al título:', e);
                document.title = getFallbackTitle(url);
            }
        };
        iframe.onerror = function() {
            console.error(`Error al cargar: ${url}`);
            showErrorMessage(url); // Mostrar mensaje con botón amarillo
        };
    }
    function getFallbackTitle(url) {
        const pageName = url.split('/').pop().replace('.html', '');
        return pageName.charAt(0).toUpperCase() + pageName.slice(1) + ' - Software Evolution';
    }
    function showErrorMessage(url) {
        contentContainer.innerHTML = `
            <div class="error-message">
                <h3>Error al cargar el contenido</h3>
                <p>No se pudo cargar la página: ${url}</p>
                <button class="retry-button" onclick="window.loadContent('${url}')">Reintentar</button>
            </div>
        `;
    }
    function initResizableSidebar() {
        let isResizing = false;
        let startX, startWidth;
        sidebarRail.addEventListener('mousedown', function(e) {
            isResizing = true;
            startX = e.clientX;
            startWidth = parseInt(getComputedStyle(sidebar).width, 10);
            document.documentElement.style.cursor = 'ew-resize';
            e.preventDefault();
        });
        document.addEventListener('mousemove', function(e) {
            if (!isResizing) return;
            const width = startWidth + (e.clientX - startX);
            if (width >= 200 && width <= 400) {
                sidebar.style.width = `${width}px`;
                document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
                document.querySelector('.content').style.marginLeft = `${width}px`;
            }
        });
        document.addEventListener('mouseup', function() {
            if (isResizing) {
                isResizing = false;
                document.documentElement.style.cursor = '';
            }
        });
    }
    collapseBtn.addEventListener('click', toggleSidebar);
    sidebarTrigger.addEventListener('click', toggleSidebar);
    overlay.addEventListener('click', toggleSidebar);
    submenuButtons.forEach(button => {
        button.addEventListener('click', () => toggleSubmenu(button));
    });
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault(); // Prevenir comportamiento por defecto
            const url = link.getAttribute('href');
            if (url && !link.classList.contains('has-submenu')) {
                setActiveLink(link);
                loadContent(url);
                if (window.innerWidth < 768) {
                    sidebar.classList.remove('mobile-open');
                    overlay.classList.remove('active');
                }
            }
        });
    });
    initSidebar();
    initResizableSidebar();
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 768) {
            sidebar.classList.remove('mobile-open');
            overlay.classList.remove('active');
        }
    });
    // Carga inicial - solo si no hay contenido estático
    if (contentContainer.children.length === 0) {
        const defaultLink = Array.from(navLinks).find(link => link.classList.contains('active'));
        if (defaultLink) {
            const url = defaultLink.getAttribute('href');
            setActiveLink(defaultLink);
            loadContent(url);
        }
    }
    window.loadContent = loadContent;
});