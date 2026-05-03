import { useApp } from "../context/AppContext";
import "./CSS/SubjectList.css"

const SubjectList = () => {
  const { selectedSubjects, setSelectedSubjects, marks, setMarks } = useApp();

  const handleMarkChange = (subjectId, assessmentId, index, value) => {
    setMarks((prev) => {
      const currentSubjectMarks = { ...(prev[subjectId] || {}) };
      const currentAssessmentMarks = [
        ...(currentSubjectMarks[assessmentId] || []),
      ];

      currentAssessmentMarks[index] = value === "" ? "" : Number(value);
      currentSubjectMarks[assessmentId] = currentAssessmentMarks;

      return { ...prev, [subjectId]: currentSubjectMarks };
    });
  };

  const removeSubject = (id) => {
    setSelectedSubjects((prev) => prev.filter((s) => s.id !== id));
    setMarks((prev) => {
      const { [id]: _, ...rest } = prev; 
      return rest;
    });
  };

  return (
    <div className="subject-list-container">
      {selectedSubjects.map((subject) => (
        <div key={subject.id} className="subject-row">
          <div className="subject-info">
            <h4 className="subject-name">{subject.name}</h4>
            <span className="subject-credits">{subject.credits} Credits</span>
          </div>

          <div className="marks-wrapper">
            {subject.assessments.map((rule) =>
              Array.from({ length: rule.count }).map((_, index) => (
                <input
                  key={`${rule.id}-${index}`}
                  type="number"
                  className="mark-input"
                  placeholder={`${rule.name.substring(0, 4)}${rule.count > 1 ? ` ${index + 1}` : ""} (/${rule.maxMarks})`}
                  value={marks[subject.id]?.[rule.id]?.[index] ?? ""}
                  onChange={(e) =>
                    handleMarkChange(subject.id, rule.id, index, e.target.value)
                  }
                />
              )),
            )}
          </div>

          <button
            className="remove-btn"
            onClick={() => removeSubject(subject.id)}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
};

export default SubjectList;
