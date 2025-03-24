"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
const electron_1 = require("electron");
const path = __importStar(require("path"));
class MainApplication {
    constructor() {
        this.mainWindow = null;
        this.createWindow = () => {
            this.mainWindow = new electron_1.BrowserWindow({
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
        this.handleWindowsClosed = () => {
            if (process.platform !== 'darwin') {
                electron_1.app.quit();
            }
        };
        this.handleActivation = () => {
            if (this.mainWindow === null) {
                this.createWindow();
            }
        };
        this.initializeApp();
    }
    initializeApp() {
        // Wait for app to be ready before creating window
        if (electron_1.app.isReady()) {
            this.createWindow();
        }
        else {
            electron_1.app.on('ready', this.createWindow);
        }
        electron_1.app.on('window-all-closed', this.handleWindowsClosed);
        electron_1.app.on('activate', this.handleActivation);
    }
}
new MainApplication();
//# sourceMappingURL=main.js.map