import { Question, Category } from '../types';

export const CATEGORIES: Category[] = [
  { id: 'aerobic', title: 'אירובי', icon: 'Wind' },
  { id: 'powerlifting', title: 'פאוור ליפטינג', icon: 'Dumbbell' },
  { id: 'olympic', title: 'הרמות אולימפיות', icon: 'Zap' },
  { id: 'bodyweight', title: 'משקל גוף', icon: 'User' },
  { id: 'skills', title: 'סקילים', icon: 'Sparkles' },
];

export const getQuestions = (gender: 'male'|'female'): Question[] => [
  // --- AEROBIC ---
  {
    id: 'a1',
    category: 'aerobic',
    text: 'מה הזמן סיום שלך ב 5 קילומטר ריצה?',
    options: [
      { label: 'פחות מ 21 דק׳', score: 3 },
      { label: '21-25 דק׳', score: 2 },
      { label: 'מעל 25 דק׳', score: 1 },
      { label: 'מי רץ בכלל מרחק כזה', score: 0 },
    ],
  },
  {
    id: 'a2',
    category: 'aerobic',
    text: 'מה הזמן שאתה רגיל לרוץ בדרך כלל 400 מטר באמצע מטקונים?',
    options: [
      { label: 'מתחת ל 2 דקות', score: 3 },
      { label: '2:00-2:30 דקות', score: 2 },
      { label: 'מעל 2:30', score: 1 },
      { label: 'אני לא רץ במטקונים', score: 0 },
    ],
  },
  {
    id: 'a3',
    category: 'aerobic',
    text: 'כמה קלוריות לדקה אתה מצליח להחזיק לאורך זמן של 5-6 דקות על מכשיר חתירה?',
    options: [
        { label: gender === 'male' ? 'מעל 16 קלוריות' : 'מעל 12 קלוריות', score: 3 },
        { label: '10 קלוריות', score: 2 },
        { label: 'פחות מ 10 קלוריות', score: 1 },
        { label: 'לא יודע / לא מכיר את המספרים שלי', score: 0 },
    ],
  },
  {
    id: 'a4',
    category: 'aerobic',
    text: 'כמה קלוריות לדקה אתה מצליח להחזיק לאורך זמן של 5-6 דקות על מכשיר אסולט בייק?',
    options: [
        { label: gender === 'male' ? 'מעל 16 קלוריות' : 'מעל 12 קלוריות', score: 3 },
        { label: '10 קלוריות', score: 2 },
        { label: 'פחות מ 10 קלוריות', score: 1 },
        { label: 'לא יודע / לא מכיר את המספרים שלי', score: 0 },
    ],
  },
  {
    id: 'a5',
    category: 'aerobic',
    text: 'כמה קלוריות אתה מצליח להכניס בדקה אחת במקסימום (דקה אחת בלבד) בחתירה?',
    options: [
      { label: 'מעל 25', score: 3 },
      { label: 'מעל 18 קלוריות', score: 2 },
      { label: 'מעל 12 קלוריות', score: 1 },
      { label: 'אין לי מושג', score: 0 },
    ],
  },
  {
    id: 'a6',
    category: 'aerobic',
    text: 'כמה קלוריות אתה מצליח להכניס בדקה אחת במקסימום (דקה אחת בלבד) באסולט בייק?',
    options: [
      { label: 'מעל 25', score: 3 },
      { label: 'מעל 18 קלוריות', score: 2 },
      { label: 'מעל 12 קלוריות', score: 1 },
      { label: 'אין לי מושג', score: 0 },
    ],
  },

  // --- POWERLIFTING ---
  {
    id: 'p1',
    category: 'powerlifting',
    text: 'מה המשקל המקסימאלי שלך בבאק סקוואט לחזרה אחת?',
    options: [
      { label: gender === 'male' ? 'מעל 160 קילו' : 'מעל 100 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 110 קילו' : 'מעל 70 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 60 קילו' : 'מעל 30 קילו', score: 1 },
      { label: 'נמוך מהנ״ל או שאני לא יודע מה המשקל', score: 0 },
    ],
  },
  {
    id: 'p2',
    category: 'powerlifting',
    text: 'מה המשקל המקסימאלי שלך בדדליפט לחזרה אחת?',
    options: [
      { label: gender === 'male' ? 'מעל 180 קילו' : 'מעל 110 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 135 קילו' : 'מעל 70 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 70 קילו' : 'מעל 35 קילו', score: 1 },
      { label: 'נמוך מהנ״ל או שאני לא יודע מה המשקל', score: 0 },
    ],
  },
  {
    id: 'p3',
    category: 'powerlifting',
    text: 'מה המשקל המקסימאלי שלך בלחיצת חזה לחזרה אחת?',
    options: [
      { label: gender === 'male' ? 'מעל 100 קילו' : 'מעל 60 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 80 קילו' : 'מעל 40 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 50 קילו' : 'מעל 25 קילו', score: 1 },
      { label: 'נמוך מהנ״ל או שאני לא יודע מה המשקל', score: 0 },
    ],
  },
  {
    id: 'p4',
    category: 'powerlifting',
    text: 'מה המשקל המקסימאלי שלך בלחיצת כתף לחזרה אחת?',
    options: [
      { label: gender === 'male' ? 'מעל 80 קילו' : 'מעל 45 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 60 קילו' : 'מעל 35 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 40 קילו' : 'מעל 20 קילו', score: 1 },
      { label: 'נמוך מהנ״ל או שאני לא יודע מה המשקל', score: 0 },
    ],
  },

  // --- OLYMPIC ---
  {
    id: 'o1',
    category: 'olympic',
    text: 'מה המשקל המירבי שלך בקלין וג׳רק?',
    options: [
      { label: gender === 'male' ? 'מעל 100 קילו' : 'מעל 60 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 80 קילו' : 'מעל 45 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 50 קילו' : 'מעל 30 קילו', score: 1 },
      { label: 'נמוך מזה או לא יודע מה המשקל', score: 0 },
    ],
  },
  {
    id: 'o2',
    category: 'olympic',
    text: 'מה המשקל המירבי שלך בפאוור קלין?',
    options: [
      { label: gender === 'male' ? 'מעל 100 קילו' : 'מעל 60 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 80 קילו' : 'מעל 45 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 50 קילו' : 'מעל 30 קילו', score: 1 },
      { label: 'נמוך מזה או לא יודע מה המשקל', score: 0 },
    ],
  },
  {
    id: 'o3',
    category: 'olympic',
    text: 'מה המשקל המירבי שלך בסקוואט סנאצ׳?',
    options: [
      { label: gender === 'male' ? 'מעל 90 קילו' : 'מעל 50 קילו', score: 3 },
      { label: gender === 'male' ? 'מעל 70 קילו' : 'מעל 35 קילו', score: 2 },
      { label: gender === 'male' ? 'מעל 45 קילו' : 'מעל 25 קילו', score: 1 },
      { label: 'נמוך מזה או לא יודע מה המשקל', score: 0 },
    ],
  },

  // --- BODYWEIGHT ---
  {
    id: 'b1',
    category: 'bodyweight',
    text: 'כמה חזרות של מתח (נקי) אתה מבצע ?',
    options: [
      { label: 'מעל 15', score: 3 },
      { label: 'מעל 8', score: 2 },
      { label: 'מעל 3', score: 1 },
      { label: 'נמוך מזה או לא יודע כמה', score: 0 },
    ],
  },
  {
    id: 'b2',
    category: 'bodyweight',
    text: 'כמה חזרות של סטריקט הנדסטנד (ללא תנופה) אתה מבצע ?',
    options: [
      { label: 'מעל 10', score: 3 },
      { label: 'מעל 5', score: 2 },
      { label: 'מעל 1', score: 1 },
      { label: 'נמוך מזה או לא יודע כמה', score: 0 },
    ],
  },
  {
    id: 'b3',
    category: 'bodyweight',
    text: 'כמה חזרות של עליות כוח (על המתח) אתה מבצע ?',
    options: [
      { label: 'מעל 10', score: 3 },
      { label: 'מעל 5', score: 2 },
      { label: 'מעל 1', score: 1 },
      { label: 'נמוך מזה או לא יודע כמה', score: 0 },
    ],
  },
  {
    id: 'b4',
    category: 'bodyweight',
    text: 'כמה חזרות של רגליים למתח (Toes To Bar) אתה מבצע ?',
    options: [
      { label: 'מעל 15', score: 3 },
      { label: 'מעל 8', score: 2 },
      { label: 'מעל 3', score: 1 },
      { label: 'נמוך מזה או לא יודע כמה', score: 0 },
    ],
  },

  // --- SKILLS ---
  {
    id: 's1',
    category: 'skills',
    text: 'כמה מטרים של הליכה על הידיים אתה מסוגל להשלים ברצף?',
    options: [
      { label: 'מעל 10 מטרים', score: 3 },
      { label: 'מעל 5 מטרים', score: 2 },
      { label: 'מעל מטר', score: 1 },
      { label: 'נמוך מזה או שלא יודע כמה', score: 0 },
    ],
  },
  {
    id: 's2',
    category: 'skills',
    text: 'כמה דאבל אנדרס (קפיצות עם 2 סבבים בדלגית) אתה יכול לבצע ברצף?',
    options: [
      { label: 'מעל 50 בכל ניסיון', score: 3 },
      { label: 'מעל 20 בכל ניסיון', score: 2 },
      { label: '1-20 בכל ניסיון', score: 1 },
      { label: 'נמוך מזה או לא יודע כי לא ניסיתי', score: 0 },
    ],
  },
  {
    id: 's3',
    category: 'skills',
    text: 'כמה מאסל אפ על טבעות אתה יכול לבצע ברצף?',
    options: [
      { label: 'מעל 10 חזרות', score: 3 },
      { label: 'מעל 5 חזרות', score: 2 },
      { label: '1-5 חזרות', score: 1 },
      { label: 'נמוך מזה או לא יודע כמה', score: 0 },
    ],
  },
];
