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
            Medellín y el Área Metropolitana del Valle de Aburrá, combinando
            múltiples fuentes de datos abiertos para darte una vista completa del
            clima.
          </p>

          {/* Radar */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">🌧️ Radar de lluvia</h3>
            <p>
              El mapa base muestra una capa de radar proporcionada por
              <strong> RainViewer</strong>. Esta capa se actualiza cada 10 minutos
              y muestra dónde está lloviendo en este momento. Los colores siguen
              la leyenda de intensidad (verde = ligera, rojo = intensa, morado =
              extrema). Puedes usar la barra inferior para retroceder hasta 90
              minutos o ver el pronóstico de la próxima hora.
            </p>
          </div>

          {/* Replay */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">⏱️ Replay histórico</h3>
            <p>
              Al activar el botón <strong>"⏱️ Replay histórico"</strong> se
              cargan los datos reales de precipitación de los <strong>últimos
              7 días</strong> para 8 puntos distribuidos en los barrios de
              Medellín (Centro, El Poblado, Robledo, Manrique, Belén, Buenos
              Aires, Castilla y San Javier). Los datos provienen de
              <strong> Open-Meteo</strong>.
            </p>
            <p className="mt-1.5">
              Aparecen círculos de colores sobre el mapa que reflejan la
              intensidad real registrada en cada zona. Puedes reproducir la
              animación, arrastrar la línea de tiempo, y ajustar la
              <strong> velocidad</strong> (0.5× a 8×) para explorar cómo
              evolucionó la lluvia.
            </p>
          </div>

          {/* Panel de precipitación */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">💧 Panel de precipitación</h3>
            <p>
              El botón <strong>"💧 Precipitación"</strong> abre un panel lateral
              con datos de 3 fuentes abiertas:
            </p>
            <div className="mt-2 space-y-1.5 pl-3 border-l-2 border-blue-200">
              <p>
                <strong>Open-Meteo:</strong> precipitación actual (mm/h),
                acumulado 24h y pronóstico 6h para cada barrio.
              </p>
              <p>
                <strong>datos.gov.co:</strong> lecturas de las estaciones
                automáticas del IDEAM en Antioquia vía el portal de datos
                abiertos de Colombia.
              </p>
              <p>
                <strong>IDEAM:</strong> observaciones de precipitación del
                Instituto de Hidrología, Meteorología y Estudios Ambientales.
              </p>
            </div>
            <p className="mt-1.5">
              Los indicadores de estado (verde/rojo) muestran si cada fuente
              está respondiendo correctamente.
            </p>
          </div>

          {/* Mapa */}
          <div>
            <h3 className="font-semibold text-slate-900 mb-1">🗺️ Navegación del mapa</h3>
            <p>
              El mapa está limitado al departamento de <strong>Antioquia</strong>,
              así que no puedes desplazarte fuera de la región. Puedes hacer zoom
              con la rueda del ratón o los botones +/– para explorar desde una
              vista general hasta el detalle por calles.
            </p>
          </div>

          {/* Fuentes */}
          <div className="bg-slate-50 rounded-lg px-4 py-3">
            <h3 className="font-semibold text-slate-900 mb-1">📡 Fuentes de datos</h3>
            <div className="text-xs text-slate-500 space-y-0.5">
              <p>• RainViewer — radar de precipitación global</p>
              <p>• Open-Meteo — pronóstico e historial meteorológico</p>
              <p>• datos.gov.co — portal de datos abiertos de Colombia (IDEAM)</p>
              <p>• IDEAM — Instituto de Hidrología, Meteorología y Estudios Ambientales</p>
              <p>• OpenStreetMap — mapa base</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
