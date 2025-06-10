import Map from '../utils/map';

// Map a report object to include a readable place name using reverse geocoding
export async function reportMapper(report) {
  if (!report || !report.location) return report;

  let placeName = '';
  try {
    if (
      typeof report.location.latitude === 'number' &&
      typeof report.location.longitude === 'number'
    ) {
      placeName = await Map.getPlaceNameByCoordinate(
        report.location.latitude,
        report.location.longitude
      );
    }
  } catch (error) {
    console.warn('Gagal mendapatkan nama lokasi:', error);
    placeName = 'Lokasi tidak diketahui';
  }

  return {
    ...report,
    location: {
      ...report.location,
      placeName: placeName || 'Lokasi tidak diketahui',
    },
  };
}

// Map an array of reports (improvisasi)
export async function reportsMapper(reports) {
  if (!Array.isArray(reports)) return [];
  return Promise.all(reports.map(reportMapper));
}
