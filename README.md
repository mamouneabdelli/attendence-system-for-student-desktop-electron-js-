<div align="center">

<h1>🎓 Attendance System</h1>
<p><strong>A cross-platform desktop application for academic attendance management — powered by QR codes and built with Electron.js</strong></p>

<p>
  <img src="https://img.shields.io/badge/Electron.js-Desktop-47848F?style=flat-square&logo=electron&logoColor=white" />
  <img src="https://img.shields.io/badge/Stack-HTML%20%2F%20CSS%20%2F%20JS-F7DF1E?style=flat-square&logo=javascript&logoColor=black" />
  <img src="https://img.shields.io/badge/Design-Figma-F24E1E?style=flat-square&logo=figma&logoColor=white" />
  <img src="https://img.shields.io/badge/Platform-Windows%20%7C%20macOS%20%7C%20Linux-blue?style=flat-square" />
</p>

</div>

---

## Overview

The **Attendance System** is a desktop application that replaces paper-based roll calls with a fast, QR-code-driven workflow. Teachers generate a unique QR code per session; students scan it from their phones; attendance is recorded instantly — no manual entry, no errors, no proxies.

It ships with two role-specific dashboards:

| Role | Responsibility |
|---|---|
| **Admin** | Manage teachers, courses, modules, and user accounts |
| **Teacher** | Run sessions, generate QR codes, validate attendance and justifications |

---

## Screenshots

![Admin Dashboard](https://github.com/mamouneabdelli/attendence-system-for-student-desktop-electron-js-/blob/821f330fff9d9bd8d215afc9b9b86f8955f099a9/Capture%20d%E2%80%99%C3%A9cran%20(105).png)

![Teacher Dashboard](https://github.com/mamouneabdelli/attendence-system-for-student-desktop-electron-js-/blob/821f330fff9d9bd8d215afc9b9b86f8955f099a9/Capture%20d%E2%80%99%C3%A9cran%20(107).png)

![QR Code Session](https://github.com/mamouneabdelli/attendence-system-for-student-desktop-electron-js-/blob/821f330fff9d9bd8d215afc9b9b86f8955f099a9/Capture%20d%E2%80%99%C3%A9cran%20(108).png)

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | [Electron.js](https://www.electronjs.org/) |
| Frontend | HTML, CSS, JavaScript |
| UI/UX Design | Figma |
| Distribution | Cross-platform desktop (Windows, macOS, Linux) |

---

## Features

### 🛠️ Admin Dashboard
- Create, update, and delete teacher accounts
- Define courses and assign modules
- Link teachers to courses
- Manage all user accounts and system settings

### 👨‍🏫 Teacher Dashboard
- Create and manage attendance sessions
- Generate a unique, time-bound QR code per session
- Monitor live attendance as students scan in
- Review and approve or reject absence justifications

### 📱 QR Code Attendance Flow

```
Teacher opens session  →  Unique QR code is generated
       ↓
Students scan with their phones
       ↓
Attendance recorded automatically
       ↓
Teacher reviews, validates, and closes session
```

This eliminates manual roll calls, proxy attendance, and transcription errors.

---

## Getting Started

### Prerequisites
- [Node.js](https://nodejs.org/) v16 or later
- npm

### Installation

```bash
# Clone the repository
git clone https://github.com/mamouneabdelli/attendence-system-for-student-desktop-electron-js-.git

# Navigate into the project
cd attendence-system-for-student-desktop-electron-js-

# Install dependencies
npm install

# Launch the application
npm start
```

---

## Roadmap

- [ ] Role-based authentication with JWT
- [ ] Cloud sync and remote database support
- [ ] Attendance analytics dashboard
- [ ] Export reports to PDF and Excel
- [ ] Mobile companion app for students
- [ ] Multi-institution support

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch — `git checkout -b feature/your-feature`
3. Commit your changes — `git commit -m "Add your feature"`
4. Push to your branch — `git push origin feature/your-feature`
5. Open a Pull Request

Please keep commits focused and PRs scoped to a single feature or fix.

---
#future ideas 
adding chatbot to help teacher and student and make user experience more better 

## License

This project is open source. Add your preferred license here.

---

<div align="center">
  <sub>Built with Electron.js · Designed in Figma · Developed by <a href="https://github.com/mamouneabdelli">Abdelli Abdelmoumen</a></sub>
</div>
