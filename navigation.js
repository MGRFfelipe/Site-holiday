// Shared navigation script (menu only)
document.addEventListener('DOMContentLoaded', () => {
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.querySelector('.nav-links');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
        });
    }

    const navItems = document.querySelectorAll('.nav-link');
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            if (navLinks) navLinks.classList.remove('active');
        });
    });

    document.addEventListener('click', (e) => {
        if (navLinks && !e.target.closest('.navbar')) {
            navLinks.classList.remove('active');
        }
    });

    function toDataUri(svg) {
        return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
    }

    function svgBase(label = 'IMG') {
        return toDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 160 100">
                <defs>
                    <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#1f1b3f"/>
                        <stop offset="100%" stop-color="#3d2f7a"/>
                    </linearGradient>
                </defs>
                <rect width="160" height="100" rx="10" fill="url(#g)"/>
                <text x="80" y="58" text-anchor="middle" font-size="16" fill="#80e9ff" font-family="Arial, sans-serif">${label}</text>
            </svg>`
        );
    }

    function svgIcon(glyph = '?') {
        return toDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <rect x="1" y="1" width="30" height="30" rx="8" fill="#1f1b3f" stroke="#ec4899" stroke-width="2"/>
                <text x="16" y="21" text-anchor="middle" font-size="14" fill="#80e9ff" font-family="Arial, sans-serif">${glyph}</text>
            </svg>`
        );
    }

    function svgAvatar() {
        return toDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120">
                <defs>
                    <linearGradient id="a" x1="0" y1="0" x2="1" y2="1">
                        <stop offset="0%" stop-color="#1f1b3f"/>
                        <stop offset="100%" stop-color="#3d2f7a"/>
                    </linearGradient>
                </defs>
                <circle cx="60" cy="60" r="58" fill="url(#a)" stroke="#ec4899" stroke-width="4"/>
                <circle cx="60" cy="45" r="18" fill="#80e9ff" fill-opacity="0.85"/>
                <rect x="28" y="68" width="64" height="30" rx="15" fill="#80e9ff" fill-opacity="0.85"/>
            </svg>`
        );
    }

    function svgUpload() {
        return toDataUri(
            `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
                <rect x="1" y="1" width="30" height="30" rx="8" fill="#1f1b3f" stroke="#ec4899" stroke-width="2"/>
                <path d="M16 8l-6 6h4v7h4v-7h4z" fill="#80e9ff"/>
            </svg>`
        );
    }

    function resolveFallbackSource(img) {
        const alt = String(img.alt || '').toLowerCase();

        if (img.classList.contains('navbar-icon')) {
            if (alt.includes('whatsapp')) return svgIcon('W');
            if (alt.includes('discord')) return svgIcon('D');
            if (alt.includes('notifica')) return svgIcon('N');
            if (alt.includes('login')) return svgIcon('L');
            return svgIcon('I');
        }

        if (img.classList.contains('banner-img')) {
            return svgBase(String(img.alt || 'CARD').slice(0, 10).toUpperCase());
        }

        if (
            img.classList.contains('user-avatar') ||
            img.classList.contains('profile-avatar') ||
            alt.includes('avatar')
        ) {
            return svgAvatar();
        }

        if (img.classList.contains('upload-btn-icon')) {
            return svgUpload();
        }

        if (alt.includes('verificado')) {
            return svgIcon('V');
        }

        return svgBase('IMG');
    }

    function applyImageFallback(img) {
        if (!(img instanceof HTMLImageElement)) return;
        if (img.dataset.fallbackApplied === '1') return;
        img.dataset.fallbackApplied = '1';
        img.src = resolveFallbackSource(img);
    }

    function scanBrokenImages() {
        document.querySelectorAll('img').forEach((img) => {
            if (img.dataset.fallbackApplied === '1') return;
            // Complete + largura zero normalmente indica erro de carregamento.
            if (img.complete && (!img.naturalWidth || img.naturalWidth < 1)) {
                applyImageFallback(img);
            }
        });
    }

    document.addEventListener(
        'error',
        (event) => {
            const target = event.target;
            if (target instanceof HTMLImageElement) {
                applyImageFallback(target);
            }
        },
        true
    );

    // Primeira varredura imediata
    scanBrokenImages();

    // Segunda varredura quando tudo da pagina terminar de carregar
    window.addEventListener('load', () => {
        scanBrokenImages();
    });

    // Varreduras extras para casos de 404 que chegam depois do DOMContentLoaded
    let retries = 0;
    const maxRetries = 8;
    const timer = setInterval(() => {
        retries += 1;
        scanBrokenImages();
        if (retries >= maxRetries) {
            clearInterval(timer);
        }
    }, 1200);
});
