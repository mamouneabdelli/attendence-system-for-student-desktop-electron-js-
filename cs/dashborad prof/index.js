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

// Toast notification function
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast-notification');
  toast.textContent = message;
  toast.className = `toast-notification show ${type}`;
  setTimeout(() => {
    toast.classList.remove('show');
  }, 3000);
}

// Custom confirm dialog
function customConfirm(message, callback) {
  if (confirm(message)) {
    callback();
  }
}

document.addEventListener('DOMContentLoaded', function() {
  init();
});

function init() {
  generateQRCode();
  updateDashboard();
  renderStudentsList();
  renderExcludedList();
  renderJustificationsList();
  updateJustificationBadge();
  setInterval(updateCodeTimer, 1000);
  
  initSearchListeners();
  
  const today = new Date().toISOString().split('T')[0];
  const dateInput = document.getElementById('justification-date');
  if (dateInput) {
    dateInput.value = today;
  }
}

function initSearchListeners() {
  const studentSearch = document.getElementById('student-search');
  const excludedSearch = document.getElementById('excluded-search');
  
  if (studentSearch) {
    studentSearch.addEventListener('input', filterStudents);
  }
  
  if (excludedSearch) {
    excludedSearch.addEventListener('input', filterExcluded);
  }
}

function showSection(sectionId) {
  document.querySelectorAll('.content-section').forEach(el => {
    el.style.display = 'none';
  });
  
  document.querySelectorAll('.nav-link').forEach(el => {
    el.classList.remove('active');
  });
  
  const section = document.getElementById(sectionId + '-section');
  if (section) {
    section.style.display = 'block';
  }
  
  const activeNav = Array.from(document.querySelectorAll('.nav-link')).find(el => 
    el.getAttribute('onclick')?.includes(sectionId)
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
  showToast("New QR code generated! All students marked as absent.", "info");
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
      <div class="student-item" id="student-${s.id}">
        <div>
          <strong>${s.name}</strong><br>
          <small class="text-muted">${s.code}</small>
          ${hasJustification ? '<span class="badge bg-warning ms-2"><i class="fas fa-file-alt"></i> Pending</span>' : ''}
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
          <button class="btn btn-sm btn-info ms-1" onclick="showSubmitJustificationModal(${s.id})" title="Submit Justification">
            <i class="fas fa-file-alt"></i>
          </button>
          <button class="btn btn-sm btn-warning ms-1" onclick="toggleExclude(${s.id})" title="Exclude">
            <i class="fas fa-user-slash"></i>
          </button>
          <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `}).join('');
  }
  updateDashboard();
}

function filterStudents() {
  const searchInput = document.getElementById('student-search');
  if (!searchInput) return;
  
  const search = searchInput.value.toLowerCase();
  const activeStudents = students.filter(s => !s.excluded);
  
  if (search.trim() === '') {
    renderStudentsList();
    return;
  }
  
  const filtered = activeStudents.filter(s => 
    s.name.toLowerCase().includes(search) || 
    s.code.toLowerCase().includes(search)
  );
  
  const container = document.getElementById('students-list');
  
  if (filtered.length === 0) {
    container.innerHTML = '<p class="text-muted">No students found</p>';
  } else {
    container.innerHTML = filtered.map(s => {
      const hasJustification = justifications.some(j => j.studentId === s.id && j.status === 'pending');
      return `
      <div class="student-item">
        <div>
          <strong>${s.name}</strong><br>
          <small class="text-muted">${s.code}</small>
          ${hasJustification ? '<span class="badge bg-warning ms-2"><i class="fas fa-file-alt"></i> Pending</span>' : ''}
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
    `}).join('');
  }
}

function markAttendance(id, status) {
  const student = students.find(s => s.id === id);
  if (student) { 
    student.status = status; 
    renderStudentsList();
    showToast(`${student.name} marked as ${status}`, 'success');
  }
}

function showAddStudentModal() {
  document.getElementById('new-student-name').value = '';
  document.getElementById('new-student-code').value = '';
  document.getElementById('addStudentModal').style.display = 'block';
}

function closeAddStudentModal(event) {
  if (event && event.target.classList.contains('modal-overlay')) {
    document.getElementById('addStudentModal').style.display = 'none';
  } else if (!event) {
    document.getElementById('addStudentModal').style.display = 'none';
  }
}

function addStudent() {
  const name = document.getElementById('new-student-name').value.trim();
  if (!name) {
    showToast('Please enter a student name', 'error');
    return;
  }
  
  const code = document.getElementById('new-student-code').value.trim();
  let finalCode = code || "STD" + String(students.length + 1).padStart(3, '0');
  
  let counter = 1;
  while (students.some(s => s.code === finalCode)) {
    finalCode = "STD" + String(students.length + 1 + counter).padStart(3, '0');
    counter++;
  }
  
  const newStudent = { 
    id: Date.now(), 
    name: name, 
    code: finalCode, 
    status: "absent", 
    excluded: false 
  };
  
  students.push(newStudent);
  renderStudentsList();
  closeAddStudentModal();
  showToast('Student added successfully!', 'success');
}

function deleteStudent(id) {
  const student = students.find(s => s.id === id);
  if (student) {
    customConfirm("Are you sure you want to delete this student?", () => {
      students = students.filter(s => s.id !== id);
      renderStudentsList();
      renderExcludedList();
      showToast('Student deleted', 'success');
    });
  }
}

function toggleExclude(id) {
  const student = students.find(s => s.id === id);
  if (student) { 
    student.excluded = !student.excluded; 
    renderStudentsList(); 
    renderExcludedList(); 
    
    if (student.excluded) {
      showToast(`${student.name} excluded from tracking`, 'info');
    } else {
      showToast(`${student.name} restored to tracking`, 'success');
    }
  }
}

function showSubmitJustificationModal(studentId) {
  const student = students.find(s => s.id === studentId);
  if (!student) return;
  
  document.getElementById('justification-student-id').value = studentId;
  document.getElementById('justification-reason').value = '';
  document.getElementById('justification-has-doc').checked = false;
  const today = new Date().toISOString().split('T')[0];
  document.getElementById('justification-date').value = today;
  document.getElementById('justificationSubmitModal').style.display = 'block';
}

function closeJustificationSubmitModal(event) {
  if (event && event.target.classList.contains('modal-overlay')) {
    document.getElementById('justificationSubmitModal').style.display = 'none';
  } else if (!event) {
    document.getElementById('justificationSubmitModal').style.display = 'none';
  }
}

function submitJustification() {
  const studentId = parseInt(document.getElementById('justification-student-id').value);
  const student = students.find(s => s.id === studentId);
  if (!student) return;
  
  const reason = document.getElementById('justification-reason').value.trim();
  if (!reason) {
    showToast('Please enter a reason', 'error');
    return;
  }
  
  const date = document.getElementById('justification-date').value;
  if (!date) {
    showToast('Please select a date', 'error');
    return;
  }
  
  const hasDocument = document.getElementById('justification-has-doc').checked;
  
  const newJustification = {
    id: Date.now(),
    studentId: student.id,
    studentName: student.name,
    date: date,
    reason: reason,
    document: hasDocument ? "document_" + Date.now() + ".pdf" : null,
    status: "pending",
    submittedAt: new Date().toLocaleString()
  };
  
  justifications.push(newJustification);
  renderJustificationsList();
  updateJustificationBadge();
  renderStudentsList();
  closeJustificationSubmitModal();
  showToast('Justification submitted successfully!', 'success');
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
  
  customConfirm(`Are you sure you want to ${action} this justification?`, () => {
    justification.status = action;
    renderJustificationsList();
    updateJustificationBadge();
    renderStudentsList();
    showToast(`Justification ${action}!`, 'success');
  });
}

function viewJustificationDetails(id) {
  const justification = justifications.find(j => j.id === id);
  if (!justification) return;
  
  const modalBody = document.getElementById('modal-body');
  modalBody.innerHTML = `
    <div class="modal-body-content">
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
        <p class="mt-2 p-2 bg-light rounded">${justification.reason}</p>
      </div>
      ${justification.document ? `
        <div class="mb-3">
          <strong>Document:</strong><br>
          <a href="#" class="btn btn-sm btn-outline-primary mt-2">
            <i class="fas fa-download"></i> ${justification.document}
          </a>
        </div>
      ` : '<div class="mb-3"><em>No document attached</em></div>'}
      <div class="mb-3">
        <strong>Status:</strong> 
        <span class="badge-status badge-${justification.status === 'pending' ? 'pending' : justification.status === 'approved' ? 'present' : 'absent'}">
          ${justification.status.toUpperCase()}
        </span>
      </div>
    </div>
  `;
  
  document.getElementById('justificationModal').style.display = 'block';
}

function closeModal(event) {
  if (event && event.target.classList.contains('modal-overlay')) {
    document.getElementById('justificationModal').style.display = 'none';
  } else if (!event) {
    document.getElementById('justificationModal').style.display = 'none';
  }
}

function updateJustificationBadge() {
  const pending = justifications.filter(j => j.status === 'pending').length;
  const badge = document.getElementById('justification-badge');
  if (badge) {
    if (pending > 0) {
      badge.textContent = pending;
      badge.style.display = 'flex';
    } else {
      badge.style.display = 'none';
    }
  }
}

function renderExcludedList() {
  const excluded = students.filter(s => s.excluded);
  const el = document.getElementById('excluded-list');
  const noEl = document.getElementById('no-excluded');
  
  if (excluded.length === 0) {
    el.innerHTML = '';
    if (noEl) noEl.style.display = 'block';
  } else {
    el.innerHTML = excluded.map(s => `
      <div class="student-item">
        <div><strong>${s.name}</strong><br><small class="text-muted">${s.code}</small></div>
        <div>
          <button class="btn btn-sm btn-success" onclick="toggleExclude(${s.id})" title="Restore">
            <i class="fas fa-undo"></i> Restore
          </button>
          <button class="btn btn-sm btn-danger ms-1" onclick="deleteStudent(${s.id})" title="Delete">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      </div>
    `).join('');
    if (noEl) noEl.style.display = 'none';
  }
}

function filterExcluded() {
  const searchInput = document.getElementById('excluded-search');
  if (!searchInput) return;
  
  const search = searchInput.value.toLowerCase();
  const excludedStudents = students.filter(s => s.excluded);
  
  if (search.trim() === '') {
    renderExcludedList();
    return;
  }
  
  const filtered = excludedStudents.filter(s => 
    s.name.toLowerCase().includes(search) || 
    s.code.toLowerCase().includes(search)
  );
  
  const el = document.getElementById('excluded-list');
  const noEl = document.getElementById('no-excluded');
  
  if (filtered.length === 0) {
    el.innerHTML = '';
    if (noEl) noEl.style.display = 'block';
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
    if (noEl) noEl.style.display = 'none';
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
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
  showToast('Data exported successfully!', 'success');
}

function saveSettings() {
  const schoolName = document.getElementById('school-name').value;
  const academicYear = document.getElementById('academic-year').value;
  localStorage.setItem('schoolName', schoolName);
  localStorage.setItem('academicYear', academicYear);
  showToast('Settings saved successfully!', 'success');
}

document.addEventListener('keydown', function(event) {
  if (event.key === 'Escape') {
    closeModal();
    closeAddStudentModal();
    closeJustificationSubmitModal();
  }
});
