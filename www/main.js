// ==========================================
// 3. CONTROLLER & RENDERER UTAMA
// ==========================================
let currentCategoryType = 'all';
let currentPage = 1;
let currentArticleData = null; 
let filterD = '';
let filterM = '';
let filterY = '';

// --- 1. FUNGSI MENU & FOOTER ---
async function loadMenu() {
    const menuSlot = document.getElementById('Ngapp_SidebarMenu');
    let baseHtml = ``;
    
    const menuData = await fetchNgapp(Ngapp_API.menu('header')); 
    
    if (menuData && menuData.length > 0) {
        menuData.forEach(item => {
            const title = item.menu_label;
            const link = item.menu_link; 
            let icon = '<i class="fa-solid fa-thumbtack"></i>'; 

            if(link === '/') icon = '<i class="fa-solid fa-house"></i>';
            else if(title.toLowerCase().includes('ekonomi') || title.toLowerCase().includes('bisnis')) icon = '<i class="fa-solid fa-briefcase"></i>';
            else if(title.toLowerCase().includes('olahraga')) icon = '<i class="fa-solid fa-futbol"></i>';
            else if(title.toLowerCase().includes('teknologi')) icon = '<i class="fa-solid fa-laptop-code"></i>';
            else if(title.toLowerCase().includes('kesehatan')) icon = '<i class="fa-solid fa-staff-snake"></i>';
            else if(title.toLowerCase().includes('hukum') || title.toLowerCase().includes('kriminal')) icon = '<i class="fa-solid fa-scale-balanced"></i>';
            else if(title.toLowerCase().includes('politik')) icon = '<i class="fa-solid fa-building-columns"></i>';

            baseHtml += `<li onclick="loadCategory('${link}', '${title}')"><span class="menu-icon">${icon}</span> ${title}</li>`;
        });
    }

    // --- PERBAIKAN DI SINI: INDEKS BERITA PAKAI 'indeks-berita' BUKAN '/' ---
    baseHtml += `
        <li class="sidebar-divider">Eksplorasi</li>
        
        <li onclick="loadCategory('indeks-berita', 'Indeks Berita')"><span class="menu-icon"><i class="fa-solid fa-list-ul"></i></span> Indeks Berita</li>
        <li onclick="loadCategory('populer', 'Populer')"><span class="menu-icon"><i class="fa-solid fa-fire" style="color:#e74c3c;"></i></span> Populer</li>
        
        <li onclick="loadCategory('foto', 'Indeks Foto')"><span class="menu-icon"><i class="fa-solid fa-camera"></i></span> Indeks Foto</li>
        <li onclick="loadCategory('pilihan', 'Editorial')"><span class="menu-icon"><i class="fa-solid fa-star" style="color:#f1c40f;"></i></span> Editorial</li>
        
        <li onclick="loadCategory('video', 'Indeks Video')"><span class="menu-icon"><i class="fa-solid fa-video"></i></span> Indeks Video</li>
        <li onclick="loadBookmarks()"><span class="menu-icon"><i class="fa-solid fa-bookmark" style="color:var(--primary);"></i></span> Bookmark</li>
    `;

    menuSlot.innerHTML = baseHtml;

    let footerLinksHtml = '';
    const footerData = await fetchNgapp(Ngapp_API.menu('footer'));
    
    if (footerData && footerData.length > 0) {
        const links = footerData.map(item => `<span onclick="openPage('${item.menu_link}', '${item.menu_label}')">${item.menu_label}</span>`);
        footerLinksHtml = links.join(' &bull; ');
    } else {
        footerLinksHtml = `<span onclick="openPage('redaksi', 'Redaksi')">Redaksi</span> &bull; <span onclick="openPage('pedoman-siber', 'Pedoman Siber')">Pedoman Siber</span> &bull; <span onclick="openPage('pedoman-ai', 'Pedoman AI')">Pedoman AI</span> &bull; <span onclick="openPage('disclaimer', 'Disclaimer')">Disclaimer</span>`;
    }

    const footerSlot = document.getElementById('Ngapp_SidebarFooter');
    if (footerSlot) {
        footerSlot.innerHTML = `
            <div class="footer-menu-links">${footerLinksHtml}</div>
            <div class="footer-info-text">
                <div class="f-logo">Banten88</div>
                Gedung Redaksi Banten88<br>
                Jl. Sudirman No. 88, Banten, Indonesia<br>
                <div style="margin-top: 10px; color: #aaa;">&copy; 2026 Banten88.com - All Rights Reserved</div>
            </div>
        `;
    }
}

