
        // Data storage
        let teachers = [
            { id: 1, name: 'John Smith', email: 'john@example.com', level: 'Expert', specialization: 'Mathematics' },
            { id: 2, name: 'Sarah Johnson', email: 'sarah@example.com', level: 'Advanced', specialization: 'Computer Science' },
            { id: 3, name: 'Michael Brown', email: 'michael@example.com', level: 'Intermediate', specialization: 'Physics' },
            { id: 4, name: 'Emily Davis', email: 'emily@example.com', level: 'Beginner', specialization: 'English Literature' }
        ];

        let students = [
            { id: 1, name: 'Alice Johnson', studentId: 'STU2025001', email: 'alice@example.com', level: 'Sophomore', major: 'Computer Science' },
            { id: 2, name: 'Bob Williams', studentId: 'STU2025002', email: 'bob@example.com', level: 'Junior', major: 'Mathematics' },
            { id: 3, name: 'Carol Miller', studentId: 'STU2025003', email: 'carol@example.com', level: 'Freshman', major: 'Physics' },
            { id: 4, name: 'David Wilson', studentId: 'STU2025004', email: 'david@example.com', level: 'Senior', major: 'Engineering' }
        ];

        let modules = [
            { id: 1, name: 'Data Structures', code: 'CS201', level: '200', credits: 3, teacher: 'Sarah Johnson' },
            { id: 2, name: 'Calculus I', code: 'MATH101', level: '100', credits: 4, teacher: 'John Smith' },
            { id: 3, name: 'Physics Fundamentals', code: 'PHY101', level: '100', credits: 3, teacher: 'Michael Brown' }
        ];

        let courses = [
            { id: 1, name: 'Computer Science', code: 'CS101', level: 'Bachelor', duration: 4 },
            { id: 2, name: 'Mathematics', code: 'MATH101', level: 'Bachelor', duration: 3 },
            { id: 3, name: 'Physics', code: 'PHY101', level: 'Bachelor', duration: 3 }
        ];

        let sessions = [
            { id: 1, name: 'Fall 2025', start: '2025-09-01', end: '2025-12-15', teacher: 'John Smith', module: 'Calculus I' },
            { id: 2, name: 'Spring 2026', start: '2026-01-15', end: '2026-05-30', teacher: 'Sarah Johnson', module: 'Data Structures' }
        ];

        // Initialize dashboard
        window.onload = function() {
            updateStats();
            displayTeachers();
            displayStudents();
            displayModules();
            displayCourses();
            displaySessions();
            updateTeacherSelects();
            updateModuleSelect();
        };

        // Navigation
        function showSection(section) {
            // Update active menu
            document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
            event.target.classList.add('active');

            // Show selected section
            const sections = ['dashboard', 'teachers', 'students', 'modules', 'courses', 'sessions'];
            sections.forEach(sec => {
                document.getElementById(sec + 'Section').classList.add('hidden');
            });
            document.getElementById(section + 'Section').classList.remove('hidden');
            
            // Update stats when dashboard is shown
            if (section === 'dashboard') {
                updateStats();
            }
        }

        function logout() {
            if (confirm('Are you sure you want to logout?')) {
                alert('Logged out successfully!');
                // In a real app, you would redirect to login page
                window.location.reload();
            }
        }

        // Update dashboard statistics
        function updateStats() {
            document.getElementById('teacherCount').textContent = teachers.length;
            document.getElementById('studentCount').textContent = students.length;
            document.getElementById('moduleCount').textContent = modules.length;
            document.getElementById('courseCount').textContent = courses.length;
        }

        // Teachers Management
        function showTeacherForm() {
            const form = document.getElementById('addTeacherForm');
            form.classList.toggle('hidden');
        }

        document.getElementById('addTeacherForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('teacherName').value;
            const email = document.getElementById('teacherEmail').value;
            const level = document.getElementById('teacherLevel').value;
            const specialization = document.getElementById('teacherSpecialization').value;
            
            const newTeacher = {
                id: teachers.length + 1,
                name,
                email,
                level,
                specialization
            };
            
            teachers.push(newTeacher);
            this.reset();
            displayTeachers();
            updateTeacherSelects();
            updateStats();
            alert('Teacher added successfully!');
            this.classList.add('hidden');
        });

        function displayTeachers() {
            const list = document.getElementById('teachersList');
            
            if (teachers.length === 0) {
                list.innerHTML = '<li class="teacher-item"><p>No teachers added yet.</p></li>';
                return;
            }

            list.innerHTML = teachers.map((teacher, index) => {
                const levelClass = teacher.level.toLowerCase();
                return `
                <li class="teacher-item">
                    <div>
                        <h4>${teacher.name}</h4>
                        <p>Email: ${teacher.email}</p>
                        <p>Specialization: ${teacher.specialization}</p>
                        <span class="level-badge level-${levelClass}">${teacher.level}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editTeacher(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteTeacher(${index})">Delete</button>
                    </div>
                </li>
            `}).join('');
        }

        function deleteTeacher(index) {
            if (confirm('Are you sure you want to delete this teacher?')) {
                teachers.splice(index, 1);
                displayTeachers();
                updateTeacherSelects();
                updateStats();
                alert('Teacher deleted successfully!');
            }
        }

        // Students Management
        function showStudentForm() {
            const form = document.getElementById('addStudentForm');
            form.classList.toggle('hidden');
        }

        document.getElementById('addStudentForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('studentName').value;
            const studentId = document.getElementById('studentId').value;
            const email = document.getElementById('studentEmail').value;
            const level = document.getElementById('studentLevel').value;
            const major = document.getElementById('studentMajor').value;
            
            const newStudent = {
                id: students.length + 1,
                name,
                studentId,
                email,
                level,
                major
            };
            
            students.push(newStudent);
            this.reset();
            displayStudents();
            updateStats();
            alert('Student added successfully!');
            this.classList.add('hidden');
        });

        function displayStudents() {
            const list = document.getElementById('studentsList');
            
            if (students.length === 0) {
                list.innerHTML = '<li class="student-item"><p>No students added yet.</p></li>';
                return;
            }

            list.innerHTML = students.map((student, index) => `
                <li class="student-item">
                    <div>
                        <h4>${student.name} (${student.studentId})</h4>
                        <p>Email: ${student.email}</p>
                        <p>Major: ${student.major}</p>
                        <span class="level-badge">${student.level}</span>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editStudent(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteStudent(${index})">Delete</button>
                    </div>
                </li>
            `).join('');
        }

        function deleteStudent(index) {
            if (confirm('Are you sure you want to delete this student?')) {
                students.splice(index, 1);
                displayStudents();
                updateStats();
                alert('Student deleted successfully!');
            }
        }

        // Modules Management
        document.getElementById('addModuleForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('moduleName').value;
            const code = document.getElementById('moduleCode').value;
            const level = document.getElementById('moduleLevel').value;
            const credits = document.getElementById('moduleCredits').value;
            const teacher = document.getElementById('moduleTeacher').value;
            
            const newModule = {
                id: modules.length + 1,
                name,
                code,
                level,
                credits,
                teacher
            };
            
            modules.push(newModule);
            this.reset();
            displayModules();
            updateModuleSelect();
            updateStats();
            alert('Module added successfully!');
        });

        function displayModules() {
            const list = document.getElementById('modulesList');
            
            if (modules.length === 0) {
                list.innerHTML = '<li class="module-item"><p>No modules added yet.</p></li>';
                return;
            }

            list.innerHTML = modules.map((module, index) => `
                <li class="module-item">
                    <div>
                        <h4>${module.name} (${module.code})</h4>
                        <p>Level: ${module.level} • Credits: ${module.credits}</p>
                        <p>Teacher: ${module.teacher}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editModule(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteModule(${index})">Delete</button>
                    </div>
                </li>
            `).join('');
        }

        function deleteModule(index) {
            if (confirm('Are you sure you want to delete this module?')) {
                modules.splice(index, 1);
                displayModules();
                updateModuleSelect();
                updateStats();
                alert('Module deleted successfully!');
            }
        }

        // Courses Management
        document.getElementById('addCourseForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('courseName').value;
            const code = document.getElementById('courseCode').value;
            const level = document.getElementById('courseLevel').value;
            const duration = document.getElementById('courseDuration').value;
            
            const newCourse = {
                id: courses.length + 1,
                name,
                code,
                level,
                duration
            };
            
            courses.push(newCourse);
            this.reset();
            displayCourses();
            updateStats();
            alert('Course added successfully!');
        });

        function displayCourses() {
            const list = document.getElementById('coursesList');
            
            if (courses.length === 0) {
                list.innerHTML = '<li class="course-item"><p>No courses added yet.</p></li>';
                return;
            }

            list.innerHTML = courses.map((course, index) => `
                <li class="course-item">
                    <div>
                        <h4>${course.name}</h4>
                        <p>${course.code} • ${course.level} • ${course.duration} years</p>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editCourse(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteCourse(${index})">Delete</button>
                    </div>
                </li>
            `).join('');
        }

        function deleteCourse(index) {
            if (confirm('Are you sure you want to delete this course?')) {
                courses.splice(index, 1);
                displayCourses();
                updateStats();
                alert('Course deleted successfully!');
            }
        }

        // Sessions Management
        document.getElementById('addSessionForm').addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('sessionName').value;
            const start = document.getElementById('sessionStart').value;
            const end = document.getElementById('sessionEnd').value;
            const teacher = document.getElementById('teacherSelect').value;
            const module = document.getElementById('moduleSelect').value;
            
            const newSession = {
                id: sessions.length + 1,
                name,
                start,
                end,
                teacher,
                module
            };
            
            sessions.push(newSession);
            this.reset();
            displaySessions();
            alert('Session created successfully!');
        });

        function updateTeacherSelects() {
            const select1 = document.getElementById('teacherSelect');
            const select2 = document.getElementById('moduleTeacher');
            
            select1.innerHTML = '<option value="">Select teacher</option>' + 
                teachers.map(teacher => `<option value="${teacher.name}">${teacher.name} (${teacher.level})</option>`).join('');
            
            select2.innerHTML = '<option value="">Select teacher</option>' + 
                teachers.map(teacher => `<option value="${teacher.name}">${teacher.name} (${teacher.level})</option>`).join('');
        }

        function updateModuleSelect() {
            const select = document.getElementById('moduleSelect');
            select.innerHTML = '<option value="">Select module</option>' + 
                modules.map(module => `<option value="${module.name}">${module.name} (${module.code})</option>`).join('');
        }

        function displaySessions() {
            const list = document.getElementById('sessionsList');
            
            if (sessions.length === 0) {
                list.innerHTML = '<li class="session-item"><p>No sessions created yet.</p></li>';
                return;
            }

            list.innerHTML = sessions.map((session, index) => `
                <li class="session-item">
                    <div>
                        <h4>${session.name}</h4>
                        <p>Duration: ${new Date(session.start).toLocaleDateString()} - ${new Date(session.end).toLocaleDateString()}</p>
                        <p>Teacher: ${session.teacher} | Module: ${session.module}</p>
                    </div>
                    <div class="action-buttons">
                        <button class="edit-btn" onclick="editSession(${index})">Edit</button>
                        <button class="delete-btn" onclick="deleteSession(${index})">Delete</button>
                    </div>
                </li>
            `).join('');
        }

        function deleteSession(index) {
            if (confirm('Are you sure you want to delete this session?')) {
                sessions.splice(index, 1);
                displaySessions();
                alert('Session deleted successfully!');
            }
        }

        // Edit functions (simplified - in a real app these would open edit forms)
        function editTeacher(index) {
            alert(`Edit teacher: ${teachers[index].name}\n\nIn a real application, this would open an edit form.`);
        }

        function editStudent(index) {
            alert(`Edit student: ${students[index].name}\n\nIn a real application, this would open an edit form.`);
        }

        function editModule(index) {
            alert(`Edit module: ${modules[index].name}\n\nIn a real application, this would open an edit form.`);
        }

        function editCourse(index) {
            alert(`Edit course: ${courses[index].name}\n\nIn a real application, this would open an edit form.`);
        }

        function editSession(index) {
            alert(`Edit session: ${sessions[index].name}\n\nIn a real application, this would open an edit form.`);
        }
   