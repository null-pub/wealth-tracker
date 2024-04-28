export function makeMatrix(columns: number, rows: number) {
  const matrix = [];
  for (let i = 0; i < columns; i++) {
    const column = [];
    for (let j = 0; j < rows; j++) {
      column.push(0);
    }
    matrix.push(column);
  }
  return matrix;
}
