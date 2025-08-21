export class GeoLocationUtils {
  static calculateDistanceMeters(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) {
    const R = 6378.137; // Radio de la Tierra en kilómetros
    const dLat = GeoLocationUtils.rad(lat2 - lat1);
    const dLon = GeoLocationUtils.rad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(GeoLocationUtils.rad(lat1)) *
        Math.cos(GeoLocationUtils.rad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const d = R * c * 1000; // Distancia en metros
    return d;
  }

  static rad(x: number) {
    return (x * Math.PI) / 180;
  }
}