// --- FUNGSI BUKA HALAMAN STATIS (PAGE) ---
async function openPage(rawSlug, fallbackTitle = 'Halaman') {
    uiCloseMenu(); 
    uiSwitchToDetail(); 
    currentArticleData = null; 
    
    document.getElementById('Ngapp_HeaderActionsRead').style.display = 'none';

    const slot = document.getElementById('Ngapp_DetailSlot');
    slot.innerHTML = '<div class="loader"><div class="spinner"></div><span>Menyiapkan halaman...</span></div>';

    let cleanSlug = rawSlug;
    if (cleanSlug.includes('/')) {
        const parts = cleanSlug.split('/');
        cleanSlug = parts[parts.length - 1] || parts[parts.length - 2]; 
    }

    try {
        const targetUrl = Ngapp_API.page(cleanSlug);
        const data = await fetchNgapp(targetUrl);
        
        let pageData = null;
        if (Array.isArray(data) && data.length > 0) {
            pageData = data[0];
        } else if (data && typeof data === 'object' && Object.keys(data).length > 0) {
            pageData = data;
        }

        if(pageData && pageData.page_title) {
            const title = pageData.page_title || fallbackTitle;
            const content = pageData.page_content || '';

            slot.innerHTML = `
                <div class="detail-body" style="padding-top: 24px;">
                    <h1 class="detail-title">${title}</h1>
                    <div class="detail-content">${content}</div>
                </div>
            `;
        } else {
            slot.innerHTML = '<div class="loader"><span>Halaman tidak ditemukan atau isi kosong.</span></div>';
        }
    } catch (err) {
        slot.innerHTML = '<div class="loader"><span>Gagal memuat halaman. Cek koneksi API.</span></div>';
    }
    window.scrollTo(0,0);
}

// --- 2. FUNGSI BOOKMARK ---
function loadBookmarks() {
    uiCloseMenu();
    currentCategoryType = 'bookmarks'; 
    
    document.getElementById('Ngapp_ListTitle').innerText = 'Artikel Tersimpan';
    document.getElementById('Ngapp_ListSlot').innerHTML = '<div class="loader"><div class="spinner"></div><span>Memuat data...</span></div>';
    
    document.getElementById('Ngapp_HeadlineSection').style.display = 'none';
    const editorSec = document.getElementById('Ngapp_EditorSection');
    if(editorSec) editorSec.style.display = 'none';
    
    let btn = document.getElementById('Ngapp_BtnLoadMore');
    if (btn) btn.style.display = 'none'; 
    
    const filterSlot = document.getElementById('Ngapp_FilterSlot');
    if (filterSlot) filterSlot.style.display = 'none';

    window.scrollTo({ top: 0, behavior: 'smooth' });

    setTimeout(() => {
        const bookmarks = JSON.parse(localStorage.getItem('ngapp_bookmarks') || '[]');
        if (bookmarks.length === 0) {
            document.getElementById('Ngapp_ListSlot').innerHTML = '<div class="loader"><span>Belum ada data yang disimpan.</span></div>';
        } else {
            renderList(bookmarks.reverse());
        }
    }, 500); 
}

