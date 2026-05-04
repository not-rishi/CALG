import { useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { useNavigate } from "react-router-dom";
import DotGridBackground from "../components/background/DotGrid";
import LoadingScreen from "./LoadingScreen";
import BranchSelection from "./BranchSelection";
import SemesterSelection from "./SemesterSelection";
import SelectionDashboard from "../components/SelectionDashboard";
import BorderGlowElement from "../components/bits/BorderGlow";
import SubjectList from "../components/SubjectList";
import Visualizer from "../components/Visualizer";
import "./GPACalculator.css";

import logo from "../assets/logo.png";
import logoGif from "../assets/logo.gif";

export default function GPACalculator() {

  const navigate = useNavigate();
  
  const {
    step,
    setStep,
    branch,
    setBranch,
    semester,
    setSemester,
    isCalculated,
    triggerCalculation,
    hasPendingChanges,
    optimism,
    setOptimism,
  } = useApp();

  const [isFadingOut, setIsFadingOut] = useState(false);
  const [vizTheme, setVizTheme] = useState("monotone");

  useEffect(() => {
    if (step === 0) {
      const timer = setTimeout(() => {
        setIsFadingOut(true);
        setTimeout(() => setStep(1), 500);
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [step, setStep]);

  return (
    <>
      <div className="app-canvas">
        {step === 0 && <LoadingScreen isFadingOut={isFadingOut} />}

        {step === 1 && (
          <BranchSelection
            onSelect={(selectedBranch) => {
              setBranch(selectedBranch);
              setStep(2);
            }}
          />
        )}

        {step === 2 && (
          <SemesterSelection
            onSelect={(selectedSem) => {
              setSemester(selectedSem);
              setStep(3);
            }}
          />
        )}

        {step === 3 && (
          <>
            <DotGridBackground />
            <div className="ui-content-wrapper">
              <nav className="top-nav">
                <div className="nav-branding">
                  <img src={logo} alt="logo" className="nav-logo" />
                  <div className="brand-text">CALG</div>
                </div>

                <div className="nav-center">
                  <div className="location">
                    {branch} <span className="divider">|</span>{" "}
                    {semester?.replace(/_/g, " ")}
                  </div>
                </div>

                <div className="nav-actions">
                  <button
                    className="nav-btn"
                    onClick={() => setStep(2)}
                    aria-label="Change semester"
                  >
                    CHANGE SEMESTER
                  </button>

                  <button
                    className="nav-btn nav-btn--secondary"
                    onClick={() => navigate("/guide")}
                    aria-label="Guide"
                  >
                    GUIDE
                  </button>
                </div>
              </nav>

              <main className="main-area">
                <div className="main-calculator-grid">
                  {/* Applied panel-card to the left panel */}

                  <div className="panel-card left-panel">
                    <h2 className="section-title">SELECT SUBJECTS</h2>
                    <SelectionDashboard mode="add-subject" />
                    <hr className="separator" />
                    <SubjectList />
                  </div>

                  {/* Applied panel-card to the right panel */}
                  <div className="panel-card right-panel">
                    {isCalculated ? (
                      <Visualizer theme={vizTheme} />
                    ) : (
                      <div className="idle-state">
                        <div className="logo-shallow">
                          <img src={logoGif} alt = "logo animation"></img>
                        </div>
                        <h3>Ready to Calculate</h3>
                        <p>Enter your marks and hit the button below.</p>
                      </div>
                    )}
                  </div>
                </div>
              </main>

              <footer className="bottom-footer">
                <div className="optimism-block">
                  <div className="optimism-row">
                    <span className="label">OPTIMISM LEVEL</span>
                    <span className="value">{optimism}%</span>
                  </div>
                  <input
                    className="optimism-range"
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={optimism}
                    onChange={(e) => setOptimism(Number(e.target.value))}
                    style={{ "--opt-val": `${optimism}%` }}
                  />
                </div>

                <div className="viz-theme-control">
                  <label className="theme-toggle">
                    <input
                      type="checkbox"
                      checked={vizTheme === "colorful"}
                      onChange={(e) =>
                        setVizTheme(e.target.checked ? "colorful" : "monotone")
                      }
                    />
                    <span className="toggle-slider"></span>
                    <span className="theme-label">Colorful</span>
                  </label>
                </div>

                <BorderGlowElement className="inline">
                  <button
                    className="calculate-btn"
                    onClick={triggerCalculation}
                  >
                    {isCalculated && !hasPendingChanges
                      ? "RESULTS SYNCED ✓"
                      : "RUN CALCULATION ✦"}
                  </button>
                </BorderGlowElement>
              </footer>
            </div>
          </>
        )}
      </div>
    </>
  );
}
