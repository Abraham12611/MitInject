export const THEMES = {
  default: {
    name: 'Default',
    colors: {
      background: '#fffbf5',
      secondary: '#faf6f0',
      border: '#f3e8d6',
      text: '#1A1A1A',
      accent: '#2C2C2C'
    }
  },
  purple: {
    name: 'Purple Dream',
    colors: {
      background: '#1F1B33',
      secondary: '#2A2344',
      border: 'rgba(255, 255, 255, 0.1)',
      text: {
        primary: 'rgba(255, 255, 255, 0.95)',
        secondary: 'rgba(255, 255, 255, 0.7)',
        accent: '#a855f7'  // Bright purple
      },
      accent: '#818cf8',  // Indigo
      effects: {
        glow: '0 0 20px rgba(168, 85, 247, 0.3)',
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.3), rgba(168, 85, 247, 0.3), rgba(236, 72, 153, 0.3))',
        backgroundImage: 'linear-gradient(135deg, #1F1B33 0%, #2A2344 100%)',
        overlay: 'linear-gradient(to bottom right, rgba(99, 102, 241, 0.2), rgba(168, 85, 247, 0.2), rgba(236, 72, 153, 0.2))'
      }
    }
  },
  warmMonochrome: {
    name: 'Warm',
    colors: {
      background: '#FDFBF7',
      secondary: '#F5F1E8',
      border: '#E8E1D5',
      text: '#1A1A1A',
      accent: '#2C2C2C'
    }
  },
  matrixTheme: {
    name: 'Matrix',
    colors: {
      background: '#000000',
      secondary: '#0C1714',
      border: '#00FF41',
      text: {
        primary: '#00FF41',     // Matrix green
        secondary: '#007A1F',   // Darker green for secondary
        accent: '#00FF41'       // Bright green for highlights
      },
      accent: '#00FF41',
      effects: {
        glow: '0 0 10px #00FF4180',  // Green glow effect
        scanline: 'linear-gradient(transparent 50%, #00000050 50%)',
        noise: 'url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADIAAAAyBAMAAADsEZWCAAAAGFBMVEUAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAgE1xQAAAABh0Uk5TAAgMEBQYHCAkKCwwNDg8QERITH1/nq7Z8x+nAAAAAWJLR0QYm6CfnAAAAAlwSFlzAAALEwAACxMBAJqcGAAAAAd0SU1FB+EBEhQYHhFkpxoAAABOSURBVDjLY2AYBaNg+AETB4ZRMApGwSgYBaNgFIyCUTAKRsEoGAWjYBSMglEwCkbBKBgFo2AUjIJRMApGwSgYBaNgFIyCUTAKRsEoGHoAAFH7HxX7Z5QHAAAAAElFTkSuQmCC)'
      }
    }
  },
  synthwave: {
    name: 'Synthwave',
    colors: {
      background: '#1a1025',
      secondary: '#2a1f35',
      border: 'rgba(255,255,255,0.1)',
      text: {
        primary: 'rgba(255,255,255,0.9)',
        secondary: 'rgba(255,255,255,0.5)',
        accent: '#e879f9'  // Pink
      },
      accent: '#818cf8',  // Indigo
      effects: {
        glow: '0 0 20px rgba(129,140,248,0.5)',
        gradient: 'linear-gradient(to bottom right, rgba(99,102,241,0.2), rgba(168,85,247,0.2), rgba(236,72,153,0.2))',
        blur: 'blur(3px)'
      }
    }
  }
};