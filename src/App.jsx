import React, { useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, Lock } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      q: "INICIANDO PROTOCOLO: ¿Con qué frecuencia revisas tu estado de cuenta bancario?",
      options: ["[A] Cada mes, sistemáticamente.", "[B] Cuando la tarjeta es rechazada.", "[C] El banco me llama a mí."]
    },
    {
      q: "¿Cuál es tu estrategia actual para lavar ropa blanca y de color?",
      options: ["[A] Separo por color, temperatura y tela.", "[B] Todo a la lavadora en ciclo normal.", "[C] Comprar ropa nueva."]
    },
    {
      q: "EVALUACIÓN MÉDICA: ¿Cuándo fue tu último chequeo general preventivo?",
      options: ["[A] Hace menos de un año.", "[B] Cuando el dolor no me dejaba dormir.", "[C] Mi sistema inmunológico es de hierro (creo)."]
    },
    {
      q: "¿Qué hay en tu refrigerador en este momento exacto?",
      options: ["[A] Proteínas, vegetales y meal-prep.", "[B] Condimentos caducados y agua.", "[C] Una caja de pizza de hace 3 días."]
    },
    {
      q: "SITUACIÓN DE CRISIS: Se rompe una tubería en tu baño. Tu reacción es:",
      options: ["[A] Cierro la llave de paso principal.", "[B] Pongo una toalla y lloro.", "[C] Me mudo de apartamento."]
    },
    {
      q: "¿Cómo gestionas tus contraseñas digitales?",
      options: ["[A] Gestor de contraseñas encriptado.", "[B] MiNombre123! para todo.", "[C] Restablecer contraseña cada que inicio sesión."]
    },
    {
      q: "ÚLTIMA PRUEBA: ¿Tienes un fondo de emergencia para 3-6 meses?",
      options: ["[A] Sí, en una cuenta de alto rendimiento.", "[B] Tengo ahorros para el fin de semana.", "[C] Mi fondo de emergencia es pedirle a mi mamá."]
    }
  ];

  const barData = [
    { name: 'Finanzas', riesgo: 85 },
    { name: 'Hogar', riesgo: 60 },
    { name: 'Salud', riesgo: 90 },
    { name: 'Tech', riesgo: 40 },
  ];

  const pieData = [
    { name: 'Adultos Funcionales', value: 15 },
    { name: 'Simuladores (Como tú)', value: 85 },
  ];
  const COLORS = ['#003300', '#00FF41'];

  const handleAnswer = () => {
    setScore((prev) => prev + (100 / questions.length));
    setCurrentQuestion((prev) => prev + 1);
  };

  const renderQuiz = () => (
    <div className="border border-[#00FF41] bg-black p-6 relative">
      <div className="absolute top-0 left-0 bg-[#00FF41] text-black px-2 py-1 text-xs font-bold">
        MÓDULO DE EVALUACIÓN - ADULT_CHECK.EXE
      </div>
      <div className="mt-6 mb-8 text-[#00FF41] text-lg lg:text-xl">
        <span className="opacity-50">[{currentQuestion + 1}/{questions.length}] :: </span>
        {questions[currentQuestion].q}
      </div>
      <div className="flex flex-col gap-4">
        {questions[currentQuestion].options.map((opt, i) => (
          <button 
            key={i} 
            onClick={handleAnswer}
            className="text-left p-4 border border-[#00FF41] hover:bg-[#00FF41] hover:text-black transition-colors duration-200 font-mono text-sm md:text-base group"
          >
            <span className="opacity-50 group-hover:text-black">{`> `}</span>{opt}
          </button>
        ))}
      </div>
    </div>
  );

  const renderResults = () => (
    <div className="space-y-8 animate-fade-in">
      <div className="border border-red-500 bg-[#1a0000] p-6 text-center">
        <AlertTriangle className="mx-auto text-red-500 mb-2" size={48} />
        <h2 className="text-2xl text-red-500 font-bold mb-2">¡ALERTA CRÍTICA: FALLO DE ADULTEZ!</h2>
        <p className="text-red-400">Sus credenciales operativos han sido revocados. Requiere intervención inmediata.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Basic Plan */}
        <div className="border border-gray-700 p-6 opacity-50 flex flex-col justify-between hover:border-gray-500 transition-colors">
          <div>
            <h3 className="text-xl mb-2 text-gray-400">Plan Supervivencia</h3>
            <p className="text-2xl mb-4">$9.99<span className="text-sm">/mes</span></p>
            <ul className="text-sm space-y-2 mb-6">
              <li>{`>`} Recordatorios para tomar agua</li>
              <li>{`>`} 1 receta de arroz que no se quema</li>
            </ul>
          </div>
          <button className="w-full border border-gray-600 py-2">Seleccionar</button>
        </div>

        {/* VIP Plan - Highlighted */}
        <div className="border-2 border-[#00FF41] p-6 relative shadow-[0_0_15px_rgba(0,255,65,0.3)] flex flex-col justify-between transform md:-translate-y-2">
          <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#00FF41] text-black px-3 font-bold text-sm">
            ACCIÓN REQUERIDA
          </div>
          <div>
            <h3 className="text-xl mb-2 text-[#00FF41] font-bold">Plan "Padres Decepcionados"</h3>
            <p className="text-3xl mb-4 text-[#00FF41]">$299.99<span className="text-sm">/mes</span></p>
            <ul className="text-sm space-y-2 mb-6">
              <li>{`>`} Asesor financiero 24/7</li>
              <li>{`>`} Outsourcing de llamadas médicas</li>
              <li>{`>`} Coartadas para el SAT/IRS</li>
            </ul>
          </div>
          <button className="w-full bg-[#00FF41] text-black font-bold py-3 hover:bg-green-400">ACTIVAR PROTOCOLO VIP</button>
        </div>

        {/* Standard Plan */}
        <div className="border border-gray-700 p-6 opacity-50 flex flex-col justify-between hover:border-gray-500 transition-colors">
          <div>
            <h3 className="text-xl mb-2 text-gray-400">Plan Independiente</h3>
            <p className="text-2xl mb-4">$49.99<span className="text-sm">/mes</span></p>
            <ul className="text-sm space-y-2 mb-6">
              <li>{`>`} Tutoriales de planchado</li>
              <li>{`>`} Alertas de vencimiento de leche</li>
            </ul>
          </div>
          <button className="w-full border border-gray-600 py-2">Seleccionar</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border border-gray-800 p-6">
        <div>
          <h4 className="text-sm mb-4 text-center text-gray-400">VECTORES DE RIESGO OPERATIVO</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#00FF41" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip cursor={{fill: '#002200'}} contentStyle={{backgroundColor: '#000', border: '1px solid #00FF41', color: '#00FF41'}} />
                <Bar dataKey="riesgo" fill="#00FF41" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
        <div>
          <h4 className="text-sm mb-4 text-center text-gray-400">TELEMETRÍA GLOBAL DE USUARIOS</h4>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={pieData} innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value">
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{backgroundColor: '#000', border: '1px solid #00FF41', color: '#00FF41'}} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-[#00FF41] font-mono selection:bg-[#00FF41] selection:text-black">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="border-b border-[#00FF41] pb-4 mb-8 flex items-end gap-3">
          <Terminal size={40} className="mb-1" />
          <div>
            <h1 className="text-4xl md:text-5xl font-black tracking-tighter">Adult.Log<span className="animate-pulse">_</span></h1>
            <p className="text-xs md:text-sm opacity-80 uppercase tracking-widest mt-1">Evaluando si realmente tienes los credenciales necesarios para operar como adulto hoy.</p>
          </div>
        </header>

        {/* Barra de progreso */}
        <div className="mb-8">
          <div className="flex justify-between text-xs mb-2">
            <span className="uppercase flex items-center gap-2"><ShieldAlert size={14}/> Nivel de Fraude Operativo Actual</span>
            <span>{Math.min(Math.round(score), 100)}%</span>
          </div>
          <div className="w-full h-4 bg-[#0a0a0a] border border-[#00FF41] relative overflow-hidden">
            <div 
              className="h-full bg-[#00FF41] transition-all duration-500 ease-out flex items-center justify-end px-1"
              style={{ width: `${Math.min(score, 100)}%` }}
            >
              <div className="w-full h-[1px] bg-black opacity-20"></div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <main>
          {currentQuestion < questions.length ? renderQuiz() : renderResults()}
        </main>
        
        <footer className="mt-12 text-center text-[10px] opacity-40 uppercase border-t border-gray-900 pt-4">
          <p>SYS::ADULT_VERIFICATION_DAEMON v2.4.1 | CLASIFICACIÓN: CONFIDENCIAL</p>
        </footer>
      </div>
    </div>
  );
}