import React, { useState, useEffect } from 'react';
import { TamilVoiceService, SpeakerName } from '../../services/tamilVoiceService';
import { Volume2, Loader2, Play } from 'lucide-react';

const VOICES: { id: SpeakerName; label: string; desc: string }[] = [
  { id: 'ishita', label: '👩 Teacher', desc: 'Ishita' },
  { id: 'ritu', label: '👩 Story Voice', desc: 'Ritu' },
  { id: 'ratan', label: '👨 Narrator', desc: 'Ratan' },
  { id: 'rohan', label: '👨 Tamil Buddy', desc: 'Rohan' }
];

export function VoiceSelector() {
  const [selected, setSelected] = useState<SpeakerName>('ishita');
  const [previewing, setPreviewing] = useState<SpeakerName | null>(null);

  useEffect(() => {
    setSelected(TamilVoiceService.getPreferredSpeaker());
  }, []);

  const handleSelect = (id: SpeakerName) => {
    setSelected(id);
    TamilVoiceService.setPreferredSpeaker(id);
  };

  const handlePreview = (id: SpeakerName, e: React.MouseEvent) => {
    e.stopPropagation();
    setPreviewing(id);
    TamilVoiceService.playTamilText(
      "வணக்கம்! இன்று நாம் தமிழ் கற்போம்.",
      { speaker: id },
      () => setPreviewing(null),
      () => setPreviewing(null)
    );
  };

  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Volume2 className="text-purple-600" />
        <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100">🎙️ என் குரல் (My Voice)</h3>
      </div>
      <p className="text-slate-600 dark:text-slate-300 text-sm mb-4">Select the preferred Tamil voice for the application.</p>
      
      <div className="grid gap-3">
        {VOICES.map(voice => (
          <div 
            key={voice.id}
            onClick={() => handleSelect(voice.id)}
            className={`flex items-center justify-between p-4 rounded-2xl border-2 transition-all cursor-pointer ${
              selected === voice.id ? 'border-purple-500 bg-purple-50 dark:bg-purple-900/20' : 'border-slate-200 dark:border-slate-700 hover:border-purple-300'
            }`}
          >
            <div>
              <div className="font-bold text-slate-800 dark:text-slate-100">{voice.label}</div>
              <div className="text-xs text-slate-500">{voice.desc}</div>
            </div>
            
            <button
              onClick={(e) => handlePreview(voice.id, e)}
              className="p-2 rounded-full bg-white dark:bg-slate-700 text-purple-600 shadow-sm hover:bg-purple-100 transition-colors"
            >
              {previewing === voice.id ? <Loader2 size={18} className="animate-spin" /> : <Play size={18} />}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
