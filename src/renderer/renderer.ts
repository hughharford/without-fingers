import { VoiceCommandSystem } from '../systems/voice/VoiceCommandSystem';

class RendererProcess {
  private voiceSystem: VoiceCommandSystem;
  private statusElement: HTMLElement | null;
  private commandListElement: HTMLElement | null;

  constructor() {
    this.voiceSystem = new VoiceCommandSystem();
    this.statusElement = document.getElementById('status');
    this.commandListElement = document.getElementById('command-list');
    
    this.initializeUI();
    this.setupEventListeners();
  }

  private initializeUI() {
    if (!this.commandListElement) return;

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

  private setupEventListeners() {
    this.voiceSystem.on('status', (message: string) => {
      if (this.statusElement) {
        this.statusElement.textContent = `Voice Recognition Status: ${message}`;
      }
    });

    this.voiceSystem.on('error', (error: Error) => {
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