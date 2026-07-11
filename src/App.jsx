import React, { useState, useEffect } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, CheckCircle2, Database, Activity, User, Briefcase, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ScatterChart, Scatter } from 'recharts';
import { supabase } from './supabase'; 

export default function App() {
  const [view, setView] = useState('LANDING'); 
  const [userData, setUserData] = useState({ nombre: '', cargo: '', edad: '' });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [dbRecords, setDbRecords] = useState([]); 
  const [categoryScores, setCategoryScores] = useState({ Finanzas: 0, Hogar: 0, Salud: 0, Logística: 0 });

  const GLOBAL_DB_AVERAGE = { Finanzas: 55, Hogar: 42, Salud: 68, Logística: 35 };

  const questions = [
    { category: "Finanzas", q: "¿Sigues viviendo al día, esperando que no ocurra un imprevisto financiero que te arruine el mes?", options: ["[A] Tengo ahorros, mis cuentas están bajo control.", "[B] Vivo al límite, a veces pido prestado.", "[C] Vivo de milagro, las tarjetas de crédito son mi salvación."], weights: [0, 50, 100] },
    { category: "Hogar", q: "¿Tu espacio vital es un caos de desorden donde no encuentras ni los calcetines?", options: ["[A] Mi casa está impecable y funcional.", "[B] Hay desorden, pero sobrevivo.", "[C] Es una zona de desastre, el desorden me controla."], weights: [0, 50, 100] },
    { category: "Salud", q: "¿Ignoras señales claras de que tu cuerpo necesita un descanso o atención médica?", options: ["[A] Me cuido, voy al médico cuando debo.", "[B] Ignoro los malestares hasta que me obligan a parar.", "[C] Solo rezo para que el dolor se pase solo."], weights: [0, 60, 100] },
    { category: "Logística", q: "¿Tu nevera está llena de comida podrida o básicamente no existe?", options: ["[A] Cocino, tengo inventario real.", "[B] Compro cosas que terminan en la basura.", "[C] Sobrevivo a punta de domicilios y sobras."], weights: [0, 50, 100] },
    { category: "Finanzas", q: "¿Es tu 'fondo de emergencia' pedirle dinero a tus padres o amigos cuando todo colapsa?", options: ["[A] Soy totalmente autosuficiente.", "[B] A veces me ayuda alguien más.", "[C] No tengo ni idea de qué haría sin ayuda externa."], weights: [0, 70, 100] }
  ];

  useEffect(() => { fetchRecords(); }, []);

  const fetchRecords = async () => {
    const { data } = await supabase.from('telemetria').select('*').order('created_at', { ascending: false });
    if (data) setDbRecords(data);
  };

  const handleInputChange = (e) => setUserData({ ...userData, [e.target.name]: e.target.value });
  const startTest = (e) => { e.preventDefault(); if (userData.nombre.trim() !== '' && userData.edad.trim() !== '') setView('TEST'); };

  const handleAnswer = async (weight, category) => {
    const newScores = { ...categoryScores, [category]: Math.min(categoryScores[category] + weight, 100) };
    setCategoryScores(newScores);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    else {
      const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
      const finalPct = Math.min(Math.round((totalScore / 500) * 100), 100);
      let statusStr = finalPct <= 30 ? 'OPERATIVO' : finalPct <= 60 ? 'RIESGO MODERADO' : 'COLAPSO ESTRUCTURAL';
      const newRecord = { nombre: userData.nombre, edad: parseInt(userData.edad), cargo: userData.cargo || 'N/A', fraude: finalPct, status: statusStr };
      const { data } = await supabase.from('telemetria').insert([newRecord]).select();
      if (data) setDbRecords(prev => [data[0], ...prev]);
      setView('RESULTS');
    }
  };

  const liveChartData = Object.keys(categoryScores).map(key => ({ categoria: key, "Nivel de Fraude": categoryScores[key], "Promedio Global": GLOBAL_DB_AVERAGE[key] }));
  const finalPercentage = Math.min(Math.round((Object.values(categoryScores).reduce((a, b) => a + b, 0) / 500) * 100), 100);
  const getRec = () => finalPercentage <= 30 ? { title: 'OPERATIVO', color: 'text-[#00FF41]', border: 'border-[#00FF41]' } : finalPercentage <= 60 ? { title: 'RIESGO MODERADO', color: 'text-yellow-500', border: 'border-yellow-500' } : { title: 'COLAPSO ESTRUCTURAL', color: 'text-red-500', border: 'border-red-500' };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="border-b border-zinc-800 pb-4 mb-8 flex justify-between items-end">
          <h1 className="text-3xl font-black text-zinc-100">Adult<span className="text-[#00FF41]">.Log</span></h1>
          <p className="text-[10px] text-zinc-500 uppercase">Estado: DB Sync</p>
        </header>

        {view === 'LANDING' && (
          <div className="border border-zinc-800 p-8 text-center bg-zinc-950 animate-fade-in">
            <h2 className="text-2xl font-bold mb-4">¿Realmente eres un adulto o solo estás improvisando?</h2>
            <button onClick={() => setView('FORM')} className="bg-zinc-100 text-black px-8 py-3 font-bold uppercase hover:bg-[#00FF41]">Iniciar Evaluación</button>
          </div>
        )}

        {view === 'FORM' && (
          <form onSubmit={startTest} className="max-w-md mx-auto border border-zinc-800 p-8 bg-zinc-950 space-y-4 animate-fade-in">
            <input required type="text" name="nombre" placeholder="Tu nombre" onChange={handleInputChange} className="w-full bg-zinc-900 border p-3" />
            <input required type="number" name="edad" placeholder="Edad" onChange={handleInputChange} className="w-full bg-zinc-900 border p-3" />
            <input type="text" name="cargo" placeholder="Cargo/Ocupación" onChange={handleInputChange} className="w-full bg-zinc-900 border p-3" />
            <button type="submit" className="w-full bg-[#00FF41] text-black font-bold p-3">Confirmar datos</button>
          </form>
        )}

        {view === 'TEST' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-fade-in">
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <p className="text-[#00FF41] mb-6 text-lg">{questions[currentQuestion].q}</p>
              {questions[currentQuestion].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(questions[currentQuestion].weights[i], questions[currentQuestion].category)} className="w-full text-left p-4 border border-zinc-700 hover:bg-zinc-800 mb-3">{opt}</button>
              ))}
            </div>
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={liveChartData}><CartesianGrid strokeDasharray="3 3" stroke="#27272a"/><XAxis dataKey="categoria" stroke="#71717a"/><YAxis domain={[0, 100]} stroke="#71717a"/><Tooltip contentStyle={{backgroundColor: '#09090b'}}/><Legend/><Bar dataKey="Nivel de Fraude" fill="#ef4444"/><Bar dataKey="Promedio Global" fill="#27272a"/></BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {view === 'RESULTS' && (
          <div className="space-y-8 animate-fade-in">
            <div className={`border p-8 text-center ${getRec().border}`}>
              <p className="text-2xl font-bold">Diagnóstico: <span className={getRec().color}>{getRec().title}</span></p>
              <p className="text-5xl font-black mt-4">{finalPercentage}% FRAUDE</p>
            </div>
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <h3 className="text-zinc-400 mb-6 uppercase text-sm">Correlación: Edad vs. Fraude</h3>
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid stroke="#27272a"/><XAxis type="number" dataKey="edad" stroke="#71717a"/><YAxis type="number" dataKey="fraude" stroke="#71717a"/><Tooltip/><Scatter data={dbRecords} fill="#00FF41"/></ScatterChart></ResponsiveContainer>
              </div>
            </div>
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <table className="w-full text-left text-xs text-zinc-300">
                <thead><tr className="border-b border-zinc-800 text-zinc-500"><th className="pb-2">OPERADOR</th><th className="pb-2">EDAD</th><th className="pb-2 text-right">FRAUDE</th></tr></thead>
                <tbody>{dbRecords.map(r => <tr key={r.id} className="border-b border-zinc-900"><td>{r.nombre}</td><td>{r.edad}</td><td className="text-right">{r.fraude}%</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}