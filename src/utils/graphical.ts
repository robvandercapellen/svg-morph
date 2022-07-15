export function check_a_point(
  a: number,
  b: number,
  x: number,
  y: number,
  r: number
) {
  const dist_points = (a - x) * (a - x) + (b - y) * (b - y);
  r *= r;
  if (dist_points < r) {
    return true;
  }
  return false;
}
