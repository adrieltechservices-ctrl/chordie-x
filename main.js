const { app, BrowserWindow } = require('electron');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "ChordieX Workstation",
    autoHideMenuBar: true, // Hides the top system menu bar
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true
    }
  });

  // Load the running Vite dev server
  win.loadURL('http://localhost:5173');
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
