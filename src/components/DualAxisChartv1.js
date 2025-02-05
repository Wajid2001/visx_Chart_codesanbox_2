import React, { useState } from "react";
import { scaleBand, scaleLinear } from "@visx/scale";
import { Bar, LinePath } from "@visx/shape";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { Group } from "@visx/group";
import { useTooltip, TooltipWithBounds } from "@visx/tooltip";
import { curveMonotoneX } from "@visx/curve";

const mockData = [
  { month: "Jan", sales: 500, growth: 5 },
  { month: "Feb", sales: 800, growth: 10 },
  { month: "Mar", sales: 650, growth: 8 },
  { month: "Apr", sales: 900, growth: 15 },
  { month: "May", sales: 1200, growth: 20 },
  { month: "Jun", sales: 1100, growth: 18 },
];

const width = 400;
const height = 400;
const margin = { top: 20, right: 50, bottom: 50, left: 50 };

const barColors = [
  "#f98150",
  "#fad175",
  "#4277cd",
  "#9a3769",
  "#9bc5f3",
  "#94c5c3",
  "#92a4bb",
];

const pastelColors = {
  bar: "#9ac7f4", // Pastel Blue
  line: "#ff6384", // Pastel Pink
  axis: "#D3D3D3", // Light Gray
};

const xScale = scaleBand({
  domain: mockData.map((d) => d.month),
  range: [margin.left, width - margin.right],
  padding: 0.3,
});

const yBarScale = scaleLinear({
  domain: [0, Math.max(...mockData.map((d) => d.sales))],
  range: [height - margin.bottom, margin.top],
});

const yLineScale = scaleLinear({
  domain: [0, Math.max(...mockData.map((d) => d.growth))],
  range: [height - margin.bottom, margin.top],
});

const DualAxisChart = () => {
  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
  } = useTooltip();
  const [hoveredBar, setHoveredBar] = useState(null);
  const [hoveredPoint, setHoveredPoint] = useState(null);

  return (
    <div style={{ position: "relative", height: "100%", width: "100%" }}>
      <svg width={width} height={height}>
        <Group>
          {/* Left Axis (Sales) */}
          <AxisLeft
            scale={yBarScale}
            left={margin.left}
            stroke={pastelColors.axis}
            tickStroke={pastelColors.axis}
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 12,
              textAnchor: "end",
              dx: "-5",
            })}
          />
          {/* Right Axis (Growth) */}
          <AxisRight
            scale={yLineScale}
            left={width - margin.right}
            stroke={pastelColors.axis}
            tickStroke={pastelColors.axis}
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 12,
              textAnchor: "start",
              dx: "5",
            })}
          />
          {/* Bottom Axis */}
          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            stroke={pastelColors.axis}
            tickStroke={pastelColors.axis}
            tickLabelProps={() => ({
              fill: "black",
              fontSize: 12,
              textAnchor: "middle",
            })}
          />
        </Group>

        <Group>
          {/* Bars (Sales) */}
          {mockData.map((d, index) => {
            const barWidth = xScale.bandwidth();
            const barHeight = height - margin.bottom - yBarScale(d.sales);
            const barX = xScale(d.month);
            const barY = yBarScale(d.sales);

            return (
              <Bar
                key={`bar-${index}`}
                x={barX}
                y={barY}
                width={barWidth}
                height={barHeight}
                fill={barColors[index]}
                rx={4}
                onMouseEnter={(event) => {
                  showTooltip({
                    tooltipData: d,
                    tooltipLeft: event.clientX,
                    tooltipTop: event.clientY - 50, // Ensure tooltip appears ABOVE the bar
                  });
                  setHoveredBar(index);
                }}
                onMouseLeave={() => {
                  hideTooltip();
                  setHoveredBar(null);
                }}
                style={{ cursor: "pointer", transition: "fill 0.3s ease" }}
              />
            );
          })}

          {/* Line Chart (Growth) */}
          <LinePath
            data={mockData}
            x={(d) => xScale(d.month) + xScale.bandwidth() / 2}
            y={(d) => yLineScale(d.growth)}
            stroke={pastelColors.line}
            strokeWidth={2}
            curve={curveMonotoneX}
          />

          {/* Line Points */}
          {mockData.map((d, index) => {
            const cx = xScale(d.month) + xScale.bandwidth() / 2;
            const cy = yLineScale(d.growth);

            return (
              <circle
                key={`point-${index}`}
                cx={cx}
                cy={cy}
                r={hoveredPoint === index ? 6 : 4}
                fill={pastelColors.line}
                stroke="white"
                strokeWidth={2}
                style={{ transition: "r 0.2s ease" }}
                onMouseEnter={(event) => {
                  showTooltip({
                    tooltipData: d,
                    tooltipLeft: event.clientX,
                    tooltipTop: event.clientY - 50, // Tooltip above the point
                  });
                  setHoveredPoint(index);
                }}
                onMouseLeave={() => {
                  hideTooltip();
                  setHoveredPoint(null);
                }}
                cursor="pointer"
              />
            );
          })}
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipOpen && tooltipData && (
        <div
          style={{
            position: "absolute",
            top: tooltipTop,
            left: tooltipLeft,
            backgroundColor: "white",
            color: "#333",
            padding: "8px",
            borderRadius: "6px",
            boxShadow: "0px 4px 8px rgba(0,0,0,0.2)",
            border: "1px solid #ddd",
            fontSize: "12px",
            fontWeight: "bold",
            pointerEvents: "none",
            transform: "translate(-50%, -100%)",
          }}
        >
          <div>
            <strong>{tooltipData.month}</strong>
          </div>
          {tooltipData.sales !== null && (
            <div>📊 Sales: {tooltipData.sales}</div>
          )}
          {tooltipData.growth !== null && (
            <div>📈 Growth: {tooltipData.growth}%</div>
          )}
          {/* Tooltip arrow */}
          <div
            style={{
              position: "absolute",
              bottom: "-5px",
              left: "50%",
              transform: "translateX(-50%)",
              width: "0",
              height: "0",
              borderLeft: "5px solid transparent",
              borderRight: "5px solid transparent",
              borderTop: "5px solid white",
            }}
          ></div>
        </div>
      )}
    </div>
  );
};

export default DualAxisChart;
