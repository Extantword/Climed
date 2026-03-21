export const MEDELLIN_CENTER = [6.2518, -75.5636];
export const MEDELLIN_ZOOM = 12;

export const TILE_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
export const TILE_ATTRIBUTION = '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
export const TILE_MAX_ZOOM = 19;

// Antioquia department bounding box (SW corner, NE corner)
export const ANTIOQUIA_BOUNDS = [
  [5.42, -77.13], // Southwest
  [8.88, -73.87], // Northeast
];

export const COMUNAS = [
  { numero: 1, nombre: 'Popular' },
  { numero: 2, nombre: 'Santa Cruz' },
  { numero: 3, nombre: 'Manrique' },
  { numero: 4, nombre: 'Aranjuez' },
  { numero: 5, nombre: 'Castilla' },
  { numero: 6, nombre: 'Doce de Octubre' },
  { numero: 7, nombre: 'Robledo' },
  { numero: 8, nombre: 'Villa Hermosa' },
  { numero: 9, nombre: 'Buenos Aires' },
  { numero: 10, nombre: 'La Candelaria' },
  { numero: 11, nombre: 'Laureles-Estadio' },
  { numero: 12, nombre: 'La América' },
  { numero: 13, nombre: 'San Javier' },
  { numero: 14, nombre: 'El Poblado' },
  { numero: 15, nombre: 'Guayabal' },
  { numero: 16, nombre: 'Belén' },
  { numero: 50, nombre: 'San Sebastián de Palmitas' },
  { numero: 60, nombre: 'San Cristóbal' },
  { numero: 70, nombre: 'Altavista' },
  { numero: 80, nombre: 'San Antonio de Prado' },
  { numero: 90, nombre: 'Santa Elena' },
];

export const RISK_COLORS = {
  verde: '#10B981',
  amarillo: '#F59E0B',
  naranja: '#F97316',
  rojo: '#EF4444',
};

export const RISK_LABELS = {
  verde: 'Bajo',
  amarillo: 'Moderado',
  naranja: 'Alto',
  rojo: 'Crítico',
};

export const AQI_SCALE = [
  { min: 0, max: 50, label: 'Buena', color: '#10B981', advice: 'Calidad del aire satisfactoria.' },
  { min: 51, max: 100, label: 'Moderada', color: '#F59E0B', advice: 'Aceptable. Personas sensibles podrían experimentar molestias.' },
  { min: 101, max: 150, label: 'Dañina para grupos sensibles', color: '#F97316', advice: 'Evite ejercicio prolongado al aire libre.' },
  { min: 151, max: 200, label: 'Dañina', color: '#EF4444', advice: 'Evite ejercicio al aire libre. Use tapabocas.' },
  { min: 201, max: 300, label: 'Muy dañina', color: '#7C3AED', advice: 'Permanezca en interiores. Alerta sanitaria.' },
  { min: 301, max: 500, label: 'Peligrosa', color: '#991B1B', advice: 'Emergencia sanitaria. No salga de casa.' },
];

export const WEATHER_CODES = {
  0: { label: 'Despejado', icon: '☀️' },
  1: { label: 'Mayormente despejado', icon: '🌤️' },
  2: { label: 'Parcialmente nublado', icon: '⛅' },
  3: { label: 'Nublado', icon: '☁️' },
  45: { label: 'Niebla', icon: '🌫️' },
  48: { label: 'Niebla con escarcha', icon: '🌫️' },
  51: { label: 'Llovizna ligera', icon: '🌦️' },
  53: { label: 'Llovizna moderada', icon: '🌦️' },
  55: { label: 'Llovizna densa', icon: '🌧️' },
  61: { label: 'Lluvia ligera', icon: '🌧️' },
  63: { label: 'Lluvia moderada', icon: '🌧️' },
  65: { label: 'Lluvia fuerte', icon: '🌧️' },
  80: { label: 'Chubascos ligeros', icon: '🌦️' },
  81: { label: 'Chubascos moderados', icon: '🌧️' },
  82: { label: 'Chubascos fuertes', icon: '⛈️' },
  95: { label: 'Tormenta eléctrica', icon: '⛈️' },
  96: { label: 'Tormenta con granizo', icon: '⛈️' },
  99: { label: 'Tormenta severa', icon: '⛈️' },
};

export const RIVER_THRESHOLDS = {
  normal: 50,
  precaucion: 150,
  alerta: 300,
};
