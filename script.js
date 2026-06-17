// --- 1. TEMA YÖNETİMİ (DARK/LIGHT MODE) ---
const themeToggleBtn = document.getElementById('theme-toggle');
const themeToggleIcon = document.getElementById('theme-toggle-icon');

// Sayfa yüklendiğinde kullanıcının tercihini kontrol et
if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
    if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
} else {
    document.documentElement.classList.remove('dark');
    if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
}

// Butona tıklandığında temayı değiştir ve hafızaya al
if (themeToggleBtn) {
    themeToggleBtn.addEventListener('click', () => {
        if (document.documentElement.classList.contains('dark')) {
            document.documentElement.classList.remove('dark');
            localStorage.setItem('theme', 'light');
            if (themeToggleIcon) themeToggleIcon.textContent = '🌙';
        } else {
            document.documentElement.classList.add('dark');
            localStorage.setItem('theme', 'dark');
            if (themeToggleIcon) themeToggleIcon.textContent = '☀️';
        }
    });
}

// --- 2. OKUMA İLERLEME ÇUBUĞU (SCROLL PROGRESS) ---
const progressBar = document.getElementById('progress-bar');

if (progressBar) {
    window.addEventListener('scroll', () => {
        // Kullanıcının ne kadar aşağı kaydırdığını hesapla
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        // Toplam kaydırılabilir yüksekliği hesapla (Toplam Sayfa Yüksekliği - Ekran Yüksekliği)
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        
        if (height > 0) {
            const scrolled = (winScroll / height) * 100;
            // Çubuğun genişliğini yüzde olarak güncelle
            progressBar.style.width = scrolled + '%';
        }
    });
}