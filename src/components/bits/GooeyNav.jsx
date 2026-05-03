import { useRef, useEffect, useState } from "react";
import "./GooeyNav.css";

const GooeyNav = ({
  items,
  activeIds = [],
  onItemClick,
  animationTime = 600,
  particleCount = 15,
  particleDistances = [90, 10],
  particleR = 100,
  timeVariance = 300,
  colors = [1, 2, 3, 1, 2, 3, 1, 4],
}) => {
  const containerRef = useRef(null);
  const navRef = useRef(null);
  const filterRef = useRef(null);
  const textRef = useRef(null);
  const [latestClickedIndex, setLatestClickedIndex] = useState(null);

  const noise = (n = 1) => n / 2 - Math.random() * n;

  const getXY = (distance, pointIndex, totalPoints) => {
    const angle =
      ((360 + noise(8)) / totalPoints) * pointIndex * (Math.PI / 180);
    return [distance * Math.cos(angle), distance * Math.sin(angle)];
  };

  const createParticle = (i, t, d, r) => {
    let rotate = noise(r / 10);
    return {
      start: getXY(d[0], particleCount - i, particleCount),
      end: getXY(d[1] + noise(7), particleCount - i, particleCount),
      time: t,
      scale: 1 + noise(0.2),
      color: colors[Math.floor(Math.random() * colors.length)],
      rotate: rotate > 0 ? (rotate + r / 20) * 10 : (rotate - r / 20) * 10,
    };
  };

  const makeParticles = (element, isSelecting) => {
    const d = particleDistances;
    const r = particleR;
    const bubbleTime = animationTime * 2 + timeVariance;
    element.style.setProperty("--time", `${bubbleTime}ms`);

    for (let i = 0; i < particleCount; i++) {
      const t = animationTime * 2 + noise(timeVariance * 2);
      const p = createParticle(i, t, d, r);
      element.classList.remove("active");

      setTimeout(() => {
        const particle = document.createElement("span");
        const point = document.createElement("span");
        particle.classList.add("particle");
        particle.style.setProperty("--start-x", `${p.start[0]}px`);
        particle.style.setProperty("--start-y", `${p.start[1]}px`);
        particle.style.setProperty("--end-x", `${p.end[0]}px`);
        particle.style.setProperty("--end-y", `${p.end[1]}px`);
        particle.style.setProperty("--time", `${p.time}ms`);
        particle.style.setProperty("--scale", `${p.scale}`);
        particle.style.setProperty("--color", `var(--color-${p.color}, white)`);
        particle.style.setProperty("--rotate", `${p.rotate}deg`);

        point.classList.add("point");
        particle.appendChild(point);
        element.appendChild(particle);

        requestAnimationFrame(() => {
          // Only maintain the active background blob if we are selecting it
          if (isSelecting) {
            element.classList.add("active");
          }
        });

        setTimeout(() => {
          try {
            element.removeChild(particle);
          } catch {
            // Do nothing
          }
        }, t);
      }, 30);
    }
  };

  const updateEffectPosition = (element) => {
    if (!containerRef.current || !filterRef.current || !textRef.current) return;
    const containerRect = containerRef.current.getBoundingClientRect();
    const pos = element.getBoundingClientRect();

    const styles = {
      left: `${pos.x - containerRect.x}px`,
      top: `${pos.y - containerRect.y}px`,
      width: `${pos.width}px`,
      height: `${pos.height}px`,
    };
    Object.assign(filterRef.current.style, styles);
    Object.assign(textRef.current.style, styles);
    textRef.current.innerText = element.innerText;
  };

  const handleClick = (e, index, item) => {
    const liEl = e.currentTarget;
    setLatestClickedIndex(index);
    const isActivating = !activeIds.includes(item.id);

    // Always update position so the effect moves to where you click
    updateEffectPosition(liEl);

    if (onItemClick) {
      onItemClick(item);
    }

    // 1. CLEAR THE PILL BACKGROUND
    if (filterRef.current) {
      filterRef.current.classList.remove("active"); // <--- This removes the stuck white pill
      const particles = filterRef.current.querySelectorAll(".particle");
      particles.forEach((p) => filterRef.current.removeChild(p));
    }

    // 2. TRIGGER THE TEXT SILHOUETTE
    if (textRef.current) {
      textRef.current.classList.remove("active");
      if (isActivating) {
        // Run as normal if selecting
        void textRef.current.offsetWidth;
        textRef.current.classList.add("active");
        textRef.current.style.opacity = "1";
      } else {
        // Erase silhouette immediately when deselecting
        textRef.current.style.opacity = "0";
        textRef.current.innerText = "";
      }
    }

    // 3. RUN ANIMATION ONLY IF ACTIVATING
    if (filterRef.current && isActivating) {
      makeParticles(filterRef.current, true);
    }
  };

  const handleKeyDown = (e, index, item) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      const liEl = e.currentTarget.parentElement;
      if (liEl) {
        handleClick({ currentTarget: liEl }, index, item);
      }
    }
  };

  useEffect(() => {
    const resizeObserver = new ResizeObserver(() => {
      if (latestClickedIndex !== null && navRef.current) {
        const currentActiveLi =
          navRef.current.querySelectorAll("li")[latestClickedIndex];
        if (currentActiveLi) {
          updateEffectPosition(currentActiveLi);
        }
      }
    });

    if (containerRef.current) {
      resizeObserver.observe(containerRef.current);
    }
    return () => resizeObserver.disconnect();
  }, [latestClickedIndex]);

  return (
    <div className="gooey-nav-container" ref={containerRef}>
      <nav>
        <ul ref={navRef} style={{ flexWrap: "wrap" }}>
          {items.map((item, index) => {
            const isActive = activeIds.includes(item.id);
            return (
              <li key={item.id} className={isActive ? "active" : ""}>
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    handleClick(e, index, item);
                  }}
                  onKeyDown={(e) => handleKeyDown(e, index, item)}
                >
                  {/* Replace native text injection with this span wrapper */}
                  <span
                    style={{
                      display: "inline-block",
                      width: "16px",
                      textAlign: "left",
                    }}
                  >
                    {isActive ? "✓" : "+"}
                  </span>
                  {item.label}
                </a>
              </li>
            );
          })}
        </ul>
      </nav>
      <span className="effect filter" ref={filterRef} />
      <span className="effect text" ref={textRef} />
    </div>
  );
};

export default GooeyNav;
