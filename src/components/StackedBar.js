import React, { useState } from "react";
import { BarStack } from "@visx/shape";
import { scaleBand, scaleLinear, scaleOrdinal } from "@visx/scale";
import { Group } from "@visx/group";
import { AxisBottom, AxisLeft } from "@visx/axis";
import { LegendOrdinal } from "@visx/legend";
import { TooltipWithBounds, useTooltip, defaultStyles } from "@visx/tooltip";

// const width = 400;
const height = 400;
const margin = { top: 20, right: 30, bottom: 50, left: 60 };

const data = [
  {
    category: "Portfolio A",
    Equity: 45,
    FixedIncome: 35,
    Forex: 15,
    Commodity: 15,
  },
  {
    category: "Portfolio B",
    Equity: 30,
    FixedIncome: 40,
    Forex: 20,
    Commodity: 10,
  },
  {
    category: "Portfolio C",
    Equity: 25,
    FixedIncome: 30,
    Forex: 30,
    Commodity: 15,
  },
];

const keys = ["Equity", "FixedIncome", "Forex", "Commodity"];

const barColors = [
  "#f98150",
  "#fad175",
  "#4277cd",
  "#9a3769",
  "#9bc5f3",
  "#94c5c3",
  "#92a4bb",
];

const colors = {
  Equity: "#6A98E6",
  FixedIncome: "#F1C40F",
  Forex: "#2E8B57",
  Commodity: "#A64CA6",
};

const yScale = scaleLinear({
  domain: [0, 100],
  nice: true,
  range: [height - margin.bottom, margin.top],
});

const colorScale = scaleOrdinal({
  domain: keys,
  range: keys.map((k) => colors[k]),
});

const tooltipStyles = {
  ...defaultStyles,
  background: 'rgba(0, 0, 0, 0.8)',
  color: 'white',
  padding: '8px',
  borderRadius: '5px',
  position: 'fixed',
};

const StackedBarChart = ({ sizes }) => {
  const { width } = sizes;
  const [hoveredBar, setHoveredBar] = useState(null);
  const { showTooltip, hideTooltip, tooltipData, tooltipLeft, tooltipTop } =
    useTooltip();


  const xScale = scaleBand({
    domain: data.map((d) => d.category),
    range: [0, width - margin.left - margin.right],
    padding: 0.3,
  }); 

  return (
    <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <svg width={width} height={height}>
        <Group left={margin.left} top={margin.top}>
          {/* Y Axis */}
          <AxisLeft
            scale={yScale}
            stroke="black"
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 12,
              textAnchor: 'end',
            })}
          />

          <AxisBottom
            scale={xScale}
            top={height - margin.bottom}
            tickLabelProps={() => ({
              fill: 'black',
              fontSize: 12,
              textAnchor: 'middle',
            })}
          />

          <BarStack
            data={data}
            keys={keys}
            x={(d) => d.category}
            xScale={xScale}
            yScale={yScale}
            color={colorScale}
          >
            {(barStacks) =>
              barStacks.map((barStack, index) =>
                barStack.bars.map((bar) => (
                  <rect
                    key={`bar-stack-${bar.key}-${bar.index}`}
                    x={bar.x}
                    y={bar.y}
                    width={bar.width}
                    height={bar.height}
                    fill={barColors[index]}
                    onMouseEnter={(event) => {
                      setHoveredBar(`${bar.key}-${bar.index}`);
                      showTooltip({
                        tooltipData: {
                          key: bar.key,
                          value: bar.bar.data[bar.key],
                        },
                        tooltipLeft: event.clientX,
                        tooltipTop: event.clientY - 50,
                      });
                    }}
                    onMouseLeave={() => {
                      setHoveredBar(null);
                      hideTooltip();
                    }}
                    style={{
                      transition: '0.2s',
                      cursor: 'pointer',
                      opacity:
                        hoveredBar === `${bar.key}-${bar.index}` ? 0.7 : 1,
                    }}
                  />
                ))
              )
            }
          </BarStack>
        </Group>

        <LegendOrdinal
          scale={colorScale}
          direction="row"
          labelMargin="0 15px 0 0"
          style={{ fontSize: '12px' }}
        />
      </svg>

      {tooltipData && (
        <TooltipWithBounds
          left={tooltipLeft}
          top={tooltipTop}
          style={tooltipStyles}
        >
          <strong>{tooltipData.key}:</strong> {tooltipData.value}%
        </TooltipWithBounds>
      )}
      <span
        style={{
          marginLeft: 'auto',
          fontSize: 12,
          color: '#aaa',
        }}
      >
        Last Update: {new Date().toLocaleString('en-US', { timeZone: 'UTC' })}
      </span>
    </div>
  );
};

export default StackedBarChart;
