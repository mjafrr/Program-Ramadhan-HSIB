document.addEventListener('DOMContentLoaded', () => {
    // Pastikan AOS tersedia sebelum diinisialisasi
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 1000,
            easing: 'ease-in-out',
        });
    }

    // --- UTILITY FUNCTION ---
    function formatRupiah(angka, prefix) {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(angka);
    }

    // --- 1. NAVIGASI (Navbar Toggle) ---
    const menuToggle = document.getElementById('menuToggle');
    const navMenu = document.getElementById('navMenu');

    if (menuToggle && navMenu) {
        menuToggle.addEventListener('click', () => {
            navMenu.classList.toggle('active');
            const icon = menuToggle.querySelector('i');
            icon.classList.toggle('fa-bars');
            icon.classList.toggle('fa-times');
        });

        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 992) { 
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- 2. PROGRESS BAR DYNAMIC & ANIMATION ---
    const progressContainer = document.querySelector('.progress-container');

    function updateProgressBar() {
        if (!progressContainer) return;

        const terkumpul = parseFloat(progressContainer.getAttribute('data-terkumpul'));
        const target = parseFloat(progressContainer.getAttribute('data-target'));
        const percentage = Math.min(100, (terkumpul / target) * 100);

        const fillElement = document.getElementById('progress-fill');
        const terkumpulLabel = document.getElementById('terkumpul-label');
        const targetLabel = document.getElementById('target-label');
        const persenLabel = document.getElementById('persen-label');

        if (!fillElement) return;

        if (terkumpulLabel) {
            terkumpulLabel.innerHTML = `Terkumpul: <strong>${formatRupiah(terkumpul)}</strong>`;
        }
        if (targetLabel) {
            targetLabel.innerHTML = `${formatRupiah(target)}`;
        }
        if (persenLabel) {
            persenLabel.textContent = `${Math.round(percentage)}%`;
        }

        const observerProgress = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillElement.style.width = percentage + '%'; 
                    observerProgress.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); 

        observerProgress.observe(progressContainer);
    }

    updateProgressBar();

    
    // =========================================================
    // ✅ PERBAIKAN: 4. CAROUSEL FOTO (AUTO-SLIDE TANPA TOMBOL)
    // =========================================================
    const photoWrapper = document.querySelector('.carousel-wrapper'); 
    const photoTrack = document.getElementById('photoCarouselTrack');
    // photoNextButton dan photoPrevButton DIHAPUS

    const SLIDE_INTERVAL = 5000;
    let slideTimer;

    // Hanya perlu memeriksa keberadaan wrapper dan track
    if (photoTrack && photoWrapper) {
        const slides = Array.from(photoTrack.children);
        const totalSlides = slides.length;
        let photoIndex = 0;

        const getVisibleSlideCount = () => {
            const width = window.innerWidth;
            if (width <= 600) {
                return 1;
            } else if (width <= 992) {
                return 2;
            } else {
                return 3;
            }
        };

        const updatePhotoCarousel = () => {
            const visibleCount = getVisibleSlideCount();
            const slideWidthPercentage = 100 / visibleCount;
            const maxIndex = totalSlides - visibleCount; 
            const finalMaxIndex = Math.max(0, maxIndex);

            // Perkuat logika looping
            if (photoIndex > finalMaxIndex) {
                photoIndex = 0; 
            } else if (photoIndex < 0) {
                photoIndex = finalMaxIndex; 
            }

            const offset = -photoIndex * slideWidthPercentage;
            photoTrack.style.transform = `translateX(${offset}%)`;
        };
        
        const stopAutoSlide = () => {
            clearInterval(slideTimer);
        };
        
        const startAutoSlide = () => {
            stopAutoSlide(); 
            
            slideTimer = setInterval(() => {
                const maxIndex = totalSlides - getVisibleSlideCount();
                const finalMaxIndex = Math.max(0, maxIndex);
                
                // Geser ke index berikutnya
                if (photoIndex < finalMaxIndex) {
                    photoIndex++;
                } else {
                    photoIndex = 0; // Looping ke awal
                }
                updatePhotoCarousel();
            }, SLIDE_INTERVAL);
        };
        
        // --- Kontrol Hover (Jeda Otomatis Saat Dilihat) ---
        // Carousel akan berhenti jika kursor di atasnya
        photoWrapper.addEventListener('mouseover', stopAutoSlide);
        photoWrapper.addEventListener('mouseout', startAutoSlide);

        // Panggil saat halaman dimuat dan ketika ukuran jendela berubah
        window.addEventListener('resize', () => {
            stopAutoSlide();
            photoIndex = 0; // Reset index saat resize
            updatePhotoCarousel(); 
            startAutoSlide();
        });
        
        // Inisialisasi awal
        updatePhotoCarousel(); 
        startAutoSlide(); // 🚀 Memulai auto-slide secara otomatis
    }


    // --- 6. TOMBOL KEMBALI KE ATAS (BACK TO TOP) ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollThreshold = 300; 

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

}); // END DOMContentLoaded

// =========================================================
// --- 7. MODAL GALERI (GLOBAL FUNCTION) ---
// =========================================================

const modal = document.getElementById("galleryModal");
const closeButton = document.getElementsByClassName("close-btn")[0];
const modalContent = modal ? modal.querySelector('.modal-content') : null;

if (modal && closeButton && modalContent) {
    
    function closeModal() {
        modal.classList.remove("active"); 
        
        setTimeout(() => {
            modal.style.display = "none";
            modalContent.innerHTML = ''; 
        }, 300); 
    }

    window.openModal = function(src, type) {
        modalContent.innerHTML = ''; 
        
        if (type === 'image') {
            modalContent.innerHTML = `<img src="${src}" alt="Dokumentasi HSI Berbagi">`;
        } else if (type === 'video') {
             modalContent.innerHTML = `
                 <iframe 
                     src="${src}?autoplay=1&rel=0" 
                     frameborder="0" 
                     allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                     allowfullscreen
                 ></iframe>
             `;
        }
        
        modal.style.display = "flex"; 
        
        setTimeout(() => {
             modal.classList.add("active");
        }, 10);
        
    }

    closeButton.onclick = closeModal;

    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}
