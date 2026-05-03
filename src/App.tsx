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
  Target,
  Shield
} from 'lucide-react';
import { 
  Radar, 
  RadarChart, 
  PolarGrid, 
  PolarAngleAxis, 
  ResponsiveContainer 
} from 'recharts';
import confetti from 'canvas-confetti';
import { Gender, UserAssessment } from './types';
import { CATEGORIES, getQuestions } from './constants/questions';
import { generatePDF } from './lib/pdfUtils';

const COLORS = {
  primary: '#d92228', // Technical Red
  border: '#b91c1c',  // Darker Red Border
  bg: '#f8f8f8',
  white: '#FFFFFF',
};

const Logo = ({ className = "" }: { className?: string }) => (
  <div className={`flex flex-col text-right ${className}`}>
    <span className="text-2xl font-black leading-none tracking-tighter uppercase italic">CrossFit</span>
    <span className="text-[12px] font-black leading-none tracking-[0.3em] uppercase text-red-600 mt-1">Kiryat Gat</span>
  </div>
);

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
    console.log('Download button clicked');
    setIsGeneratingPdf(true);
    try {
      // Small delay to ensure isGeneratingPdf state has propagated to DOM if needed
      await new Promise(r => setTimeout(r, 100));
      await generatePDF('results-container', athleteName || 'CrossFit_Kiryat_Gat');
    } catch (err) {
      console.error('Download handler error:', err);
      alert('שגיאה בהורדה');
    } finally {
      setIsGeneratingPdf(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#f8f8f8] text-slate-900 font-sans selection:bg-red-100" dir="rtl">
      {/* Full screen loader for PDF generation */}
      {isGeneratingPdf && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-[100] flex flex-col items-center justify-center text-white text-center p-6">
          <div className="w-20 h-20 border-4 border-[#d92228] border-t-transparent rounded-full animate-spin mb-8"></div>
          <h2 className="text-3xl font-black uppercase italic tracking-tighter mb-2">מייצר דוח ביצועים...</h2>
          <p className="text-slate-300 font-bold max-w-xs">
            אנחנו מכינים את הנתונים שלך. זה עשוי לקחת כמה שניות, במיוחד בנייד.
          </p>
        </div>
      )}

      {/* Header */}
      <header className="bg-black text-white px-8 py-4 flex flex-col md:flex-row md:items-center justify-between shadow-lg border-b-4 border-[#d92228] sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Logo className="scale-90" />
          <div className="h-8 w-px bg-white/20 hidden md:block"></div>
          <p className="text-[10px] md:text-xs font-bold opacity-80 uppercase tracking-widest hidden md:block">מחשבון יכולות אתלט</p>
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
              <div className="flex justify-center mb-16">
                <Logo className="scale-[2.5]" />
              </div>
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
              <div 
                id="results-container" 
                className="bg-white rounded-3xl overflow-hidden shadow-2xl border border-slate-200"
                style={{ direction: 'rtl' }}
              >
                {/* Header for Report */}
                <div className="bg-black text-white p-8 md:p-12 flex flex-col md:flex-row justify-between items-center gap-6 border-b-8 border-[#d92228]">
                  <div className="flex items-center gap-8 text-center md:text-right">
                    <Logo className="hidden md:flex" />
                    <div className="h-10 w-px bg-white/20 hidden md:block"></div>
                    <div>
                      <h1 className="text-3xl md:text-4xl font-black uppercase tracking-tighter">קרוספיט קרית גת</h1>
                      <p className="text-xs md:text-sm font-bold opacity-80 uppercase tracking-widest mt-1 italic">Athlete Performance Report</p>
                    </div>
                  </div>
                  <div className="text-center md:text-left bg-zinc-900 p-4 md:p-6 rounded-xl border border-white/20 min-w-[240px]">
                    <p className="text-2xl font-black tracking-tight">{athleteName}</p>
                    <p className="text-[11px] font-bold opacity-90 uppercase tracking-widest mt-1">
                      {gender === 'male' ? 'מתאמן' : 'מתאמנת'} • {new Date().toLocaleDateString('he-IL')}
                    </p>
                  </div>
                </div>

                <div className="p-6 md:p-10 lg:p-12">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">
                    {/* Score Panel */}
                    <div className="col-span-1">
                      <section className="bg-white border-4 border-[#d92228]/10 rounded-2xl p-8 flex flex-col items-center justify-center space-y-10 relative overflow-hidden h-full">
                        <div className="absolute -top-6 -left-6 opacity-[0.03] font-black text-8xl pointer-events-none rotate-12">SCORE</div>
                        
                        <div className="relative w-56 h-56 flex items-center justify-center">
                          <svg className="absolute inset-0 w-full h-full -rotate-90">
                            <circle
                              cx="112" cy="112" r="102"
                              fill="none" stroke="#f1f5f9"
                              strokeWidth="12"
                            />
                            <motion.circle
                              cx="112" cy="112" r="102"
                              fill="none" stroke="#d92228"
                              strokeWidth="12"
                              strokeDasharray="640.88"
                              initial={{ strokeDashoffset: 640.88 }}
                              animate={{ strokeDashoffset: 640.88 - (640.88 * overallScore) / 100 }}
                              transition={{ duration: 1.5, ease: "easeOut" }}
                              strokeLinecap="round"
                            />
                          </svg>
                          <div className="text-center z-10">
                            <span className="text-7xl font-black text-[#d92228] tracking-tighter">{overallScore}</span>
                            <span className="text-xl font-bold text-slate-400">/100</span>
                            <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 mt-2">Overall Fitness</p>
                          </div>
                        </div>

                        <div className="w-full space-y-6">
                          {domainScores.map((score, idx) => (
                            <div key={idx} className="space-y-2">
                              <div className="flex justify-between text-[11px] font-black uppercase tracking-widest">
                                <span className="text-slate-500">{score.subject}</span>
                                <span className="text-[#d92228]">{score.A >= 85 ? 'ELITE' : score.A >= 70 ? 'RX+' : score.A >= 40 ? 'RX' : 'SCALED'}</span>
                              </div>
                              <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${score.A}%` }}
                                  className={`h-full ${score.A >= 70 ? 'bg-[#d92228]' : 'bg-slate-400'}`}
                                />
                              </div>
                            </div>
                          ))}
                        </div>
                      </section>
                    </div>

                    {/* Radar and Recommendations */}
                    <div className="lg:col-span-2 space-y-8">
                      <div className="bg-slate-50 border border-slate-200 rounded-2xl p-8 shadow-inner relative overflow-hidden">
                        <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
                          <h3 className="font-black text-slate-700 uppercase tracking-tight flex items-center gap-2">
                            <User size={18} className="text-[#d92228]" />
                            Performance Analysis
                          </h3>
                        </div>
                        <div className="h-[400px] w-full pdf-chart-container">
                          <ResponsiveContainer width="100%" height="100%">
                            <RadarChart cx="50%" cy="50%" outerRadius="75%" data={domainScores}>
                              <PolarGrid stroke="#cbd5e1" />
                              <PolarAngleAxis 
                                dataKey="subject" 
                                tick={{ fill: '#334155', fontSize: 13, fontWeight: 900 }} 
                              />
                              <Radar
                                name="Score"
                                dataKey="A"
                                stroke="#d92228"
                                strokeWidth={3}
                                fill="#d92228"
                                fillOpacity={0.4}
                              />
                            </RadarChart>
                          </ResponsiveContainer>
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-[#1e293b] text-white p-8 rounded-2xl shadow-lg border-b-4 border-[#d92228] relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10">
                          <Trophy size={64} />
                        </div>
                        <div className="flex items-center gap-3 mb-6">
                          <Sparkles size={24} className="text-[#d92228]" />
                          <h4 className="font-black text-lg uppercase tracking-widest">סיכום ביצועים</h4>
                        </div>
                        
                        <div className="space-y-6">
                          <p className="text-base font-bold leading-relaxed border-r-2 border-[#d92228] pr-4 text-slate-200">
                             כל הכבוד על סיום המבדק! הנתונים מראים את רמת הכושר הנוכחית שלך בחמישה תחומים קריטיים. השתמש בתוצאות אלו כדי לבנות תוכנית עבודה ממוקדת יחד עם המאמנים בבוקס.
                          </p>
                          
                          <div className="pt-4 border-t border-slate-700">
                            <p className="text-[10px] font-black uppercase tracking-widest text-[#d92228] mb-2">תחום למיקוד</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-bold">{getFocusArea()?.subject}</span>
                              <span className="text-xs bg-[#d92228] px-2 py-0.5 rounded font-black">{Math.round(getFocusArea()?.A)}%</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white border-2 border-slate-100 p-8 rounded-2xl flex flex-col justify-center min-h-[140px]">
                        <p className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-4">מוטיבציה יומית</p>
                        <blockquote className="text-xl font-black text-slate-800 italic leading-tight">
                          "הדרך לפסגה מתחילה באימון של היום."
                        </blockquote>
                      </div>
                      </div>
                    </div>
                  </div>

                  {/* Level Legend */}
                  <div className="mt-10 grid grid-cols-2 md:grid-cols-4 gap-4 bg-slate-50 p-6 rounded-xl border border-slate-200">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-[#d92228]"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">ELITE (85%+)</p>
                        <p className="text-[10px] font-bold text-slate-600">רמה תחרותית ארצית</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-slate-800"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RX+ (70-84%)</p>
                        <p className="text-[10px] font-bold text-slate-600">רמה גבוהה מאוד</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-slate-400"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">RX (40-69%)</p>
                        <p className="text-[10px] font-bold text-slate-600">מבצע אימונים כפי שנכתבו</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-slate-200"></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">SCALED (0-39%)</p>
                        <p className="text-[10px] font-bold text-slate-600">מיקוד בבניית יסודות</p>
                      </div>
                    </div>
                  </div>

                  <div className="mt-12 flex justify-between items-center text-[10px] text-slate-400 font-black uppercase tracking-[0.3em] px-2 pt-8 border-t border-slate-100">
                    <div className="flex gap-8">
                      <span>DATE: {new Date().toLocaleDateString('he-IL')}</span>
                      <span>VERSION: 2.5.0_PRO</span>
                    </div>
                    <div className="flex items-center gap-2">
                       VERIFIED BY KG SYSTEM
                      <div className="w-1.5 h-1.5 rounded-full bg-green-500"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons - Visible only on screen */}
              <div className="flex flex-col md:flex-row justify-center items-center gap-4 mt-12 pb-16 no-print">
                <button 
                  onClick={handleDownloadPdf}
                  disabled={isGeneratingPdf}
                  className="w-full md:w-auto bg-[#d92228] text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-[#b91c1c] transition-all flex items-center justify-center gap-3 shadow-xl shadow-red-100"
                >
                  {isGeneratingPdf ? <RotateCcw className="animate-spin" size={18} /> : <Download size={18} />}
                  {isGeneratingPdf ? 'מייצר דוח...' : 'הורד דוח ביצועים PDF'}
                </button>
                <button 
                  onClick={reset}
                  className="w-full md:w-auto bg-slate-900 text-white px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest hover:bg-black transition-all flex items-center justify-center gap-3"
                >
                  <RotateCcw size={18} />
                  מבדק חדש
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
