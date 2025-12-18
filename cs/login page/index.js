
       
        let users = {
            'teacher@school.com': { 
                name: 'hanousse Teacher', 
                password: 't123', 
                role: 'teacher' 
            },
            'admin@school.com': { 
                name: 'Admin User', 
                password: 'admin123', 
                role: 'admin' 
            }
        };

        // Load users from localStorage if available
        window.onload = function() {
            const storedUsers = localStorage.getItem('users');
            if (storedUsers) {
                users = JSON.parse(storedUsers);
            }

            // Check if user is already logged in
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                if (user.role === 'teacher') {
                    window.location.href = 'teacher-dashboard.html';
                } else if (user.role === 'admin') {
                    window.location.href = 'admin-dashboard.html';
                }
            }
        };

        // Login Form Handler
        document.getElementById('loginForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const email = document.getElementById('loginEmail').value;
            const password = document.getElementById('loginPassword').value;
            const messageDiv = document.getElementById('loginMessage');

            // Validate credentials
            if (users[email] && users[email].password === password) {
                // Store current user
                const currentUser = {
                    email: email,
                    name: users[email].name,
                    role: users[email].role
                };
                
                // Save to localStorage
                localStorage.setItem('currentUser', JSON.stringify(currentUser));
                
                // Show success message
                messageDiv.innerHTML = '<div class="success-message">Login successful! Redirecting...</div>';
                
                // Redirect based on role
                setTimeout(() => {
                    if (currentUser.role === 'teacher') {
                        window.location.href = 'teacher-dashboard.html';
                    } else if (currentUser.role === 'admin') {
                        window.location.href = 'admin-dashboard.html';
                    }
                }, 1500);
            } else {
                // Show error message
                messageDiv.innerHTML = '<div class="error-message">Invalid email or password!</div>';
                setTimeout(() => {
                    messageDiv.innerHTML = '';
                }, 3000);
            }
        });

        // Contact Admin Modal Functions
        function openContactModal() {
            document.getElementById('contactModal').style.display = 'flex';
            
            // Pre-fill email if user is logged in
            const currentUser = localStorage.getItem('currentUser');
            if (currentUser) {
                const user = JSON.parse(currentUser);
                document.getElementById('contactEmail').value = user.email;
                document.getElementById('contactName').value = user.name;
            }
        }

        function closeContactModal() {
            document.getElementById('contactModal').style.display = 'none';
            document.getElementById('contactName').value = '';
            document.getElementById('contactEmail').value = '';
            document.getElementById('contactSubject').value = '';
            document.getElementById('contactMessage').value = '';
        }

        function submitContactForm() {
            const name = document.getElementById('contactName').value;
            const email = document.getElementById('contactEmail').value;
            const subject = document.getElementById('contactSubject').value;
            const message = document.getElementById('contactMessage').value;

            // Basic validation
            if (!name || !email || !subject || !message) {
                alert('Please fill in all fields');
                return;
            }

            // In a real application, this would send the data to a server
            // For demo purposes, we'll just show a success message
            
            // Get existing contact requests or initialize array
            let contactRequests = JSON.parse(localStorage.getItem('contactRequests')) || [];
            
            // Add new contact request
            const newRequest = {
                id: Date.now(),
                name: name,
                email: email,
                subject: subject,
                message: message,
                timestamp: new Date().toISOString(),
                status: 'pending'
            };
            
            contactRequests.push(newRequest);
            localStorage.setItem('contactRequests', JSON.stringify(contactRequests));

            // Show success message
            alert('Thank you! Your message has been sent to the administrator. We will contact you soon.');
            
            // Close modal and reset form
            closeContactModal();
            
            // Show success message on login page
            const messageDiv = document.getElementById('loginMessage');
            messageDiv.innerHTML = '<div class="success-message">Your contact request has been submitted successfully!</div>';
            setTimeout(() => {
                messageDiv.innerHTML = '';
            }, 3000);
        }

        // Close modal when clicking outside
        window.onclick = function(event) {
            const modal = document.getElementById('contactModal');
            if (event.target === modal) {
                closeContactModal();
            }
        }

        // Close modal with Escape key
        document.addEventListener('keydown', function(event) {
            if (event.key === 'Escape') {
                closeContactModal();
            }
        });

    
