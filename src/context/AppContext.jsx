import { createContext, useState, useContext, useMemo } from "react";
import { getFullAcademicStructure } from "../data/registry";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [step, setStep] = useState(0);
  const [branch, setBranch] = useState("");
  const [semester, setSemester] = useState("");
  const [selectedSubjects, setSelectedSubjects] = useState([]);
  const [marks, setMarks] = useState({});
  const [optimism, setOptimism] = useState(100);
  const [isMinimal, setIsMinimal] = useState(false);

  const [isCalculated, setIsCalculated] = useState(false);
  const [calculatedSnapshot, setCalculatedSnapshot] = useState(null);

  const academicData = useMemo(() => getFullAcademicStructure(), []);

  const hasPendingChanges = useMemo(() => {
    if (!isCalculated || !calculatedSnapshot) return true;

    const marksChanged =
      JSON.stringify(marks) !== JSON.stringify(calculatedSnapshot.marks);
    const optimismChanged = optimism !== calculatedSnapshot.optimism;
    const subjectsChanged =
      JSON.stringify(selectedSubjects.map((s) => s.id)) !==
      JSON.stringify(calculatedSnapshot.subjectIds);

    return marksChanged || optimismChanged || subjectsChanged;
  }, [isCalculated, calculatedSnapshot, marks, optimism, selectedSubjects]);

  const triggerCalculation = () => {
    setCalculatedSnapshot({
      marks: JSON.parse(JSON.stringify(marks)),
      optimism,
      branch,
      semester,

      subjectIds: selectedSubjects.map((s) => s.id),
    });
    setIsCalculated(true);
  };

  return (
    <AppContext.Provider
      value={{
        step,
        setStep,
        branch,
        setBranch,
        semester,
        setSemester,
        selectedSubjects,
        setSelectedSubjects,
        marks,
        setMarks,
        optimism,
        setOptimism,
        isMinimal,
        setIsMinimal,
        academicData,
        isCalculated,
        setIsCalculated,
        calculatedSnapshot,
        triggerCalculation,
        hasPendingChanges,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => useContext(AppContext);
