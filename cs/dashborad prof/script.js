  
    let students = [
      { id: 1, name: "Ahmed Hassan", code: "STD001", status: "present" },
      { id: 2, name: "Fatima Ali", code: "STD002", status: "present" },
      { id: 3, name: "Mohamed Ibrahim", code: "STD003", status: "absent" },
      { id: 4, name: "Sara Ahmed", code: "STD004", status: "present" },
      { id: 5, name: "Youssef Mahmoud", code: "STD005", status: "absent" }
    ];

    let dailyCode = "";
    let codeHistory = [];
    let attendanceHistory = {};

    // Initialize
    function init() {
      checkAndGenerateDailyCode();
      updateDashboard();
      renderStudentsList();
      setInterval(updateCodeTimer, 1000);
    }

    // Generate Daily Code
    function generateDailyCode() {
      const code = Math.random().toString(36).substring(2, 8).toUpperCase();
      const today = new Date().toISOString().split('T')[0];
      
      dailyCode = code;
      codeHistory.unshift({ date: today, code: code });
      if (codeHistory.length > 7) codeHistory.pop();
      
      document.getElementById('daily-code-display').textContent = code;
      updateCodeHistory();
      
      // Reset all students to absent for new day
      students.forEach(s => s.status = "absent");
      updateDashboard();
      
      alert('New daily code generated: ' + code);
    }

    function checkAndGenerateDailyCode() {
      const today = new Date().toISOString().split('T')[0];
      const lastCode = codeHistory[0];
      
      if (!lastCode || lastCode.date !== today) {
        generateDailyCode();
      } else {
        dailyCode = lastCode.code;
        document.getElementById('daily-code-display').textContent = dailyCode;
        updateCodeHistory();
      }
    }

    function updateCodeTimer() {
      const now = new Date();
      const midnight = new Date();
      midnight.setHours(24, 0, 0, 0);
      const diff = midnight - now;
      
      const hours = Math.floor(diff / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      const timer = document.getElementById('code-timer');
      if (timer) {
        timer.textContent = `Code expires in ${hours}h ${minutes}m ${seconds}s`;
      }
    }

    function updateCodeHistory() {
      const html = codeHistory.map(item => `
        <div class="student-item">
          <div>
            <strong>${item.date}</strong>
          </div>
          <div>
            <span class="badge-status badge-present">${item.code}</span>
          </div>
        </div>
      `).join('');
      
      const element = document.getElementById('code-history');
      if (element) element.innerHTML = html || '<p class="text-muted">No history available</p>';
    }

    // Student Management
    function renderStudentsList() {
      const html = students.map(student => `
        <div class="student-item">
          <div>
            <strong>${student.name}</strong><br>
            <small class="text-muted">Code: ${student.code}</small>
          </div>
          <div>
            <span class="badge-status ${student.status === 'present' ? 'badge-present' : 'badge-absent'}">
              ${student.status === 'present' ? 'Present' : 'Absent'}
            </span>
            <button class="btn-action btn-mark-present ms-2" onclick="markAttendance(${student.id}, 'present')">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-action btn-mark-absent ms-2" onclick="markAttendance(${student.id}, 'absent')">
              <i class="fas fa-times"></i>
            </button>
            <button class="btn btn-sm btn-danger ms-2" onclick="deleteStudent(${student.id})">
              <i class="fas fa-trash"></i>
            </button>
          </div>
        </div>
      `).join('');
      
      document.getElementById('students-list').innerHTML = html;
      updateDashboard();
    }

    function markAttendance(studentId, status) {
      const student = students.find(s => s.id === studentId);
      if (student) {
        student.status = status;
        renderStudentsList();
      }
    }

    function addStudent() {
      const name = prompt("Enter student name:");
      if (!name) return;
      
      const code = "STD" + String(students.length + 1).padStart(3, '0');
      students.push({
        id: students.length + 1,
        name: name,
        code: code,
        status: "absent"
      });
      
      renderStudentsList();
    }

    function deleteStudent(studentId) {
      if (confirm("Are you sure you want to delete this student?")) {
        students = students.filter(s => s.id !== studentId);
        renderStudentsList();
      }
    }

    function filterStudents() {
      const search = document.getElementById('student-search').value.toLowerCase();
      const filtered = students.filter(s => 
        s.name.toLowerCase().includes(search) || 
        s.code.toLowerCase().includes(search)
      );
      
      const html = filtered.map(student => `
        <div class="student-item">
          <div>
            <strong>${student.name}</strong><br>
            <small class="text-muted">Code: ${student.code}</small>
          </div>
          <div>
            <span class="badge-status ${student.status === 'present' ? 'badge-present' : 'badge-absent'}">
              ${student.status === 'present' ? 'Present' : 'Absent'}
            </span>
            <button class="btn-action btn-mark-present ms-2" onclick="markAttendance(${student.id}, 'present')">
              <i class="fas fa-check"></i>
            </button>
            <button class="btn-action btn-mark-absent ms-2" onclick="markAttendance(${student.id}, 'absent')">
              <i class="fas fa-times"></i>
            </button>
          </div>
        </div>
      `).join('');
      
      document.getElementById('students-list').innerHTML = html;
    }

    // Dashboard Updates
    function updateDashboard() {
      const total = students.length;
      const present = students.filter(s => s.status === 'present').length;
      const absent = total - present;
      const rate = total > 0 ? Math.round((present / total) * 100) : 0;
      
      document.getElementById('total-students').textContent = total;
      document.getElementById('present-today').textContent = present;
      document.getElementById('absent-today').textContent = absent;
      document.getElementById('attendance-rate').textContent = rate + '%';
      
      // Update today's attendance list
      const html = students.map(student => `
        <div class="student-item">
          <div>
            <strong>${student.name}</strong><br>
            <small class="text-muted">${student.code}</small>
          </div>
          <span class="badge-status ${student.status === 'present' ? 'badge-present' : 'badge-absent'}">
            ${student.status === 'present' ? 'Present' : 'Absent'}
          </span>
        </div>
      `).join('');
      
      const element = document.getElementById('today-attendance-list');
      if (element) element.innerHTML = html;
    }

    // Navigation
    function showSection(section) {
      document.querySelectorAll('.content-section').forEach(el => el.style.display = 'none');
      document.querySelectorAll('.nav-link').forEach(el => el.classList.remove('active'));
      
      document.getElementById(section + '-section').style.display = 'block';
      event.target.closest('.nav-link').classList.add('active');
    }

    // Export
    function exportAttendance() {
      const csv = "Name,Code,Status\n" + students.map(s => 
        `${s.name},${s.code},${s.status}`
      ).join('\n');
      
      const blob = new Blob([csv], { type: 'text/csv' });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'attendance_' + new Date().toISOString().split('T')[0] + '.csv';
      a.click();
    }

    function saveSettings() {
      alert('Settings saved successfully!');
    }

    function loadHistory() {
      alert('Loading attendance history...');
    }

   
    init();

   
  