// --- 3. FUNGSI LOAD & RENDER KATEGORI ---
async function loadCategory(type, title, isLoadMore = false) {
    if (!isLoadMore) {
        currentPage = 1;
        currentCategoryType = type;
        uiCloseMenu();
        document.getElementById('Ngapp_ListTitle').innerText = title;
        document.getElementById('Ngapp_ListSlot').innerHTML = '<div class="loader"><div class="spinner"></div><span>Memuat data...</span></div>';
        
        document.getElementById('Ngapp_HeadlineSection').style.display = 'none';
        document.getElementById('Ngapp_HeadlineSlot').innerHTML = '';
        const editorSec = document.getElementById('Ngapp_EditorSection');
        if(editorSec) {
            editorSec.style.display = 'none';
            document.getElementById('Ngapp_EditorSlot').innerHTML = '';
        }
        
        const filterSlot = document.getElementById('Ngapp_FilterSlot');
        if (filterSlot) filterSlot.style.display = 'none';
        
        let btn = document.getElementById('Ngapp_BtnLoadMore');
        if (btn) btn.style.display = 'none';
    } else {
        currentPage++; 
    }
    
    let targetUrl = '';
    
    let isHome = (currentCategoryType === '/' || currentCategoryType === 'all'); 
    let isIndeks = (currentCategoryType === 'indeks-berita');
    
    if (isHome) targetUrl = Ngapp_API.all(currentPage);
    else if (isIndeks) targetUrl = Ngapp_API.indeks(currentPage, filterD, filterM, filterY); 
    else if (currentCategoryType === 'pilihan') targetUrl = Ngapp_API.pilihan(currentPage);
    else if (currentCategoryType === 'populer') targetUrl = Ngapp_API.populer(currentPage);
    else if (currentCategoryType === 'foto' || currentCategoryType === 'indeks-foto') targetUrl = Ngapp_API.foto(currentPage);
    else if (currentCategoryType === 'video' || currentCategoryType === 'indeks-video') targetUrl = Ngapp_API.video(currentPage);
    else if (currentCategoryType.startsWith('category/')) {
        const slug = currentCategoryType.replace('category/', ''); 
        targetUrl = Ngapp_API.category(slug, currentPage);
    }
    else if (currentCategoryType.startsWith('berita/kanal/')) {
        const slug = currentCategoryType.replace('berita/kanal/', '');
        targetUrl = Ngapp_API.category(slug, currentPage);
    }
    else if (currentCategoryType.startsWith('search:')) { 
        const keyword = currentCategoryType.split(':')[1];
        targetUrl = Ngapp_API.search(keyword, currentPage);
    }
    
    const data = targetUrl ? await fetchNgapp(targetUrl) : [];
    let listData = data.data || data; 

    if (!isLoadMore) {
        if (isHome) {
            document.getElementById('Ngapp_HeadlineSection').style.display = 'block';
            document.querySelector('#Ngapp_HeadlineSection .section-title').innerText = '🔥 Headline';
            
            const editorSec = document.getElementById('Ngapp_EditorSection');
            if(editorSec) editorSec.style.display = 'block';

            fetchNgapp(Ngapp_API.headline()).then(renderHeadline);
            fetchNgapp(Ngapp_API.pilihan(1)).then(renderEditorPick);
            
            renderList(listData);
        } else if (isIndeks) {
            // HALAMAN INDEKS BERITA (LIST + FILTER)
            renderFilterUI(); 
            if (listData && listData.length > 0) {
                renderList(listData);
            } else {
                document.getElementById('Ngapp_ListSlot').innerHTML = '<div class="loader">Data tidak ditemukan</div>';
            }
        } else {
            if (listData && listData.length > 0) {
                document.getElementById('Ngapp_HeadlineSection').style.display = 'block';
                document.querySelector('#Ngapp_HeadlineSection .section-title').innerText = 'Sorotan ' + title;
                
                const firstItem = listData.shift(); 
                
                if (currentCategoryType === 'foto' || currentCategoryType === 'indeks-foto') {
                    renderHeadlineFoto([firstItem]);
                    renderFotoList(listData);
                } else if (currentCategoryType === 'video' || currentCategoryType === 'indeks-video') {
                    renderHeadlineVideo([firstItem]);
                    renderVideoList(listData);
                } else {
                    renderHeadline([firstItem]); 
                    renderList(listData); 
                }
                
            } else {
                document.getElementById('Ngapp_ListSlot').innerHTML = '<div class="loader">Data tidak ditemukan</div>';
            }
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
        if (currentCategoryType === 'foto' || currentCategoryType === 'indeks-foto') {
            appendFotoList(listData);
        } else if (currentCategoryType === 'video' || currentCategoryType === 'indeks-video') {
            appendVideoList(listData);
        } else {
            appendList(listData);
        }
    }
    checkLoadMoreButton(listData.length, isHome);
}

// ===============================================================
// RENDERER UI FILTER TANGGAL (INDEKS BERITA)
// ===============================================================
function renderFilterUI() {
    let filterSlot = document.getElementById('Ngapp_FilterSlot');
    
    if (!filterSlot) {
        filterSlot = document.createElement('div');
        filterSlot.id = 'Ngapp_FilterSlot';
        filterSlot.style.padding = '0 16px 15px';
        filterSlot.style.display = 'flex';
        filterSlot.style.gap = '8px';
        const listSlot = document.getElementById('Ngapp_ListSlot');
        listSlot.parentNode.insertBefore(filterSlot, listSlot);
    }
    
    filterSlot.style.display = 'flex';
    
    let days = '<option value="">Tgl</option>';
    for(let i=1; i<=31; i++) days += `<option value="${i}" ${filterD==i?'selected':''}>${i}</option>`;
    
    let months = '<option value="">Bulan</option>';
    for(let i=1; i<=12; i++) months += `<option value="${i}" ${filterM==i?'selected':''}>${i}</option>`;

    let currentYear = new Date().getFullYear();
    let years = '<option value="">Tahun</option>';
    for(let i=0; i<5; i++) years += `<option value="${currentYear-i}" ${filterY==(currentYear-i)?'selected':''}>${currentYear-i}</option>`;

    filterSlot.innerHTML = `
        <select id="Ngapp_SelTanggal" style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-dark);">${days}</select>
        <select id="Ngapp_SelBulan" style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-dark);">${months}</select>
        <select id="Ngapp_SelTahun" style="flex:1; padding:8px; border-radius:8px; border:1px solid var(--border); background:var(--bg-card); color:var(--text-dark);">${years}</select>
        <button onclick="applyIndeksFilter()" style="padding:8px 15px; background:var(--primary); color:white; border:none; border-radius:8px; font-weight:bold;">Cari</button>
    `;
}

function applyIndeksFilter() {
    filterD = document.getElementById('Ngapp_SelTanggal').value;
    filterM = document.getElementById('Ngapp_SelBulan').value;
    filterY = document.getElementById('Ngapp_SelTahun').value;
    loadCategory('indeks-berita', 'Indeks Berita');
}

// ===============================================================
// RENDERER KHUSUS FOTO & VIDEO
// ===============================================================
function renderHeadlineFoto(data) {
    const slot = document.getElementById('Ngapp_HeadlineSlot');
    if (!data || data.length === 0) return;
    slot.innerHTML = data.map(item => `
        <div class="headline-card" onclick="openFoto('${item.foto_id}')">
            <img src="${item.foto_source}" onerror="this.src='https://via.placeholder.com/400x200?text=Foto'">
            <div class="headline-info">
                <span class="cat-badge" style="background:#e91e63;">📷 Galeri Foto</span>
                <h3 style="font-size: 16px; margin-top:5px;">${item.foto_title || 'Foto Terbaru'}</h3>
            </div>
        </div>
    `).join('');
}

function renderHeadlineVideo(data) {
    const slot = document.getElementById('Ngapp_HeadlineSlot');
    if (!data || data.length === 0) return;
    slot.innerHTML = data.map(item => `
        <div class="headline-card" onclick="openVideo('${item.video_id}')">
            <img src="${item.video_thumbnail}" onerror="this.src='https://via.placeholder.com/400x200?text=Video'" style="filter: brightness(0.7);">
            <div style="position: absolute; top: 45%; left: 50%; transform: translate(-50%, -50%); font-size: 50px; color: white; opacity:0.9;">▶</div>
            <div class="headline-info">
                <span class="cat-badge" style="background:#ff0000;">🎥 Video</span>
                <h3 style="font-size: 16px; margin-top:5px;">${item.video_title || 'Video Banten88'}</h3>
            </div>
        </div>
    `).join('');
}

function renderFotoList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    if (!data || data.length === 0) return slot.innerHTML = '<div class="loader">Belum ada foto</div>';
    slot.innerHTML = data.map(item => fotoTemplateHTML(item)).join('');
}

