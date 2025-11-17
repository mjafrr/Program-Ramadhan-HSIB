document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTION ---
    /**
     * Mengubah angka menjadi format Rupiah.
     */
    function formatRupiah(angka, prefix) {
        // Hapus karakter non-angka dan koma dari input
        var number_string = angka.toString().replace(/[^,\d]/g, ''),
            split = number_string.split(','),
            sisa = split[0].length % 3,
            rupiah = split[0].substr(0, sisa),
            ribuan = split[0].substr(sisa).match(/\d{3}/gi);

        // Tambahkan titik sebagai pemisah ribuan
        if (ribuan) {
            separator = sisa ? '.' : '';
            rupiah += separator + ribuan.join('.');
        }

        rupiah = split[1] != undefined ? rupiah + ',' + split[1] : rupiah;
        return prefix == undefined ? rupiah : (rupiah ? prefix + rupiah : '');
    }

    // --- 2. PROGRESS BAR DYNAMIC & ANIMATION ---

    const progressContainer = document.querySelector('.progress-container');
    
    function updateProgressBar() {
        if (!progressContainer) return;

        // Ambil data dari atribut HTML
        const terkumpul = parseFloat(progressContainer.getAttribute('data-terkumpul'));
        const target = parseFloat(progressContainer.getAttribute('data-target'));
        
        // Hitung persentase
        const percentage = Math.min(100, (terkumpul / target) * 100);

        // Dapatkan elemen
        const fillElement = document.getElementById('progress-fill');
        const terkumpulLabel = document.getElementById('terkumpul-label');
        const targetLabel = document.getElementById('target-label');
        const persenLabel = document.getElementById('persen-label');

        if (!fillElement) return;

        // Update teks label
        if (terkumpulLabel) {
            terkumpulLabel.innerHTML = `Terkumpul: <strong>${formatRupiah(terkumpul, 'Rp ')}</strong>`;
        }
        if (targetLabel) {
            targetLabel.innerHTML = `${formatRupiah(target, 'Rp ')}`;
        }
        if (persenLabel) {
            persenLabel.textContent = `${Math.round(percentage)}%`;
        }
        
        // Animasi Progress Bar saat elemen terlihat (Intersection Observer)
        const observerProgress = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Memicu CSS transition: width 1.5s
                    fillElement.style.width = percentage + '%'; 
                    observerProgress.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 }); // Aktif saat 50% terlihat

        observerProgress.observe(progressContainer);
    }
    
    updateProgressBar();
    
    // --- 1. INISIALISASI & NAVIGASI ---

    // Inisialisasi AOS (Pastikan sudah dimuat di HTML)
    if (typeof AOS !== 'undefined') {
        AOS.init({
            once: true,
            duration: 1000,
            easing: 'ease-in-out',
        });
    }

    // Navbar Toggle (Menu Hamburger)
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
                // Gunakan window.innerWidth untuk cek mobile
                if (window.innerWidth <= 768) {
                    navMenu.classList.remove('active');
                    const icon = menuToggle.querySelector('i');
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            });
        });
    }

    


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

            // Logika untuk loop carousel
            currentIndex = (index % totalItems + totalItems) % totalItems;

            items.forEach((item) => {
                item.classList.remove('active');
                item.style.opacity = 0; 
                item.style.position = 'absolute'; 
            });

            // Tampilkan item aktif
            items[currentIndex].classList.add('active');
            items[currentIndex].style.opacity = 1; 
            items[currentIndex].style.position = 'relative'; // Mengambil ruang di container
        }

        // Navigasi
        prevBtn.addEventListener('click', () => showItem(currentIndex - 1));
        nextBtn.addEventListener('click', () => showItem(currentIndex + 1));
        
        // Auto-play
        setInterval(() => showItem(currentIndex + 1), 7000); // Ganti setiap 7 detik

        showItem(0); // Inisialisasi: Tampilkan item pertama
    }
    
    // --- 4. DROP-DOWN FAQ (ACCORDION) ---
    const faqQuestions = document.querySelectorAll('.faq-question');

    faqQuestions.forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const isActive = question.classList.contains('active');

            // Tutup semua jawaban yang sedang terbuka (Single-open accordion)
            faqQuestions.forEach(q => {
                const a = q.nextElementSibling;
                if (q.classList.contains('active')) {
                    q.classList.remove('active');
                    // Menggunakan null untuk memicu CSS transition max-height: 0
                    a.style.maxHeight = null; 
                    a.style.padding = '0 20px';
                }
            });

            // Buka/Tutup jawaban yang diklik
            if (!isActive) {
                question.classList.add('active');
                // Atur maxHeight ke scrollHeight konten + padding bawah
                answer.style.maxHeight = answer.scrollHeight + 30 + "px"; 
                answer.style.padding = '0 20px 15px 20px'; 
            }
        });
    });

    // --- 5. MODAL GALERI (PERBAIKAN TOTAL) ---
    const modal = document.getElementById("galleryModal");
    const closeButton = document.getElementsByClassName("close-btn")[0];
    const modalContent = modal ? modal.querySelector('.modal-content') : null;

    if (modal && closeButton && modalContent) {
        
        // Fungsi terpisah untuk menutup modal (digunakan oleh tombol X dan klik di luar)
        function closeModal() {
            // Hapus class active untuk memicu transisi keluar (scale & opacity)
            modal.classList.remove("active"); 
            
            // Atur display: none setelah transisi selesai (sesuai durasi 0.3s di CSS)
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
            // Pastikan modalContent kosong sebelum diisi
            modalContent.innerHTML = ''; 
            
            if (type === 'image') {
                modalContent.innerHTML = `<img src="${src}" alt="Dokumentasi HSI Berbagi">`;
            } else if (type === 'video') {
                 // Embed YouTube link dengan autoplay=1
                 modalContent.innerHTML = `
                    <iframe 
                        src="${src}?autoplay=1" 
                        frameborder="0" 
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                        allowfullscreen
                    ></iframe>
                 `;
            }
            
            // 1. Atur display ke 'flex' (agar CSS centering bekerja)
            modal.style.display = "flex"; 
            
            // 2. Timeout singkat untuk memastikan browser menerapkan display: flex sebelum menambahkan class active
            setTimeout(() => {
                 // Tambahkan class active untuk memicu animasi masuk
                 modal.classList.add("active");
            }, 10);
           
        }

        // 3. Event Listener: Ketika user klik tombol (x), panggil closeModal
        closeButton.onclick = closeModal;

        // 4. Event Listener: Ketika user klik di luar modal (overlay), panggil closeModal
        window.onclick = function(event) {
            if (event.target == modal) {
                closeModal();
            }
        }
    }
});

// --- 6. TOMBOL KEMBALI KE ATAS (BACK TO TOP) ---
const backToTopBtn = document.getElementById('backToTopBtn');
const scrollThreshold = 300; // Jarak scroll (dalam piksel) sebelum tombol muncul

if (backToTopBtn) {
    // 1. Logika Tampil/Sembunyi saat Scroll
    window.addEventListener('scroll', () => {
        // Jika posisi scroll lebih dari batas (300px), tampilkan tombol
        if (window.scrollY > scrollThreshold) {
            backToTopBtn.classList.add('show');
        } else {
            // Sembunyikan tombol
            backToTopBtn.classList.remove('show');
        }
    });

    // 2. Logika Fungsi Klik: Menggulirkan halaman ke paling atas
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0, // Posisi tujuan: 0 (paling atas)
            behavior: 'smooth' // Animasi gulir yang halus
        });
    });
}

