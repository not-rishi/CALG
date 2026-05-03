import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { useState, useMemo } from "react";
import { useApp } from "../context/AppContext";
import { calculateDynamicTotal } from "../core/engine";
import { calculateGradePoint } from "../core/grading";
import "./CSS/Visualizer.css";

const THEMED_COLOR_MAP = {
  monotone: {
    see: "#3b3b3b",
    cie: "#d4d4d4",
    aat: "#9a9a9a",
    lab: "#707070",
    default: "#222222",
  },
  colorful: {
    see: "#FF6B6B", 
    cie: "#00C2FF", 
    aat: "#FFD93D", 
    lab: "#FF3CAC", 
    default: "#7CFF6B", 
  },
};

const PALETTES = {
  monotone: ["#636363", "#dddddd", "#bbbbbb", "#999999", "#777777", "#555555"],
  colorful: [
    "#FFD166", 
    "#F9844A", 
    "#FB5607", 
    "#FF006E", 
    "#F15BB5", 
    "#9B5DE5", 
    "#8338EC", 
    "#3A86FF", 
    "#118AB2", 
    "#06D6A0", 
  ],
};

const Visualizer = ({ theme = "monotone" }) => {
  const { academicData, calculatedSnapshot } = useApp();
  const [expandedId, setExpandedId] = useState(null);

  
  const { chartData, masterSGPA, totalCredits } = useMemo(() => {
    if (!calculatedSnapshot)
      return { chartData: [], masterSGPA: 0, totalCredits: 0 };

    
    const activeColors = THEMED_COLOR_MAP[theme] || THEMED_COLOR_MAP.monotone;

    const { marks, optimism, branch, semester } = calculatedSnapshot;
    const allSemesterSubjects = academicData[branch]?.[semester] || [];
    const tCredits = allSemesterSubjects.reduce(
      (acc, sub) => acc + sub.credits,
      0,
    );

    const processedData = allSemesterSubjects.map((sub) => {
      const subjectMarks = marks[sub.id] || {};
      const hasManualData = Object.keys(subjectMarks).length > 0;

      const { total, breakdown } = calculateDynamicTotal(
        subjectMarks,
        sub.assessments,
        optimism,
      );
      const grading = calculateGradePoint(total);

      const maxContribution = tCredits > 0 ? (10 * sub.credits) / tCredits : 0;
      const achievedContribution =
        tCredits > 0 ? (grading.points * sub.credits) / tCredits : 0;
      const unachievedContribution = maxContribution - achievedContribution;

      const pieData = [
        { name: "Unachieved", value: unachievedContribution, fill: "#1a1a24" },
      ];
      const gpaBreakdownDisplay = {};

      Object.entries(breakdown).forEach(([key, comp]) => {
        const gpaSlice =
          total > 0 ? (comp.score / total) * achievedContribution : 0;
        if (gpaSlice > 0) {
          const needle = ((key || comp.name) + "").toLowerCase();
          let colorKey = "default";
          if (needle.includes("cie")) colorKey = "cie";
          else if (needle.includes("see")) colorKey = "see";
          else if (needle.includes("aat")) colorKey = "aat";
          else if (needle.includes("lab")) colorKey = "lab";

          pieData.push({
            name: comp.name,
            value: gpaSlice,
            
            fill: activeColors[colorKey] || activeColors.default,
          });
          gpaBreakdownDisplay[key] = { name: comp.name, gpa: gpaSlice };
        }
      });

      return {
        ...sub,
        finalPercentage: total,
        achieved: achievedContribution,
        max: maxContribution,
        unachieved: unachievedContribution,
        isPredicted: !hasManualData,
        hasManualData,
        pieData,
        gpaBreakdownDisplay,
      };
    });

    const sortedData = processedData.sort(
      (a, b) => b.hasManualData - a.hasManualData,
    );
    const mSGPA = sortedData.reduce((acc, curr) => acc + curr.achieved, 0);

    return { chartData: sortedData, masterSGPA: mSGPA, totalCredits: tCredits };

    
  }, [calculatedSnapshot, academicData, theme]);

  if (!calculatedSnapshot) return null;

  const masterUnachieved = Math.max(0, 10.0 - masterSGPA);
  const palette = PALETTES[theme] || PALETTES.monotone;
  const masterPieData = chartData.map((sub, index) => ({
    name: sub.name,
    value: sub.achieved,
    fill: palette[index % palette.length],
    isPredicted: sub.isPredicted,
  }));

  if (masterUnachieved > 0) {
    masterPieData.push({
      name: "Unachieved GPA",
      value: masterUnachieved,
      fill: "#1a1a24",
    });
  }

  const toggleExpand = (id) =>
    setExpandedId((prev) => (prev === id ? null : id));

  return (
    <div className="visualizer">
      <div className="master-header">
        <h2 className="master-title">Overall SGPA</h2>
        <h1 className="master-gpa-value">
          {masterSGPA.toFixed(2)}{" "}
          <span className="master-gpa-max">/ 10.00</span>
        </h1>
        <p className="master-credits-info">
          Total Semester Credits: <strong>{totalCredits}</strong>
        </p>

        <div className="chart-container-large">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={masterPieData}
                innerRadius={70}
                outerRadius={100}
                dataKey="value"
                stroke="none"
              >
                {masterPieData.map((entry, index) => (
                  <Cell
                    key={`master-cell-${index}`}
                    fill={entry.fill}
                    fillOpacity={entry.name === "Unachieved GPA" ? 0 : 1}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => `${value.toFixed(2)} GPA`}
                contentStyle={{
                  backgroundColor: "#ececec",
                  color: "#000",
                  borderRadius: 6,
                  padding: 8,
                }}
                itemStyle={{ color: "#000" }}
                labelStyle={{ color: "#000" }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="subject-list-container">
        {chartData.map((sub) => {
          const isExpanded = expandedId === sub.id;

          return (
            <div
              key={sub.id}
              className={`subject-card ${sub.hasManualData ? "manual" : "predicted"}`}
            >
              <button
                onClick={() => toggleExpand(sub.id)}
                className="expand-button"
              >
                <div className="subject-main-info">
                  <span className="subject-name-text">
                    {sub.name}{" "}
                    {!sub.hasManualData && (
                      <span className="predicted-tag">(Predicted)</span>
                    )}
                  </span>
                  <span className="subject-sub-text">
                    {sub.credits} Credits | {sub.finalPercentage.toFixed(1)}%
                    Total
                  </span>
                </div>

                <div className="gpa-display">
                  <span className="gpa-achieved">
                    {sub.achieved.toFixed(2)}{" "}
                    <span className="gpa-max-label">
                      / {sub.max.toFixed(2)}
                    </span>
                  </span>
                  <span className="expand-label">
                    {isExpanded ? "CLOSE ▲" : "DETAILS ▼"}
                  </span>
                </div>
              </button>

              {isExpanded && (
                <div className="expanded-details">
                  <div className="chart-container-small">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={sub.pieData}
                          innerRadius={50}
                          outerRadius={80}
                          dataKey="value"
                          stroke="none"
                        >
                          {sub.pieData.map((entry, index) => (
                            <Cell
                              key={`cell-${index}`}
                              fill={entry.fill}
                              fillOpacity={entry.name === "Unachieved" ? 0 : 1}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          formatter={(value) => `${value.toFixed(2)} GPA`}
                          contentStyle={{
                            backgroundColor: "#ececec",
                            color: "#000",
                            borderRadius: 6,
                            padding: 8,
                          }}
                          itemStyle={{ color: "#000" }}
                          labelStyle={{ color: "#000" }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="breakdown-grid">
                    <div className="unachieved-banner">
                      <strong>Lost/Unachieved:</strong>{" "}
                      {sub.unachieved.toFixed(2)} GPA
                    </div>
                    {Object.values(sub.gpaBreakdownDisplay).map((item, i) => (
                      <div key={i} className="breakdown-item">
                        <strong>{item.name}:</strong> {item.gpa.toFixed(2)}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Visualizer;