function appendFotoList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    slot.insertAdjacentHTML('beforeend', data.map(item => fotoTemplateHTML(item)).join(''));
}

function fotoTemplateHTML(item) {
    return `
        <div class="news-item" onclick="openFoto('${item.foto_id}')" style="flex-direction: column; height: auto;">
            <img src="${item.foto_source}" onerror="this.src='https://via.placeholder.com/400x250?text=Foto'" style="width: 100%; height: 180px; object-fit: cover;">
            <div class="news-detail" style="padding: 12px;">
                <div class="news-title" style="font-size: 15px;">${item.foto_title || 'Galeri Foto'}</div>
            </div>
        </div>
    `;
}

function renderVideoList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    if (!data || data.length === 0) return slot.innerHTML = '<div class="loader">Belum ada video</div>';
    slot.innerHTML = data.map(item => videoTemplateHTML(item)).join('');
}

function appendVideoList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    slot.insertAdjacentHTML('beforeend', data.map(item => videoTemplateHTML(item)).join(''));
}

function videoTemplateHTML(item) {
    return `
        <div class="news-item" onclick="openVideo('${item.video_id}')" style="position: relative; flex-direction: column; height: auto;">
            <img src="${item.video_thumbnail || 'https://via.placeholder.com/400x250?text=Video'}" style="width: 100%; height: 180px; object-fit: cover; filter: brightness(0.8);">
            <div style="position: absolute; top: 70px; left: 50%; transform: translateX(-50%); font-size: 40px; color: rgba(255,255,255,0.9);">▶</div>
            <div class="news-detail" style="padding: 12px;">
                <div class="news-title" style="font-size: 15px;">${item.video_title || 'Video Banten88'}</div>
            </div>
        </div>
    `;
}

