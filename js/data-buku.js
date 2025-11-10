// js/data-buku.js

// Fungsi untuk mendapatkan data buku dari localStorage
// Jika localStorage kosong, gunakan data awal (8 buku), lalu simpan ke localStorage
localStorage.removeItem('libora_books');
function getBookData() {
    const storedData = localStorage.getItem('libora_books');
    
    if (storedData) {
        // Jika ada data di localStorage, gunakan data tersebut
        return JSON.parse(storedData);
    } else {
        // Data Awal (8 Buku)
        const initialBooks = [
            {
                id: 'B001',
                judul: 'Filosofi Teras',
                pengarang: 'Henry Manampiring',
                kategori: 'Non-Fiksi',
                status: 'Tersedia',
                cover: 'img/filosofi teras.jpg'
            },
            {
                id: 'B002',
                judul: 'Bumi Manusia',
                pengarang: 'Pramoedya Ananta Toer',
                kategori: 'Fiksi',
                status: 'Dipinjam',
                cover: 'img/bumi manusia.jpg'
            },
            {
                id: 'B003',
                judul: 'Sapiens: Riwayat Singkat Umat Manusia',
                pengarang: 'Yuval Noah Harari',
                kategori: 'Sejarah',
                status: 'Tersedia',
                cover: 'img/sapiens.jpeg'
            },
            {
                id: 'B004',
                judul: 'Clean Code: Handbook of Agile Software Craftsmanship',
                pengarang: 'Robert C. Martin',
                kategori: 'Sains',
                status: 'Tersedia',
                cover: 'img/clean code.jpg'
            },
            {
                id: 'B005',
                judul: 'Atomic Habits: Perubahan Kecil, Hasil Luar Biasa',
                pengarang: 'James Clear',
                kategori: 'Self-Improvement',
                status: 'Tersedia',
                cover: 'img/atomic habits.jpg' 
            },
            {
                id: 'B006',
                judul: 'The Lord of the Rings: The Fellowship of the Ring',
                pengarang: 'J.R.R. Tolkien',
                kategori: 'Fiksi',
                status: 'Tersedia',
                cover: 'img/the lord of the rings.jpg'
            },
            {
                id: 'B007',
                judul: 'Dasar-Dasar Pemrograman Web',
                pengarang: 'Rizky Fadillah',
                kategori: 'Sains',
                status: 'Dipinjam',
                cover: 'img/dasar pemrograman.jpg'
            },
            {
                id: 'B008',
                judul: 'Sejarah Dunia yang Disembunyikan',
                pengarang: 'Jonathan Black',
                kategori: 'Sejarah',
                status: 'Tersedia',
                cover: 'img/sejarah dunia yang disembunyikan.jpg'
            }
        ];
        
        // Simpan data awal ke localStorage untuk pertama kali
        localStorage.setItem('libora_books', JSON.stringify(initialBooks));
        
        return initialBooks;
    }
}

// Global variable yang akan digunakan di script lain
const dataBuku = getBookData();