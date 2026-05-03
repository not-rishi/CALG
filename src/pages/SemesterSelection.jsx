import DotGridBackground from "../components/background/DotGrid";
import TargetCursor from "../components/bits/TargetCursor";
import BlurText from "../components/bits/BlurText";
import { useApp } from "../context/AppContext";
import "./BranchSelection.css";

export default function SemesterSelection({ onSelect }) {
  const { branch, academicData } = useApp();

  const semesters =
    branch && academicData[branch] ? Object.keys(academicData[branch]) : [];

  return (
    <>
      <div className="content">
        <TargetCursor
          spinDuration={2}
          hideDefaultCursor
          parallaxOn
          hoverDuration={0.2}
        />
        <BlurText
          text="Select your Semester"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-2xl mb-8 title-text"
        />
        <div className="branch-list">
          {semesters.map((s) => (
            <div
              key={s}
              className="cursor-target select-block"
              onClick={() => onSelect(s)}
            >
              {s.replace(/_/g, " ")}
            </div>
          ))}
        </div>
      </div>
      <DotGridBackground />
    </>
  );
}
