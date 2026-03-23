import { useState } from 'react';

const FORMSPREE_URL = 'https://formspree.io/f/xzzrpkqo'; // Replace with your Formspree form ID

const STAR_LABELS = ['Muy malo', 'Malo', 'Regular', 'Bueno', 'Excelente'];

export default function FeedbackModal({ open, onClose }) {
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [comment, setComment] = useState('');
  const [status, setStatus] = useState('idle'); // idle | sending | sent | error

  if (!open) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (rating === 0) return;

    setStatus('sending');
    try {
      const res = await fetch(FORMSPREE_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          rating,
          ratingLabel: STAR_LABELS[rating - 1],
          comment: comment.trim() || '(sin comentario)',
        }),
      });
      setStatus(res.ok ? 'sent' : 'error');
    } catch {
      setStatus('error');
    }
  };

  const handleClose = () => {
    setRating(0);
    setHoveredStar(0);
    setComment('');
    setStatus('idle');
    onClose();
  };

  const activeStar = hoveredStar || rating;

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/40 backdrop-blur-sm" onClick={handleClose}>
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-sm mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-400 to-orange-500 px-6 py-4">
          <h2 className="text-lg font-bold text-white">Evaluar el proyecto</h2>
          <p className="text-sm text-white/80">Tu opinión nos ayuda a mejorar</p>
        </div>

        {status === 'sent' ? (
          <div className="px-6 py-8 text-center">
            <span className="text-5xl">🎉</span>
            <p className="mt-3 text-lg font-semibold text-slate-800">¡Gracias por tu evaluación!</p>
            <p className="mt-1 text-sm text-slate-500">Tu opinión es muy valiosa.</p>
            <button
              onClick={handleClose}
              className="mt-5 px-6 py-2 bg-slate-800 text-white rounded-lg text-sm font-semibold hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="px-6 py-5 space-y-4">
            {/* Stars */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-2">Calificación</label>
              <div className="flex gap-1 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredStar(star)}
                    onMouseLeave={() => setHoveredStar(0)}
                    className="text-4xl transition-transform hover:scale-110 focus:outline-none cursor-pointer"
                    title={STAR_LABELS[star - 1]}
                  >
                    {star <= activeStar ? '⭐' : '☆'}
                  </button>
                ))}
              </div>
              {activeStar > 0 && (
                <p className="text-center text-xs text-slate-500 mt-1">{STAR_LABELS[activeStar - 1]}</p>
              )}
            </div>

            {/* Comment */}
            <div>
              <label className="block text-sm font-semibold text-slate-700 mb-1">
                Comentario <span className="font-normal text-slate-400">(opcional)</span>
              </label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="¿Qué te pareció la aplicación?"
                rows={3}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm resize-none focus:outline-none focus:ring-2 focus:ring-amber-400 focus:border-transparent"
              />
            </div>

            {/* Error */}
            {status === 'error' && (
              <p className="text-sm text-red-600 text-center">Error al enviar. Intenta de nuevo.</p>
            )}

            {/* Buttons */}
            <div className="flex gap-3 pt-1">
              <button
                type="button"
                onClick={handleClose}
                className="flex-1 px-4 py-2 text-sm font-semibold text-slate-600 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                disabled={rating === 0 || status === 'sending'}
                className="flex-1 px-4 py-2 text-sm font-semibold text-white bg-amber-500 rounded-lg hover:bg-amber-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                {status === 'sending' ? 'Enviando…' : 'Enviar'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
