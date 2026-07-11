import React, { useState } from 'react';
import { Terminal, ShieldAlert, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { BarChart, Bar, PieChart, Pie, Cell, XAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function App() {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);

  const questions = [
    {
      q: "INICIANDO PROTOCOLO: ¿Con qué frecuencia revisas tu estado de cuenta bancario?",
      options: ["[A] Cada mes, sistemáticamente.", "[B] Cuando la tarjeta es rechazada.", "[C] El banco me llama a mí."],
      weights: [0, 7, 15]
    },
    {
      q: "¿Cuál es tu estrategia actual para lavar ropa blanca y de color?",
      options: ["[A] Separo por color, temperatura y tela.", "[B] Todo a la lavadora en ciclo normal.", "[C] Comprar ropa nueva."],
      weights: [0, 5, 15]
    },
    {
      q: "EVALUACIÓN MÉDICA: ¿Cuándo fue tu último chequeo general preventivo?",
      options: ["[A] Hace menos de un año.", "[B] Cuando el dolor no me dejaba dormir.", "[C] Mi sistema inmunológico es de hierro (creo)."],
      weights: [0, 8, 15]
    },
    {
      q: "¿Qué hay en tu refrigerador en este momento exacto?",
      options: ["[A] Proteínas, vegetales y meal-prep.", "[B] Condimentos caducados y agua.", "[C] Una caja de pizza de hace 3 días."],
      weights: [0, 6, 15]
    },
    {
      q: "SITUACIÓN DE CRISIS: Se rompe una tubería en tu baño. Tu reacción es:",
      options: ["[A] Cierro la llave de paso principal.", "[B] Pongo una toalla y lloro.", "[C] Me mudo de apartamento."],
      weights: [0, 10, 15]
    },
    {
      q: "¿Cómo gestionas tus contraseñas digitales?",
      options: ["[A] Gestor de contraseñas encriptado.", "[B] MiNombre123! para todo.", "[C] Restablecer contraseña cada que inicio sesión."],
      weights: [0, 5, 15]
    },
    {
      q: "ÚLTIMA PRUEBA: ¿Tienes un fondo de emergencia para son de 3 a 6 meses?",
      options: ["[A] Sí, en una cuenta de alto rendimiento.", "[B] Tengo ahorros para el fin de semana.", "[C] Mi fondo de emergencia es pedirle a mi mamá."],
      weights: [0, 10, 15]
    }
  ];

  // El puntaje máximo teórico es 105, lo normalizamos a base 100
  const finalCalculatedScore = Math.min(Math.round((score / 105) * 100), 100);

  const handleAnswer = (weight) => {
    setScore((prev) => prev + weight);
    setCurrentQuestion((prev) => prev + 1);
  };

  const getRecommendation = () => {
    if (finalCalculatedScore <= 30) return { plan: 'basic', title: 'RIESGO BAJO', color: 'text-green-400' };
    if (finalCalculatedScore <= 70) return { plan: 'standard', title: 'RIESGO MODERADO', color: 'text-yellow-500' };
    return { plan: 'vip', title: 'FALLO CRÍTICO', color: 'text-red-500' };
  };

  const recommendation = getRecommendation();

  const barData = [
    { name: 'Finanzas', riesgo: finalCalculatedScore > 60 ? 88 : 45 },
    { name: 'Hogar', riesgo: finalCalculatedScore > 40 ? 75 : 30 },
    { name: 'Salud', riesgo: finalCalculatedScore > 70 ? 92 : 50 },
    { name: 'Logística', riesgo: finalCalculatedScore },
  ];

  const pieData = [
    { name: 'Tu Nivel de Fraude', value: finalCalculatedScore },
    { name: 'Madurez Operativa', value: 100 - finalCalculatedScore },
  ];
  const COLORS = [finalCalculatedScore > 70 ? '#ef4444' : '#f59e0b', '#18181b'];

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-100 font-mono selection:bg-[#00FF41] selection:text-black">
      <div className="max-w-4xl mx-auto p-4 md:p-8">
        
        {/* Header */}
        <header className="border-b border-zinc-800 pb-6 mb-8 flex items-end gap-3">
          <Terminal size={36} className="text-[#00FF41] mb-1" />
          <div>
            <h1 className="text-3xl md:text-4xl font-black tracking-tighter text-zinc-100">
              Adult<span className="text-[#00FF41]">.Log</span>
            </h1>
            <p className="text-xs text-zinc-400 uppercase tracking-wider mt-1">
              Evaluando si realmente tienes los credenciales necesarios para operar como adulto hoy.
            </p>
          </div>
        </header>

        {/* Telemetría de Barra de Fraude */}
        <div className="mb-8 bg-zinc-950 p-4 border border-zinc-800">
          <div className="flex justify-between text-xs mb-2">
            <span className="uppercase flex items-center gap-2 text-zinc-400">
              <ShieldAlert size={14} className={finalCalculatedScore > 70 ? "text-red-500 animate-pulse" : "text-[#00FF41]"} /> 
              Índice de Fraude Operativo en Tiempo Real
            </span>
            <span className={finalCalculatedScore > 70 ? "text-red-500 font-bold" : "text-[#00FF41]"}>
              {finalCalculatedScore}%
            </span>
          </div>
          <div className="w-full h-3 bg-zinc-900 border border-zinc-800 rounded-sm overflow-hidden">
            <div 
              className={`h-full transition-all duration-500 ease-out ${finalCalculatedScore > 70 ? 'bg-red-500' : finalCalculatedScore > 35 ? 'bg-yellow-500' : 'bg-[#00FF41]'}`}
              style={{ width: `${Math.max(finalCalculatedScore, 2)}%` }}
            />
          </div>
        </div>

        {/* Contenedor Principal */}
        <main>
          {currentQuestion < questions.length ? (
            /* Interfaz del Cuestionario */
            <div className="border border-zinc-800 bg-zinc-950 p-6 rounded-sm relative">
              <div className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-4">
                MÓDULO_AUDITORÍA :: PARTE {currentQuestion + 1} DE {questions.length}
              </div>
              <div className="mb-8 text-zinc-200 text-base md:text-lg border-l-2 border-[#00FF41] pl-3">
                {questions[currentQuestion].q}
              </div>
              <div className="flex flex-col gap-3">
                {questions[currentQuestion].options.map((opt, i) => (
                  <button 
                    key={i} 
                    onClick={() => handleAnswer(questions[currentQuestion].weights[i])}
                    className="text-left p-4 border border-zinc-800 bg-zinc-900/50 hover:border-[#00FF41] hover:bg-zinc-900 text-zinc-300 hover:text-white transition-all duration-150 text-sm md:text-base rounded-sm"
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>
          ) : (
            /* Interfaz de Resultados Dinámicos */
            <div className="space-y-8 animate-fade-in">
              <div className={`border p-6 text-center rounded-sm bg-zinc-950 ${finalCalculatedScore > 70 ? 'border-red-500/30' : 'border-zinc-800'}`}>
                {finalCalculatedScore > 70 ? (
                  <AlertTriangle className="mx-auto text-red-500 mb-2 animate-bounce" size={44} />
                ) : (
                  <CheckCircle2 className="mx-auto text-[#00FF41] mb-2" size={44} />
                )}
                <h2 className="text-xl font-bold mb-1 tracking-tight">DIAGNÓSTICO DEL SISTEMA: <span className={recommendation.color}>{recommendation.title}</span></h2>
                <p className="text-sm text-zinc-400">Tu nivel de simulación ha sido calculado. Se requiere suscripción para mitigar riesgos.</p>
              </div>

              {/* Pricing Cards con Selección Lógica */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Plan Básico */}
                <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${recommendation.plan === 'basic' ? 'border-[#00FF41] bg-zinc-900/30 ring-1 ring-[#00FF41]/30' : 'border-zinc-800 bg-zinc-950 opacity-40'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-200">Plan Supervivencia</h3>
                      {recommendation.plan === 'basic' && <span className="text-[10px] bg-[#00FF41] text-black px-2 py-0.5 font-bold uppercase rounded-sm">Sugerido</span>}
                    </div>
                    <p className="text-2xl font-black text-zinc-100 mb-4">$9.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
                    <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                      <li>• Alertas para tomar agua</li>
                      <li>• Receta de arroz básico asistido</li>
                    </ul>
                  </div>
                  <button className={`w-full py-2 text-xs font-bold rounded-sm border ${recommendation.plan === 'basic' ? 'bg-[#00FF41] text-black border-[#00FF41]' : 'border-zinc-700 text-zinc-400'}`}>
                    ADQUIRIR ACCESO
                  </button>
                </div>

                {/* Plan Estándar */}
                <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${recommendation.plan === 'standard' ? 'border-yellow-500 bg-zinc-900/30 ring-1 ring-yellow-500/30' : 'border-zinc-800 bg-zinc-950 opacity-40'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-200">Plan Independiente</h3>
                      {recommendation.plan === 'standard' && <span className="text-[10px] bg-yellow-500 text-black px-2 py-0.5 font-bold uppercase rounded-sm">Sugerido</span>}
                    </div>
                    <p className="text-2xl font-black text-zinc-100 mb-4">$49.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
                    <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                      <li>• Recordatorio de vencimiento de leche</li>
                      <li>• Botón de pánico para citas médicas</li>
                    </ul>
                  </div>
                  <button className={`w-full py-2 text-xs font-bold rounded-sm border ${recommendation.plan === 'standard' ? 'bg-yellow-500 text-black border-yellow-500' : 'border-zinc-700 text-zinc-400'}`}>
                    ADQUIRIR ACCESO
                  </button>
                </div>

                {/* Plan VIP */}
                <div className={`border p-5 rounded-sm flex flex-col justify-between transition-all ${recommendation.plan === 'vip' ? 'border-red-500 bg-zinc-900/30 ring-1 ring-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.1)]' : 'border-zinc-800 bg-zinc-950 opacity-40'}`}>
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-zinc-200">Plan "Padres Decepcionados"</h3>
                      {recommendation.plan === 'vip' && <span className="text-[10px] bg-red-500 text-white px-2 py-0.5 font-bold uppercase rounded-sm">Requerido</span>}
                    </div>
                    <p className="text-2xl font-black text-zinc-100 mb-4">$299.99<span className="text-xs text-zinc-500 font-normal">/mes</span></p>
                    <ul className="text-xs text-zinc-400 space-y-2 mb-6">
                      <li>• Tercerización total de burocracia</li>
                      <li>• Asistente personal para declarar impuestos</li>
                      <li>• Generador de excusas familiares creíbles</li>
                    </ul>
                  </div>
                  <button className={`w-full py-2 text-xs font-bold rounded-sm border ${recommendation.plan === 'vip' ? 'bg-red-500 text-white border-red-500' : 'border-zinc-700 text-zinc-400'}`}>
                    CONTRATAR SALVAMENTO
                  </button>
                </div>
              </div>

              {/* Módulos Gráficos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                <div className="border border-zinc-800 p-4 bg-zinc-950 rounded-sm">
                  <h4 className="text-[11px] mb-4 text-zinc-400 tracking-wider text-center uppercase">Vectores de Vulnerabilidad</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={barData}>
                        <XAxis dataKey="name" stroke="#71717a" fontSize={11} tickLine={false} />
                        <Tooltip cursor={{fill: '#18181b'}} contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', color: '#f4f4f5'}} />
                        <Bar dataKey="riesgo" fill={finalCalculatedScore > 70 ? '#ef4444' : '#f59e0b'} radius={[2, 2, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                <div className="border border-zinc-800 p-4 bg-zinc-950 rounded-sm">
                  <h4 className="text-[11px] mb-4 text-zinc-400 tracking-wider text-center uppercase">Métrica de Simulación Global</h4>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={pieData} innerRadius={50} outerRadius={65} paddingAngle={4} dataKey="value">
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', color: '#f4f4f5'}} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            </div>
          )}
        </main>
        
        <footer className="mt-12 text-center text-[10px] text-zinc-600 uppercase border-t border-zinc-900 pt-4 tracking-widest">
          SYS::ADULT_VERIFICATION_DAEMON v2.5.0 | CONTEXTO: PRODUCCIÓN SEGURA
        </footer>
      </div>
    </div>
  );
}