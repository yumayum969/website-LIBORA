// js/main.js

document.addEventListener('DOMContentLoaded', () => {
    // Pastikan dataBuku dari data-buku.js sudah dimuat
    if (typeof dataBuku === 'undefined' || !dataBuku.length) {
        console.error("dataBuku tidak ditemukan. Pastikan js/data-buku.js dimuat lebih dulu.");
        return;
    }

    // --- FUNGSI UTAMA UNTUK MERENDER BUKU ---
    function renderBooks(booksArray) {
        const container = document.getElementById('books-list-container');
        if (!container) return; // Keluar jika bukan halaman books.html
        
        container.innerHTML = ''; // Bersihkan konten lama

        if (booksArray.length === 0) {
            container.innerHTML = `
                <div class="col-12 text-center py-5">
                    <i class="fas fa-exclamation-circle fa-4x text-white-50 mb-3"></i>
                    <h4 class="text-white">Buku tidak ditemukan.</h4>
                    <p class="text-white-50">Coba kata kunci atau filter lain.</p>
                </div>
            `;
            return;
        }

        booksArray.forEach(book => {
            // Tentukan Badge Status (Warna Teal Blue untuk Tersedia, Slate Gray untuk Dipinjam)
            const statusColor = book.status === 'Tersedia' ? 'background-color: var(--teal-blue) !important;' : 'background-color: var(--slate-gray) !important;';
            const statusText = book.status;

            // Tentukan tombol aksi
            const actionButton = book.status === 'Tersedia' ?
                `<button class="btn btn-sm w-100 fw-bold borrow-btn text-dark" style="background-color: var(--amber);" data-bs-toggle="modal" data-bs-target="#borrowModal" data-book-id="${book.id}" data-book-title="${book.judul}">Pinjam (Simulasi)</button>` :
                `<button class="btn btn-sm w-100 btn-secondary disabled">Dipinjam</button>`;

            // Tentukan Badge Kategori
            let categoryBadge;
            const categoryColors = {
                'Fiksi': 'text-bg-warning',
                'Non-Fiksi': 'text-bg-success',
                'Sejarah': 'text-bg-info',
                'Sains': 'text-bg-danger',
                'Self-Improvement': 'text-bg-primary',
                'Lainnya': 'text-bg-secondary'
            };
            categoryBadge = `<span class="badge rounded-pill ${categoryColors[book.kategori] || 'text-bg-secondary'}">${book.kategori}</span>`;

            const bookCard = `
                <div class="col-md-6 col-lg-3">
                    <div class="card h-100 shadow-sm border-0">
                        <div class="card-body text-center">
                            <img src="${book.cover || 'img/cover-buku/default.jpg'}" alt="Cover ${book.judul}" class="img-fluid rounded mb-3" style="height: 200px; object-fit: cover;">
                            <h5 class="card-title fw-semibold" style="color: var(--midnight-blue);">${book.judul}</h5>
                            <p class="card-text small mb-1" style="color: var(--slate-gray);">Pengarang: ${book.pengarang}</p>
                            ${categoryBadge}
                            <span class="badge rounded-pill ms-2 text-white" style="${statusColor}">${statusText}</span>
                        </div>
                        <div class="card-footer border-0 bg-white">
                            ${actionButton}
                        </div>
                    </div>
                </div>
            `;
            container.innerHTML += bookCard;
        });

        attachBorrowEvents(); // Pasang event setelah rendering
    }
    
    // --- FUNGSI FILTER & SEARCH ---
    function filterBooks() {
        const searchTerm = document.getElementById('book-search-input')?.value.toLowerCase() || '';
        const category = document.getElementById('category-filter')?.value || '';

        const filtered = dataBuku.filter(book => {
            // Logika Pencarian (Judul, Pengarang, ID, Kategori)
            const matchesSearch = book.judul.toLowerCase().includes(searchTerm) ||
                                  book.pengarang.toLowerCase().includes(searchTerm) ||
                                  book.id.toLowerCase().includes(searchTerm);

            // Logika Filter Kategori
            const matchesCategory = category === '' || book.kategori === category;

            return matchesSearch && matchesCategory;
        });
        
        renderBooks(filtered);
    }
    
    // --- FUNGSI SIMULASI PEMINJAMAN ---
    function attachBorrowEvents() {
        const borrowButtons = document.querySelectorAll('.borrow-btn');
        const modalTitleElement = document.getElementById('modal-book-title');

        if (!modalTitleElement) return;

        borrowButtons.forEach(button => {
            button.addEventListener('click', function() {
                const title = this.getAttribute('data-book-title');
                // const id = this.getAttribute('data-book-id'); // ID bisa digunakan jika ingin simulasi lebih lanjut

                modalTitleElement.textContent = title;
            });
        });
    }

    // --- INISIALISASI ---

    // 1. Inisialisasi Books.html
    if (document.getElementById('books-list-container')) {
        renderBooks(dataBuku);

        // Pasang event listener untuk pencarian dan filter di books.html
        document.getElementById('book-search-input')?.addEventListener('input', filterBooks);
        document.getElementById('category-filter')?.addEventListener('change', filterBooks);
    }

    // 2. Inisialisasi Pencarian Cepat di Index.html (Opsional)
    const mainSearchInput = document.getElementById('main-search-input');
    const quickSearchResults = document.getElementById('quick-search-results');
    
    if (mainSearchInput && quickSearchResults) {
        mainSearchInput.addEventListener('input', function() {
            const searchTerm = this.value.toLowerCase();
            quickSearchResults.innerHTML = '';
            
            if (searchTerm.length > 2) {
                const quickFiltered = dataBuku.filter(book => 
                    book.judul.toLowerCase().includes(searchTerm) ||
                    book.pengarang.toLowerCase().includes(searchTerm)
                ).slice(0, 3); // Ambil 3 hasil teratas
                
                if (quickFiltered.length > 0) {
                    let resultsHtml = `<ul class="list-group shadow-sm">`;
                    quickFiltered.forEach(book => {
                        resultsHtml += `
                            <li class="list-group-item d-flex justify-content-between align-items-center">
                                <div>
                                    <h6 class="mb-0">${book.judul}</h6>
                                    <small class="text-muted">${book.pengarang} (${book.kategori})</small>
                                </div>
                                <span class="badge rounded-pill text-white" style="background-color: ${book.status === 'Tersedia' ? 'var(--teal-blue)' : 'var(--slate-gray)'};">${book.status}</span>
                            </li>
                        `;
                    });
                    resultsHtml += `</ul>`;
                    quickSearchResults.innerHTML = resultsHtml;
                } else {
                    quickSearchResults.innerHTML = `<p class="alert alert-warning small text-center">Tidak ada hasil ditemukan.</p>`;
                }
            } else if (searchTerm.length === 0) {
                quickSearchResults.innerHTML = '';
            }
        });
    }
});