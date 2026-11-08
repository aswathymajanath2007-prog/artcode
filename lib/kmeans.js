const TIME_SLOTS = ['10:00 AM', '12:30 PM', '3:00 PM', '5:30 PM'];

const distanceSquared = (a, b) => (a.latitude - b.latitude) ** 2 + (a.longitude - b.longitude) ** 2;

function nearestCentre(point, centres) {
  return centres.reduce((best, centre, index) => (
    distanceSquared(point, centre) < distanceSquared(point, centres[best]) ? index : best
  ), 0);
}

export function allocateEvents(events) {
  if (!events.length) return [];
  const clusterCount = Math.min(TIME_SLOTS.length, Math.max(1, Math.round(Math.sqrt(events.length / 2))));
  const ordered = [...events].sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude);
  let centres = Array.from({ length: clusterCount }, (_, index) => {
    const point = ordered[Math.floor(index * ordered.length / clusterCount)];
    return { latitude: point.latitude, longitude: point.longitude };
  });

  for (let iteration = 0; iteration < 20; iteration += 1) {
    const groups = Array.from({ length: clusterCount }, () => []);
    events.forEach((event) => groups[nearestCentre(event, centres)].push(event));
    const next = centres.map((centre, index) => {
      if (!groups[index].length) return centre;
      return {
        latitude: groups[index].reduce((sum, event) => sum + event.latitude, 0) / groups[index].length,
        longitude: groups[index].reduce((sum, event) => sum + event.longitude, 0) / groups[index].length,
      };
    });
    const unchanged = next.every((centre, index) => distanceSquared(centre, centres[index]) < 0.0000000001);
    centres = next;
    if (unchanged) break;
  }

  // Stable north-to-south ordering makes the time allocation predictable.
  const sortedCentres = [...centres].sort((a, b) => a.latitude - b.latitude || a.longitude - b.longitude);
  return events.map((event) => {
    const clusterIndex = nearestCentre(event, sortedCentres);
    const centre = sortedCentres[clusterIndex];
    return { id: event.id, clusterIndex, allottedLatitude: centre.latitude, allottedLongitude: centre.longitude, allottedTime: TIME_SLOTS[clusterIndex] };
  });
}
