import React, { useState } from 'react';
import { Send, CheckCircle, Star } from 'lucide-react';

export function Feedback() {
  const [submitted, setSubmitted] = useState(false);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, this would save to Firestore 'feedback' collection
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="w-full max-w-2xl mx-auto py-12 px-4 text-center space-y-6">
        <div className="w-24 h-24 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
          <CheckCircle size={48} />
        </div>
        <h2 className="text-3xl font-bold text-slate-800 dark:text-slate-100">Thank You!</h2>
        <p className="text-slate-500">Your feedback has been submitted successfully.</p>
        <button onClick={() => setSubmitted(false)} className="text-purple-600 font-bold hover:underline">
          Submit another response
        </button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto py-8 px-4 space-y-8 pb-12">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-slate-800 dark:text-slate-100">User Feedback Validation</h1>
        <p className="text-slate-500">Help us evaluate Tamil Buddy's effectiveness.</p>
      </div>

      <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-slate-100 dark:border-slate-700 space-y-6">
        
        <div className="space-y-3">
          <label className="font-bold text-slate-700 dark:text-slate-200">Learner Age Group</label>
          <select required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            <option value="">Select age group...</option>
            <option value="under_6">Under 6 years</option>
            <option value="6_to_10">6 - 10 years</option>
            <option value="11_to_15">11 - 15 years</option>
            <option value="adult">Adult beginner</option>
          </select>
        </div>

        <div className="space-y-3">
          <label className="font-bold text-slate-700 dark:text-slate-200">Module Tested</label>
          <select required className="w-full p-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100">
            <option value="">Select module...</option>
            <option value="adventure">Adventure Map</option>
            <option value="learn">Alphabet & Phonics</option>
            <option value="stories">Stories & Rhymes</option>
            <option value="chat">AI Chat Buddy</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          <RatingField label="Ease of Use (Usability)" />
          <RatingField label="Engagement & Fun" />
          <RatingField label="Audio / Pronunciation Usefulness" />
          <RatingField label="Overall Satisfaction" />
        </div>

        <div className="space-y-3">
          <label className="font-bold text-slate-700 dark:text-slate-200">Suggestions for Improvement</label>
          <textarea 
            rows={4}
            className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100"
            placeholder="What could be better?"
          ></textarea>
        </div>

        <button type="submit" className="w-full py-4 bg-purple-600 text-white rounded-xl font-bold shadow-md hover:bg-purple-700 flex items-center justify-center gap-2">
          <Send size={20} /> Submit Feedback
        </button>

      </form>
    </div>
  );
}

function RatingField({ label }: { label: string }) {
  const [rating, setRating] = useState(0);
  return (
    <div className="space-y-2">
      <label className="font-bold text-slate-700 dark:text-slate-200 text-sm">{label}</label>
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map(star => (
          <button
            key={star}
            type="button"
            onClick={() => setRating(star)}
            className={`p-2 rounded-lg transition-colors ${rating >= star ? 'text-yellow-500' : 'text-slate-300 dark:text-slate-600 hover:text-yellow-200'}`}
          >
            <Star size={28} className={rating >= star ? 'fill-current' : ''} />
          </button>
        ))}
      </div>
    </div>
  );
}
