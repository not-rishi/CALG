export const calculateGradePoint = (
  totalMarks,
  seeScore = 100,
  cieWeight = 40,
) => {
  if (seeScore < 35 || cieWeight < 16 || totalMarks < 40) {
    return { grade: "F", points: 0, isFail: true };
  }

  const thresholds = [
    { min: 90, grade: "O", points: 10 },
    { min: 80, grade: "A+", points: 9 },
    { min: 70, grade: "A", points: 8 },
    { min: 60, grade: "B+", points: 7 },
    { min: 55, grade: "B", points: 6 },
    { min: 50, grade: "C", points: 5 },
    { min: 40, grade: "P", points: 4 },
  ];

  const result = thresholds.find((t) => totalMarks >= t.min);
  return result
    ? { ...result, isFail: false }
    : { grade: "F", points: 0, isFail: true };
};
