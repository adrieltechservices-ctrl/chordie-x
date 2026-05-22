const { app, BrowserWindow } = require('electron');
const path = require('path');
const http = require('http');

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 800,
    title: "ChordieX Workstation",
    autoHideMenuBar: true,
    // CRITICAL LATENCY FIX: Forces high-priority processing loops
    backgroundColor: '#18181b', 
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      backgroundThrottling: false, // Prevents Mac from slowing down the app when clicking GarageBand
    }
  });

  // Optimize GPU render loops for the vector graphics sheet
  app.commandLine.appendSwitch('disable-renderer-backgrounding');
  app.commandLine.appendSwitch('force_high_performance_gpu');

  


  const devUrl = 'http://localhost:5173';

  // Proactively check if Vite's local development server is actively running
  const checkReq = http.request(devUrl, { method: 'HEAD', timeout: 300 }, (res) => {
    // Dev server is alive -> load the local development URL string path
    win.loadURL(devUrl);
    checkReq.destroy();
  });

  checkReq.on('error', () => {
    // Dev server is offline -> instantly failover to loading the raw local production bundle assets
    win.loadFile(path.join(__dirname, 'dist', 'index.html')).catch((err) => {
      console.error("Local disk storage file routing matrix calculation failed: ", err);
    });
    checkReq.destroy();
  });

  checkReq.on('timeout', () => {
    // Connection timed out -> load local production assets
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
    checkReq.destroy();
  });

  checkReq.end();
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
