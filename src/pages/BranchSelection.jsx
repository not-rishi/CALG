import DotGridBackground from "../components/background/DotGrid";
import TargetCursor from "../components/bits/TargetCursor";
import BlurText from "../components/bits/BlurText";
import { useApp } from "../context/AppContext";
import "./BranchSelection.css";

export default function BranchSelection({ onSelect }) {
  const { academicData } = useApp();

  const branches = Object.keys(academicData || {});

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
          text="Select your Branch"
          delay={200}
          animateBy="words"
          direction="top"
          className="text-2xl mb-8 title-text"
        />
        <div className="branch-list">
          {branches.map((b) => (
            <div
              key={b}
              className="cursor-target select-block"
              onClick={() => onSelect(b)}
            >
              {b}
            </div>
          ))}
        </div>
      </div>
      <DotGridBackground />
    </>
  );
}
