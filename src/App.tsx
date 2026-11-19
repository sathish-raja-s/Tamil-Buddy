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
import { AuthProvider } from './context/AuthContext';
import { AchievementProvider } from './context/AchievementContext';
import { NetworkProvider } from './context/NetworkContext';
import { Validation } from './pages/Validation';
import { PerformanceDashboard } from './pages/PerformanceDashboard';
import { ErrorBoundary } from './components/common/ErrorBoundary';

/**
 * Root application component configuring context providers (Theme, Auth,
 * Achievements, Network) and client-side routes wrapped inside a top-level
 * React {@link ErrorBoundary} for fault isolation.
 */
export default function App() {
  return (
    <ErrorBoundary scope="Application Root">
      <ThemeProvider>
      <AuthProvider>
      <AchievementProvider>
      <NetworkProvider>
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
              <Route path="feedback" element={<Validation />} />
              <Route path="validation" element={<Validation />} />
              <Route path="performance" element={<PerformanceDashboard />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </NetworkProvider>
      </AchievementProvider>
      </AuthProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

