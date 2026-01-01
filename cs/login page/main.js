const { app, BrowserWindow } = require('electron')
const path = require('path')

let win

function createWindow () {
  win = new BrowserWindow({
    width: 1000,
    height: 700
  })

  // تحميل صفحة تسجيل الدخول
  win.loadFile(path.join(__dirname, 'pages/login/index.html'))
}

app.whenReady().then(createWindow)
