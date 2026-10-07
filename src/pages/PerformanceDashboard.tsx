import React, { useState, useEffect } from 'react';
import {
  Activity,
  Volume2,
  Brain,
  Zap,
  Database,
  RefreshCw,
  Trash2,
  CheckCircle,
  AlertCircle,
  Wifi,
  WifiOff,
} from 'lucide-react';
import { metricsService, PerformanceTelemetry } from '../services/metricsService';
import { audioCache } from '../services/audioCache';
import { AudioService } from '../utils/audioService';
import { aiService } from '../services/aiService';
import { useNetwork } from '../context/NetworkContext';

export function PerformanceDashboard() {
  const [telemetry, setTelemetry] = useState<PerformanceTelemetry>(metricsService.getData());
  const [cacheStats, setCacheStats] = useState({ count: 0, totalSizeBytes: 0 });
  const [testStatus, setTestStatus] = useState<string | null>(null);
  const [isTesting, setIsTesting] = useState(false);
  const { isOnline, isLowBandwidth, toggleLowBandwidth } = useNetwork();

  const refreshStats = () => {
    setTelemetry(metricsService.getData());
    setCacheStats(audioCache.getStats());
  };

  useEffect(() => {
    const unsub = metricsService.subscribe((data) => {
      setTelemetry(data);
      setCacheStats(audioCache.getStats());
    });
    return () => unsub();
  }, []);

  const handleClearCache = async () => {
    await audioCache.clear();
    refreshStats();
    setTestStatus('Cache storage cleared successfully.');
    setTimeout(() => setTestStatus(null), 3000);
  };

  const handleResetMetrics = () => {
    metricsService.resetTelemetry();
    refreshStats();
    setTestStatus('Telemetry metrics reset.');
    setTimeout(() => setTestStatus(null), 3000);
  };

  // Live Test Runners to verify Telemetry
  const runAudioTest = async () => {
    setIsTesting(true);
    setTestStatus('Testing Audio synthesis pipeline...');
    try {
      await new Promise<void>((resolve) => {
        AudioService.playTamilWord('வணக்கம்', () => resolve());
      });
      setTestStatus('✅ Audio pipeline tested successfully.');
    } catch {
      setTestStatus('⚠️ Audio test finished with fallback.');
    } finally {
      setIsTesting(false);
      refreshStats();
    }
  };

  const runAITest = async () => {
    setIsTesting(true);
    setTestStatus('Testing AI chat response pipeline...');
    try {
      const res = await aiService.sendMessage('அ என்றால் என்ன?');
      setTestStatus(`✅ AI response received (${res.durationMs}ms): "${res.text.slice(0, 40)}..."`);
    } catch (err: any) {
      setTestStatus(`⚠️ AI test handled: ${err.message}`);
    } finally {
      setIsTesting(false);
      refreshStats();
    }
  };

  const audioSuccessRate = metricsService.getAudioSuccessRate();
  const audioCacheHitRate = metricsService.getAudioCacheHitRate();
  const avgAudioLoadTime = metricsService.getAverageAudioLoadTimeSec();
  const aiSuccessRate = metricsService.getAISuccessRate();
  const avgAIResponseTime = metricsService.getAverageAIResponseTimeSec();
  const aiFallbackRate = metricsService.getAIFallbackRate();
  const apiErrorRate = metricsService.getAPIErrorRate();
  const hasData = metricsService.hasSufficientData();

  return (
    <div className="w-full max-w-6xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            <Activity className="text-purple-600" />
            System Performance & Telemetry
          </h1>
          <p className="text-slate-500 mt-1">
            Real-time telemetry measuring audio latency, cache hits, AI response times, and resilience.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={toggleLowBandwidth}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition flex items-center gap-1.5 ${
              isLowBandwidth
                ? 'bg-amber-100 border-amber-300 text-amber-800 dark:bg-amber-950 dark:border-amber-800 dark:text-amber-300'
                : 'bg-slate-100 border-slate-200 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:border-slate-700 dark:text-slate-300'
            }`}
          >
            {isLowBandwidth ? '📶 Low-Bandwidth: ON' : '📶 Low-Bandwidth: OFF'}
          </button>

          <button
            onClick={refreshStats}
            className="p-2 text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            title="Refresh metrics"
          >
            <RefreshCw size={18} />
          </button>
        </div>
      </div>

      {/* Network / Connection Bar */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className={`p-2.5 rounded-xl ${isOnline ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
            {isOnline ? <Wifi size={20} /> : <WifiOff size={20} />}
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Network State</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              {isOnline ? '🟢 Online & Connected' : '📡 Offline Mode Active'}
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-purple-100 text-purple-700">
            <Database size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">Client Audio Cache</div>
            <div className="font-bold text-slate-800 dark:text-slate-100 tabular-nums">
              {cacheStats.count} items ({Math.round(cacheStats.totalSizeBytes / 1024)} KB)
            </div>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-100 text-indigo-700">
            <Zap size={20} />
          </div>
          <div>
            <div className="text-xs text-slate-400 font-semibold uppercase">AI Engine Model</div>
            <div className="font-bold text-slate-800 dark:text-slate-100">
              Gemini 3.8 Flash (Server Proxy)
            </div>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics */}
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
        <MetricBox
          label="Audio Success Rate"
          value={audioSuccessRate !== null ? `${audioSuccessRate}%` : 'Insufficient data'}
          sub={`${telemetry.audio.successes} / ${telemetry.audio.requests} reqs`}
        />
        <MetricBox
          label="Audio Cache Hit Rate"
          value={audioCacheHitRate !== null ? `${audioCacheHitRate}%` : 'Insufficient data'}
          sub={`${telemetry.audio.cacheHits} cache hits`}
        />
        <MetricBox
          label="Avg Audio Load Time"
          value={avgAudioLoadTime !== null ? `${avgAudioLoadTime}s` : 'Insufficient data'}
          sub="Latency to play"
        />
        <MetricBox
          label="AI Success Rate"
          value={aiSuccessRate !== null ? `${aiSuccessRate}%` : 'Insufficient data'}
          sub={`${telemetry.ai.successes} / ${telemetry.ai.requests} chats`}
        />
        <MetricBox
          label="Avg AI Response"
          value={avgAIResponseTime !== null ? `${avgAIResponseTime}s` : 'Insufficient data'}
          sub="Round-trip latency"
        />
        <MetricBox
          label="AI Fallback Usage"
          value={aiFallbackRate !== null ? `${aiFallbackRate}%` : 'Insufficient data'}
          sub={`${telemetry.ai.fallbackCount} fallback responses`}
        />
        <MetricBox
          label="API Error Rate"
          value={apiErrorRate !== null ? `${apiErrorRate}%` : '0%'}
          sub={`${telemetry.audio.failures + telemetry.ai.failures} total errors`}
        />
      </div>

      {/* Raw Telemetry Counters & Interactive Diagnostics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Audio Pipeline Diagnostics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Volume2 className="text-purple-600" size={20} />
              Audio Pipeline Telemetry
            </h3>
            <span className="text-xs text-slate-400 font-mono">audioService</span>
          </div>

          <div className="space-y-2.5 text-sm">
            <Row label="Total Audio Requests" value={telemetry.audio.requests} />
            <Row label="Successful Playbacks" value={telemetry.audio.successes} />
            <Row label="Cache Hits (Storage API)" value={telemetry.audio.cacheHits} />
            <Row label="Cache Misses" value={telemetry.audio.cacheMisses} />
            <Row label="SpeechSynthesis Fallbacks" value={telemetry.audio.fallbackCount} />
            <Row label="Audio Failures" value={telemetry.audio.failures} />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <button
              onClick={runAudioTest}
              disabled={isTesting}
              className="px-4 py-2 bg-purple-50 hover:bg-purple-100 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-xl text-xs font-bold transition"
            >
              ▶ Test Audio Playback
            </button>
            <button
              onClick={handleClearCache}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Clear Cache
            </button>
          </div>
        </div>

        {/* AI Buddy Diagnostics */}
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 flex items-center gap-2">
              <Brain className="text-indigo-600" size={20} />
              AI Buddy & Rate Limiter Telemetry
            </h3>
            <span className="text-xs text-slate-400 font-mono">aiService</span>
          </div>

          <div className="space-y-2.5 text-sm">
            <Row label="Total Chat Requests" value={telemetry.ai.requests} />
            <Row label="Successful AI Responses" value={telemetry.ai.successes} />
            <Row label="Rate Limit Events (429)" value={telemetry.ai.rateLimitHits} />
            <Row label="Timeout Invocations (>8s)" value={telemetry.ai.timeouts} />
            <Row label="Local Deterministic Fallbacks" value={telemetry.ai.fallbackCount} />
            <Row label="Total AI Failures" value={telemetry.ai.failures} />
          </div>

          <div className="pt-3 border-t border-slate-100 dark:border-slate-700 flex gap-2">
            <button
              onClick={runAITest}
              disabled={isTesting}
              className="px-4 py-2 bg-indigo-50 hover:bg-indigo-100 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 rounded-xl text-xs font-bold transition"
            >
              ▶ Test AI Chat Request
            </button>
            <button
              onClick={handleResetMetrics}
              className="px-4 py-2 bg-slate-50 hover:bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 rounded-xl text-xs font-bold transition flex items-center gap-1.5"
            >
              <Trash2 size={14} /> Reset Telemetry
            </button>
          </div>
        </div>
      </div>

      {/* Live test message notification */}
      {testStatus && (
        <div className="p-4 rounded-2xl bg-slate-900 text-white text-sm font-medium flex items-center gap-2 shadow-lg animate-in fade-in">
          <CheckCircle size={18} className="text-emerald-400 shrink-0" />
          <span>{testStatus}</span>
        </div>
      )}
    </div>
  );
}

function MetricBox({ label, value, sub }: { label: string; value: string; sub: string }) {
  const isInsufficient = value === 'Insufficient data';
  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-slate-200 dark:border-slate-700 flex flex-col justify-between">
      <div className="text-xs font-semibold text-slate-500 leading-tight mb-2">{label}</div>
      <div>
        <div
          className={`font-bold leading-tight tabular-nums ${
            isInsufficient
              ? 'text-xs text-slate-400 font-normal italic'
              : 'text-2xl text-slate-900 dark:text-slate-100'
          }`}
        >
          {value}
        </div>
        <div className="text-[11px] text-slate-400 mt-1">{sub}</div>
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: number }) {
  return (
    <div className="flex items-center justify-between p-2 rounded-lg bg-slate-50 dark:bg-slate-900/40">
      <span className="text-slate-600 dark:text-slate-400">{label}</span>
      <span className="font-bold text-slate-800 dark:text-slate-200 tabular-nums">{value}</span>
    </div>
  );
}
