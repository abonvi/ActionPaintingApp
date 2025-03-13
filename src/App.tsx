import React, { useRef, useEffect, useState, useCallback } from 'react';
import { Palette, Download, Eraser, MousePointer, Play } from 'lucide-react';

const generateRandomColor = () => {
  const hue = Math.random() * 360;
  const saturation = 70 + Math.random() * 30;
  const lightness = 40 + Math.random() * 20;
  return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
};

interface Point {
  x: number;
  y: number;
  color: string;
  size: number;
  opacity: number;
  type: 'drip' | 'splash' | 'stroke';
}

function App() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [lastUsedEffect, setLastUsedEffect] = useState<string>('');
  const [currentColor, setCurrentColor] = useState('#000000');
  const [mouseColor, setMouseColor] = useState(generateRandomColor());
  const [commandSequence, setCommandSequence] = useState('');
  const lastPoint = useRef<Point | null>(null);
  
  const effectMap = {
    's': 'splash',
    'g': 'goccia',
    'v': 'versare',
    'e': 'esplosione',
    'r': 'ricciolo',
    'f': 'fuochi',
    'p': 'pioggia',
    't': 'tornado',
    'o': 'onda',
    'b': 'bubble',
    'f': 'fulmine',
    'e': 'elica',
    'm': 'meteor',
    'n': 'nebula',
    'x': 'crystal',
    'y': 'galaxy',
    'z': 'zigzag',
    'q': 'quake',
    'u': 'burst',
    'i': 'iris',
    'o': 'orbit',
    'k': 'kaleidoscope'
  };

  const getRandomEffect = () => {
    const effects = Object.keys(effectMap);
    return effects[Math.floor(Math.random() * effects.length)];
  };

  const createExplosion = (x: number, y: number, color: string) => {
    const power = 50 + Math.random() * 150;
    for (let i = 0; i < 8; i++) {
      const angle = (Math.PI * 2 * i) / 8;
      createSplash(
        x + Math.cos(angle) * power,
        y + Math.sin(angle) * power,
        color
      );
    }
  };

  const createSpiral = (x: number, y: number, color: string) => {
    const turns = 2 + Math.random() * 3;
    const points = 100;
    let radius = 2 + Math.random() * 3;
    
    for (let i = 0; i < points; i++) {
      const t = i / points;
      const angle = t * Math.PI * 2 * turns;
      radius += 1;
      const px = x + Math.cos(angle) * radius;
      const py = y + Math.sin(angle) * radius;
      createDrip(px, py, color);
    }
  };

  const createWave = (x: number, y: number, color: string) => {
    const width = 200 + Math.random() * 300;
    const amplitude = 30 + Math.random() * 50;
    const frequency = 0.02 + Math.random() * 0.03;
    
    for (let i = 0; i < width; i += 2) {
      const waveY = y + Math.sin(i * frequency) * amplitude;
      createDrip(x + i, waveY, color);
    }
  };

  const createBubble = (x: number, y: number, color: string) => {
    const size = 20 + Math.random() * 60;
    const rings = 5 + Math.floor(Math.random() * 5);
    
    for (let i = 0; i < rings; i++) {
      const radius = size * (i / rings);
      const points = Math.floor(10 + radius);
      
      for (let j = 0; j < points; j++) {
        const angle = (j / points) * Math.PI * 2;
        const wobble = Math.random() * 5;
        const px = x + Math.cos(angle) * (radius + wobble);
        const py = y + Math.sin(angle) * (radius + wobble);
        createDrip(px, py, color);
      }
    }
  };

  const createLightning = (x: number, y: number, color: string) => {
    let currentX = x;
    let currentY = y;
    const segments = 8 + Math.floor(Math.random() * 6);
    const maxOffset = 50;
    
    for (let i = 0; i < segments; i++) {
      const nextY = currentY + (300 / segments);
      const nextX = currentX + (Math.random() * maxOffset * 2 - maxOffset);
      
      for (let j = 0; j < 10; j++) {
        const t = j / 10;
        const px = currentX + (nextX - currentX) * t;
        const py = currentY + (nextY - currentY) * t;
        createSplash(px, py, color);
      }
      
      currentX = nextX;
      currentY = nextY;
    }
  };

  const clearCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;
    
    // Save the current canvas dimensions
    const width = canvas.width;
    const height = canvas.height;
    
    // Clear by resetting dimensions (more thorough than clearRect)
    canvas.width = width;
    canvas.height = height;
    
    // Fill with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, width, height);
    
    // Reset any canvas state that might affect future drawing
    ctx.globalAlpha = 1;
    ctx.globalCompositeOperation = 'source-over';
  }, []);

  const createDrip = (x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const length = 30 + Math.random() * 200;
    const width = 1 + Math.random() * 12;
    const gravity = 0.5 + Math.random() * 1.5;
    const waviness = 0.05 + Math.random() * 0.2;
    let currentY = y;
    let momentum = 0;

    const animate = () => {
      if (currentY < y + length) {
        momentum += gravity;
        const wobble = Math.sin(currentY * waviness) * (width + momentum);
        const radiusX = Math.max((width + momentum) / 2, 0.1);
        const radiusY = Math.max((width - momentum / 2) / 2, 0.1);
        ctx.fillStyle = color;
        ctx.globalAlpha = 0.05 + Math.random() * 0.4;
        ctx.beginPath();
        ctx.ellipse(
          x + wobble,
          currentY,
          radiusX,
          radiusY,
          0,
          0,
          Math.PI * 2
        );
        ctx.fill();
        currentY += gravity + Math.random() * momentum;
        requestAnimationFrame(animate);
      }
    };

    animate();
  };

  const createSplash = (x: number, y: number, color: string) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const style = Math.floor(Math.random() * 4);
    const drops = 15 + Math.random() * 40;
    const force = 30 + Math.random() * 100;
    
    for (let i = 0; i < drops; i++) {
      const angle = (Math.PI * 2 * i) / drops;
      const distance = force * (0.5 + Math.random());
      const dropX = x + Math.cos(angle) * distance;
      const dropY = y + Math.sin(angle) * distance;
      const size = style === 0 ? 1 + Math.random() * 3 :
                   style === 1 ? 3 + Math.random() * 8 :
                   style === 2 ? 0.5 + Math.random() * 6 :
                   2 + Math.random() * 5;
      
      ctx.fillStyle = color;
      ctx.globalAlpha = 0.1 + Math.random() * 0.5;
      
      if (style === 0) {
        // Schizzi fini e allungati
        ctx.beginPath();
        ctx.ellipse(
          dropX,
          dropY,
          size * 3,
          size / 2,
          angle,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (style === 1) {
        // Macchie irregolari
        const points = 5 + Math.random() * 4;
        ctx.beginPath();
        for (let j = 0; j <= points; j++) {
          const a = (j / points) * Math.PI * 2;
          const r = size * (0.8 + Math.random() * 0.4);
          const px = dropX + Math.cos(a) * r;
          const py = dropY + Math.sin(a) * r;
          j === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
      } else {
        // Gocce rotonde
        ctx.beginPath();
        ctx.arc(dropX, dropY, size, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.beginPath();
      ctx.arc(dropX, dropY, size, 0, Math.PI * 2);
      ctx.fill();

      if (Math.random() > 0.7) {
        createDrip(dropX, dropY, color);
      }
    }
    
    // Effetto alone
    ctx.globalAlpha = 0.1;
    ctx.beginPath();
    ctx.arc(x, y, force * 0.7, 0, Math.PI * 2);
    ctx.fill();
  };

  const drawStroke = (from: Point, to: Point) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!ctx || !canvas) return;

    const points = 25;
    const style = Math.floor(Math.random() * 3);
    const baseSize = 3 + Math.random() * 4;
    
    for (let i = 0; i < points; i++) {
      const t = i / points;
      const x = from.x + (to.x - from.x) * t;
      const y = from.y + (to.y - from.y) * t;
      const angle = Math.atan2(to.y - from.y, to.x - from.x);
      
      ctx.fillStyle = to.color;
      ctx.globalAlpha = 0.1 + Math.random() * 0.4;
      const size = baseSize * (0.5 + Math.random());
      
      if (style === 0) {
        // Pennellate dinamiche
        ctx.beginPath();
        ctx.ellipse(
          x + Math.random() * 4 - 2,
          y + Math.random() * 4 - 2,
          size * 2,
          size / 2,
          angle,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else if (style === 1) {
        // Tratti spezzati
        const offset = Math.random() * 6 - 3;
        ctx.beginPath();
        ctx.arc(
          x + Math.cos(angle) * offset,
          y + Math.sin(angle) * offset,
          size,
          0,
          Math.PI * 2
        );
        ctx.fill();
      } else {
        // Schizzi esplosivi
        for (let j = 0; j < 3; j++) {
          const scatter = Math.random() * 8 - 4;
          ctx.beginPath();
          ctx.arc(
            x + Math.cos(angle + Math.PI/2) * scatter,
            y + Math.sin(angle + Math.PI/2) * scatter,
            size * 0.7,
            0,
            Math.PI * 2
          );
          ctx.fill();
        }
      }

      if (Math.random() > 0.85) {
        createDrip(x, y, to.color);
      }
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    canvas.width = window.innerWidth * 0.9;
    canvas.height = window.innerHeight * 0.8;
    clearCanvas();

    // Simulate initial mouse interaction
    const initialX = canvas.width / 2;
    const initialY = canvas.height / 2;
    lastPoint.current = {
      x: initialX,
      y: initialY,
      color: generateRandomColor(),
      size: 5,
      opacity: 0.5,
      type: 'stroke'
    };
    setIsDrawing(true);
    setIsDrawing(false);
    
    const handleResize = () => {
      const imageData = canvas.getContext('2d')?.getImageData(0, 0, canvas.width, canvas.height);
      canvas.width = window.innerWidth * 0.9;
      canvas.height = window.innerHeight * 0.8;
      clearCanvas();
      if (imageData) {
        canvas.getContext('2d')?.putImageData(imageData, 0, 0);
      }
    };

    const handleKeyPress = (e: KeyboardEvent) => {
      const canvas = canvasRef.current;
      if (!canvas || e.repeat || (e.target as HTMLElement).tagName === 'INPUT') return;

      const x = Math.random() * canvas.width;
      const y = Math.random() * canvas.height;
      const color = generateRandomColor();

      const effect = effectMap[e.key.toLowerCase()] ? e.key.toLowerCase() : getRandomEffect();

      setLastUsedEffect(effect);
      
      const applyEffect = () => {
        switch (effect) {
          case 's': createSplash(x, y, color); break;
          case 'g': createDrip(x, y, color); break;
          case 'v':
            for (let i = 0; i < 8; i++) {
              createDrip(
                x + Math.random() * 100 - 50,
                y + Math.random() * 30,
                color
              );
            }
            break;
          case 'e': createExplosion(x, y, color); break;
          case 'r': createSpiral(x, y, color); break;
          case 'f':
            for (let i = 0; i < 3; i++) {
              createExplosion(
                x + Math.random() * 200 - 100,
                y + Math.random() * 200 - 100,
                generateRandomColor()
              );
            }
            break;
          case 'p':
            for (let i = 0; i < 10; i++) {
              createDrip(Math.random() * canvas.width, 0, generateRandomColor());
            }
            break;
          case 't':
            for (let i = 0; i < 20; i++) {
              const radius = 50 + i * 5;
              const angle = i * 0.5;
              createSplash(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius,
                generateRandomColor()
              );
            }
            break;
          case 'w': createWave(x, y, color); break;
          case 'b': createBubble(x, y, color); break;
          case 'l': createLightning(x, y, color); break;
          case 'h':
            for (let i = 0; i < 50; i++) {
              const t = i / 50;
              const radius = 5 + t * 100;
              const angle = t * Math.PI * 8;
              createDrip(
                x + Math.cos(angle) * radius,
                y + Math.sin(angle) * radius,
                color
              );
            }
            break;
          case 'm':
            for (let i = 0; i < 30; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 200;
              createSplash(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                color
              );
            }
            break;
          case 'n':
            for (let i = 0; i < 40; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 150;
              createDrip(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                generateRandomColor()
              );
            }
            break;
          case 'x':
            for (let i = 0; i < 40; i++) {
              const angle = Math.random() * Math.PI * 2;
              const distance = Math.random() * 100;
              createDrip(
                x + Math.cos(angle) * distance,
                y + Math.sin(angle) * distance,
                generateRandomColor()
              );
            }
            break;
          default:
            createSplash(x, y, color);
        }
      };
      
      applyEffect();
    };

    window.addEventListener('resize', handleResize);
    window.addEventListener('keypress', handleKeyPress);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('keypress', handleKeyPress);
    };
  }, [clearCanvas]);

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    const rect = e.currentTarget.getBoundingClientRect();
    lastPoint.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      color: mouseColor,
      size: 5,
      opacity: 0.5,
      type: 'stroke'
    };
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !lastPoint.current) return;
    
    // Update mouse color during drag
    const newColor = generateRandomColor();
    setMouseColor(newColor);
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const effect = lastUsedEffect || 's'; // Default to splash if no last effect
    
    switch (effect) {
      case 's': createSplash(x, y, newColor); break;
      case 'g': createDrip(x, y, newColor); break;
      case 'v': 
        for (let i = 0; i < 8; i++) {
          createDrip(x + Math.random() * 100 - 50, y + Math.random() * 30, newColor);
        }
        break;
      case 'e': createExplosion(x, y, newColor); break;
      case 'r': createSpiral(x, y, newColor); break;
      case 'f':
        for (let i = 0; i < 3; i++) {
          createExplosion(x + Math.random() * 200 - 100, y + Math.random() * 200 - 100, newColor);
        }
        break;
      case 'p':
        for (let i = 0; i < 10; i++) {
          createDrip(x, Math.random() * 30, newColor);
        }
        break;
      case 't':
        for (let i = 0; i < 20; i++) {
          const radius = 50 + i * 5;
          const angle = i * 0.5;
          createSplash(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, newColor);
        }
        break;
      case 'w': createWave(x, y, newColor); break;
      case 'b': createBubble(x, y, newColor); break;
      case 'l': createLightning(x, y, newColor); break;
      case 'h':
        for (let i = 0; i < 50; i++) {
          const t = i / 50;
          const radius = 5 + t * 100;
          const angle = t * Math.PI * 8;
          createDrip(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, newColor);
        }
        break;
      default:
        createSplash(x, y, newColor);
    }
    
    lastPoint.current = { x, y, color: newColor, size: 5, opacity: 0.5, type: 'stroke' };
  };

  const handleMouseUp = () => {
    setIsDrawing(false);
  };

  const executeCommandSequence = (sequence: string) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    sequence.split('').forEach((key, index) => {
      setTimeout(() => {
        const x = Math.random() * canvas.width;
        const y = Math.random() * canvas.height;
        const color = generateRandomColor();
        
        let effect = key.toLowerCase();
        if (!effectMap[effect]) {
          const effects = Object.keys(effectMap);
          effect = effects[Math.floor(Math.random() * effects.length)];
        }
        
        setLastUsedEffect(effect);
        
        switch (effect) {
          case 's': createSplash(x, y, color); break;
          case 'g': createDrip(x, y, color); break;
          case 'v':
            for (let i = 0; i < 8; i++) {
              createDrip(x + Math.random() * 100 - 50, y + Math.random() * 30, color);
            }
            break;
          case 'e': createExplosion(x, y, color); break;
          case 'r': createSpiral(x, y, color); break;
          case 'f':
            for (let i = 0; i < 3; i++) {
              createExplosion(x + Math.random() * 200 - 100, y + Math.random() * 200 - 100, generateRandomColor());
            }
            break;
          case 'p':
            for (let i = 0; i < 10; i++) {
              createDrip(Math.random() * canvas.width, 0, generateRandomColor());
            }
            break;
          case 't':
            for (let i = 0; i < 20; i++) {
              const radius = 50 + i * 5;
              const angle = i * 0.5;
              createSplash(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, generateRandomColor());
            }
            break;
          case 'w': createWave(x, y, color); break;
          case 'b': createBubble(x, y, color); break;
          case 'l': createLightning(x, y, color); break;
          case 'h':
            for (let i = 0; i < 50; i++) {
              const t = i / 50;
              const radius = 5 + t * 100;
              const angle = t * Math.PI * 8;
              createDrip(x + Math.cos(angle) * radius, y + Math.sin(angle) * radius, color);
            }
            break;
          default:
            createSplash(x, y, color);
        }
      }, index * 300);
    });
    setCommandSequence('');
  };

  return (
    <div className="min-h-screen bg-neutral-900 text-white p-8">
      <div>
        <div className="flex flex-col items-center gap-8">
          <div className="relative">
            <a
              href="https://www.oneusefulthing.org/p/speaking-things-into-existence"
              target="_blank"
              rel="noopener noreferrer"
              className="block text-center mb-4 text-blue-400 hover:text-blue-300 transition-colors"
            >
              Speaking things into existence
            </a>
            <p className="text-center mb-4 text-neutral-300 italic">
              Comincia a dipingere con il mouse, e poi puoi alternare mouse, tastiera e frasi per continuare il tuo quadro alla Pollock
            </p>
            <canvas
              ref={canvasRef}
              className="border border-neutral-700 rounded-lg bg-white"
              onMouseDown={handleMouseDown}
              onMouseMove={handleMouseMove}
              onMouseUp={handleMouseUp}
              onMouseLeave={handleMouseUp}
            />
          </div>
          <div className="flex gap-4">
            <button
              onClick={clearCanvas}
              className="flex items-center gap-2 px-4 py-2 bg-neutral-800 rounded hover:bg-neutral-700"
            >
              <Eraser size={20} />
              <span>Clear</span>
            </button>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                executeCommandSequence(commandSequence);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={commandSequence}
                onChange={(e) => setCommandSequence(e.target.value)}
                placeholder="Type sequence and press Enter..."
                className="px-4 py-2 bg-neutral-800 rounded text-white placeholder-neutral-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                type="submit"
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 rounded hover:bg-blue-500"
              >
                <Play size={20} />
                <span>Run</span>
              </button>
            </form>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            <div className="bg-neutral-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Effetti Base</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">S</kbd>
                  <span>Splash</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">G</kbd>
                  <span>Goccia</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">V</kbd>
                  <span>Versare</span>
                </li>
              </ul>
            </div>
            <div className="bg-neutral-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Effetti Speciali</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">E</kbd>
                  <span>Esplosione</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">R</kbd>
                  <span>Ricciolo</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">F</kbd>
                  <span>Fuochi</span>
                </li>
              </ul>
            </div>
            <div className="bg-neutral-800 p-4 rounded">
              <h3 className="font-semibold mb-2">Effetti Naturali</h3>
              <ul className="space-y-2">
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">P</kbd>
                  <span>Pioggia</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">T</kbd>
                  <span>Tornado</span>
                </li>
                <li className="flex items-center gap-2">
                  <kbd className="px-2 py-1 bg-neutral-700 rounded">O</kbd>
                  <span>Onda</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App