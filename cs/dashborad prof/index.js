let students = [
  { id: 1, name: "abdelli abdelmoumen", code: "STD001", status: "present", excluded: false },
  { id: 2, name: "boulahia yahia", code: "STD002", status: "present", excluded: false },
  { id: 3, name: "brahmia lokman", code: "STD003", status: "absent", excluded: false },
  { id: 4, name: "Sid ali", code: "STD004", status: "present", excluded: false },
  { id: 5, name: "halitim amine", code: "STD005", status: "absent", excluded: false }
];

let justifications = [
  { id: 1, studentId: 3, studentName: "brahmia lokman", date: "2024-12-08", reason: "Medical appointment", document: "medical_certificate.pdf", status: "pending", submittedAt: "2024-12-08 10:30" },
  { id: 2, studentId: 5, studentName: "halitim amine", date: "2024-12-07", reason: "Family emergency", document: null, status: "pending", submittedAt: "2024-12-07 15:20" }
];

let dailyCode = "";
let currentJustificationFilter = 'all';
let apiBaseUrl = "http://localhost:8000/api"; // Change this to your Laravel API URL

// API Configuration
const apiConfig = {
  baseUrl: "http://localhost:8000/api",
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
};

document.addEventListener('DOMContentLoaded', function() {
  init();
  // Test API connection on startup
  // testApiConnection();
});

async function testApiConnection() {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/test`);
    if (response.ok) {
      console.log("API Connection Successful");
    }
  } catch (error) {
    console.warn("API not available, using local data:", error);
  }
}

function init() {
  generateQRCode();
  updateDashboard();
  renderStudentsList();
  renderExcludedList();
  renderJustificationsList();
  updateJustificationBadge();
  setInterval(updateCodeTimer, 1000);
  
  // Load settings from localStorage
  loadSettings();
}

function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(el => {
    el.style.display = 'none';
  });
  
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('active');
  });
  
  document.getElementById(sectionId + '-section').style.display = 'block';
  
  const activeNav = Array.from(document.querySelectorAll('.nav-link')).find(el => 
    el.textContent.toLowerCase().includes(sectionId)
  );
  if (activeNav) {
    activeNav.classList.add('active');
  }
  
  if (sectionId === 'dashboard') {
    updateDashboard();
  }
}

function generateQRCode() {
  dailyCode = Math.random().toString(36).substring(2, 8).toUpperCase();
  document.getElementById('qrcode').innerHTML = '';
  
  new QRCode(document.getElementById('qrcode'), {
    text: `ATTENDANCE:${dailyCode}:${new Date().toISOString().split('T')[0]}`,
    width: 200,
    height: 200,
    colorDark: "#344767",
    colorLight: "#ffffff"
  });
  
  students.forEach(s => { 
    if (!s.excluded) s.status = "absent"; 
  });
  
  updateDashboard();
  alert("New QR code generated! All students marked as absent.");
}

function updateCodeTimer() {
  const now = new Date();
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  const diff = midnight - now;
  const h = Math.floor(diff / 3600000);
  const m = Math.floor((diff % 3600000) / 60000);
  const s = Math.floor((diff % 60000) / 1000);
  const el = document.getElementById('code-timer');
  if (el) el.textContent = `Code expires in ${h}h ${m}m ${s}s`;
}

function updateDashboard() {
  const activeStudents = students.filter(s => !s.excluded);
  const present = activeStudents.filter(s => s.status === 'present').length;
  const absent = activeStudents.filter(s => s.status === 'absent').length;
  const rate = activeStudents.length > 0 ? Math.round((present / activeStudents.length) * 100) : 0;
  
  document.getElementById('total-students').textContent = activeStudents.length;
  document.getElementById('present-today').textContent = present;
  document.getElementById('absent-today').textContent = absent;
  document.getElementById('attendance-rate').textContent = rate + '%';
  
  const todayList = document.getElementById('today-attendance-list');
  todayList.innerHTML = activeStudents.map(s => `
    <div class="student-item">
      <div><strong>${s.name}</strong><br><small class="text-muted">${s.code}</small></div>
      <span class="badge-status ${s.status === 'present' ? 'badge-present' : 'badge-absent'}">
        ${s.status === 'present' ? 'Present' : 'Absent'}
      </span>
    </div>
  `).join('') || '<p class="text-muted">No students today</p>';
}

function renderStudentsList() {
  const active = students.filter(s => !s.excluded);
  const container = document.getElementById('students-list');
  
  if (active.length === 0) {
    container.innerHTML = '<p class="text-muted">No active students</p>';
  } else {
    container.innerHTML = active.map(s => {
      const hasJustification = justifications.some(j => j.studentId === s.id && j.status === 'pending');
      return `
      <div class="student-item">
        <div>
          <strong>${s.name}</strong><br>
          <small class="text-muted">${s.code}</small>
          ${hasJustification ? '<span class="badge bg-warning ms-2"><i class="fas fa-file-alt"></i> Pending Justification</span>' : ''}
        </div>
        <div>
          <span class="badge-status ${s.status === 'present' ? 'badge-present' : 'badge-absent'}">
            ${s.status === 'present' ? 'Present' : 'Absent'}
          </span>
          <button class="btn-action btn-mark-present ms-1" onclick="markAttendance(${s.id}, 'present')" title="Mark Present">
            <i class="fas fa-check"></i>
          </button>
          <button class="btn-action btn-mark-absent ms-1" onclick="markAttendance(${s.id}, 'absent')" title="Mark Absent">
            <i class="fas fa-times"></i>
          </button>
          <button class="btn btn-sm btn-info ms-1" onclick="submitJustification(${s.id})" title="Submit Justification">
            <i class="fas fa-file-alt"></i>
          </button>
          <button class="btn btn-sm btn-warning ms-1" onclick="toggleExclude(${s.id})" title="Exclude Student">
            <i class="fas fa-user-slash"></i>
          </button>
          <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})" title="Delete Student">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `}).join('');
  }
  updateDashboard();
}

