export interface StrokeData {
  char: string;
  paths: string[]; // Standard SVG path data
  viewBox: string;
}

// In a full production app, this would contain all 247 letters.
// Generating exact single-line tracing paths for 247 complex Tamil 
// characters requires manual vector design. We provide a robust structure 
// here and sample data for the first few letters to demonstrate the engine.
export const TAMIL_STROKES: Record<string, StrokeData> = {
  'அ': {
    char: 'அ',
    viewBox: '0 0 100 100',
    paths: [
      "M 35 35 C 35 25, 45 25, 50 35 C 55 45, 45 55, 35 55 C 25 55, 20 65, 20 75 C 20 85, 35 85, 50 85 L 80 85",
      "M 65 60 L 65 95"
    ]
  },
  'ஆ': {
    char: 'ஆ',
    viewBox: '0 0 100 100',
    paths: [
      "M 35 35 C 35 25, 45 25, 50 35 C 55 45, 45 55, 35 55 C 25 55, 20 65, 20 75 C 20 85, 35 85, 50 85 L 80 85",
      "M 65 60 L 65 95",
      "M 65 95 C 65 110, 85 110, 85 95 C 85 80, 65 80, 65 95"
    ]
  },
  'இ': {
    char: 'இ',
    viewBox: '0 0 100 100',
    paths: [
      "M 25 40 C 25 20, 50 20, 50 40 C 50 60, 20 60, 20 80 C 20 95, 40 100, 50 90 C 60 80, 70 70, 80 60 C 90 50, 95 65, 80 85 L 60 95"
    ]
  }
};
