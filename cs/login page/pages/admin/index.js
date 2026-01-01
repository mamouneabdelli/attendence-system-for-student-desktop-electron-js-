/* =======================
   🔐 حماية الصفحة (Admin فقط)
======================= */
const currentUser = JSON.parse(localStorage.getItem('currentUser'));

if (!currentUser || currentUser.role !== 'admin') {
    window.location.href = '../login/index.html';
}

/* =======================
   📦 البيانات (Demo Data)
======================= */
let teachers = [
    { id: 1, name: 'hanousse', email: 'john@example.com', level: 'Expert', specialization: 'security' },
    { id: 2, name: 'kouihla najib', email: 'sarah@example.com', level: 'Advanced', specialization: 'graph' },
    { id: 3, name: 'kouihla zinedine', email: 'michael@example.com', level: 'Intermediate', specialization: 'algo' },
];

let students = [
    { id: 1, name: 'boulahia yahia', studentId: 'STU2025001', email: 'yahia@example.com', level: 'Sophomore', major: 'Computer Science' },
    { id: 2, name: 'abdelli abdelmoumen', studentId: 'STU2025002', email: 'abdelli@example.com', level: 'Junior', major: 'Mathematics' },
    { id: 3, name: 'brahmia lokman', studentId: 'STU2025003', email: 'brahmial@example.com', level: 'Freshman', major: 'Physics' },
    { id: 4, name: 'sid ali', studentId: 'STU2025004', email: 'sidali@example.com', level: 'Senior', major: 'Engineering' }
];

let modules = [
    { id: 1, name: 'Data Structures', code: 'CS201', level: '200', credits: 3, teacher: 'hanousse' },
    { id: 2, name: 'Calculus I', code: 'MATH101', level: '100', credits: 4, teacher: 'najib' },
    { id: 3, name: 'Physics Fundamentals', code: 'PHY101', level: '100', credits: 3, teacher: 'uwo' }
];

let courses = [
    { id: 1, name: 'Computer Science', code: 'CS101', level: 'Bachelor', duration: 4 },
    { id: 2, name: 'Mathematics', code: 'MATH101', level: 'Bachelor', duration: 3 },
    { id: 3, name: 'Physics', code: 'PHY101', level: 'Bachelor', duration: 3 }
];

let sessions = [
    { id: 1, name: 'Fall 2025', start: '2025-09-01', end: '2025-12-15', teacher: 'hanousse', module: 'Calculus I' },
    { id: 2, name: 'Spring 2026', start: '2026-01-15', end: '2026-05-30', teacher: 'najib', module: 'Data Structures' }
];

/* =======================
   🚀 عند التحميل
======================= */
window.onload = function () {
    updateStats();
    displayTeachers();
    displayStudents();
    displayModules();
    displayCourses();
    displaySessions();
    updateTeacherSelects();
    updateModuleSelect();
};

/* =======================
   🧭 التنقل بين الأقسام
======================= */
function showSection(section) {
    document.querySelectorAll('.sidebar-menu a').forEach(a => a.classList.remove('active'));
    event.target.classList.add('active');

    const sections = ['dashboard', 'teachers', 'students', 'modules', 'courses', 'sessions'];
    sections.forEach(sec => {
        document.getElementById(sec + 'Section').classList.add('hidden');
    });

    document.getElementById(section + 'Section').classList.remove('hidden');

    if (section === 'dashboard') updateStats();
}

/* =======================
   🚪 Logout (مُصلَّح)
======================= */
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        localStorage.removeItem('currentUser');
        window.location.href = '../login/index.html';
    }
}

/* =======================
   📊 الإحصائيات
======================= */
function updateStats() {
    document.getElementById('teacherCount').textContent = teachers.length;
    document.getElementById('studentCount').textContent = students.length;
    document.getElementById('moduleCount').textContent = modules.length;
    document.getElementById('courseCount').textContent = courses.length;
}

/* =======================
   👨‍🏫 Teachers
======================= */
function showTeacherForm() {
    document.getElementById('addTeacherForm').classList.toggle('hidden');
}

document.getElementById('addTeacherForm').addEventListener('submit', function (e) {
    e.preventDefault();

    teachers.push({
        id: teachers.length + 1,
        name: teacherName.value,
        email: teacherEmail.value,
        level: teacherLevel.value,
        specialization: teacherSpecialization.value
    });

    this.reset();
    displayTeachers();
    updateTeacherSelects();
    updateStats();
    alert('Teacher added successfully!');
    this.classList.add('hidden');
});

function displayTeachers() {
    const list = document.getElementById('teachersList');
    list.innerHTML = teachers.map((t, i) => `
        <li class="teacher-item">
            <div>
                <h4>${t.name}</h4>
                <p>Email: ${t.email}</p>
                <p>Specialization: ${t.specialization}</p>
                <span class="level-badge">${t.level}</span>
            </div>
            <div class="action-buttons">
                <button onclick="deleteTeacher(${i})">Delete</button>
            </div>
        </li>
    `).join('');
}

function deleteTeacher(i) {
    if (confirm('Delete this teacher?')) {
        teachers.splice(i, 1);
        displayTeachers();
        updateStats();
    }
}

/* =======================
   👨‍🎓 Students
======================= */
function showStudentForm() {
    document.getElementById('addStudentForm').classList.toggle('hidden');
}

document.getElementById('addStudentForm').addEventListener('submit', function (e) {
    e.preventDefault();

    students.push({
        id: students.length + 1,
        name: studentName.value,
        studentId: studentId.value,
        email: studentEmail.value,
        level: studentLevel.value,
        major: studentMajor.value
    });

    this.reset();
    displayStudents();
    updateStats();
    alert('Student added successfully!');
    this.classList.add('hidden');
});

function displayStudents() {
    const list = document.getElementById('studentsList');
    list.innerHTML = students.map((s, i) => `
        <li class="student-item">
            <h4>${s.name} (${s.studentId})</h4>
            <p>${s.email}</p>
            <button onclick="deleteStudent(${i})">Delete</button>
        </li>
    `).join('');
}

function deleteStudent(i) {
    if (confirm('Delete this student?')) {
        students.splice(i, 1);
        displayStudents();
        updateStats();
    }
}

/* =======================
   📚 Modules / Courses / Sessions
======================= */
function updateTeacherSelects() {
    teacherSelect.innerHTML = teachers.map(t => `<option>${t.name}</option>`).join('');
    moduleTeacher.innerHTML = teacherSelect.innerHTML;
}

function updateModuleSelect() {
    moduleSelect.innerHTML = modules.map(m => `<option>${m.name}</option>`).join('');
}

function displayModules() {
    modulesList.innerHTML = modules.map(m => `<li>${m.name}</li>`).join('');
}

function displayCourses() {
    coursesList.innerHTML = courses.map(c => `<li>${c.name}</li>`).join('');
}

function displaySessions() {
    sessionsList.innerHTML = sessions.map(s => `<li>${s.name}</li>`).join('');
}
