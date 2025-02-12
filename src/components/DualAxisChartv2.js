import React, { useMemo } from "react";
import { Group } from "@visx/group";
import { Bar } from "@visx/shape";
import { LinePath } from "@visx/shape";
import { scaleLinear, scaleBand } from "@visx/scale";
import { AxisBottom, AxisLeft, AxisRight } from "@visx/axis";
import { useTooltip, Tooltip, defaultStyles } from "@visx/tooltip";
import { localPoint } from "@visx/event";
import { withScreenSize } from "@visx/responsive";

// Sample data
const data = [
  { label: "Jan", barValue: 30, lineValue: 10 },
  { label: "Feb", barValue: 40, lineValue: 20 },
  { label: "Mar", barValue: 50, lineValue: 30 },
  { label: "Apr", barValue: 60, lineValue: 40 },
  { label: "May", barValue: 70, lineValue: 50 },
  { label: "Jun", barValue: 80, lineValue: 60 },
];

// Chart dimensions and margins
const width = 600;
const height = 400;
const margin = { top: 20, bottom: 50, left: 50, right: 50 };

// Inner chart dimensions
const innerWidth = width - margin.left - margin.right;
const innerHeight = height - margin.top - margin.bottom;

// Pastel colors
const pastelColors = {
  bar: "#A6CEE3",
  line: "#B2DF8A",
  tooltipBackground: "#333",
  tooltipText: "#fff",
};

const DualAxisChart = () => {
  const { tooltipData, tooltipLeft, tooltipTop, showTooltip, hideTooltip } =
    useTooltip();

  // Scales
  const xScale = useMemo(
    () =>
      scaleBand({
        domain: data.map((d) => d.label),
        range: [0, innerWidth],
        padding: 0.2,
      }),
    [innerWidth]
  );

  const yBarScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.barValue))],
        range: [innerHeight, 0],
      }),
    [innerHeight]
  );

  const yLineScale = useMemo(
    () =>
      scaleLinear({
        domain: [0, Math.max(...data.map((d) => d.lineValue))],
        range: [innerHeight, 0],
      }),
    [innerHeight]
  );

  // Tooltip handler
  const handleTooltip = (event) => {
    const { x } = localPoint(event) || { x: 0 };
    const index = Math.floor(x / (innerWidth / data.length));
    const d = data[index];

    if (d) {
      showTooltip({
        tooltipData: d,
        tooltipLeft: event.clientX,
        tooltipTop: event.clientY,
      });
    }
  };

  return (
    <div style={{ position: 'relative' }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Bars */}
          {data.map((d) => (
            <Bar
              key={d.label}
              x={xScale(d.label)}
              y={yBarScale(d.barValue)}
              width={xScale.bandwidth()}
              height={innerHeight - yBarScale(d.barValue)}
              fill={pastelColors.bar}
              onMouseMove={handleTooltip}
              onMouseLeave={hideTooltip}
            />
          ))}

          {/* Line */}
          <LinePath
            data={data}
            x={(d) => xScale(d.label) + xScale.bandwidth() / 2}
            y={(d) => yLineScale(d.lineValue)}
            stroke={pastelColors.line}
            strokeWidth={2}
          />

          {/* Axes */}
          <AxisBottom scale={xScale} top={innerHeight} />
          <AxisLeft scale={yBarScale} />
          <AxisRight
            scale={yLineScale}
            left={innerWidth}
            tickFormat={(value) => `${value}`}
          />
        </Group>
      </svg>

      {/* Tooltip */}
      {tooltipData && (
        <Tooltip
          left={tooltipLeft}
          top={tooltipTop}
          style={{
            ...defaultStyles,
            backgroundColor: pastelColors.tooltipBackground,
            color: pastelColors.tooltipText,
            position: 'fixed',
          }}
        >
          <div>
            <strong>{tooltipData.label}</strong>
            <div>Bar: {tooltipData.barValue}</div>
            <div>Line: {tooltipData.lineValue}</div>
          </div>
        </Tooltip>
      )}
    </div>
  );
};

export default withScreenSize(DualAxisChart);