// --- 4. FUNGSI DETAIL ARTIKEL ---
async function openArticle(postSlug) {
    uiSwitchToDetail();
    const slot = document.getElementById('Ngapp_DetailSlot');
    slot.innerHTML = '<div class="loader"><div class="spinner"></div><span>Menyiapkan data...</span></div>';

    const data = await fetchNgapp(Ngapp_API.read(postSlug));
    const article = Array.isArray(data) ? data[0] : data; 

    if(article) {
        currentArticleData = article; 
        if(typeof checkBookmarkStatus === 'function') checkBookmarkStatus(); 

        slot.innerHTML = `
            ${article.post_thumbnail ? `<img src="${article.post_thumbnail}" class="detail-header-img">` : ''}
            <div class="detail-body">
                <span class="detail-cat">${article.category_names || 'Berita'}</span>
                <h1 class="detail-title">${article.post_title}</h1>
                <div class="detail-meta">📅 ${formatDate(article.created_at)} • 👁️ ${article.post_views || 0} Dilihat</div>
                <div class="detail-content">${article.post_content}</div>
            </div>
        `;
    } else {
        currentArticleData = null;
        slot.innerHTML = '<div class="loader">Tidak ditemukan.</div>';
    }
    window.scrollTo(0,0);
}

// --- 5. RENDERER COMPONENTS ---
function renderHeadline(data) {
    const slot = document.getElementById('Ngapp_HeadlineSlot');
    if (!data || data.length === 0) return slot.innerHTML = '<div class="loader"><span>Tidak ada sorotan</span></div>';
    slot.innerHTML = data.map(item => `
        <div class="headline-card" onclick="openArticle('${item.post_slug}')">
            <img src="${item.post_thumbnail}" onerror="this.src='https://via.placeholder.com/400x200?text=Banten88'">
            <div class="headline-info">
                <span class="cat-badge">${item.category_names || 'Update'}</span>
                <h3>${item.post_title}</h3>
            </div>
        </div>
    `).join('');
}

function renderEditorPick(data) {
    const slot = document.getElementById('Ngapp_EditorSlot');
    const section = document.getElementById('Ngapp_EditorSection');
    
    slot.className = 'editor-scroll-container';

    if (!data || data.length === 0) {
        if(section) section.style.display = 'none';
        return;
    }
    
    const displayData = data.slice(0, 5); 
    
    slot.innerHTML = displayData.map(item => `
        <div class="editor-card" onclick="openArticle('${item.post_slug}')">
            <img src="${item.post_thumbnail}" onerror="this.src='https://via.placeholder.com/200?text=Editor'">
            <div class="editor-card-detail">
                <div class="editor-card-title">${item.post_title}</div>
                <div class="editor-card-meta">${item.category_names || 'Pilihan'} • ${formatDate(item.created_at)}</div>
            </div>
        </div>
    `).join('');
}

function renderList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    if (!data || data.length === 0) return slot.innerHTML = '<div class="loader"><span>Belum ada berita</span></div>';
    slot.innerHTML = generateListHTML(data);
}

function appendList(data) {
    const slot = document.getElementById('Ngapp_ListSlot');
    slot.innerHTML += generateListHTML(data);
}

function generateListHTML(data) {
    let html = '';
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        if (i === 5 && i + 1 < data.length) {
            html += `<div class="inline-grid-2">`;
            html += createInlineGridItemHTML(data[i]);       
            html += createInlineGridItemHTML(data[i + 1]);   
            html += `</div>`;
            i++; 
        } else {
            html += createNewsItemHTML(item);
        }
    }
    return html;
}

function createInlineGridItemHTML(item) {
    return `
        <div class="inline-grid-item" onclick="openArticle('${item.post_slug}')">
            <img src="${item.post_thumbnail}" onerror="this.src='https://via.placeholder.com/200?text=Banten88'">
            <div class="inline-grid-detail">
                <div class="inline-grid-title">${item.post_title}</div>
                <div class="inline-grid-meta">${item.category_names || 'Berita'} • ${formatDate(item.created_at)}</div>
            </div>
        </div>
    `;
}

