// js/auth.js

document.addEventListener('DOMContentLoaded', () => {

    // --- UTILITY FUNCTIONS ---

    // Mendapatkan daftar anggota dari localStorage (untuk simulasi register)
    function getMembers() {
        const storedMembers = localStorage.getItem('libora_members');
        return storedMembers ? JSON.parse(storedMembers) : [];
    }

    // Menyimpan daftar anggota ke localStorage
    function saveMembers(members) {
        localStorage.setItem('libora_members', JSON.stringify(members));
    }

    // Mengambil status login admin dari sessionStorage
    function isAdminLoggedIn() {
        return sessionStorage.getItem('libora_admin_status') === 'logged_in';
    }

    // --- ADMIN AUTHENTICATION LOGIC ---

    const adminLoginForm = document.getElementById('adminLoginForm');
    
    if (adminLoginForm) {
        adminLoginForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const usernameInput = document.getElementById('adminUsername').value;
            const passwordInput = document.getElementById('adminPassword').value;

            // Kredensial Admin Hardcoded (Sesuai catatan di admin-login.html)
            const correctUsername = 'admin';
            const correctPassword = 'libora123';

            if (usernameInput === correctUsername && passwordInput === correctPassword) {
                // Login Berhasil: Set status di sessionStorage
                sessionStorage.setItem('libora_admin_status', 'logged_in');
                alert('Login Admin Berhasil! Selamat datang.');
                window.location.href = 'admin-dashboard.html';
            } else {
                // Login Gagal
                alert('Username atau Password salah! (Simulasi: admin / libora123)');
            }
        });
    }

    // Admin Logout Handler (Di admin-dashboard.html)
    const adminLogoutBtn = document.getElementById('adminLogoutBtn');
    if (adminLogoutBtn) {
        adminLogoutBtn.addEventListener('click', () => {
            sessionStorage.removeItem('libora_admin_status');
            alert('Anda telah Logout sebagai Admin.');
            window.location.href = 'admin-login.html';
        });
    }

    // Pengecekan Akses Dashboard Admin
    if (window.location.pathname.endsWith('admin-dashboard.html')) {
        if (!isAdminLoggedIn()) {
            // Jika belum login, redirect ke halaman login
            alert('Akses ditolak. Silakan login sebagai Admin terlebih dahulu.');
            window.location.href = 'admin-login.html';
        }
    }


    // --- USER REGISTER LOGIC ---

    const registerForm = document.getElementById('registerForm');
    
    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const name = document.getElementById('registerName').value.trim();
            const email = document.getElementById('registerEmail').value.trim();
            const password = document.getElementById('registerPassword').value;

            if (name === '' || email === '' || password === '') {
                alert('Semua kolom harus diisi.');
                return;
            }

            let members = getMembers();

            // Cek apakah email sudah terdaftar
            if (members.some(member => member.email === email)) {
                alert('Email ini sudah terdaftar. Silakan gunakan email lain atau login.');
                return;
            }

            // Simulasi pendaftaran: Simpan data ke localStorage
            const newMember = {
                id: 'A' + String(members.length + 1).padStart(3, '0'),
                name: name,
                email: email,
                password: password // Dalam dunia nyata, password harus di-hash!
            };

            members.push(newMember);
            saveMembers(members);

            alert(`Registrasi ${name} Berhasil! Silakan Login.`);
            window.location.href = 'login.html';
        });
    }

    // --- USER LOGIN LOGIC (Simulasi) ---

    const loginForm = document.getElementById('loginForm');

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const emailInput = document.getElementById('loginEmail').value;
            const passwordInput = document.getElementById('loginPassword').value;
            
            const members = getMembers();
            
            const user = members.find(m => m.email === emailInput && m.password === passwordInput);

            if (user) {
                // Simulasi Login Berhasil: Simpan status login user ke localStorage
                localStorage.setItem('libora_user_status', JSON.stringify({
                    isLoggedIn: true,
                    name: user.name,
                    id: user.id
                }));
                
                alert(`Login Berhasil! Selamat datang, ${user.name}.`);
                window.location.href = 'index.html'; // Redirect ke halaman utama
            } else {
                alert('Email atau Password salah, atau akun belum terdaftar.');
            }
        });
    }
});