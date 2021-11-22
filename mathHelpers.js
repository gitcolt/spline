import {Point} from './point';

export function dist(p0, p1) {
  return Math.sqrt( ((p1.x - p0.x) ** 2) + ((p1.y - p0.y) ** 2) );
}

export function lerp(p0, p1, t) {
  return new Point( (p0.x + (p1.x - p0.x) * t ), ( p0.y + (p1.y - p0.y) * t ));
}

export function quadraticCurve(p0, p1, p2, t) {
  const pA = lerp(p0, p1, t);
  const pB = lerp(p1, p2, t);
  return lerp(pA, pB, t);
}

export function cubicCurve(p0, p1, p2, p3, t) {
  const pA = quadraticCurve(p0, p1, p2, t);
  const pB = quadraticCurve(p1, p2, p3, t);
  return lerp(pA, pB, t);
}
