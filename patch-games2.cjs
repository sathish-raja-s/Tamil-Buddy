const fs = require('fs');
let code = fs.readFileSync('src/pages/Games.tsx', 'utf-8');

// There is a second setFeedback('wrong') for the Match game. Let's fix that.
code = code.replace(
  "setFeedback('wrong');\n      setTimeout(() => setFeedback('idle'), 1000);",
  "audio.playError();\n      setFeedback('wrong');\n      setTimeout(() => setFeedback('idle'), 1000);"
);

// Tracing completion sound
code = code.replace(
  "setTraceIndex((prev) => prev + 1);",
  "audio.playSuccess();\n                setTraceIndex((prev) => prev + 1);"
);

fs.writeFileSync('src/pages/Games.tsx', code);
