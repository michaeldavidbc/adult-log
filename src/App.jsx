import React, { useState, useEffect } from 'react';
import { Terminal, Database, Activity, Zap, ShieldCheck, CheckCircle } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid, ScatterChart, Scatter } from 'recharts';
import { supabase } from './supabase'; 

export default function App() {
  const [view, setView] = useState('LANDING'); 
  const [userData, setUserData] = useState({ nombre: '', profesion: '', edad: '' });
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [dbRecords, setDbRecords] = useState([]); 
  const [categoryScores, setCategoryScores] = useState({ Finanzas: 0, Hogar: 0, Salud: 0, Logística: 0 });

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

  const handleAnswer = async (weight, category) => {
    const newScores = { ...categoryScores, [category]: Math.min(categoryScores[category] + weight, 100) };
    setCategoryScores(newScores);
    if (currentQuestion < questions.length - 1) setCurrentQuestion(prev => prev + 1);
    else {
      const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
      const finalPct = Math.min(Math.round((totalScore / 500) * 100), 100);
      let statusStr = finalPct <= 30 ? 'OPERATIVO' : finalPct <= 60 ? 'RIESGO MODERADO' : 'COLAPSO ESTRUCTURAL';
      const newRecord = { nombre: userData.nombre, edad: parseInt(userData.edad), cargo: userData.profesion, fraude: finalPct, status: statusStr };
      await supabase.from('telemetria').insert([newRecord]);
      fetchRecords();
      setView('RESULTS_BANNER');
    }
  };

  const livePercentage = Math.min(Math.round((Object.values(categoryScores).reduce((a, b) => a + b, 0) / 500) * 100), 100);
  const getRec = () => {
    if (livePercentage <= 30) return { title: 'OPERATIVO', plan: 'basic', color: 'text-[#00FF41]', border: 'border-[#00FF41]', drama: "Has logrado engañar al sistema. Eres un adulto 'funcional', pero cuidado: la estabilidad es un espejismo que se desvanece con una factura inesperada." };
    if (livePercentage <= 60) return { title: 'RIESGO MODERADO', plan: 'standard', color: 'text-yellow-500', border: 'border-yellow-500', drama: "Tu vida es un equilibrio precario. Estás a un paso de que tu fachada de adulto responsable se desplome. Estás improvisando, y el público (tus finanzas) lo sabe." };
    return { title: 'COLAPSO ESTRUCTURAL', plan: 'vip', color: 'text-red-500', border: 'border-red-500', drama: "¡Alerta Roja! Tu nivel de fraude es tan alto que ni tú mismo te crees tu propia mentira. Ya no eres un adulto, eres un caos organizado esperando una catástrofe inminente." };
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        <header className="border-b border-zinc-800 pb-4 mb-8 flex justify-between items-center sticky top-0 bg-[#0a0a0a] z-50">
          <h1 className="text-3xl font-black text-zinc-100 animate-pulse">Adult<span className="text-[#00FF41]">.Log</span></h1>
          <p className="text-[10px] text-zinc-500 uppercase">Estado: {view} // DB Synced</p>
        </header>

        {view === 'LANDING' && (
          <div className="border border-zinc-800 p-8 text-center bg-zinc-950 animate-fade-in mt-12">
            <h2 className="text-3xl font-bold mb-6 text-[#00FF41]">El Gran Fraude: ¿Por qué no tienes idea de lo que haces?</h2>
            <div className="text-zinc-400 mb-8 max-w-2xl mx-auto text-sm leading-relaxed space-y-4">
              <p>La adultez es un contrato que firmaste sin leer la letra pequeña. Te prometieron estabilidad, éxito y una vida en orden, pero la realidad es una lucha constante contra el sistema.</p>
              <p>Tu nevera es un cementerio de intenciones, tus finanzas son un acto de fe y tu salud mental depende de un hilo de cafeína. ¿Eres un adulto real o un fraude operando bajo presión? Este test no juzga tu vida, simplemente mide qué tan cerca estás del colapso operativo total.</p>
            </div>
            <button onClick={() => setView('FORM')} className="bg-zinc-100 text-black px-8 py-3 font-bold uppercase hover:bg-[#00FF41] transition-colors">Inicializar Diagnóstico</button>
          </div>
        )}

        {view === 'FORM' && (
          <form onSubmit={(e) => { e.preventDefault(); setView('TEST'); }} className="max-w-md mx-auto border border-zinc-800 p-8 bg-zinc-950 space-y-4 mt-12">
            <input required type="text" placeholder="Nombre de Operador" onChange={(e) => setUserData({...userData, nombre: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 p-3" />
            <input required type="number" placeholder="Edad" onChange={(e) => setUserData({...userData, edad: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 p-3" />
            <input required type="text" placeholder="Profesión" onChange={(e) => setUserData({...userData, profesion: e.target.value})} className="w-full bg-zinc-900 border border-zinc-700 p-3" />
            <button type="submit" className="w-full bg-[#00FF41] text-black font-bold p-3 uppercase">Conectar</button>
          </form>
        )}

        {view === 'TEST' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8 animate-fade-in">
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <div className="mb-6">
                <div className="flex justify-between text-xs text-zinc-500 uppercase mb-1">
                  <span>Nivel de Fraude Acumulado</span>
                  <span>{livePercentage}%</span>
                </div>
                <div className="h-2 w-full bg-zinc-900 border border-zinc-800">
                  <div className="h-full bg-[#ef4444] transition-all duration-500" style={{ width: `${livePercentage}%` }} />
                </div>
              </div>
              <p className="text-[#00FF41] mb-6 text-lg">{questions[currentQuestion].q}</p>
              {questions[currentQuestion].options.map((opt, i) => (
                <button key={i} onClick={() => handleAnswer(questions[currentQuestion].weights[i], questions[currentQuestion].category)} className="w-full text-left p-4 border border-zinc-700 hover:bg-zinc-800 mb-3 text-sm transition-colors">{opt}</button>
              ))}
            </div>
            <div className="border border-zinc-800 p-6 bg-zinc-950 flex flex-col items-center justify-center">
              <span className="text-xs text-zinc-500 mb-4 uppercase">Telemetría de Riesgo</span>
              <ResponsiveContainer width="100%" height={200}><BarChart data={Object.keys(categoryScores).map(k => ({cat: k, val: categoryScores[k]}))}><XAxis dataKey="cat" stroke="#71717a" fontSize={10}/><Bar dataKey="val" fill="#ef4444"/></BarChart></ResponsiveContainer>
            </div>
          </div>
        )}

        {view === 'RESULTS_BANNER' && (
          <div className="animate-fade-in text-center mt-12 p-8 border border-zinc-800 bg-zinc-950">
            <h2 className="text-4xl font-black mb-4">DIAGNÓSTICO: <span className={getRec().color}>{getRec().title}</span></h2>
            <p className="text-xl text-zinc-300 italic mb-8 max-w-2xl mx-auto">"{getRec().drama}"</p>
            <p className="text-6xl font-black mb-8">{livePercentage}% FRAUDE</p>
            <button onClick={() => setView('SERVICES')} className="bg-[#00FF41] text-black px-12 py-4 font-bold uppercase text-lg hover:bg-white transition-all">Ver Soluciones de Rescate</button>
          </div>
        )}

        {view === 'SERVICES' && (
          <div className="space-y-12 animate-fade-in mt-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                { id: 'basic', title: 'Alquiler de Adulto', price: '$9.99/semana', desc: '¿Pánico por una llamada? Alquilamos un Adulto Responsable por 1 hora. Realiza trámites, firma documentos y finge seguridad absoluta. Garantía de no llorar en público.' },
                { id: 'standard', title: 'Soporte Logístico', price: '$49.99/semana', desc: 'Auditoría de despensa, automatización de pagos y eliminación de carga mental. Transformamos tu caos en un sistema operativo limpio.' },
                { id: 'vip', title: 'Rescate Ejecutivo', price: '$299.99/semana', desc: 'Control total: finanzas, agenda y dignidad. Si esto no te salva, nada lo hará. Incluye plan de contingencia contra el fracaso.' }
              ].map((s, i) => (
                <div key={i} className={`border p-6 flex flex-col justify-between ${getRec().plan === s.id ? 'border-[#00FF41] ring-1 ring-[#00FF41] bg-zinc-900' : 'bg-zinc-950 border-zinc-800'}`}>
                  {getRec().plan === s.id && <div className="text-[10px] bg-[#00FF41] text-black font-bold uppercase p-1 mb-4 text-center">Recomendado para ti</div>}
                  <div>
                    <h3 className="font-bold mb-2 text-lg text-[#00FF41]">{s.title}</h3>
                    <p className="text-xs text-zinc-400 mb-6 leading-relaxed italic">{s.desc}</p>
                  </div>
                  <div className="mt-auto">
                    <p className="text-2xl font-bold mb-4">{s.price}</p>
                    <a href="https://checkout.wompi.co/l/tdQ64T" target="_blank" rel="noopener noreferrer" className="w-full py-3 bg-zinc-800 border border-zinc-700 hover:bg-[#00FF41] hover:text-black uppercase font-bold text-sm text-center block">Comprar Salvamento</a>
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border border-zinc-800 p-6 bg-zinc-950">
              <h3 className="text-zinc-400 mb-6 text-sm uppercase tracking-widest">Correlación: Edad vs. Nivel de Fraude</h3>
              <div className="h-64"><ResponsiveContainer width="100%" height="100%"><ScatterChart><CartesianGrid stroke="#27272a"/><XAxis type="number" dataKey="edad" stroke="#71717a"/><YAxis type="number" dataKey="fraude" stroke="#71717a"/><Tooltip/><Scatter data={dbRecords} fill="#00FF41"/></ScatterChart></ResponsiveContainer></div>
              
              <h3 className="text-zinc-400 mb-6 text-sm uppercase tracking-widest mt-12">Base de datos de los últimos 20 encuestados</h3>
              <table className="w-full text-left text-xs text-zinc-300 border-t border-zinc-800 pt-4">
                <thead><tr className="text-zinc-500 uppercase border-b border-zinc-800"><th className="pb-2">Operador</th><th className="pb-2">Edad</th><th className="pb-2 text-right">Fraude</th></tr></thead>
                <tbody>{dbRecords.slice(0, 20).map(r => <tr key={r.id} className="border-b border-zinc-900"><td>{r.nombre}</td><td>{r.edad}</td><td className="text-right">{r.fraude}%</td></tr>)}</tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}