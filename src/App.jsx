import React, { useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, CheckCircle2, Database, Activity, User, Briefcase, Hash } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, CartesianGrid } from 'recharts';

export default function App() {
  // --- ESTADO DE LA APLICACIÓN ---
  const [view, setView] = useState('LANDING'); 
  
  // --- DATOS DEL USUARIO (Ahora incluye Edad) ---
  const [userData, setUserData] = useState({ nombre: '', cargo: '', edad: '' });
  
  // --- LÓGICA DEL CUESTIONARIO ---
  const [currentQuestion, setCurrentQuestion] = useState(0);
  
  const [categoryScores, setCategoryScores] = useState({
    Finanzas: 0,
    Hogar: 0,
    Salud: 0,
    Logística: 0
  });

  // --- BASE DE DATOS SIMULADA (Histórico) ---
  // Inicializamos con algunos registros para que la tabla no esté vacía.
  const [dbRecords, setDbRecords] = useState([
    { id: 'SYS-892', nombre: 'Carlos M.', edad: 34, cargo: 'Backend Dev', fraude: 82, status: 'COLAPSO ESTRUCTURAL' },
    { id: 'SYS-893', nombre: 'Laura G.', edad: 29, cargo: 'Project Manager', fraude: 45, status: 'RIESGO MODERADO' },
    { id: 'SYS-894', nombre: 'Andrés F.', edad: 41, cargo: 'Director Médico', fraude: 90, status: 'COLAPSO ESTRUCTURAL' },
    { id: 'SYS-895', nombre: 'Sofía T.', edad: 25, cargo: 'Marketing', fraude: 20, status: 'OPERATIVO' },
    { id: 'SYS-896', nombre: 'Diego R.', edad: 31, cargo: 'Stage Manager', fraude: 68, status: 'COLAPSO ESTRUCTURAL' },
  ]);

  const GLOBAL_DB_AVERAGE = {
    Finanzas: 55,
    Hogar: 42,
    Salud: 68,
    Logística: 35
  };

  const questions = [
    {
      category: "Finanzas",
      q: "¿Con qué frecuencia revisas tu estado de cuenta bancario y flujo de caja?",
      options: ["[A] Sistemáticamente, con proyecciones.", "[B] Solo cuando la tarjeta es rechazada.", "[C] El contador me persigue para cuadrar esto."],
      weights: [0, 50, 100] 
    },
    {
      category: "Hogar",
      q: "Estrategia actual para el manejo de inventario de lavandería (ropa blanca/color):",
      options: ["[A] Separación estricta por temperatura y tela.", "[B] Todo a la máquina en ciclo normal, que sobreviva el más fuerte.", "[C] Comprar ropa nueva en descuento."],
      weights: [0, 50, 100]
    },
    {
      category: "Salud",
      q: "Protocolo de mantenimiento preventivo (Chequeo médico):",
      options: ["[A] Agendado y ejecutado anualmente.", "[B] Solo asisto cuando el dolor detiene mis operaciones.", "[C] Mi sistema inmunológico se gestiona solo."],
      weights: [0, 60, 100]
    },
    {
      category: "Logística",
      q: "Estado actual de la cadena de suministro en tu refrigerador:",
      options: ["[A] Proteínas, vegetales y meal-prep organizado.", "[B] Condimentos caducados y líquidos dudosos.", "[C] Cajas de delivery apiladas de hace días."],
      weights: [0, 50, 100]
    },
    {
      category: "Finanzas",
      q: "Gestión de riesgos: ¿Cuál es el estado de tu fondo de emergencia?",
      options: ["[A] Líquido, cubriendo 3-6 meses de operaciones.", "[B] Tengo saldo para sobrevivir este fin de semana.", "[C] Mi fondo de emergencia se llama 'Familia/Amigos'."],
      weights: [0, 70, 100]
    }
  ];

  // --- FUNCIONES DE CONTROL ---
  const handleInputChange = (e) => {
    setUserData({ ...userData, [e.target.name]: e.target.value });
  };

  const startTest = (e) => {
    e.preventDefault();
    if (userData.nombre.trim() !== '' && userData.edad.trim() !== '') {
      setView('TEST');
    }
  };

  const handleAnswer = (weight, category) => {
    const newScores = { ...categoryScores, [category]: Math.min(categoryScores[category] + weight, 100) };
    setCategoryScores(newScores);

    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    } else {
      // Calcular puntaje final para guardar en la Base de Datos
      const totalScore = Object.values(newScores).reduce((a, b) => a + b, 0);
      const finalPct = Math.min(Math.round((totalScore / 500) * 100), 100);
      
      let statusStr = 'COLAPSO ESTRUCTURAL';
      if (finalPct <= 30) statusStr = 'OPERATIVO';
      else if (finalPct <= 60) statusStr = 'RIESGO MODERADO';

      // Crear el nuevo registro
      const newRecord = {
        id: `SYS-${Math.floor(1000 + Math.random() * 9000)}`,
        nombre: userData.nombre,
        edad: userData.edad,
        cargo: userData.cargo || 'No especificado',
        fraude: finalPct,
        status: statusStr
      };

      // Guardar en la DB simulada (añadiéndolo al principio de la lista)
      setDbRecords(prev => [newRecord, ...prev]);
      
      setView('RESULTS');
    }
  };

  // Preparar datos para la gráfica en vivo
  const liveChartData = Object.keys(categoryScores).map(key => ({
    categoria: key,
    "Tu Nivel de Fraude": categoryScores[key],
    "Promedio Global (n=100)": GLOBAL_DB_AVERAGE[key]
  }));

  // Puntuación global actual
  const totalScore = Object.values(categoryScores).reduce((a, b) => a + b, 0);
  const finalPercentage = Math.min(Math.round((totalScore / 500) * 100), 100);

  const getRecommendation = () => {
    if (finalPercentage <= 30) return { plan: 'basic', title: 'OPERATIVO', color: 'text-[#00FF41]', border: 'border-[#00FF41]' };
    if (finalPercentage <= 60) return { plan: 'standard', title: 'RIESGO MODERADO', color: 'text-yellow-500', border: 'border-yellow-500' };
    return { plan: 'vip', title: 'COLAPSO ESTRUCTURAL', color: 'text-red-500', border: 'border-red-500' };
  };

  // --- RENDERIZADO DE VISTAS ---

  const renderLanding = () => (
    <div className="animate-fade-in max-w-2xl mx-auto mt-12 space-y-8">
      <div className="border border-zinc-800 bg-zinc-950 p-8 rounded-sm text-center">
        <Activity className="mx-auto text-zinc-400 mb-6" size={48} />
        <h2 className="text-2xl md:text-3xl font-bold mb-4 text-zinc-100">
          Diagnóstico de Simulación de Adultez
        </h2>
        <p className="text-zinc-400 text-sm md:text-base leading-relaxed mb-6">
          Estadísticamente, el 85% de nuestra generación está simplemente improvisando. Has dominado el arte de parecer que tienes todo bajo control en público, pero la telemetría no miente. Las mentes más dinámicas suelen presentar fallas críticas cuando se trata de gestionar la infraestructura básica de su propia existencia.
        </p>
        <p className="text-zinc-500 text-xs uppercase tracking-widest mb-8 border-l-2 border-zinc-700 pl-4 text-left">
          Adult.Log cruzará tus respuestas con una base de datos global para calcular, en tiempo real, tu nivel exacto de fraude operativo.
        </p>
        <button onClick={() => setView('FORM')} className="bg-zinc-100 text-black px-8 py-3 text-sm font-bold uppercase hover:bg-[#00FF41] transition-colors w-full md:w-auto">
          Inicializar Diagnóstico
        </button>
      </div>
    </div>
  );

  const renderForm = () => (
    <div className="animate-fade-in max-w-md mx-auto mt-12">
      <form onSubmit={startTest} className="border border-zinc-800 bg-zinc-950 p-8 rounded-sm">
        <div className="flex items-center gap-2 mb-8 text-zinc-400 border-b border-zinc-800 pb-4">
          <Database size={18} />
          <h2 className="text-sm uppercase tracking-widest">Registro en Base de Datos</h2>
        </div>
        
        <div className="space-y-5">
          <div>
            <label className="flex items-center gap-2 text-xs text-zinc-500 uppercase mb-2"><User size={14}/> ID de Operador (Nombre)</label>
            <input 
              required
              type="text" 
              name="nombre"
              value={userData.nombre}
              onChange={handleInputChange}
              className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] text-zinc-100 p-3 outline-none text-sm font-mono transition-all"
              placeholder="Ej: Michael David"
            />
          </div>
          
          <div className="grid grid-cols-3 gap-4">
            <div className="col-span-1">
              <label className="flex items-center gap-2 text-xs text-zinc-500 uppercase mb-2"><Hash size={14}/> Edad</label>
              <input 
                required
                type="number" 
                name="edad"
                min="18"
                max="99"
                value={userData.edad}
                onChange={handleInputChange}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] text-zinc-100 p-3 outline-none text-sm font-mono transition-all text-center"
                placeholder="25"
              />
            </div>
            <div className="col-span-2">
              <label className="flex items-center gap-2 text-xs text-zinc-500 uppercase mb-2"><Briefcase size={14}/> Cargo / Rol</label>
              <input 
                required
                type="text" 
                name="cargo"
                value={userData.cargo}
                onChange={handleInputChange}
                className="w-full bg-zinc-900 border border-zinc-700 focus:border-[#00FF41] focus:ring-1 focus:ring-[#00FF41] text-zinc-100 p-3 outline-none text-sm font-mono transition-all"
                placeholder="Ej: Data Analytics"
              />
            </div>
          </div>

          <button type="submit" className="w-full bg-zinc-800 text-zinc-100 border border-zinc-600 px-4 py-3 text-sm font-bold uppercase hover:bg-zinc-100 hover:text-black transition-colors mt-6">
            Conectar y Evaluar
          </button>
        </div>
      </form>
    </div>
  );

  const renderTest = () => (
    <div className="animate-fade-in grid grid-cols-1 lg:grid-cols-2 gap-6 mt-8">
      {/* Columna Izquierda: Cuestionario */}
      <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-sm flex flex-col justify-between">
        <div>
          <div className="flex justify-between items-center mb-6 border-b border-zinc-800 pb-4">
            <span className="text-xs text-[#00FF41] font-bold uppercase tracking-widest">
              Analizando a: {userData.nombre} [Edad: {userData.edad}]
            </span>
            <span className="text-xs text-zinc-500">
              Q {currentQuestion + 1} / {questions.length}
            </span>
          </div>
          
          <div className="text-xs text-zinc-500 uppercase tracking-widest mb-2 flex items-center gap-2">
            <Activity size={14} /> Vector: {questions[currentQuestion].category}
          </div>
          <h3 className="text-zinc-200 text-lg mb-8 min-h-[5rem]">
            {questions[currentQuestion].q}
          </h3>
        </div>

        <div className="flex flex-col gap-3">
          {questions[currentQuestion].options.map((opt, i) => (
            <button 
              key={i} 
              onClick={() => handleAnswer(questions[currentQuestion].weights[i], questions[currentQuestion].category)}
              className="text-left p-4 border border-zinc-800 bg-zinc-900/50 hover:border-zinc-400 hover:bg-zinc-800 text-zinc-300 transition-all duration-150 text-sm rounded-sm"
            >
              {opt}
            </button>
          ))}
        </div>
      </div>

      {/* Columna Derecha: Gráfica en Vivo */}
      <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-sm flex flex-col">
        <h4 className="text-xs text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
          <Database size={14} /> Telemetría en Tiempo Real vs Población
        </h4>
        <div className="flex-grow h-64 md:h-auto min-h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={liveChartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
              <XAxis dataKey="categoria" stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} />
              <YAxis stroke="#71717a" fontSize={11} tickLine={false} axisLine={false} domain={[0, 100]} />
              <Tooltip cursor={{fill: '#18181b'}} contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', color: '#f4f4f5'}} />
              <Legend wrapperStyle={{ fontSize: '11px', color: '#71717a', marginTop: '10px' }} />
              
              <Bar dataKey="Promedio Global (n=100)" fill="#27272a" radius={[2, 2, 0, 0]} />
              <Bar dataKey="Tu Nivel de Fraude" fill="#ef4444" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
        <p className="text-[10px] text-zinc-600 mt-4 text-center">
          *Las barras rojas se actualizan con cada respuesta, simulando tu desviación respecto al usuario promedio.
        </p>
      </div>
    </div>
  );

  const renderResults = () => {
    const rec = getRecommendation();
    return (
      <div className="space-y-8 animate-fade-in mt-8">
        {/* Diagnóstico Final */}
        <div className={`border p-6 text-center rounded-sm bg-zinc-950 ${rec.border}`}>
          {finalPercentage > 60 ? (
            <AlertTriangle className="mx-auto text-red-500 mb-2 animate-bounce" size={44} />
          ) : (
            <CheckCircle2 className={`mx-auto ${rec.color} mb-2`} size={44} />
          )}
          <h2 className="text-xl font-bold mb-1 tracking-tight text-zinc-100">
            AUDITORÍA FINALIZADA PARA: <span className="uppercase">{userData.nombre}</span>
          </h2>
          <h3 className="text-sm mb-4 text-zinc-400">
            Edad: {userData.edad} | Cargo: <span className="text-zinc-300">{userData.cargo}</span>
          </h3>
          <p className={`text-2xl font-black ${rec.color}`}>DIAGNÓSTICO: {rec.title} ({finalPercentage}% Fraude)</p>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${rec.plan === 'basic' ? 'border-[#00FF41] bg-zinc-900/30' : 'border-zinc-800 bg-zinc-950 opacity-50'}`}>
            <div>
              <h3 className="font-bold text-zinc-200 mb-2">Mantenimiento Básico</h3>
              <p className="text-2xl font-black text-zinc-100 mb-4">$9.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
              <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                <li>• Recordatorios de hidratación</li>
                <li>• Gestión de agenda simple</li>
              </ul>
            </div>
            <button className={`w-full py-2 text-xs font-bold rounded-sm border ${rec.plan === 'basic' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-zinc-700 text-zinc-400'}`}>
              SELECCIONAR
            </button>
          </div>

          <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${rec.plan === 'standard' ? 'border-yellow-500 bg-zinc-900/30' : 'border-zinc-800 bg-zinc-950 opacity-50'}`}>
            <div>
              <h3 className="font-bold text-zinc-200 mb-2">Soporte Logístico</h3>
              <p className="text-2xl font-black text-zinc-100 mb-4">$49.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
              <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                <li>• Alertas de caducidad en nevera</li>
                <li>• Automatización de pagos recurrentes</li>
              </ul>
            </div>
            <button className={`w-full py-2 text-xs font-bold rounded-sm border ${rec.plan === 'standard' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-zinc-700 text-zinc-400'}`}>
              SELECCIONAR
            </button>
          </div>

          <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${rec.plan === 'vip' ? 'border-red-500 bg-zinc-900/30 ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800 bg-zinc-950 opacity-50'}`}>
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-zinc-200">Outsourcing Total</h3>
                {rec.plan === 'vip' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 font-bold uppercase rounded-sm">Requerido</span>}
              </div>
              <p className="text-2xl font-black text-zinc-100 mb-4">$299.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
              <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                <li>• Delegación completa de burocracia</li>
                <li>• Conciliación contable personal</li>
                <li>• Asistente para crisis domésticas</li>
              </ul>
            </div>
            <button className={`w-full py-2 text-xs font-bold rounded-sm border ${rec.plan === 'vip' ? 'bg-red-500 text-white border-red-500' : 'border-zinc-700 text-zinc-400'}`}>
              CONTRATAR SALVAMENTO
            </button>
          </div>
        </div>

        {/* Tabla de Base de Datos */}
        <div className="mt-16 border border-zinc-800 bg-zinc-950 p-4 md:p-6 rounded-sm overflow-hidden">
          <h3 className="text-sm text-zinc-400 uppercase tracking-widest mb-6 flex items-center gap-2 border-b border-zinc-800 pb-4">
            <Database size={16} /> Registro de Telemetría (Últimos 50 Operadores)
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs whitespace-nowrap">
              <thead className="text-zinc-500 border-b border-zinc-800">
                <tr>
                  <th className="pb-3 font-normal px-2">ID_SYS</th>
                  <th className="pb-3 font-normal px-2">OPERADOR</th>
                  <th className="pb-3 font-normal px-2">EDAD</th>
                  <th className="pb-3 font-normal px-2">CARGO</th>
                  <th className="pb-3 font-normal text-right px-2">NIVEL FRAUDE</th>
                  <th className="pb-3 font-normal text-right px-2">ESTADO DE OPERACIÓN</th>
                </tr>
              </thead>
              <tbody className="text-zinc-300">
                {dbRecords.slice(0, 50).map((record, idx) => (
                  <tr key={idx} className="border-b border-zinc-900 hover:bg-zinc-900/50 transition-colors">
                    <td className="py-3 px-2 text-zinc-500 font-mono">{record.id}</td>
                    <td className="py-3 px-2 uppercase">{record.nombre}</td>
                    <td className="py-3 px-2">{record.edad}</td>
                    <td className="py-3 px-2 uppercase text-zinc-400">{record.cargo}</td>
                    <td className="py-3 px-2 text-right font-bold font-mono">{record.fraude}%</td>
                    <td className={`py-3 px-2 text-right font-bold ${record.status === 'OPERATIVO' ? 'text-[#00FF41]' : record.status === 'RIESGO MODERADO' ? 'text-yellow-500' : 'text-red-500'}`}>
                      {record.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono selection:bg-[#00FF41] selection:text-black">
      <div className="max-w-5xl mx-auto p-4 md:p-8">
        
        {/* Cabecera Global */}
        <header className="border-b border-zinc-800 pb-4 mb-4 flex items-end justify-between">
          <div className="flex items-end gap-3">
            <Terminal size={32} className="text-[#00FF41] mb-1" />
            <div>
              <h1 className="text-2xl md:text-3xl font-black tracking-tighter text-zinc-100">
                Adult<span className="text-[#00FF41]">.Log</span>
              </h1>
            </div>
          </div>
          <div className="text-right hidden md:block">
            <p className="text-[10px] text-zinc-500 uppercase">Estado del Servidor: <span className="text-[#00FF41]">Online</span></p>
            <p className="text-[10px] text-zinc-500 uppercase">Conexión DB: <span className="text-[#00FF41]">Estable (Syncing...)</span></p>
          </div>
        </header>

        {/* Renderizado Condicional */}
        {view === 'LANDING' && renderLanding()}
        {view === 'FORM' && renderForm()}
        {view === 'TEST' && renderTest()}
        {view === 'RESULTS' && renderResults()}
        
        {/* Footer */}
        <footer className="mt-16 text-center text-[10px] text-zinc-600 uppercase border-t border-zinc-900 pt-6 tracking-widest">
          SYS::ADULT_VERIFICATION_DAEMON v3.1 | MÓDULO DE RECOLECCIÓN DE DATOS ACTIVO
        </footer>
      </div>
    </div>
  );
}