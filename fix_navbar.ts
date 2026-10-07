import fs from 'fs';

let nav = fs.readFileSync('src/components/layout/Navbar.tsx', 'utf8');
if (!nav.includes('/feedback')) {
    nav = nav.replace(
        "{ name: 'Parent', path: '/parent', icon: Users },",
        "{ name: 'Parent', path: '/parent', icon: Users },\n  { name: 'Feedback', path: '/feedback', icon: MessageSquare },"
    );
    
    if (!nav.includes('MessageSquare')) {
        nav = nav.replace('import { Home, BookOpen', 'import { Home, BookOpen, MessageSquare');
    }
    fs.writeFileSync('src/components/layout/Navbar.tsx', nav);
}
