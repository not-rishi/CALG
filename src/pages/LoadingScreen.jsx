import DotGridBackground from "../components/background/DotGrid";
import "./LoadingScreen.css";
import logo from "../assets/logo.png";
import logoGif from "../assets/logo.gif";

export default function LoadingScreen({ isFadingOut }) {
  const shades = [
    "#FFFFFF",
    "#D4D4D4",
    "#A9A9A9",
    "#7F7F7F",
    "#545454",
    "#2A2A2A",
  ];

  return (
    <div className={`loading-wrapper ${isFadingOut ? "fade-out" : "fade-in"}`}>
      <div className="branding">
        <img src={logo} alt="Loading..." />
        <h3>GPA Calculator</h3>
      </div>

      <div className="loader">
        <div className="boxy-loader">
          {shades.map((color, index) => (
            <div
              key={index}
              className="static-square"
              style={{
                backgroundColor: color,
                animationDelay: `${index * 0.15}s`,
              }}
            ></div>
          ))}
        </div>
        <p className="loading-text">Loading Assets</p>
      </div>

      <DotGridBackground />
    </div>
  );
}
