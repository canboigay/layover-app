import axios from 'axios';

const AVIATIONSTACK_API_KEY = process.env.AVIATIONSTACK_API_KEY || '';
const AVIATIONSTACK_BASE_URL = 'http://api.aviationstack.com/v1';

/**
 * Look up a flight by flight number and get arrival/departure times
 * @param {string} flightNumber - Flight number (e.g., "AA1234", "UA567")
 * @returns {Promise<Object>} Flight data with arrival/departure times
 */
export const lookupFlight = async (flightNumber) => {
  if (!AVIATIONSTACK_API_KEY) {
    throw new Error('AviationStack API key not configured');
  }

  try {
    // Clean up flight number (remove spaces, convert to uppercase)
    const cleanFlightNumber = flightNumber.trim().toUpperCase();

    const response = await axios.get(`${AVIATIONSTACK_BASE_URL}/flights`, {
      params: {
        access_key: AVIATIONSTACK_API_KEY,
        flight_iata: cleanFlightNumber,
        limit: 1
      },
      timeout: 5000 // 5 second timeout
    });

    if (!response.data || !response.data.data || response.data.data.length === 0) {
      return null;
    }

    const flight = response.data.data[0];

    return {
      flightNumber: cleanFlightNumber,
      airline: flight.airline?.name || 'Unknown',
      airlineIata: flight.airline?.iata || '',
      departure: {
        airport: flight.departure?.airport || 'Unknown',
        iata: flight.departure?.iata || '',
        timezone: flight.departure?.timezone || 'UTC',
        scheduled: flight.departure?.scheduled || null,
        estimated: flight.departure?.estimated || null,
        actual: flight.departure?.actual || null,
      },
      arrival: {
        airport: flight.arrival?.airport || 'Unknown',
        iata: flight.arrival?.iata || '',
        timezone: flight.arrival?.timezone || 'UTC',
        scheduled: flight.arrival?.scheduled || null,
        estimated: flight.arrival?.estimated || null,
        actual: flight.arrival?.actual || null,
      },
      status: flight.flight_status || 'unknown'
    };
  } catch (error) {
    console.error('Error looking up flight:', error.message);
    throw new Error('Failed to lookup flight information');
  }
};

/**
 * Calculate layover duration between two flights
 * @param {string} arrivalFlight - Arriving flight number
 * @param {string} departureFlight - Departing flight number
 * @returns {Promise<Object>} Layover duration and details
 */
export const calculateLayoverDuration = async (arrivalFlight, departureFlight) => {
  try {
    const [arrival, departure] = await Promise.all([
      lookupFlight(arrivalFlight),
      lookupFlight(departureFlight)
    ]);

    if (!arrival || !departure) {
      return {
        success: false,
        error: 'One or both flights not found'
      };
    }

    // Use actual > estimated > scheduled time (in that priority)
    const arrivalTime = new Date(
      arrival.arrival.actual || arrival.arrival.estimated || arrival.arrival.scheduled
    );
    
    const departureTime = new Date(
      departure.departure.actual || departure.departure.estimated || departure.departure.scheduled
    );

    if (isNaN(arrivalTime.getTime()) || isNaN(departureTime.getTime())) {
      return {
        success: false,
        error: 'Invalid flight times'
      };
    }

    // Calculate layover duration in minutes
    const layoverMinutes = Math.floor((departureTime - arrivalTime) / (1000 * 60));

    if (layoverMinutes <= 0) {
      return {
        success: false,
        error: 'Departure is before arrival'
      };
    }

    // Session should expire 30 minutes before departure
    const sessionDuration = Math.max(30, layoverMinutes - 30);

    return {
      success: true,
      arrival: {
        flight: arrival.flightNumber,
        airport: arrival.arrival.airport,
        time: arrivalTime.toISOString(),
        timezone: arrival.arrival.timezone
      },
      departure: {
        flight: departure.flightNumber,
        airport: departure.departure.airport,
        time: departureTime.toISOString(),
        timezone: departure.departure.timezone
      },
      layoverMinutes,
      sessionDuration,
      expiresAt: new Date(departureTime.getTime() - 30 * 60 * 1000).toISOString()
    };
  } catch (error) {
    console.error('Error calculating layover:', error.message);
    return {
      success: false,
      error: error.message || 'Failed to calculate layover'
    };
  }
};