function filterStudents() {
  const search = document.getElementById('student-search').value.toLowerCase();
  const filtered = students.filter(s => !s.excluded && 
    (s.name.toLowerCase().includes(search) || s.code.toLowerCase().includes(search)));
  
  const container = document.getElementById('students-list');
  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted">No students found</p>';
    return;
  }
  
  container.innerHTML = filtered.map(s => `
    <div class="student-item">
      <div>
        <strong>${s.name}</strong><br>
        <small class="text-muted">${s.code}</small>
      </div>
      <div>
        <span class="badge-status ${s.status === 'present' ? 'badge-present' : 'badge-absent'}">
          ${s.status === 'present' ? 'Present' : 'Absent'}
        </span>
        <button class="btn-action btn-mark-present ms-1" onclick="markAttendance(${s.id}, 'present')">
          <i class="fas fa-check"></i>
        </button>
        <button class="btn-action btn-mark-absent ms-1" onclick="markAttendance(${s.id}, 'absent')">
          <i class="fas fa-times"></i>
        </button>
      </div>
    </div>
  `).join('');
}

function markAttendance(id, status) {
  const student = students.find(s => s.id === id);
  if (student) { 
    student.status = status; 
    renderStudentsList(); 
  }
}

function addStudent() {
  const name = prompt("Enter student name:");
  if (!name) return;
  
  const code = prompt("Enter student code (or leave blank for auto-generate):");
  const finalCode = code || "STD" + String(students.length + 1).padStart(3, '0');
  
  students.push({ 
    id: Date.now(), 
    name, 
    code: finalCode, 
    status: "absent", 
    excluded: false 
  });
  
  renderStudentsList();
  alert("Student added successfully!");
}

function deleteStudent(id) {
  if (confirm("Are you sure you want to delete this student?")) {
    students = students.filter(s => s.id !== id);
    renderStudentsList();
    renderExcludedList();
  }
}

function toggleExclude(id) {
  const student = students.find(s => s.id === id);
  if (student) { 
    student.excluded = !student.excluded; 
    renderStudentsList(); 
    renderExcludedList(); 
    
    if (student.excluded) {
      alert(`${student.name} has been excluded from attendance tracking.`);
    } else {
      alert(`${student.name} has been restored to attendance tracking.`);
    }
  }
}

function submitJustification(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;
  
  const reason = prompt("Enter justification reason:");
  if (!reason) return;
  
  const date = prompt("Enter absence date (YYYY-MM-DD):", new Date().toISOString().split('T')[0]);
  if (!date) return;
  
  const hasDocument = confirm("Do you have a supporting document? (This is a simulation - click OK if yes)");
  
  justifications.push({
    id: Date.now(),
    studentId: student.id,
    studentName: student.name,
    date: date,
    reason: reason,
    document: hasDocument ? "document_" + Date.now() + ".pdf" : null,
    status: "pending",
    submittedAt: new Date().toLocaleString()
  });
  
  renderJustificationsList();
  updateJustificationBadge();
  renderStudentsList();
  alert("Justification submitted successfully!");
}

