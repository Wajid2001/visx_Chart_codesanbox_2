import React, { useMemo, useState } from "react";
import { Pie } from "@visx/shape";
import { Group } from "@visx/group";
import { scaleOrdinal } from "@visx/scale";
import { useTooltip } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { arc as d3Arc } from "d3-shape";
import { LegendOrdinal } from "@visx/legend";

const mockData = [
  { label: "Category A", value: 30, color: "#407abc" },
  { label: "Category B", value: 20, color: "#fad175" },
  { label: "Category C", value: 25, color: "#9bc5ef" },
  { label: "Category D", value: 15, color: "#9a3769" },
  { label: "Category E", value: 10, color: "#94c5c3" },
];

const width = 350;
const height = 350;
const radius = Math.min(width, height) / 2.5;
const innerRadius = radius * 0.6;
const cornerRadius = 6;
const padAngle = 0;

const colorScale = scaleOrdinal({
  domain: mockData.map((d) => d.label),
  range: mockData.map((d) => d.color),
});

const DonutChart = () => {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
  } = useTooltip();
  const [hoveredArc, setHoveredArc] = useState(null);
  const [hideIndex, setHideIndex] = useState([]);

  const filteredData = useMemo(() => {
    return mockData.filter((_, i) => !hideIndex.includes(i));
  }, [hideIndex]);

  return (
    <div
      style={{
        position: "relative",
        textAlign: "center",
        height: "100%",
        width: "100%",
      }}
    >
      {/* Legend */}
      <div style={{ display: "flex", justifyContent: "center" }}>
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 0 0 0">
          {(labels) => (
            <div style={{ display: "flex", width, flexWrap: "wrap" }}>
              {labels.map((label, index) => {
                if (index > mockData.length - 1) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    style={{
                      display: "flex",
                      alignItems: "center",
                      marginRight: 15,
                      cursor: "pointer",
                      userSelect: "none",
                    }}
                    onClick={() => {
                      setHideIndex((prev) =>
                        prev.includes(index)
                          ? prev.filter((idx) => idx !== index)
                          : [...prev, index]
                      );
                    }}
                    tabIndex={1}
                    onMouseOver={() => {
                      setHoveredArc(label.text);
                    }}
                    onMouseLeave={() => {
                      setHoveredArc(null);
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: colorScale(label),
                        marginRight: 5,
                      }}
                    ></div>
                    <span
                      style={{
                        fontSize: 12,
                        fontWeight: "bold",
                        textDecoration: hideIndex.includes(index)
                          ? "line-through"
                          : "none",
                      }}
                    >
                      {label?.text || ""}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </LegendOrdinal>
      </div>

      <svg width={width} height={height}>
        <Group top={height / 2} left={width / 2}>
          <Pie
            data={filteredData}
            pieValue={(d) => d.value}
            outerRadius={radius}
            innerRadius={innerRadius}
            padAngle={padAngle}
          >
            {(pie) =>
              pie.arcs.map((arc, index) => {
                const [centroidX, centroidY] = pie.path.centroid(arc);

                const isHovered = hoveredArc === arc.data.label || !hoveredArc;

                const arcGenerator = d3Arc()
                  .innerRadius(innerRadius)
                  .outerRadius(radius)
                  .cornerRadius(cornerRadius)
                  .padAngle(padAngle);

                const shadowArcGenerator = d3Arc()
                  .innerRadius(innerRadius * 1.7)
                  .outerRadius(isHovered ? radius + 10 : radius + 15)
                  .cornerRadius(cornerRadius);

                return (
                  <g
                    key={`arc-${index}`}
                    onMouseEnter={(event) => {
                      const coords = localPoint(event);
                      console.log(arc, "wajid");
                      showTooltip({
                        tooltipData: arc.data,
                        tooltipLeft: event.clientX + 10,
                        tooltipTop: event.clientY - 10,
                      });
                      setHoveredArc(arc.data.label);
                    }}
                    onMouseLeave={() => {
                      hideTooltip();
                      setHoveredArc(null);
                    }}
                    style={{
                      cursor: "pointer",
                      opacity: isHovered ? 1 : 0.5,
                      scale: hoveredArc === arc.data.label ? 1.1 : 1,
                      transition: "all 0.250s ease-in-out",
                    }}
                  >
                    <path
                      d={arcGenerator(arc)}
                      fill={colorScale(arc.data.label)}
                      stroke={"white"}
                      strokeWidth={2}
                      style={{
                        transition: "all 0.250s ease-in-out",
                      }}
                    />
                    {hoveredArc === arc.data.label && (
                      <path
                        d={shadowArcGenerator(arc)}
                        fill={colorScale(arc.data.label)}
                        opacity={0.2}
                        style={{
                          // filter: "blur(2.5px)",
                          transition: "all 0.250s ease-in-out",
                        }}
                      />
                    )}
                    <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="white"
                      fontSize={10}
                      textAnchor="middle"
                      fontWeight={
                        hoveredArc?.index === index ? "bold" : "normal"
                      }
                    >
                      {arc.data.label}
                    </text>
                  </g>
                );
              })
            }
          </Pie>
        </Group>
      </svg>

      {tooltipOpen && tooltipData && (
        <div
          style={{
            position: "absolute",
            top: tooltipTop,
            left: tooltipLeft,
            backgroundColor: "white",
            color: "#333",
            padding: "10px",
            borderRadius: "6px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            border: "1px solid #ddd",
            fontSize: "12px",
            fontWeight: "bold",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
            whiteSpace: "nowrap",
            transition: "all 0.250s ease-in-out",
          }}
        >
          <div style={{ marginBottom: "5px", textAlign: "center" }}>
            {tooltipData.label}
          </div>
          <div style={{ fontSize: "14px", fontWeight: "bold" }}>
            {tooltipData.value}
          </div>
        </div>
      )}
    </div>
  );
};

export default DonutChart;
