import { useState, useEffect } from "react";

// Función para obtener el próximo lunes desde hoy
const getNextMonday = () => {
  const today = new Date();
  const nextMonday = new Date(today);
  const day = today.getDay();
  const diff = day === 0 ? 1 : 8 - day;
  nextMonday.setDate(today.getDate() + diff);
  nextMonday.setHours(0, 0, 0, 0);
  return nextMonday;
};

const startDate = new Date();

const generateWeek = (baseDate, offset = 0) => {
  const start = new Date(baseDate);
  start.setDate(start.getDate() + offset * 7);
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(start);
    d.setDate(d.getDate() + i);
    return d;
  });
};

// Planes semanales
const planSemanas = {
  0: {
    Lunes: "Caminata suave 20 min + movilidad articular general",
    Martes: "Ejercicios de movilidad + respiración diafragmática",
    Miércoles: "Caminata 25 min ritmo cómodo + estiramientos básicos",
    Jueves: "Reposo activo (estiramiento suave o paseo corto de 10 min)",
    Viernes: "Caminata 30 min + movilidad de hombros y columna",
    Sábado: "Circuito suave en casa (sentadillas al aire, elevaciones, movilidad)",
    Domingo: "Descanso completo",
  },
  1: {
    Lunes: "Caminata 30 min a ritmo constante + movilidad articular",
    Martes: "Respiración consciente + movilidad + 10 min marcha en el lugar",
    Miércoles: "Caminata 35 min + ejercicios de estiramiento posterior",
    Jueves: "Descanso o paseo breve 10 min",
    Viernes: "Caminata 30 min + 3 bloques de 1 min de trote muy suave intercalado",
    Sábado: "Circuito: 3 rondas de 30” sentadillas, 30” brazos, 30” abdominales",
    Domingo: "Descanso total o caminata opcional 15 min muy suave",
  },
};

export default function Home() {
  const [weekOffset, setWeekOffset] = useState(0);
  const [activities, setActivities] = useState({});

  const currentWeek = generateWeek(startDate, weekOffset);

  useEffect(() => {
    const baseMonday = getNextMonday();
    const monday = new Date(baseMonday);
    monday.setDate(baseMonday.getDate() + weekOffset * 7);

    // Determina cuál semana estamos viendo (0 = Semana 1, 1 = Semana 2, etc.)
    const weekIndex = Math.floor((monday - baseMonday) / (7 * 24 * 60 * 60 * 1000));

    if (planSemanas[weekIndex]) {
      const updated = {};
      currentWeek.forEach((d) => {
        const dateStr = d.toISOString().split("T")[0];
        const nombreDia = d.toLocaleDateString("es-ES", { weekday: "long" });
        const diaClave = nombreDia.charAt(0).toUpperCase() + nombreDia.slice(1);
        updated[dateStr] = planSemanas[weekIndex][diaClave] || "";
      });
      setActivities(updated);
    }
  }, [weekOffset]);

  const handleChange = (date, value) => {
    setActivities((prev) => ({ ...prev, [date]: value }));
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "sans-serif" }}>
      <h1 style={{ fontSize: "1.5rem", fontWeight: "bold" }}>Calendario de Entrenamiento 10K</h1>
      <div style={{ display: "flex", justifyContent: "space-between", margin: "1rem 0" }}>
        <button onClick={() => setWeekOffset(weekOffset - 1)}>Semana anterior</button>
        <button onClick={() => setWeekOffset(weekOffset + 1)}>Semana siguiente</button>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "1rem" }}>
        {currentWeek.map((date) => {
          const dateStr = date.toISOString().split("T")[0];
          return (
            <div key={dateStr} style={{ border: "1px solid #ccc", borderRadius: "10px", padding: "1rem", background: "#fff" }}>
              <h2 style={{ fontWeight: "bold", textAlign: "center" }}>
                {date.toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "short" })}
              </h2>
              <textarea
                style={{ width: "100%", marginTop: "0.5rem", padding: "0.5rem", borderRadius: "5px" }}