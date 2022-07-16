export function point_overlap(
  a: number,
  b: number,
  x: number,
  y: number,
  r: number
) {
  const dist_points = distanceBetweenPoints(a, b, x, y);
  r *= r;
  if (dist_points < r) {
    return true;
  }
  return false;
}

export function distanceBetweenPoints(
  a: number,
  b: number,
  x: number,
  y: number
) {
  return (a - x) * (a - x) + (b - y) * (b - y);
}