function createNewsItemHTML(item) {
    return `
        <div class="news-item" onclick="openArticle('${item.post_slug}')">
            <img src="${item.post_thumbnail}" onerror="this.src='https://via.placeholder.com/150?text=News'">
            <div class="news-detail">
                <div class="news-title">${item.post_title}</div>
                <div class="news-meta">${item.category_names || 'Berita'} • ${formatDate(item.created_at)}</div>
            </div>
        </div>
    `;
}

function checkLoadMoreButton(fetchedCount, isHome) {
    let btn = document.getElementById('Ngapp_BtnLoadMore');
    let expectedCount = isHome ? DEFAULT_LIMIT : (currentPage === 1 ? DEFAULT_LIMIT - 1 : DEFAULT_LIMIT);

    if (!btn) {
        btn = document.createElement('button');
        btn.id = 'Ngapp_BtnLoadMore';
        btn.className = 'btn-load-more'; 
        btn.onclick = () => {
            btn.innerHTML = '<i class="fa-solid fa-circle-notch fa-spin"></i> Memuat...';
            loadCategory(currentCategoryType, document.getElementById('Ngapp_ListTitle').innerText, true);
        };
        document.getElementById('Ngapp_MainSlot').appendChild(btn);
    }

    if (isHome) {
        btn.style.display = 'none';
        return; 
    }

    if (fetchedCount > 0 && fetchedCount >= expectedCount) {
        btn.style.display = 'flex'; 
        btn.innerHTML = 'Muat Lebih Banyak <i class="fa-solid fa-angle-down"></i>';
    } else {
        btn.style.display = 'none'; 
    }
}

// ==========================================
// 6. JALANKAN APLIKASI
// ==========================================
if(typeof uiInitTheme === 'function') uiInitTheme(); 
loadMenu();
loadCategory('/', 'Berita Terbaru');

// ==========================================
// 7. PULL TO REFRESH & HARDWARE BACK BUTTON
// ==========================================
const toastEl = document.createElement('div');
toastEl.id = 'Ngapp_Toast';
document.body.appendChild(toastEl);

function showToast(msg) {
    toastEl.innerText = msg;
    toastEl.style.display = 'block';
    setTimeout(() => toastEl.style.display = 'none', 2000);
}

let pStartY = 0;
let pCurrentY = 0;

document.addEventListener('touchstart', e => {
    if (window.scrollY === 0) pStartY = e.touches[0].clientY;
}, {passive: true});

document.addEventListener('touchmove', e => {
    if (window.scrollY === 0 && pStartY > 0) pCurrentY = e.touches[0].clientY;
}, {passive: true});

document.addEventListener('touchend', e => {
    if (window.scrollY === 0 && pStartY > 0 && pCurrentY > 0) {
        let pullDistance = pCurrentY - pStartY;
        if (pullDistance > 120) { 
            showToast("Merekap data terbaru...");
            let isHome = (currentCategoryType === '/' || currentCategoryType === 'all');
            if(isHome) {
                loadCategory('/', 'Berita Terbaru');
            } else {
                loadCategory(currentCategoryType, document.getElementById('Ngapp_ListTitle').innerText);
            }
        }
    }
    pStartY = 0;
    pCurrentY = 0;
}, {passive: true});

let backButtonPressCount = 0;

if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.App) {
    window.Capacitor.Plugins.App.addListener('backButton', ({ canGoBack }) => {
        const detailSlot = document.getElementById('Ngapp_DetailSlot');
        if (detailSlot && detailSlot.style.display === 'block') {
            uiCloseDetail();
            return;
        }

        const sidebar = document.getElementById('Ngapp_Sidebar');
        if (sidebar && sidebar.classList.contains('active')) {
            uiCloseMenu();
            return;
        }

        let isHome = (currentCategoryType === '/' || currentCategoryType === 'all');
        if (!isHome) {
            const navItems = document.querySelectorAll('.nav-item');
            navItems.forEach(item => item.classList.remove('active'));
            if(navItems[0]) navItems[0].classList.add('active'); 

            loadCategory('/', 'Berita Terbaru');
            return;
        }

        if (backButtonPressCount === 0) {
            backButtonPressCount++;
            showToast("Tekan sekali lagi untuk keluar");
            setTimeout(() => { backButtonPressCount = 0; }, 2000);
        } else {
            window.Capacitor.Plugins.App.exitApp();
        }
    });
}