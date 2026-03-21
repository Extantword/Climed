import { useMemo } from 'react';
import { Polyline, Tooltip } from 'react-leaflet';
import { scoreToColor, scoreToLabel, scoreToSpeed } from '../../hooks/useTrafficReplay';

export default function CongestionLayer({ corridorScores }) {
  const lines = useMemo(() => corridorScores(), [corridorScores]);

  return lines.map(({ id, name, positions, weight, score }) => (
    <Polyline
      key={id}
      positions={positions}
      pathOptions={{
        color: scoreToColor(score),
        weight: weight ?? 5,
        opacity: 0.85,
        lineCap: 'round',
        lineJoin: 'round',
      }}
    >
      <Tooltip sticky>
        <div className="text-sm">
          <p className="font-bold">{name}</p>
          <p style={{ color: scoreToColor(score) }}>{scoreToLabel(score)}</p>
          <p className="text-slate-500">~{scoreToSpeed(score)} km/h</p>
        </div>
      </Tooltip>
    </Polyline>
  ));
}