function renderJustificationsList() {
  let filtered = justifications;
  if (currentJustificationFilter !== 'all') {
    filtered = justifications.filter(j => j.status === currentJustificationFilter);
  }
  
  const el = document.getElementById('justifications-list');
  const noEl = document.getElementById('no-justifications');
  
  if (filtered.length === 0) {
    el.innerHTML = '';
    noEl.style.display = 'block';
  } else {
    el.innerHTML = filtered.map(j => `
      <div class="justification-item ${j.status}">
        <div class="d-flex justify-content-between align-items-start mb-2">
          <div>
            <strong>${j.studentName}</strong>
            <br><small class="text-muted">Date: ${j.date}</small>
            <br><small class="text-muted">Submitted: ${j.submittedAt}</small>
          </div>
          <span class="badge-status badge-${j.status === 'pending' ? 'pending' : j.status === 'approved' ? 'present' : 'absent'}">
            ${j.status.toUpperCase()}
          </span>
        </div>
        <p class="mb-2"><strong>Reason:</strong> ${j.reason}</p>
        ${j.document ? `<p class="mb-2"><i class="fas fa-paperclip"></i> <small>${j.document}</small></p>` : ''}
        ${j.status === 'pending' ? `
          <div class="mt-2">
            <button class="btn btn-sm btn-success me-2" onclick="handleJustification(${j.id}, 'approved')">
              <i class="fas fa-check"></i> Approve
            </button>
            <button class="btn btn-sm btn-danger me-2" onclick="handleJustification(${j.id}, 'rejected')">
              <i class="fas fa-times"></i> Reject
            </button>
            <button class="btn btn-sm btn-info" onclick="viewJustificationDetails(${j.id})">
              <i class="fas fa-eye"></i> View Details
            </button>
          </div>
        ` : ''}
      </div>
    `).join('');
    noEl.style.display = 'none';
  }
}

function filterJustifications(filter) {
  currentJustificationFilter = filter;
  renderJustificationsList();
}

function handleJustification(id, action) {
  const justification = justifications.find(j => j.id === id);
  if (!justification) return;
  
  if (confirm(`Are you sure you want to ${action} this justification?`)) {
    justification.status = action;
    renderJustificationsList();
    updateJustificationBadge();
    renderStudentsList();
    alert(`Justification ${action} successfully!`);
  }
}

function viewJustificationDetails(id) {
  const justification = justifications.find(j => j.id === id);
  if (!justification) return;
  
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="mb-3">
      <strong>Student:</strong> ${justification.studentName}
    </div>
    <div class="mb-3">
      <strong>Absence Date:</strong> ${justification.date}
    </div>
    <div class="mb-3">
      <strong>Submitted At:</strong> ${justification.submittedAt}
    </div>
    <div class="mb-3">
      <strong>Reason:</strong><br>
      <p class="mt-2">${justification.reason}</p>
    </div>
    ${justification.document ? `
      <div class="mb-3">
        <strong>Document:</strong><br>
        <a href="#" class="btn btn-sm btn-outline-primary mt-2">
          <i class="fas fa-download"></i> Download ${justification.document}
        </a>
      </div>
    ` : '<div class="mb-3"><em>No document attached</em></div>'}
    <div class="mb-3">
      <strong>Status:</strong> 
      <span class="badge-status badge-${justification.status === 'pending' ? 'pending' : justification.status === 'approved' ? 'present' : 'absent'}">
        ${justification.status.toUpperCase()}
      </span>
    </div>
  `;
  
  document.getElementById('justificationModal').style.display = 'block';
}

function closeModal(event) {
  if (!event || event.target.classList.contains('modal-overlay')) {
    document.getElementById('justificationModal').style.display = 'none';
  }
}

function updateJustificationBadge() {
  const pending = justifications.filter(j => j.status === 'pending').length;
  const badge = document.getElementById('justification-badge');
  if (pending > 0) {
    badge.textContent = pending;
    badge.style.display = 'flex';
  } else {
    badge.style.display = 'none';
  }
}

function renderExcludedList() {
  const excluded = students.filter(s => s.excluded);
  const el = document.getElementById('excluded-list');
  const noEl = document.getElementById('no-excluded');
  if (excluded.length === 0) {
    el.innerHTML = '';
    noEl.style.display = 'block';
  } else {
    el.innerHTML = excluded.map(s => `
      <div class="student-item">
        <div><strong>${s.name}</strong><br><small class="text-muted">${s.code}</small></div>
        <div>
          <button class="btn btn-sm btn-success" onclick="toggleExclude(${s.id})" title="Restore Student">
            <i class="fas fa-undo"></i> Restore
          </button>
          <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})" title="Delete Permanently">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    noEl.style.display = 'none';
  }
}

