import fs from 'fs';

let dashboard = fs.readFileSync('src/pages/ParentDashboard.tsx', 'utf8');
dashboard = dashboard.replace('count > 0', '(count as number) > 0');
fs.writeFileSync('src/pages/ParentDashboard.tsx', dashboard);

// Also add Feedback route to App.tsx
let app = fs.readFileSync('src/App.tsx', 'utf8');
if (!app.includes('Feedback')) {
    app = app.replace("import { Login } from './pages/Login';", "import { Login } from './pages/Login';\nimport { Feedback } from './pages/Feedback';");
    app = app.replace('<Route path="login" element={<Login />} />', '<Route path="login" element={<Login />} />\n            <Route path="feedback" element={<Feedback />} />');
    fs.writeFileSync('src/App.tsx', app);
}

