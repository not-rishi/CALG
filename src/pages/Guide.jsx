import { useState, useEffect } from "react";
import DotGridBackground from "../components/background/DotGrid";
import LoadingScreen from "./LoadingScreen";
import "./GPACalculator.css";
import "./Guide.css";

import logo from "../assets/logo.png";
import logoGif from "../assets/logo.gif";
import graphimg from "../assets/graph-colour.png";
import sliderimg from "../assets/optimism-slider.png";
import runimg from "../assets/run-calculation.png"

export default function Guide() {
  const [isLoading, setIsLoading] = useState(true);
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsFadingOut(true);
      setTimeout(() => setIsLoading(false), 500);
    }, 1500);
    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="app-canvas">
        <LoadingScreen isFadingOut={isFadingOut} />
      </div>
    );
  }

  return (
    <>
      <head>
        <title>Guide</title>
      </head>
      <div className="app-canvas">
        <DotGridBackground />
        <div className="ui-content-wrapper">
          {/* Retained Navigation Bar */}
          <nav className="top-nav">
            <div className="nav-branding">
              <img src={logo} alt="logo" className="nav-logo" />
              <div className="brand-text">CALG</div>
            </div>

            <div className="nav-center">
              <div className="location">
                USER GUIDE <span className="divider">|</span> DOCUMENTATION
              </div>
            </div>

            <div className="nav-actions">
              <button
                className="nav-btn"
                onClick={() => (window.location.href = "/")}
                aria-label="Back to Calculator"
              >
                RETURN TO APP
              </button>
            </div>
          </nav>

          {/* Main Bento Layout */}
          <main className="main-area guide-main">
            <div className="bento-wrapper">
              <div className="bento-header">
                <h1 className="section-title">SYSTEM MANUAL</h1>
                <p className="bento-subtitle">
                  Navigate your calculations with optimal efficiency.
                </p>
              </div>

              <div className="bento-grid">
                {/* Bento Item 1: Large Feature */}
                <div className="panel-card bento-card bento-large">
                  <div className="bento-image-wrapper">
                    <img
                      className="bento-image"
                      src={sliderimg}
                      alt="error"
                    />
                    {/* <div className="placeholder-img retro-bg-1"></div> */}
                  </div>
                  <div className="bento-text">
                    <h3>The Optimism Engine</h3>
                    <br />
                    <p>
                      ♦ CALG is designed to work even when you don’t have
                      complete data. You can simply set your expectation level
                      using a percentage slider, and it intelligently fills in
                      any missing values based on your chosen level of optimism.
                      <br />
                      <br />
                      ♦ There’s no need to enter values in every field. Just
                      input the marks you already have, adjust the optimism
                      level, and CALG will estimate the rest to give you a
                      projected SGPA.
                      <br />
                      <br />
                      ♦ This makes it especially useful when certain
                      results—like CIE-2 or SEE are still unavailable. Instead
                      of waiting, you can still get a meaningful estimate of
                      your academic performance. <br />
                      <br />♦ It also helps you understand how your current
                      marks impact your overall GPA, giving you a clearer idea
                      of what you might expect based on the data you already
                      have.
                    </p>
                  </div>
                </div>

                {/* Bento Item 2: Standard */}
                <div className="panel-card bento-card">
                  <div className="bento-image-wrapper">
                    <img
                      className="bento-image"
                      src={runimg}
                      alt="error"
                    />
                  </div>
                  <div className="bento-text">
                    <h3>Semester Architecture</h3>
                    <p>
                      One click instant calculation, change any metrics and hit
                      the calculate button to view results.
                    </p>
                  </div>
                </div>

                {/* Bento Item 3: Standard */}
                <div className="panel-card bento-card">
                  <div className="bento-image-wrapper">
                    <img
                      className="bento-image"
                      src={graphimg}
                      alt="error"
                    />
                  </div>
                  <div className="bento-text">
                    <h3>Visualizer Themes</h3>
                    <p>
                      Toggle between the boxy monochrome terminal aesthetic or
                      inject vibrant, data-driven colorful visual states to view
                      your metrics.
                    </p>
                  </div>
                </div>

                {/* Bento Item 4: Wide List */}
                <div className="panel-card bento-card bento-wide">
                  <div className="bento-text wide-text-content">
                    <h3>Quick Tips for Accuracy</h3>
                    <ul className="retro-list">
                      <li>
                        Only enter the data you want to be considered for
                        calculation. <br />
                        <br />
                        For example you got (13/40) in CIE-1 and (36/40) in
                        CIE-2 and you are giving CIE-3. You know you will get
                        more than CIE-1 then you can just enter CIE-1 marks.
                      </li>
                      <li>
                        Optimism is generally between 70% to 90%.
                        <br />
                        <br /> You can calculate your own optimism by finding
                        how much marks you generally score. Lets say I score
                        32/40 on average then I will put 80% optimism.
                      </li>
                      <li>
                        This application is just made to help you plan ahead.
                        <br />
                        <br /> Most of us dont know how much a CIE is worth or
                        how much GPA I will lose if I score bad in some
                        AAT/Quiz. This application just helps you visualize it
                        and make stratergy to score well.
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
      </div>
    </>
  );
}
