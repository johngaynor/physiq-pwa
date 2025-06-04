export function convertTime(time: number) {
  const sign = time < 0 ? "-" : "";
  const absTime = Math.abs(time);
  const hours = Math.floor(absTime);
  const minutes = Math.floor((absTime - hours) * 60);

  return `${sign}${hours}h ${minutes}m`;
}
