import { useApp } from "../context/AppContext";
import GooeyNav from "./bits/GooeyNav";

const SelectionDashboard = ({ mode }) => {
  const {
    branch,
    setBranch,
    semester,
    setSemester,
    academicData,
    selectedSubjects,
    setSelectedSubjects,
    setStep,
  } = useApp();

  const handleToggleSubject = (subject) => {
    setSelectedSubjects((prev) =>
      prev.some((s) => s.id === subject.id)
        ? prev.filter((s) => s.id !== subject.id)
        : [...prev, subject],
    );
  };

  const renderGrid = (items, onSelect) => (
    <div className="selection-layer">
      <div className="grid-options">
        {items.map((item) => (
          <button
            key={item}
            className="pixel-card-btn"
            onClick={() => onSelect(item)}
          >
            {item.replace(/_/g, " ")}
          </button>
        ))}
      </div>
    </div>
  );

  if (mode === "branch") {
    return renderGrid(Object.keys(academicData), (b) => {
      setBranch(b);
      setStep(2);
    });
  }

  if (mode === "semester") {
    return renderGrid(branch ? Object.keys(academicData[branch]) : [], (s) => {
      setSemester(s);
      setStep(3);
    });
  }

  
  const availableSubjects = academicData[branch]?.[semester] || [];
  const gooeyItems = availableSubjects.map((sub) => ({
    label: sub.name,
    id: sub.id,
    original: sub,
  }));
  const activeIds = selectedSubjects.map((s) => s.id);

  return (
    <div className="add-subject-control" style={{ position: "relative" }}>
      <GooeyNav
        items={gooeyItems}
        activeIds={activeIds}
        onItemClick={(item) => handleToggleSubject(item.original)}
        animationTime={600}
        particleCount={15}
      />
    </div>
  );
};

export default SelectionDashboard;
