export const sortUpcomingEvents = (a, b) => {
  if (a.datetime < b.datetime) return -1;
  if (a.datetime > b.datetime) return 1;
  return a.location.localeCompare(b.location);
};
