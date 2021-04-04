export interface TextElement {
  text: string;
  boundingBox: {x: number, y: number, width: number; height: number};
  results?: string[];
}

export function isUnder(ref: TextElement, elm: TextElement) {
  return isOverlappingX(ref, elm) && yMax(ref) <= yMin(elm);
}

export function isRightOf(ref: TextElement, elm: TextElement) {
  return isOverlappingY(ref, elm) && xMax(ref) <= xMin(elm);
}

export function sortByY(a: TextElement, b: TextElement) {
  return a.boundingBox.y - b.boundingBox.y;
}

export function sortByX(a: TextElement, b: TextElement) {
  return a.boundingBox.x - b.boundingBox.x;
}

export function xMin(elm: TextElement) {
  return elm.boundingBox.x;
}

export function xMax(elm: TextElement) {
  return elm.boundingBox.x + elm.boundingBox.width;
}

export function isOverlappingX(elm1: TextElement, elm2: TextElement) {
  return xMax(elm1) >= xMin(elm2) && xMax(elm2) >= xMin(elm1);
}

export function yMin(elm: TextElement) {
  return elm.boundingBox.y;
}

export function yMax(elm: TextElement) {
  return elm.boundingBox.y + elm.boundingBox.height;
}

export function isOverlappingY(elm1: TextElement, elm2: TextElement) {
  return yMax(elm1) >= yMin(elm2) && yMax(elm2) >= yMin(elm1);
}
