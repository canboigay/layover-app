export const airlines = [
  { code: 'AA', name: 'American Airlines', color: '#0078D2' },
  { code: 'DL', name: 'Delta Air Lines', color: '#C8102E' },
  { code: 'UA', name: 'United Airlines', color: '#0033A0' },
  { code: 'WN', name: 'Southwest Airlines', color: '#FF6B2C' },
  { code: 'AS', name: 'Alaska Airlines', color: '#01426A' },
  { code: 'B6', name: 'JetBlue Airways', color: '#0F4C8F' },
  { code: 'NK', name: 'Spirit Airlines', color: '#FFD100' },
  { code: 'F9', name: 'Frontier Airlines', color: '#00A651' },
  { code: 'G4', name: 'Allegiant Air', color: '#0080C9' },
  { code: 'SY', name: 'Sun Country Airlines', color: '#FFB500' },
  { code: 'AC', name: 'Air Canada', color: '#D9291C' },
  { code: 'BA', name: 'British Airways', color: '#075AAA' },
  { code: 'LH', name: 'Lufthansa', color: '#05164D' },
  { code: 'AF', name: 'Air France', color: '#002157' },
  { code: 'EK', name: 'Emirates', color: '#D71921' },
  { code: 'QR', name: 'Qatar Airways', color: '#5C0931' },
  { code: 'SQ', name: 'Singapore Airlines', color: '#00205B' },
  { code: 'CX', name: 'Cathay Pacific', color: '#00846A' },
  { code: 'QF', name: 'Qantas', color: '#E0001B' },
  { code: 'NZ', name: 'Air New Zealand', color: '#00B2E3' },
  { code: 'OTHER', name: 'Other', color: '#64748B' }
];

export const getAirlineByCode = (code) => {
  return airlines.find(a => a.code === code);
};

export const getAirlineByName = (name) => {
  return airlines.find(a => a.name.toLowerCase() === name.toLowerCase()) || 
         airlines.find(a => a.code === 'OTHER');
};
