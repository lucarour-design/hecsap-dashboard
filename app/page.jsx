'use client';

import React, { useState, useMemo } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ScatterChart, Scatter } from 'recharts';
import { AlertTriangle, TrendingUp, Users, Target, Activity } from 'lucide-react';

const HECSAPDashboard = () => {
const [activeRegional, setActiveRegional] = useState(null);

// Datos completos de Marzo 2026
const regionalData = [
{ regional: 'BOGOTÁ', ciudad: 'BOGOTA', H: 1477, E: 2372, hecsapE: 916, hecsapH: 464, totalEgresos: 3752, hecHpct: 34.1, hecTotPct: 36.8 },
{ regional: 'CENTRO ORIENTE', ciudad: 'YOPAL', H: 1001, E: 1417, hecsapE: 706, hecsapH: 327, totalEgresos: 2450, hecHpct: 44.0, hecTotPct: 42.2 },
{ regional: 'BUCARAMANGA', ciudad: 'VELEZ', H: 630, E: 940, hecsapE: 497, hecsapH: 219, totalEgresos: 1656, hecHpct: 41.4, hecTotPct: 43.2 },
{ regional: 'CALI', ciudad: 'TULUA', H: 578, E: 947, hecsapE: 400, hecsapH: 237, totalEgresos: 1584, hecHpct: 39.1, hecTotPct: 40.2 },
{ regional: 'BARRANQUILLA', ciudad: 'VALLEDUPAR', H: 515, E: 892, hecsapE: 353, hecsapH: 210, totalEgresos: 1455, hecHpct: 35.8, hecTotPct: 38.7 },
{ regional: 'MEDELLÍN', ciudad: 'RIONEGRO', H: 301, E: 502, hecsapE: 239, hecsapH: 115, totalEgresos: 856, hecHpct: 36.4, hecTotPct: 41.4 },
];

// Ciudades con alertas críticas (>50%)
const citiesWithAlerts = [
{ ciudad: 'ZIPAQUIRÁ', pct: 60.0, regional: 'BOGOTÁ' },
{ ciudad: 'GARZÓN', pct: 67.8, regional: 'CENTRO ORIENTE' },
{ ciudad: 'PAMPLONA', pct: 72.4, regional: 'BUCARAMANGA' },
];

// KPIs Nacionales
const totalCenso = 11991;
const totalEvitables = 4805;
const pctHecsapNacional = 40.1;
const metaNacional = 5.0;

// Ordenar regionales por % HECSAP descendente
const sortedRegionales = useMemo(() => {
return [...regionalData].sort((a, b) => b.hecTotPct - a.hecTotPct);
}, []);

// Datos para gráfico de barras
const barChartData = sortedRegionales.map(d => ({
name: d.regional,
valor: d.hecTotPct,
meta: metaNacional
}));

// Datos para gráfico de composición H vs E
const compositionData = sortedRegionales.map(d => ({
name: d.regional,
casos_H: d.hecsapH,
casos_E: d.hecsapE,
totalHECSAP: d.hecsapH + d.hecsapE
}));

// Scatter plot: % vs Volumen
const scatterData = sortedRegionales.map(d => ({
name: d.regional,
x: d.hecsapH + d.hecsapE,
y: d.hecTotPct
}));

const KPICard = ({ icon: Icon, label, value, unit, color, trend }) => (
<div className="bg-white rounded-xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
<div className="flex items-start justify-between">
<div>
<p className="text-gray-600 text-sm font-medium mb-2">{label}</p>
<div className="flex items-baseline gap-2">
<span className="text-3xl font-bold text-gray-900">{value.toLocaleString()}</span>
<span className="text-gray-500 text-sm">{unit}</span>
</div>
{trend && <p className={`text-xs mt-2 font-semibold ${trend > 0 ? 'text-red-600' : 'text-green-600'}`}>
{trend > 0 ? '↑' : '↓'} {Math.abs(trend)}% vs meta
</p>}
</div>
<div className={`p-3 rounded-lg ${color}`}>
<Icon size={24} className="text-white" />
</div>
</div>
</div>
);

const AlertBadge = ({ ciudad, pct, regional }) => (
<div className="flex items-center gap-3 bg-red-50 border border-red-200 rounded-lg p-4 hover:bg-red-100 transition-colors">
<AlertTriangle size={20} className="text-red-600 flex-shrink-0" />
<div>
<p className="font-bold text-red-900 text-sm">{ciudad}</p>
<p className="text-xs text-red-700">{regional} • {pct}% HECSAP</p>
</div>
</div>
);

return (
<div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6">
{/* Header */}
<div className="mb-10">
<div className="flex items-center gap-3 mb-3">
<div className="w-2 h-8 bg-gradient-to-b from-blue-800 to-cyan-500 rounded"></div>
<h1 className="text-4xl font-bold text-gray-900 tracking-tight">HECSAP Dashboard</h1>
</div>
<p className="text-gray-600 text-sm mt-2">Hospitalizaciones Evitables por Condiciones Sensibles a Atención Primaria • Marzo 2026</p>
<div className="mt-3 bg-blue-50 border-l-4 border-blue-800 p-4 rounded-r text-sm text-gray-700">
<p><strong>Propósito:</strong> Medir la capacidad resolutiva de la atención primaria. Estos casos representan ingresos hospitalarios potencialmente prevenibles con gestión adecuada en primer nivel.</p>
</div>
</div>

{/* KPI Row */}
<div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
<KPICard
icon={Users}
label="Censo Total"
value={totalCenso}
unit="pacientes"
color="bg-blue-800"
/>
<KPICard
icon={Activity}
label="Casos Evitables (HECSAP)"
value={totalEvitables}
unit="casos"
color="bg-red-600"
/>
<KPICard
icon={TrendingUp}
label="% HECSAP Nacional"
value={pctHecsapNacional.toFixed(1)}
unit="%"
color="bg-orange-600"
trend={pctHecsapNacional - metaNacional}
/>
<KPICard
icon={Target}
label="Meta Nacional"
value={metaNacional}
unit="%"
color="bg-green-600"
/>
</div>

{/* Main Grid */}
<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
{/* Gráfico de Barras - % HECSAP por Regional */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<h2 className="text-lg font-bold text-gray-900 mb-2">% HECSAP por Regional</h2>
<p className="text-xs text-gray-500 mb-4">Ordenado de mayor a menor desempeño (% de casos evitables)</p>
<ResponsiveContainer width="100%" height={300}>
<BarChart data={barChartData}>
<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
<XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
<YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
<Tooltip
contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
formatter={(value) => `${value.toFixed(1)}%`}
/>
<Bar dataKey="valor" fill="#004b8d" radius={[8, 8, 0, 0]} />
<Bar dataKey="meta" fill="#d1d5db" radius={[8, 8, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>

{/* Composición H vs E */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<h2 className="text-lg font-bold text-gray-900 mb-2">Casos HECSAP: H vs E por Regional</h2>
<p className="text-xs text-gray-500 mb-4">H = Activos en gestión concurrente | E = Casos cerrados</p>
<ResponsiveContainer width="100%" height={300}>
<BarChart data={compositionData}>
<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
<XAxis dataKey="name" angle={-45} textAnchor="end" height={80} tick={{ fontSize: 12 }} />
<YAxis stroke="#9ca3af" tick={{ fontSize: 11 }} />
<Tooltip contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }} />
<Legend />
<Bar dataKey="casos_H" fill="#004b8d" name="Pacientes Activos (H)" radius={[8, 8, 0, 0]} />
<Bar dataKey="casos_E" fill="#76bc21" name="Casos Cerrados (E)" radius={[8, 8, 0, 0]} />
</BarChart>
</ResponsiveContainer>
</div>
</div>

{/* Scatter Plot */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
<h2 className="text-lg font-bold text-gray-900 mb-2">Análisis: Volumen vs % HECSAP</h2>
<p className="text-xs text-gray-500 mb-4">Relación entre casos evitables (volumen) y tasa HECSAP (calidad de atención primaria)</p>
<ResponsiveContainer width="100%" height={350}>
<ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
<CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
<XAxis type="number" dataKey="x" label={{ value: 'Total Casos HECSAP', offset: 10 }} stroke="#9ca3af" />
<YAxis type="number" dataKey="y" label={{ value: '% HECSAP', angle: -90, position: 'insideLeft' }} stroke="#9ca3af" />
<Tooltip
contentStyle={{ backgroundColor: '#1f2937', border: 'none', borderRadius: '8px', color: '#fff' }}
formatter={(value, name) => name === 'x' ? `${value} casos` : `${value.toFixed(1)}%`}
labelFormatter={(value) => ''}
/>
<Scatter name="Regionales" data={scatterData} fill="#004b8d" />
</ScatterChart>
</ResponsiveContainer>
</div>

{/* Alertas Críticas */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-8">
<div className="flex items-center gap-2 mb-4">
<AlertTriangle size={20} className="text-red-600" />
<h2 className="text-lg font-bold text-gray-900">Alertas Críticas</h2>
<span className="ml-auto text-xs bg-red-100 text-red-800 px-3 py-1 rounded-full font-semibold">3 ciudades con HECSAP > 50%</span>
</div>
<div className="grid grid-cols-1 md:grid-cols-3 gap-4">
{citiesWithAlerts.map((alert, idx) => (
<AlertBadge key={idx} {...alert} />
))}
</div>
<div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
<p className="text-sm text-blue-900">
<strong>⚠️ Interpretación:</strong> Ciudades con % HECSAP > 50% indican que más de la mitad de sus egresos hospitalarios corresponden a condiciones que deberían haberse resuelto en atención primaria. Requieren intervención inmediata en programas de prevención y control de enfermedades crónicas.
</p>
</div>
</div>

{/* Tabla Regional Detallada */}
<div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
<h2 className="text-lg font-bold text-gray-900 mb-4">Detalle Regional</h2>
<div className="overflow-x-auto">
<table className="w-full text-sm">
<thead>
<tr className="border-b border-gray-200">
<th className="text-left py-3 px-4 font-bold text-gray-900">Regional</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">H (Activos)</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">E (Cerrados)</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">HECSAP H</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">HECSAP E</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">Total HECSAP</th>
<th className="text-center py-3 px-4 font-bold text-gray-900">% HECSAP</th>
</tr>
</thead>
<tbody>
{sortedRegionales.map((row, idx) => (
<tr key={idx} className="border-b border-gray-100 hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setActiveRegional(activeRegional === idx ? null : idx)}>
<td className="py-3 px-4 font-semibold text-gray-900">{row.regional}</td>
<td className="text-center py-3 px-4 text-gray-700">{row.H.toLocaleString()}</td>
<td className="text-center py-3 px-4 text-gray-700">{row.E.toLocaleString()}</td>
<td className="text-center py-3 px-4 text-blue-800 font-semibold">{row.hecsapH.toLocaleString()}</td>
<td className="text-center py-3 px-4 text-green-700 font-semibold">{row.hecsapE.toLocaleString()}</td>
<td className="text-center py-3 px-4 font-bold text-gray-900">{(row.hecsapH + row.hecsapE).toLocaleString()}</td>
<td className="text-center py-3 px-4">
<span className={`inline-block font-bold rounded px-3 py-1 ${row.hecTotPct > metaNacional + 10 ? 'bg-red-100 text-red-800' : row.hecTotPct > metaNacional ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
{row.hecTotPct.toFixed(1)}%
</span>
</td>
</tr>
))}
</tbody>
</table>
</div>
</div>

{/* Footer */}
<div className="mt-10 border-t border-gray-200 pt-6 text-center text-xs text-gray-500">
<p>Dashboard HECSAP • EPS Sanitas • Datos Marzo 2026 • Información Confidencial</p>
</div>
</div>
);
};

export default HECSAPDashboard;
