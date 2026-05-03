import { useMemo } from "react";
import { useApp } from "../context/AppContext";
import { calculateDynamicTotal, calculateSGPA } from "../core/engine";
import { calculateGradePoint } from "../core/grading";

const GPADisplay = () => {
  const { selectedSubjects, marks, optimism, isDirty } = useApp();

  const estimatedSGPA = useMemo(() => {
    if (!selectedSubjects.length) return 0;

    const processedSubjects = selectedSubjects.map((sub) => {
      const { total, breakdown } = calculateDynamicTotal(
        marks[sub.id],
        sub.assessments,
        optimism,
      );

      
      const seeScore = breakdown.see
        ? (breakdown.see.score / breakdown.see.max) * 100
        : 100;
      const cieWeight = breakdown.cie
        ? (breakdown.cie.score / breakdown.cie.max) * 40
        : 40;

      const grading = calculateGradePoint(total, seeScore, cieWeight);

      return {
        gradePoints: grading.points,
        credits: sub.credits,
        isFail: grading.isFail,
      };
    });

    
    const passedSubjects = processedSubjects.filter((s) => !s.isFail);
    return calculateSGPA(passedSubjects);
  }, [selectedSubjects, marks, optimism]);

  if (!isDirty || selectedSubjects.length === 0) return null;

  return (
    <div className="gpa-footer">
      <div className="gpa-card">
        <h3>Estimated SGPA</h3>
        <div className="gpa-value">{estimatedSGPA}</div>
        <p className="disclaimer">*Excludes subjects below passing threshold</p>
      </div>
    </div>
  );
};

export default GPADisplay;
