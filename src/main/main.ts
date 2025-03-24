import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';

class MainApplication {
  private mainWindow: BrowserWindow | null = null;

  constructor() {
    this.initializeApp();
  }

  private initializeApp(): void {
    // Wait for app to be ready before creating window
    if (app.isReady()) {
      this.createWindow();
    } else {
      app.on('ready', this.createWindow);
    }
    
    app.on('window-all-closed', this.handleWindowsClosed);
    app.on('activate', this.handleActivation);
  }

  private createWindow = (): void => {
    this.mainWindow = new BrowserWindow({
      width: 1200,
      height: 800,
      webPreferences: {
        nodeIntegration: true,
        contextIsolation: false,
        devTools: process.env.NODE_ENV === 'development'
      }
    });

    const indexPath = path.join(__dirname, '../renderer/index.html');
    this.mainWindow.loadFile(indexPath).catch(err => {
      console.error('Failed to load index.html:', err);
    });

    if (process.env.NODE_ENV === 'development') {
      this.mainWindow.webContents.openDevTools();
    }

    this.mainWindow.on('closed', () => {
      this.mainWindow = null;
    });
  };

  private handleWindowsClosed = (): void => {
    if (process.platform !== 'darwin') {
      app.quit();
    }
  };

  private handleActivation = (): void => {
    if (this.mainWindow === null) {
      this.createWindow();
    }
  };
}

new MainApplication(); 