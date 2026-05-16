document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');

    // Initialize mock database if not exists
    if (!localStorage.getItem('usersDB')) {
        const initialDB = [
            { id: 1, name: 'Admin User', email: 'admin@luxestay.com', password: 'admin', phone: '1234567890', role: 'ADMIN' }
        ];
        localStorage.setItem('usersDB', JSON.stringify(initialDB));
    }

    if (loginForm) {
        loginForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-message');
            
            try {
                // In a real app, this would be an API call
                const usersDB = JSON.parse(localStorage.getItem('usersDB'));
                const user = usersDB.find(u => u.email === email && u.password === password);

                if (user) {
                    // Mock JWT token
                    localStorage.setItem('token', 'mock-jwt-token-' + user.id);
                    
                    // Don't save password in session
                    const sessionUser = { ...user };
                    delete sessionUser.password;
                    
                    localStorage.setItem('user', JSON.stringify(sessionUser));
                    localStorage.setItem('role', user.role);
                    
                    window.location.href = user.role === 'ADMIN' ? 'admin.html' : 'dashboard.html';
                } else {
                    errorMsg.textContent = 'Invalid email or password. If you do not have an account, please sign up.';
                    errorMsg.style.display = 'block';
                }
            } catch (error) {
                errorMsg.textContent = 'Connection error. Please try again later.';
                errorMsg.style.display = 'block';
            }
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const phone = document.getElementById('phone').value;
            const password = document.getElementById('password').value;
            const errorMsg = document.getElementById('error-message');
            const successMsg = document.getElementById('success-message');

            errorMsg.style.display = 'none';
            successMsg.style.display = 'none';

            if (password.length < 6) {
                errorMsg.textContent = 'Password must be at least 6 characters long';
                errorMsg.style.display = 'block';
                return;
            }

            try {
                // In a real app, this would be an API call
                const usersDB = JSON.parse(localStorage.getItem('usersDB'));
                
                if (usersDB.find(u => u.email === email)) {
                    errorMsg.textContent = 'An account with this email already exists. Please login.';
                    errorMsg.style.display = 'block';
                    return;
                }

                const newUser = {
                    id: Date.now(), // Generate mock ID
                    name,
                    email,
                    phone,
                    password,
                    role: 'USER'
                };

                usersDB.push(newUser);
                localStorage.setItem('usersDB', JSON.stringify(usersDB));

                successMsg.textContent = 'Registration successful! Redirecting to login...';
                successMsg.style.display = 'block';
                
                // Extra Feature: Mock Email Confirmation message
                alert(`A confirmation email has been sent to ${email}. Please check your inbox!`);
                
                setTimeout(() => {
                    window.location.href = 'login.html';
                }, 2000);
            } catch (error) {
                errorMsg.textContent = 'Registration failed. Please try again.';
                errorMsg.style.display = 'block';
            }
        });
    }
});