function filterExcluded() {
  const search = document.getElementById('excluded-search').value.toLowerCase();
  const filtered = students.filter(s => s.excluded && 
    (s.name.toLowerCase().includes(search) || s.code.toLowerCase().includes(search)));
  
  const el = document.getElementById('excluded-list');
  const noEl = document.getElementById('no-excluded');
  
  if (filtered.length === 0) {
    el.innerHTML = '';
    noEl.style.display = 'block';
  } else {
    el.innerHTML = filtered.map(s => `
      <div class="student-item">
        <div><strong>${s.name}</strong><br><small class="text-muted">${s.code}</small></div>
        <div>
          <button class="btn btn-sm btn-success" onclick="toggleExclude(${s.id})">
            <i class="fas fa-undo"></i> Restore
          </button>
          <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})">
            <i class="fas fa-trash"></i> Delete
          </button>
        </div>
      </div>
    `).join('');
    noEl.style.display = 'none';
  }
}

function exportData() {
  const data = {
    students: students,
    justifications: justifications,
    exportDate: new Date().toLocaleString()
  };
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = 'attendance_data.json';
  link.click();
  URL.revokeObjectURL(url);
}

function saveSettings() {
  const schoolName = document.getElementById('school-name').value;
  const academicYear = document.getElementById('academic-year').value;
  localStorage.setItem('schoolName', schoolName);
  localStorage.setItem('academicYear', academicYear);
  alert('Settings saved successfully!');
}

function loadSettings() {
  const schoolName = localStorage.getItem('schoolName');
  const academicYear = localStorage.getItem('academicYear');
  
  if (schoolName) {
    document.getElementById('school-name').value = schoolName;
  }
  if (academicYear) {
    document.getElementById('academic-year').value = academicYear;
  }
}

// ==================== API FUNCTIONS ====================
// These are the functions you'll use to connect to your Laravel backend

async function fetchStudents() {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/students`, {
      method: 'GET',
      headers: apiConfig.headers
    });
    
    if (response.ok) {
      const data = await response.json();
      students = data; // Replace local data with API data
      renderStudentsList();
      return true;
    }
  } catch (error) {
    console.error("Error fetching students:", error);
    return false;
  }
}

async function addStudentAPI(studentData) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/students`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(studentData)
    });
    
    if (response.ok) {
      const newStudent = await response.json();
      students.push(newStudent);
      renderStudentsList();
      return true;
    }
  } catch (error) {
    console.error("Error adding student:", error);
    return false;
  }
}

async function updateAttendanceAPI(studentId, status) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/attendance/${studentId}`, {
      method: 'PUT',
      headers: apiConfig.headers,
      body: JSON.stringify({ status: status })
    });
    
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error("Error updating attendance:", error);
    return false;
  }
}

async function fetchJustifications() {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/justifications`, {
      method: 'GET',
      headers: apiConfig.headers
    });
    
    if (response.ok) {
      const data = await response.json();
      justifications = data;
      renderJustificationsList();
      updateJustificationBadge();
      return true;
    }
  } catch (error) {
    console.error("Error fetching justifications:", error);
    return false;
  }
}

async function submitJustificationAPI(justificationData) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/justifications`, {
      method: 'POST',
      headers: apiConfig.headers,
      body: JSON.stringify(justificationData)
    });
    
    if (response.ok) {
      const newJustification = await response.json();
      justifications.push(newJustification);
      renderJustificationsList();
      updateJustificationBadge();
      return true;
    }
  } catch (error) {
    console.error("Error submitting justification:", error);
    return false;
  }
}

async function handleJustificationAPI(justificationId, action) {
  try {
    const response = await fetch(`${apiConfig.baseUrl}/justifications/${justificationId}`, {
      method: 'PUT',
      headers: apiConfig.headers,
      body: JSON.stringify({ status: action })
    });
    
    if (response.ok) {
      return true;
    }
  } catch (error) {
    console.error("Error handling justification:", error);
    return false;
  }
}
