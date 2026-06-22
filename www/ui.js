// ==========================================
// 2. UI HELPERS & THEME INIT
// ==========================================

// INI DIA FUNGSI YANG HILANG (OBAT LAYAR BLANK)
function uiInitTheme() {
    const savedTheme = localStorage.getItem('ngapp_theme') || 'light';
    document.documentElement.setAttribute('data-theme', savedTheme);
    uiRenderThemeUI(savedTheme);
}

function uiToggleSearch() {
    const searchBar = document.getElementById('Ngapp_SearchBar');
    if(!searchBar) return;
    searchBar.classList.toggle('active');
    if (searchBar.classList.contains('active')) {
        document.getElementById('Ngapp_SearchInput').focus();
    }
}

function handleSearch(event) {
    if (event.key === 'Enter') executeSearch();
}

function executeSearch() {
    const keyword = document.getElementById('Ngapp_SearchInput').value.trim();
    if (!keyword) return;
    
    uiToggleSearch();
    loadCategory('search:' + keyword, 'Hasil Pencarian: ' + keyword);
}

function uiOpenMenu() {
    document.getElementById('Ngapp_Sidebar').classList.add('active');
    document.getElementById('Ngapp_Overlay').classList.add('active');
}

function uiCloseMenu() {
    document.getElementById('Ngapp_Sidebar').classList.remove('active');
    document.getElementById('Ngapp_Overlay').classList.remove('active');
}

function uiSwitchToDetail() {
    document.getElementById('Ngapp_MainSlot').style.display = 'none';
    const detailSlot = document.getElementById('Ngapp_DetailSlot');
    detailSlot.style.display = 'block';
    
    // Hilangkan padding bawah yang tadinya buat tempat Bottom Bar
    detailSlot.style.paddingBottom = '20px'; 
    
    // Sembunyikan Bottom Bar
    const bottomBar = document.getElementById('Ngapp_BottomBar');
    if(bottomBar) bottomBar.style.display = 'none';
    
    const searchBar = document.getElementById('Ngapp_SearchBar');
    if(searchBar) searchBar.classList.remove('active'); 
    
    document.getElementById('Ngapp_BtnBack').style.display = 'flex'; 
    document.getElementById('Ngapp_LogoContainer').classList.add('read-mode');
    
    document.getElementById('Ngapp_HeaderActionsMain').style.display = 'none';
    document.getElementById('Ngapp_HeaderActionsRead').style.display = 'flex';

    window.scrollTo(0,0);
}

function uiCloseDetail() {
    document.getElementById('Ngapp_MainSlot').style.display = 'block';
    document.getElementById('Ngapp_DetailSlot').style.display = 'none';
    
    // Tampilkan kembali Bottom Bar
    const bottomBar = document.getElementById('Ngapp_BottomBar');
    if(bottomBar) bottomBar.style.display = 'flex';
    
    document.getElementById('Ngapp_BtnBack').style.display = 'none';
    document.getElementById('Ngapp_LogoContainer').classList.remove('read-mode');
    
    document.getElementById('Ngapp_HeaderActionsMain').style.display = 'flex';
    document.getElementById('Ngapp_HeaderActionsRead').style.display = 'none';

    document.getElementById('Ngapp_DetailSlot').innerHTML = '';
}

