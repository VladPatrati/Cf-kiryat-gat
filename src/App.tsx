/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Dumbbell, 
  Wind, 
  Zap, 
  User, 
  Sparkles, 
  ChevronRight, 
  ChevronLeft, 
  Download, 
  RotateCcw,
  Trophy,
  Target
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import confetti from 'canvas-confetti';
import { Gender, UserAssessment } from './types.ts';
import { CATEGORIES, getQuestions } from './constants/questions.ts';
import { generatePDF } from './lib/pdfUtils.ts';

const COLORS = {
  primary: '#d92228', // Technical Red
  border: '#b91c1c',  // Darker Red Border
  bg: '#f8f8f8',
  white: '#FFFFFF',
};

export default function App() {
  const [step, setStep] = useState<'welcome' | 'gender' | 'quiz' | 'results'>('welcome');
  const [athleteName, setAthleteName] = useState('');
  const [gender, setGender] = useState<Gender | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [responses, setResponses] = useState<Record<string, number>>({});
  const [isGeneratingPdf, setIsGeneratingPdf] = useState(false);

  const questions = useMemo(() => (gender ? getQuestions(gender) : []), [gender]);

  const handleStart = () => {
    if (!athleteName.trim()) return;
    setStep('gender');
  };

  const handleGenderSelect = (g: Gender) => {
    setGender(g);
    setStep('quiz');
  };

  const handleAnswer = (score: number) => {
    const questionId = questions[currentQuestionIndex].id;
    setResponses((prev) => ({ ...prev, [questionId]: score }));

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setStep('results');
      confetti({
        particleCount: 150,
        spread: 70,
        origin: { y: 0.6 },
        colors: [COLORS.primary, '#000000', '#FFFFFF']
      });
    }
  };

  const handleBack = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    } else {
      setStep('gender');
    }
  };

  const reset = () => {
    setStep('welcome');
    setGender(null);
    setCurrentQuestionIndex(0);
    setResponses({});
  };

  const domainScores = useMemo(() => {
    if (step !== 'results') return [];
    
    return CATEGORIES.map(cat => {
      const catQuestions = questions.filter(q => q.category === cat.id);
      const totalPossible = catQuestions.length * 3;
      const actualScore = catQuestions.reduce((acc, q) => acc + (responses[q.id] || 0), 0);
      return {
        subject: cat.title,
        A: (actualScore / totalPossible) * 100,
        fullMark: 100,
        raw: actualScore,
        maxRaw: totalPossible
      };
    });
  }, [step, responses, questions]);

  const overallScore = useMemo(() => {
    if (domainScores.length === 0) return 0;
    const total = domainScores.reduce((acc, s) => acc + s.A, 0);
    return Math.round(total / domainScores.length);
  }, [domainScores]);

  const getFocusArea = () => {
    const sorted = [...domainScores].sort((a, b) => a.A - b.A);
    return sorted[0];
  };

  const handleDownloadPdf = async () => {
    setIsGeneratingPdf(true);
    try {
      await generatePDF('results-container', athleteName || 'CrossFit_Kiryat_Gat');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-900 font-sans selection:bg-red-100" dir="rtl">
      {/* Header */}
      <header className="bg-[#d92228] text-white px-8 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-lg border-b-4 border-[#b91c1c] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center font-black text-[#d92228] text-xl border-2 border-white">KG</div>
          <div>
            <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">קרוספיט קרית גת</h1>
            <p className="text-[10px] md:text-xs font-bold opacity-80 mt-1 uppercase tracking-widest">מחשבון יכולות אתלט</p>
          </div>
        </div>
        
        <div className="flex items-center gap-4 mt-4 md:mt-0">
          {gender && (
            <div className="flex bg-[#b91c1c] rounded-lg p-1 border border-white/20">
              <button 
                className={`px-6 py-1 rounded shadow-sm font-bold text-xs transition-colors ${gender === 'male' ? 'bg-white text-[#d92228]' : 'text-white/60 hover:text-white'}`}
                onClick={() => setGender('male')}
              >
                גבר
              </button>
              <button 
                className={`px-6 py-1 rounded shadow-sm font-bold text-xs transition-colors ${gender === 'female' ? 'bg-white text-[#d92228]' : 'text-white/60 hover:text-white'}`}
                onClick={() => setGender('female')}
              >
                אישה
              </button>
            </div>
          )}
          {step === 'results' && (
            <button 
              onClick={handleDownloadPdf}
              disabled={isGeneratingPdf}
              className="bg-white text-[#d92228] px-5 py-2 rounded font-black text-xs uppercase shadow-sm hover:bg-gray-100 transition-all flex items-center gap-2"
            >
              {isGeneratingPdf ? 'מייצר...' : 'ייצוא PDF'}
              <Download size={14} />
            </button>
          )}
        </div>
      </header>

      <main className="container mx-auto p-6">
        <AnimatePresence mode="wait">
          {step === 'welcome' && (
            <motion.div 
              key="welcome"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-xl mx-auto text-center space-y-12 py-20"
            >
              <div className="space-y-6">
                <div className="space-y-4">
                  <h2 className="text-5xl font-black text-[#d92228] tracking-tighter uppercase italic">
                    START YOUR<br/>ASSESSMENT
                  </h2>
                  <div className="w-20 h-1 bg-[#d92228] mx-auto"></div>
                  <p className="text-slate-500 font-bold text-sm tracking-wide leading-relaxed">
                    הזן את שמך ואת התוצאות שלך בחמש קטגוריות מרכזיות כדי לקבל ניתוח מעמיק.
                  </p>
                </div>

                <div className="max-w-sm mx-auto space-y-2">
                  <label htmlFor="athlete-name" className="block text-right text-xs font-black text-slate-400 uppercase tracking-widest">
                    שם האתלט
                  </label>
                  <input
                    id="athlete-name"
                    type="text"
                    value={athleteName}
                    onChange={(e) => setAthleteName(e.target.value)}
                    placeholder="הכנס שם מלא..."
                    className="w-full bg-white border-2 border-slate-100 rounded-lg px-4 py-3 text-right font-bold focus:border-[#d92228] outline-none transition-all shadow-sm"
                  />
                </div>
              </div>
              <button 
                onClick={handleStart}
                disabled={!athleteName.trim()}
                className="bg-black text-white px-10 py-4 rounded font-black text-lg hover:bg-zinc-800 transition-all shadow-xl shadow-slate-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                בוא נתחיל
              </button>
            </motion.div>
          )}

          {step === 'gender' && (
            <motion.div 
              key="gender"
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              className="max-w-2xl mx-auto space-y-8"
            >
              <div className="text-center">
                <h2 className="text-2xl font-black text-slate-800 uppercase tracking-tight">בחר מגדר</h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <button 
                  onClick={() => handleGenderSelect('male')}
                  className="bg-white border border-slate-200 p-10 rounded-xl shadow-sm hover:border-[#d92228] hover:shadow-md transition-all group"
                >
                  <div className="w-20 h-20 bg-[#f1f1f1] rounded-full mx-auto flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-[#d92228] transition-colors">
                    <User size={40} strokeWidth={2.5} />
                  </div>
                  <span className="block mt-6 font-black text-xl text-slate-700">גבר</span>
                </button>
                <button 
                  onClick={() => handleGenderSelect('female')}
                  className="bg-white border border-slate-200 p-10 rounded-xl shadow-sm hover:border-[#d92228] hover:shadow-md transition-all group"
                >
                  <div className="w-20 h-20 bg-[#f1f1f1] rounded-full mx-auto flex items-center justify-center text-slate-400 group-hover:bg-red-50 group-hover:text-[#d92228] transition-colors">
                    <User size={40} strokeWidth={2.5} />
                  </div>
                  <span className="block mt-6 font-black text-xl text-slate-700">אישה</span>
                </button>
              </div>
            </motion.div>
          )}

          {step === 'quiz' && (
            <motion.div 
              key={`q-${currentQuestionIndex}`}
              className="max-w-2xl mx-auto space-y-6"
            >
              <section className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                <div className="bg-[#f1f1f1] px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                  <div className="flex items-center gap-2 font-black text-slate-700 text-sm">
                    {CATEGORIES.find(c => c.id === questions[currentQuestionIndex].category)?.title}
                  </div>
                  <span className="text-[11px] bg-[#d92228] text-white px-3 py-1 rounded-full font-bold uppercase tracking-wider">
                    {currentQuestionIndex + 1} / {questions.length}
                  </span>
                </div>
                
                <div className="p-8 space-y-10">
                  <h3 className="text-2xl font-black text-slate-800 leading-tight">
                    {questions[currentQuestionIndex].text}
                  </h3>
                  
                  <div className="grid gap-3">
                    {questions[currentQuestionIndex].options.map((opt, idx) => (
                      <button 
                        key={idx}
                        onClick={() => handleAnswer(opt.score)}
                        className="w-full text-right p-4 rounded border border-slate-200 hover:border-[#d92228] hover:bg-red-50 font-bold text-slate-700 transition-all active:bg-red-100"
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <button 
                onClick={handleBack}
                className="flex items-center gap-2 text-slate-400 font-black text-xs uppercase tracking-widest hover:text-[#d92228] transition-colors"
              >
                <ChevronRight size={16} />
                חזור שלב אחד
              </button>
            </motion.div>
          )}

          {step === 'results' && (
            <motion.div 
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="max-w-6xl mx-auto"
            >
              <div id="results-container" className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200">
                {/* Header for Report */}
                <div className="bg-[#d92228] text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b-8 border-[#b91c1c]">
                  <div className="text-center md:text-right">
                    <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">CrossFit Kiryat Gat</h1>
                    <p className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest mt-1">Athlete Performance Report</p>
                  </div>
                  <div className="text-center md:text-left bg-[#b91c1c] p-4 rounded-xl border border-white/10 min-w-[200px]">
                    <p className="text-xl font-black">{athleteName}</p>
                    <p className="text-[11px] font-bold opacity-80 uppercase tracking-widest mt-1">
                      {gender === 'male' ? 'מתאמן' : 'מתאמנת'} • {new Date().toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-10 grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Score Panel */}
                <div className="col-span-1">
                  <section className="bg-white border-2 border-[#d92228] rounded-xl shadow-lg flex flex-col relative h-full">
                    <div className="absolute top-4 left-4 opacity-10 font-black text-5xl pointer-events-none">RESULTS</div>
                    <div className="flex-1 flex flex-col items-center justify-center p-8 space-y-10">
                      <div className="relative w-56 h-56 border-8 border-[#d92228]/10 rounded-full flex items-center justify-center">
                        <svg className="absolute inset-0 w-full h-full -rotate-90">
                          <circle
                            cx="112" cy="112" r="104"
                            fill="none" stroke="#d92228"
                            strokeWidth="8"
                            strokeDasharray="653.45"
                            strokeDashoffset={653.45 - (653.45 * overallScore) / 100}
                            strokeLinecap="round"
                          />
                        </svg>
                        <div className="text-center z-10">
                          <span className="text-6xl font-black text-[#d92228] tracking-tighter">{overallScore}</span>
                          <span className="text-xl font-bold text-slate-400">/100</span>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-500 mt-2">Overall Athlete Score</p>
                        </div>
                      </div>

                      <div className="w-full space-y-6">
                        {domainScores.map((score, idx) => (
                          <div key={idx} className="space-y-1.5">
                            <div className="flex justify-between text-[11px] font-black uppercase tracking-wider">
                              <span className="text-slate-500">{score.subject}</span>
                              <span className="text-[#d92228]">{score.A >= 90 ? 'ELITE' : score.A >= 70 ? 'RX+' : score.A >= 40 ? 'COMP' : 'SCALED'}</span>
                            </div>
                            <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                              <motion.div 
                                initial={{ width: 0 }}
                                animate={{ width: `${score.A}%` }}
                                className={`h-full ${score.A >= 70 ? 'bg-[#d92228]' : 'bg-slate-400'}`}
                              />
                            </div>
                          </div>
                        ))}
                      </div>

                      <div className="text-center p-5 bg-slate-50 rounded-xl border border-slate-200 w-full">
                        <p className="text-xs font-black text-slate-700 mb-2 uppercase tracking-wide">תובנת מאמן:</p>
                        <p className="text-xs text-slate-500 leading-relaxed italic font-medium">
                          "יש לך בסיס מצוין בתחומים החזקים שלך. עם זאת, כדי להפוך לאתלט מאוזן יותר, המיקוד הבא שלך חייב להיות 
                          שיפור ה- {getFocusArea()?.subject}. המשך להתאמן בעקביות!"
                        </p>
                      </div>
                    </div>
                  </section>
                </div>

                {/* Radar and Detailed Cards */}
                <div className="lg:col-span-2 space-y-6">
                   <div className="bg-white border border-slate-200 rounded-xl p-8 shadow-sm">
                      <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                        <h3 className="font-black text-slate-800 uppercase tracking-tight">Performance Breakdown</h3>
                        <div className="flex gap-2">
                           <div className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-[#d92228]"></span><span className="text-[10px] font-bold text-slate-400 uppercase">Score</span></div>
                        </div>
                      </div>
                      <div className="h-[350px]">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart cx="50%" cy="50%" outerRadius="80%" data={domainScores}>
                            <PolarGrid stroke="#e5e7eb" />
                            <PolarAngleAxis dataKey="subject" tick={{ fill: '#4B5563', fontSize: 13, fontWeight: 800 }} />
                            <Radar
                              name="Score"
                              dataKey="A"
                              stroke={COLORS.primary}
                              fill={COLORS.primary}
                              fillOpacity={0.4}
                            />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                   </div>

                   <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {CATEGORIES.map(cat => {
                        const score = domainScores.find(s => s.subject === cat.title);
                        return (
                          <section key={cat.id} className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden flex flex-col">
                            <div className="bg-[#f1f1f1] px-4 py-3 border-b border-slate-200 flex justify-between items-center">
                              <h2 className="font-black text-xs text-slate-700 uppercase tracking-widest">{cat.title}</h2>
                              <span className="text-[10px] bg-slate-400 text-white px-2 py-0.5 rounded font-bold uppercase">
                                {score?.raw}/{score?.maxRaw}
                              </span>
                            </div>
                            <div className="p-5 flex-1 flex flex-col justify-center gap-4">
                              <div className="flex items-center gap-4">
                                <div className={`w-10 h-10 rounded flex items-center justify-center font-black text-sm ${score && score.A >= 60 ? 'bg-[#d92228] text-white' : 'bg-slate-100 text-slate-400'}`}>
                                  {score ? Math.round(score.A) : 0}%
                                </div>
                                <div className="flex-1 space-y-1">
                                  <div className="w-full h-1.5 bg-slate-100 rounded-full">
                                    <div className="h-full bg-[#d92228]" style={{ width: `${score?.A}%` }} />
                                  </div>
                                  <p className="text-[9px] font-black text-slate-400 uppercase">Categorical Dominance</p>
                                </div>
                              </div>
                            </div>
                          </section>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>

              <footer className="mt-12 mb-8 flex justify-between items-center text-[10px] text-slate-400 font-bold uppercase tracking-widest px-2">
                <div className="flex gap-6">
                  <span>תאריך עדכון: {new Date().toLocaleDateString('he-IL')}</span>
                  <span>גרסה: 2.1.0</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                  מחובר למערכת קרית גת
                </div>
              </footer>

              <div className="flex justify-center pb-12">
                <button 
                  onClick={reset}
                  className="bg-black text-white px-8 py-3 rounded font-black text-xs uppercase tracking-[0.2em] hover:bg-zinc-800 transition-all flex items-center gap-3"
                >
                  <RotateCcw size={14} />
                  התחל מבדק חדש
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
