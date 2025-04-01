const { app, BrowserWindow } = require('electron');
const path = require('path');
const { PythonShell } = require('python-shell');
const { exec } = require('child_process');

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    }
  });

  win.loadFile('index.html');

  // Run Python script
  const pythonPath = path.join(__dirname, 'without_fingers', 'hello.py');
  const options = {
    mode: 'text',
    pythonPath: process.env.VIRTUAL_ENV ? 
      path.join(process.env.VIRTUAL_ENV, 'bin', 'python') : 
      'python',
    pythonOptions: ['-u'],
    scriptPath: path.join(__dirname, 'without_fingers')
  };

  PythonShell.run('hello.py', options, function (err, results) {
    if (err) {
      console.error('Python Error:', err);
      throw err;
    }
    if (results && results[0]) {
      win.webContents.send('python-message', results[0]);
    }
  });

  // Run Docker container
  exec('docker run --rm without-fingers:test', (error, stdout, stderr) => {
    if (error) {
      console.error('Docker Error:', error);
      return;
    }
    if (stderr) {
      console.error('Docker stderr:', stderr);
    }
    console.log('Docker output:', stdout);
    win.webContents.send('docker-message', stdout.trim());
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
}); 