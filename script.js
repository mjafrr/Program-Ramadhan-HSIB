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
    /**
     * Mengubah angka menjadi format Rupiah.
     */
    function formatRupiah(angka, prefix) {
        // Gunakan Intl.NumberFormat yang lebih modern dan akurat
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

        // Sembunyikan menu saat link diklik (khusus mobile)
        navMenu.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    // --- 2. PROGRESS BAR DYNAMIC & ANIMATION (Triggered by Intersection Observer) ---

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

        // Update teks label menggunakan formatRupiah
        if (terkumpulLabel) {
            terkumpulLabel.innerHTML = `Terkumpul: <strong>${formatRupiah(terkumpul)}</strong>`;
        }
        if (targetLabel) {
            targetLabel.innerHTML = `${formatRupiah(target)}`;
        }
        if (persenLabel) {
            persenLabel.textContent = `${Math.round(percentage)}%`;
        }

        // Animasi Progress Bar saat elemen terlihat
        const observerProgress = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    fillElement.style.width = percentage + '%'; 
                    observerProgress.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Aktif saat 50% terlihat

        observerProgress.observe(progressContainer);
    }

    updateProgressBar();

    // --- 3. CAROUSEL TESTIMONI ---
    const carousel = document.getElementById('testimonial-carousel');
    const prevBtn = document.querySelector('.carousel-nav .prev-btn');
    const nextBtn = document.querySelector('.carousel-nav .next-btn');

    if (carousel && prevBtn && nextBtn) {
        const items = carousel.querySelectorAll('.testimonial-item');
        const totalItems = items.length;
        let currentIndex = 0;

        function showItem(index) {
            if (items.length === 0) return;

            currentIndex = (index % totalItems + totalItems) % totalItems;

            items.forEach((item) => {
                // Hapus kelas aktif dan atur properti untuk transisi keluar
                item.classList.remove('active');
                item.style.opacity = 0; 
                item.style.position = 'absolute'; 
            });

            // Tampilkan item aktif
            items[currentIndex].classList.add('active');
            items[currentIndex].style.opacity = 1; 
            items[currentIndex].style.position = 'relative'; 
        }

        prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
        nextBtn.addEventListener('click', () => showItem(currentIndex + 1));

        // Auto-play
        setInterval(() => showItem(currentIndex + 1), 7000); 

        showItem(0); // Inisialisasi: Tampilkan item pertama
    }

    // =========================================================
    // --- 4. CAROUSEL FOTO (SECTION GALERI) ---
    // =========================================================
    const photoTrack = document.getElementById('photoCarouselTrack');
    const photoNextButton = document.getElementById('nextPhotoBtn');
    const photoPrevButton = document.getElementById('prevPhotoBtn');
    
    if (photoTrack && photoNextButton && photoPrevButton) {
        const slides = Array.from(photoTrack.children);
        let photoIndex = 0;

        // Fungsi untuk mendapatkan berapa banyak slide yang terlihat (sesuai CSS media query)
        const getVisibleSlideCount = () => {
            const width = window.innerWidth;
            if (width <= 600) {
                return 1; // Mobile: 1
            } else if (width <= 992) {
                return 2; // Tablet: 2
            } else {
                return 3; // Desktop: 3
            }
        };

        // Fungsi untuk menggeser carousel foto
        const updatePhotoCarousel = () => {
            const visibleCount = getVisibleSlideCount();
            const slideWidthPercentage = 100 / visibleCount;
            const maxIndex = slides.length - visibleCount;

            // Membatasi index agar tidak melebihi batas terakhir
            if (photoIndex > maxIndex) photoIndex = maxIndex;
            if (photoIndex < 0) photoIndex = 0;

            const offset = -photoIndex * slideWidthPercentage;
            photoTrack.style.transform = `translateX(${offset}%)`;

            // Update status tombol
            photoPrevButton.disabled = photoIndex === 0;
            photoNextButton.disabled = photoIndex >= maxIndex;
        };

        // Handler Tombol Next
        photoNextButton.addEventListener('click', () => {
            const maxIndex = slides.length - getVisibleSlideCount();
            if (photoIndex < maxIndex) {
                photoIndex++;
            }
            updatePhotoCarousel();
        });

        // Handler Tombol Previous
        photoPrevButton.addEventListener('click', () => {
            if (photoIndex > 0) {
                photoIndex--;
            }
            updatePhotoCarousel();
        });

        // Panggil saat halaman dimuat dan ketika ukuran jendela berubah
        window.addEventListener('resize', () => {
            photoIndex = 0; // Reset index agar posisi tetap konsisten saat resize
            updatePhotoCarousel(); 
        });
        
        // Inisialisasi awal
        updatePhotoCarousel(); 
    }


    // --- 5. DROP-DOWN FAQ (ACCORDION) ---
    // MODIFIKASI: Bagian ini dihapus total karena Section FAQ telah dihapus dari HTML
    // const faqQuestions = document.querySelectorAll('.faq-question');
    // ... (Logika FAQ dihapus) ...


    // --- 6. TOMBOL KEMBALI KE ATAS (BACK TO TOP) ---
    const backToTopBtn = document.getElementById('backToTopBtn');
    const scrollThreshold = 300; 

    if (backToTopBtn) {
        // Logika Tampil/Sembunyi saat Scroll
        window.addEventListener('scroll', () => {
            if (window.scrollY > scrollThreshold) {
                backToTopBtn.classList.add('show');
            } else {
                backToTopBtn.classList.remove('show');
            }
        });

        // Logika Fungsi Klik: Menggulirkan halaman ke paling atas
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
// MODIFIKASI: Fungsi ini tetap dipertahankan karena bagian galeri foto masih ada.

const modal = document.getElementById("galleryModal");
const closeButton = document.getElementsByClassName("close-btn")[0];
const modalContent = modal ? modal.querySelector('.modal-content') : null;

if (modal && closeButton && modalContent) {
    
    // Fungsi terpisah untuk menutup modal (digunakan oleh tombol X dan klik di luar)
    function closeModal() {
        modal.classList.remove("active"); 
        
        // Atur display: none setelah transisi selesai
        setTimeout(() => {
            modal.style.display = "none";
            // Hapus konten untuk menghentikan video YouTube
            modalContent.innerHTML = ''; 
        }, 300); 
    }

    /**
     * Fungsi global untuk membuka modal dengan konten Gambar atau Video
     * Dipanggil dari onclick di HTML: openModal('url', 'image' | 'video')
     */
    window.openModal = function(src, type) {
        modalContent.innerHTML = ''; 
        
        if (type === 'image') {
            modalContent.innerHTML = `<img src="${src}" alt="Dokumentasi HSI Berbagi">`;
        } else if (type === 'video') {
             // Embed YouTube link dengan autoplay=1 dan mode privasi
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

    // Event Listener: Ketika user klik tombol (x), panggil closeModal
    closeButton.onclick = closeModal;

    // Event Listener: Ketika user klik di luar modal (overlay), panggil closeModal
    window.onclick = function(event) {
        if (event.target == modal) {
            closeModal();
        }
    }
}
