// --- 1. TEMA YÖNETİMİ (DARK/LIGHT MODE) ---
const themeToggleBtn = document.getElementById("theme-toggle");
const themeToggleIcon = document.getElementById("theme-toggle-icon");

// Sayfa yüklendiğinde kullanıcının tercihini kontrol et
if (
  localStorage.getItem("theme") === "dark" ||
  (!("theme" in localStorage) &&
    window.matchMedia("(prefers-color-scheme: dark)").matches)
) {
  document.documentElement.classList.add("dark");
  if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
} else {
  document.documentElement.classList.remove("dark");
  if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
}

// Butona tıklandığında temayı değiştir ve hafızaya al
if (themeToggleBtn) {
  themeToggleBtn.addEventListener("click", () => {
    if (document.documentElement.classList.contains("dark")) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      if (themeToggleIcon) themeToggleIcon.textContent = "🌙";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      if (themeToggleIcon) themeToggleIcon.textContent = "☀️";
    }
  });
}

// --- 2. OKUMA İLERLEME ÇUBUĞU (SCROLL PROGRESS) ---
const progressBar = document.getElementById("progress-bar");

if (progressBar) {
  window.addEventListener("scroll", () => {
    // Kullanıcının ne kadar aşağı kaydırdığını hesapla
    const winScroll =
      document.body.scrollTop || document.documentElement.scrollTop;
    // Toplam kaydırılabilir yüksekliği hesapla (Toplam Sayfa Yüksekliği - Ekran Yüksekliği)
    const height =
      document.documentElement.scrollHeight -
      document.documentElement.clientHeight;

    if (height > 0) {
      const scrolled = (winScroll / height) * 100;
      // Çubuğun genişliğini yüzde olarak güncelle
      progressBar.style.width = scrolled + "%";
    }
  });
}

// --- 3. 3D PERSPECTIVE CAROUSEL WITH PROGRESS BARS ---
const track = document.getElementById("projects-track");
const barsContainer = document.getElementById("projects-bars");

if (track && barsContainer) {
  const slides = Array.from(track.children);
  let currentIndex = 0;
  let progressInterval;
  let startTime;
  const duration = 5000;

  // Generate progress bars
  slides.forEach((_, index) => {
    const barWrapper = document.createElement("button");
    barWrapper.className =
      "h-1 w-12 bg-neutral-300 dark:bg-neutral-800 rounded-full overflow-hidden relative cursor-pointer";
    barWrapper.setAttribute("aria-label", `Go to project ${index + 1}`);

    const fill = document.createElement("div");
    fill.className =
      "h-full w-0 bg-neutral-800 dark:bg-neutral-200 transition-all ease-linear";
    fill.style.transitionDuration = "0ms";

    barWrapper.appendChild(fill);
    barWrapper.addEventListener("click", () => {
      goToSlide(index);
    });
    barsContainer.appendChild(barWrapper);
  });

  const barFills = barsContainer.querySelectorAll("#projects-bars div");

  // Core function to calculate layout offsets for 3D depth effect
  function updateCarouselLayout() {
    const totalSlides = slides.length;

    slides.forEach((slide, i) => {
      // Calculate shortest loop distance between item index and active index
      let offset = i - currentIndex;
      if (offset < -1 && totalSlides > 2) offset += totalSlides;
      if (offset > 1 && totalSlides > 2) offset -= totalSlides;

      if (offset === 0) {
        // Active Center Card
        slide.style.transform = "translateX(0) scale(1)";
        slide.style.zIndex = "30";
        slide.style.opacity = "1";
        slide.style.pointerEvents = "auto";
      } else if (
        offset === 1 ||
        (currentIndex === totalSlides - 1 && i === 0)
      ) {
        // Right Preview Card
        slide.style.transform = "translateX(65%) scale(0.85)";
        slide.style.zIndex = "20";
        slide.style.opacity = "0.40";
        slide.style.pointerEvents = "none";
      } else if (
        offset === -1 ||
        (currentIndex === 0 && i === totalSlides - 1)
      ) {
        // Left Preview Card
        slide.style.transform = "translateX(-65%) scale(0.85)";
        slide.style.zIndex = "20";
        slide.style.opacity = "0.40";
        slide.style.pointerEvents = "none";
      } else {
        // Out of view elements
        slide.style.transform = "translateX(0) scale(0.7)";
        slide.style.zIndex = "10";
        slide.style.opacity = "0";
        slide.style.pointerEvents = "none";
      }
    });
  }

  function animateProgress() {
    cancelAnimationFrame(progressInterval);
    startTime = performance.now();

    function update() {
      const currentTime = performance.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min((elapsed / duration) * 100, 100);

      barFills.forEach((fill, i) => {
        if (i === currentIndex) {
          fill.style.width = `${progress}%`;
        } else {
          fill.style.width = "0%";
        }
      });

      if (elapsed < duration) {
        progressInterval = requestAnimationFrame(update);
      } else {
        nextSlide();
      }
    }

    progressInterval = requestAnimationFrame(update);
  }

  function goToSlide(index) {
    currentIndex = index;
    updateCarouselLayout();
    animateProgress();
  }

  function nextSlide() {
    let nextIndex = currentIndex + 1;
    if (nextIndex >= slides.length) {
      nextIndex = 0;
    }
    goToSlide(nextIndex);
  }

  // Initialize layout and animation
  goToSlide(0);
}

// --- 4. DYNAMIC READING TIME CALCULATOR ---
function calculateReadingTime() {
  // Sadece makale içeriğinin olduğu ana alanı seçiyoruz
  const articleContainer = document.querySelector("main");
  const readingTimeTarget = document.getElementById("reading-time");

  if (articleContainer && readingTimeTarget) {
    const text = articleContainer.innerText;

    // Düzenli ifade (regex) ile metindeki tüm kelimeleri ayıkla ve diziye dök
    const words = text.trim().split(/\s+/);
    const wordCount = words.length;

    // Dakikada ortalama okuma hızı: 200 kelime
    const wordsPerMinute = 200;

    // Toplam kelimeyi hıza böl ve en yakın tam sayıya yuvarla (en az 1 dk)
    const readingTime = Math.max(1, Math.round(wordCount / wordsPerMinute));

    // Ekrana chill ve profesyonel formatta yazdır
    readingTimeTarget.innerText = `${readingTime} DK OKUMA SÜRESİ`;
  }
}

// Sayfa tamamen yüklendiğinde hesaplamayı tetikle
document.addEventListener("DOMContentLoaded", calculateReadingTime);
