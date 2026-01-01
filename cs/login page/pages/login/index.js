let users = {
    'teacher@school.com': {
        name: 'hanousse Teacher',
        password: 'teacher123',
        role: 'teacher'
    },
    'admin@school.com': {
        name: 'Admin User',
        password: 'admin123',
        role: 'admin'
    }
};

// Load users from localStorage if available
window.onload = function () {
    const storedUsers = localStorage.getItem('users');
    if (storedUsers) {
        users = JSON.parse(storedUsers);
    }

    // Check if user is already logged in
    const currentUser = localStorage.getItem('currentUser');
    if (currentUser) {
        const user = JSON.parse(currentUser);
        if (user.role === 'teacher') {
            window.location.href = '../prof/index.html';
        } else if (user.role === 'admin') {
            window.location.href = '../admin/index.html';
        }
    }
};

// Login Form Handler
document.getElementById('loginForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    const messageDiv = document.getElementById('loginMessage');

    if (users[email] && users[email].password === password) {
        const currentUser = {
            email: email,
            name: users[email].name,
            role: users[email].role
        };

        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        messageDiv.innerHTML =
            '<div class="success-message">Login successful! Redirecting...</div>';

        setTimeout(() => {
            if (currentUser.role === 'teacher') {
                window.location.href = '../prof/index.html';
            } else if (currentUser.role === 'admin') {
                window.location.href = '../admin/index.html';
            }
        }, 1000);
    } else {
        messageDiv.innerHTML =
            '<div class="error-message">Invalid email or password!</div>';
        setTimeout(() => {
            messageDiv.innerHTML = '';
        }, 3000);
    }
});
