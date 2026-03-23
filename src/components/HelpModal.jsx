export default function HelpModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-[90vw] max-w-lg max-h-[80vh] overflow-y-auto mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <h2 className="text-lg font-bold text-slate-900">¿Cómo funciona?</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center text-lg transition-colors"
          >
            ✕
          </button>
        </div>

        {/* Content */}
        <div className="px-5 py-4 space-y-5 text-sm text-slate-700 leading-relaxed">

          {/* Intro */}
          <p>
            Esta aplicación monitorea la <strong>precipitación en tiempo real</strong> sobre
            Medellín y Antioquia, combinando radar meteorológico y datos de
            modelos numéricos para darte una vista clara de lo que está lloviendo
            ahora y lo que ha llovido en los últimos días.
          </p>

          {/* Radar */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">🌧️ Radar de lluvia</h3>
            <p>
              El mapa muestra una capa de radar proporcionada por{' '}
              <strong>RainViewer</strong>, que se actualiza cada 10 minutos con
              imágenes reales de precipitación. Los colores siguen la leyenda de
              intensidad (verde = ligera, rojo = intensa, morado = extrema).
              Puedes retroceder hasta <strong>90 minutos</strong> o ver el
              pronóstico de la próxima hora usando la barra de tiempo.
            </p>
          </div>

          {/* Círculos */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">⭕ Círculos de precipitación</h3>
            <p>
              En la vista por defecto, los círculos sobre el mapa reflejan la
              precipitación actual estimada por <strong>Open-Meteo</strong> en{' '}
              <strong>59 puntos</strong> distribuidos por todo el departamento de
              Antioquia — desde el Valle de Aburrá hasta el Bajo Cauca y el
              Magdalena Medio. El tamaño y color del círculo indica la intensidad
              en mm/h.
            </p>
          </div>

          {/* Replay */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">⏱️ Replay histórico</h3>
            <p>
              Al activar <strong>"⏱️ Replay histórico"</strong> se cargan los
              datos horarios de precipitación de los <strong>últimos 7 días</strong>{' '}
              para los mismos 59 puntos, obtenidos de <strong>Open-Meteo</strong>.
              Puedes reproducir la animación, arrastrar la línea de tiempo y
              ajustar la <strong>velocidad</strong> (0.5× a 8×) para ver cómo
              evolucionaron las lluvias hora a hora.
            </p>
          </div>

          {/* Mapa */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">🗺️ Navegación</h3>
            <p>
              El mapa cubre el departamento de <strong>Antioquia</strong>. Usa
              la rueda del ratón o los botones +/– para hacer zoom. El encabezado
              muestra la hora del frame de radar actual y si estás viendo datos
              pasados o un pronóstico (<em>nowcast</em>).
            </p>
          </div>

          {/* Fuentes */}
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <h3 className="font-semibold text-slate-900 mb-1">📡 Fuentes de datos</h3>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>• <strong>RainViewer</strong> — radar de precipitación global en tiempo real</p>
              <p>• <strong>Open-Meteo</strong> — modelo meteorológico abierto, precipitación actual e histórica</p>
              <p>• <strong>OpenStreetMap</strong> — mapa base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
