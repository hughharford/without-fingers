"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const VoiceCommandSystem_1 = require("../systems/voice/VoiceCommandSystem");
class RendererProcess {
    constructor() {
        this.voiceSystem = new VoiceCommandSystem_1.VoiceCommandSystem();
        this.statusElement = document.getElementById('status');
        this.commandListElement = document.getElementById('command-list');
        this.initializeUI();
        this.setupEventListeners();
    }
    initializeUI() {
        if (!this.commandListElement)
            return;
        // Add control buttons
        const startButton = document.createElement('button');
        startButton.textContent = 'Start Listening';
        startButton.className = 'command-button';
        startButton.onclick = () => this.voiceSystem.startListening();
        const stopButton = document.createElement('button');
        stopButton.textContent = 'Stop Listening';
        stopButton.className = 'command-button';
        stopButton.onclick = () => this.voiceSystem.stopListening();
        this.commandListElement.appendChild(startButton);
        this.commandListElement.appendChild(stopButton);
    }
    setupEventListeners() {
        this.voiceSystem.on('status', (message) => {
            if (this.statusElement) {
                this.statusElement.textContent = `Voice Recognition Status: ${message}`;
            }
        });
        this.voiceSystem.on('error', (error) => {
            if (this.statusElement) {
                this.statusElement.textContent = `Error: ${error.message}`;
                this.statusElement.style.background = '#ffebee';
                this.statusElement.style.border = '1px solid #ffcdd2';
            }
        });
    }
}
// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new RendererProcess();
});
//# sourceMappingURL=renderer.js.map