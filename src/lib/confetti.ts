import confetti from 'canvas-confetti';
import { audio } from './audio';

export const triggerGrandCelebration = () => {
  audio.playSuccess();
  
  const duration = 3 * 1000;
  const animationEnd = Date.now() + duration;
  const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 100 };

  const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

  const interval: any = setInterval(function() {
    const timeLeft = animationEnd - Date.now();

    if (timeLeft <= 0) {
      return clearInterval(interval);
    }

    const particleCount = 50 * (timeLeft / duration);
    // since particles fall down, start a bit higher than random
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']
    });
    confetti({
      ...defaults,
      particleCount,
      origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6']
    });
  }, 250);
};

export const triggerMiniCelebration = () => {
  audio.playSparkle();
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ['#F59E0B', '#EF4444', '#10B981', '#3B82F6', '#8B5CF6'],
    zIndex: 100
  });
};
