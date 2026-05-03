export const calculateDynamicTotal = (
  subjectMarks = {},
  assessments = [],
  optimism = 100,
) => {
  let total = 0;
  let breakdown = {};
  const optFactor = optimism / 100;

  assessments.forEach(
    ({ id, name, weightage, maxMarks, count, combineMethod }) => {
      if (!weightage || !maxMarks) return;

      let marks = subjectMarks[id];
      if (marks === undefined) marks = Array(count).fill(maxMarks * optFactor);
      else if (!Array.isArray(marks)) marks = [marks];

      const validMarks = marks.map(Number).filter((n) => !isNaN(n));
      const sum = validMarks.reduce((a, b) => a + b, 0);

      const maxPossible =
        combineMethod === "average" ? maxMarks : maxMarks * count;
      const combinedScore =
        combineMethod === "average" && validMarks.length > 0
          ? sum / validMarks.length
          : sum;

      const cappedScore = Math.min(combinedScore, maxPossible);
      const componentScore =
        maxPossible > 0 ? (cappedScore / maxPossible) * weightage : 0;

      total += componentScore;
      breakdown[id] = { name, score: componentScore, max: weightage };
    },
  );

  return { total, breakdown };
};

export const calculateSGPA = (subjects = []) => {
  const { totalPoints, totalCredits } = subjects.reduce(
    (acc, { gradePoints = 0, credits = 0 }) => {
      acc.totalPoints += Number(gradePoints) * Number(credits);
      acc.totalCredits += Number(credits);
      return acc;
    },
    { totalPoints: 0, totalCredits: 0 },
  );

  return totalCredits === 0
    ? 0
    : Number((totalPoints / totalCredits).toFixed(2));
};
