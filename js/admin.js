// js/admin.js

document.addEventListener('DOMContentLoaded', () => {
    // PENTING: Simulasi Cek Autentikasi Admin.
    // Di aplikasi nyata, fungsi ini SANGAT bergantung pada js/auth.js.
    // Untuk tujuan implementasi CRUD, kita asumsikan admin sudah login.
    
    // Fungsi global getBookData() dan dataBuku diasumsikan sudah ada dari js/data-buku.js
    let currentBooks = getBookData(); 
    let editMode = 'create'; 
    let currentBookId = null; 

    // Pengecekan dasar data
    if (typeof currentBooks === 'undefined') {
        console.error("Gagal memuat data buku. Pastikan js/data-buku.js dimuat.");
        return;
    }

    // --- UTILITY FUNCTIONS ---

    /**
     * Menyimpan data buku ke localStorage dan memperbarui variabel lokal.
     * @param {Array<Object>} books - Array data buku terbaru.
     */
    function saveBooksToStorage(books) {
        localStorage.setItem('libora_books', JSON.stringify(books));
        currentBooks = books; // Perbarui variabel lokal untuk sesi saat ini
    }

    /**
     * Mendapatkan ID Buku Baru (sequential: B001, B002, dst.).
     * @param {Array<Object>} books - Array data buku saat ini.
     * @returns {string} ID baru.
     */
    function generateNewId(books) {
        if (books.length === 0) return 'B001';
        
        // Cari ID tertinggi untuk menentukan ID berikutnya
        const lastBook = books[books.length - 1];
        const lastIdNum = parseInt(lastBook.id.substring(1));
        const newIdNum = lastIdNum + 1;
        
        // Format ke B00x atau B0xx
        return 'B' + String(newIdNum).padStart(3, '0'); 
    }

    /**
     * Merender Tabel Buku di Dashboard Admin.
     */
    function renderBookTable() {
        const tableBody = document.getElementById('book-management-body');
        if (!tableBody) return;

        // Ambil ulang data terbaru dari localStorage (jika ada perubahan dari tab lain)
        currentBooks = getBookData(); 
        tableBody.innerHTML = '';

        currentBooks.forEach(book => {
            const row = document.createElement('tr');
            
            const statusBadge = book.status === 'Tersedia' ? 
                '<span class="badge bg-success">Tersedia</span>' : 
                '<span class="badge bg-danger">Dipinjam</span>';

            row.innerHTML = `
                <td class="small">${book.id}</td>
                <td class="fw-semibold">${book.judul}</td>
                <td>${book.pengarang}</td>
                <td>${book.kategori}</td>
                <td>${statusBadge}</td>
                <td class="text-center">
                    <button class="btn btn-sm btn-primary edit-btn me-2" data-id="${book.id}">Edit</button>
                    <button class="btn btn-sm btn-danger delete-btn" data-id="${book.id}">Hapus</button>
                </td>
            `;
            tableBody.appendChild(row);
        });
    }

    // --- CRUD HANDLERS SETUP ---
    
    const bookForm = document.getElementById('crud-form');
    const modalTitle = document.getElementById('book-modal-title');
    // Inisialisasi Modal Bootstrap
    const bookCrudModal = new bootstrap.Modal(document.getElementById('bookCrudModal'));

    // Buka Modal: Tambah Buku Baru (Tombol Tambah)
    document.getElementById('add-new-book-btn')?.addEventListener('click', () => {
        editMode = 'create';
        currentBookId = null;
        modalTitle.textContent = 'Tambah Buku Baru';
        bookForm.reset();
        document.getElementById('book-id-input').value = 'Otomatis'; 
        bookCrudModal.show();
    });

    // Delegasi Event untuk Edit dan Hapus (Tombol di dalam tabel)
    document.getElementById('book-management-body')?.addEventListener('click', (event) => {
        const target = event.target;
        const bookId = target.getAttribute('data-id');

        // Handler Edit
        if (target.classList.contains('edit-btn')) {
            editMode = 'edit';
            currentBookId = bookId;
            modalTitle.textContent = 'Edit Data Buku';
            
            const bookToEdit = currentBooks.find(b => b.id === bookId);
            if (bookToEdit) {
                // Isi formulir dengan data buku yang akan di-edit
                document.getElementById('book-id-input').value = bookToEdit.id;
                document.getElementById('book-title-input').value = bookToEdit.judul;
                document.getElementById('book-author-input').value = bookToEdit.pengarang;
                document.getElementById('book-category-input').value = bookToEdit.kategori;
                document.getElementById('book-status-input').value = bookToEdit.status;
                document.getElementById('book-cover-input').value = bookToEdit.cover || '';
                
                bookCrudModal.show();
            }
        }

        // Handler Hapus
        if (target.classList.contains('delete-btn')) {
            if (confirm(`Yakin ingin menghapus buku dengan ID ${bookId}? Aksi ini tidak dapat diurungkan.`)) {
                deleteBook(bookId);
            }
        }
    });

    // Submit Form (Logika Create & Update)
    bookForm?.addEventListener('submit', (event) => {
        event.preventDefault();

        // Ambil data dari formulir
        const judul = document.getElementById('book-title-input').value;
        const pengarang = document.getElementById('book-author-input').value;
        const kategori = document.getElementById('book-category-input').value;
        const status = document.getElementById('book-status-input').value;
        const cover = document.getElementById('book-cover-input').value;

        const data = { judul, pengarang, kategori, status, cover };

        if (editMode === 'create') {
            createBook(data);
        } else if (editMode === 'edit' && currentBookId) {
            updateBook(currentBookId, data);
        }
        
        bookCrudModal.hide();
    });

    // 3. Logika Create (Menambah Buku Baru)
    function createBook(data) {
        const newId = generateNewId(currentBooks);
        const newBook = {
            id: newId,
            judul: data.judul,
            pengarang: data.pengarang,
            kategori: data.kategori,
            status: data.status,
            cover: data.cover || 'img/cover-buku/default.jpg' 
        };
        
        currentBooks.push(newBook);
        saveBooksToStorage(currentBooks);
        renderBookTable();
        alert(`Buku "${newBook.judul}" berhasil ditambahkan! ID: ${newId}`);
    }

    // 4. Logika Update (Mengubah Data Buku)
    function updateBook(id, data) {
        const bookIndex = currentBooks.findIndex(b => b.id === id);
        
        if (bookIndex !== -1) {
            currentBooks[bookIndex] = {
                ...currentBooks[bookIndex], 
                judul: data.judul,
                pengarang: data.pengarang,
                kategori: data.kategori,
                status: data.status,
                cover: data.cover || currentBooks[bookIndex].cover
            };
            
            saveBooksToStorage(currentBooks);
            renderBookTable();
            alert(`Buku "${data.judul}" (ID: ${id}) berhasil diperbarui.`);
        }
    }
    
    // 5. Logika Delete (Menghapus Buku)
    function deleteBook(id) {
        const bookIndex = currentBooks.findIndex(b => b.id === id);

        if (bookIndex !== -1) {
            const deletedBook = currentBooks.splice(bookIndex, 1)[0];
            saveBooksToStorage(currentBooks);
            renderBookTable();
            alert(`Buku "${deletedBook.judul}" (ID: ${id}) berhasil dihapus.`);
        }
    }

    // --- INISIALISASI ---
    renderBookTable();
});