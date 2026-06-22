// ==========================================
// 1. ENGINE & API CONFIG
// ==========================================
const API_KEY = 'API_KEY';
const BASE_URL = 'https://domain.com/api';
const DEFAULT_LIMIT = 13;

const Ngapp_API = {
    all: (page = 1) => `${BASE_URL}/post/all?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    headline: () => `${BASE_URL}/post/headline?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=1`,
    pilihan: (page = 1) => `${BASE_URL}/post/pilihan?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    populer: (page = 1) => `${BASE_URL}/post/populer?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    search: (keyword, page = 1) => `${BASE_URL}/post/search?q=${keyword}&key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    category: (slug, page = 1) => `${BASE_URL}/post/category/${slug}?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    read: (slug) => `${BASE_URL}/post/read/${slug}?key=${API_KEY}`,
    menu: (position = '') => `${BASE_URL}/menu${position ? '/' + position : ''}?key=${API_KEY}`,
	page: (slug) => `${BASE_URL}/pages/${slug}?key=${API_KEY}`,
    foto: (page = 1) => `${BASE_URL}/foto?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
    video: (page = 1) => `${BASE_URL}/video?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}`,
	// TAMBAHKAN BARIS INI:
    indeks: (page = 1, d = '', m = '', y = '') => `${BASE_URL}/post/all?key=${API_KEY}&limit=${DEFAULT_LIMIT}&page=${page}&d=${d}&m=${m}&y=${y}`,
    // ...
};

async function fetchNgapp(url) {
    try {
        const req = await fetch(url);
        if (!req.ok) throw new Error('Network error');
        const res = await req.json();
        return res.data || [];
    } catch (err) {
        console.error("API Request Error:", err);
        return null;
    }
}