function formatDate(dateString) {
    if (!dateString) return '';
    const d = new Date(dateString);
    return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

// ==========================================
// KONTROL DARK MODE 
// ==========================================
function uiRenderThemeUI(theme) {
    const logoImg = document.getElementById('Ngapp_LogoImg');
    const themeBtn = document.getElementById('Ngapp_BtnTheme');
    const sidebarLogo = document.getElementById('Ngapp_SidebarLogo');
    
    if (sidebarLogo) {
        sidebarLogo.src = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
    }
    if (logoImg) {
        logoImg.src = theme === 'dark' ? 'logo-dark.png' : 'logo-light.png';
    }
    
    if (themeBtn) {
        themeBtn.innerHTML = theme === 'dark' ? '<i class="fa-solid fa-sun"></i>' : '<i class="fa-solid fa-moon"></i>';
    }
}

function uiToggleTheme() {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('ngapp_theme', newTheme);
    uiRenderThemeUI(newTheme);
}

// ==========================================
// KONTROL BOTTOM BAR & NAVIGASI BAWAH
// ==========================================
function updateBottomBar(clickedElement) {
    const items = document.querySelectorAll('.nav-item');
    items.forEach(item => item.classList.remove('active'));
    if(clickedElement) clickedElement.classList.add('active');
}

function navToHome(el) {
    updateBottomBar(el);
    loadCategory('/', 'Berita Terbaru');
}

function navToTrending(el) {
    updateBottomBar(el);
    loadCategory('populer', 'Berita Populer');
}

function navToEditorial(el) {
    updateBottomBar(el);
    loadCategory('pilihan', 'Pilihan Redaksi');
}

function navToMenu(el) {
    uiOpenMenu();
}

// ==========================================
// KONTROL HEADER MODE BACA (Bookmark & Share)
// ==========================================

function checkBookmarkStatus() {
    if (!currentArticleData) return;
    const bookmarks = JSON.parse(localStorage.getItem('ngapp_bookmarks') || '[]');
    const isBookmarked = bookmarks.some(b => b.post_slug === currentArticleData.post_slug);
    
    const btnBookmark = document.getElementById('Ngapp_BtnBookmark');
    if(btnBookmark) {
        btnBookmark.innerHTML = isBookmarked ? '<i class="fa-solid fa-bookmark" style="color: var(--primary);"></i>' : '<i class="fa-regular fa-bookmark"></i>'; 
    }
}

function toggleBookmark() {
    if (!currentArticleData) return;
    
    let bookmarks = JSON.parse(localStorage.getItem('ngapp_bookmarks') || '[]');
    const index = bookmarks.findIndex(b => b.post_slug === currentArticleData.post_slug);
    
    if (index > -1) {
        bookmarks.splice(index, 1);
        alert("Artikel dihapus dari bookmark.");
    } else {
        bookmarks.push({
            post_slug: currentArticleData.post_slug,
            post_title: currentArticleData.post_title,
            post_thumbnail: currentArticleData.post_thumbnail,
            category_names: currentArticleData.category_names,
            created_at: currentArticleData.created_at
        });
        alert("Artikel disimpan!");
    }
    
    localStorage.setItem('ngapp_bookmarks', JSON.stringify(bookmarks));
    checkBookmarkStatus();
}

async function shareArticle() {
    if (!currentArticleData) {
        alert("Data belum selesai dimuat.");
        return;
    }
    
    const webDomain = new URL(BASE_URL).origin;
    const articleUrl = `${webDomain}/detail/${currentArticleData.post_slug}`; 

    const shareData = {
        title: currentArticleData.post_title,
        text: currentArticleData.post_title,
        url: articleUrl,
        dialogTitle: 'Bagikan' // Khusus buat Capacitor Android
    };

    try {
        // 1. Cek apakah jalan di dalam Capacitor dan plugin Share tersedia
        if (window.Capacitor && window.Capacitor.Plugins && window.Capacitor.Plugins.Share) {
            await window.Capacitor.Plugins.Share.share(shareData);
            console.log('Berhasil share via Native Capacitor!');
        } 
        // 2. Fallback ke Web Share API (Misal lagi ngetes di browser biasa)
        else if (navigator.share) {
            await navigator.share(shareData);
            console.log('Berhasil share via Web!');
        } 
        // 3. Fallback terakhir: Copy Link otomatis
        else {
            fallbackCopyText(articleUrl);
        }
    } catch (err) {
        console.log('Share dibatalkan oleh user atau error:', err);
        // Kalau error di emulator, biasanya karena gak ada aplikasi WA/IG dll buat nerima share-nya
    }
}

// Fungsi pembantu buat nyalin teks (Copy Link)
function fallbackCopyText(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert("Web Share tidak didukung. Link disalin:\n" + text);
        }).catch(err => {
            console.error("Gagal copy otomatis:", err);
            prompt("Gagal copy otomatis, salin link manual di bawah ini:", text);
        });
    } else {
        const tempInput = document.createElement("input");
        document.body.appendChild(tempInput);
        tempInput.value = text;
        tempInput.select();
        document.execCommand("copy");
        document.body.removeChild(tempInput);
        alert("Link disalin:\n" + text);
    }
}