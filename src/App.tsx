import { ThemeProvider } from './context/ThemeContext';
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { Home } from './pages/Home';
import { Learn } from './pages/Learn';
import { Games } from './pages/Games';
import { Stories } from './pages/Stories';
import { Rhymes } from './pages/Rhymes';
import { Heritage } from './pages/Heritage';
import { WritingPad } from './pages/WritingPad';
import { Chat } from './pages/Chat';
import { Adventure } from './pages/Adventure';
import { Progress } from './pages/Progress';
import { ParentDashboard } from './pages/ParentDashboard';
import { Login } from './pages/Login';
import { AchievementProvider } from './context/AchievementContext';
import { AuthProvider } from './context/AuthContext';

export default function App() {
  return (
    <ThemeProvider>
    <AuthProvider>
    <AchievementProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="learn" element={<Learn />} />
            <Route path="games" element={<Games />} />
            <Route path="stories" element={<Stories />} />
            <Route path="rhymes" element={<Rhymes />} />
            <Route path="heritage" element={<Heritage />} />
            <Route path="adventure" element={<Adventure />} />
            <Route path="chat" element={<Chat />} />
            <Route path="pad" element={<WritingPad />} />
            <Route path="progress" element={<Progress />} />
            <Route path="parent" element={<ParentDashboard />} />
            <Route path="login" element={<Login />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </AchievementProvider>
    </AuthProvider>
    </ThemeProvider>
  );
}

