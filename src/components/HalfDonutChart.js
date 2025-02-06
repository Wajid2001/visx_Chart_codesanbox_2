import React, { useMemo, useState } from 'react';
import { Pie } from '@visx/shape';
import { Group } from '@visx/group';
import { scaleOrdinal } from '@visx/scale';
import { useTooltip } from '@visx/tooltip';
import { localPoint } from '@visx/event';
import { arc as d3Arc } from 'd3-shape';
import { LegendOrdinal } from '@visx/legend';

const DonutChart = ({ sizes, data }) => {
  const { width } = sizes;
  const height = 400;
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
  const radius = Math.min(width, height) / 2.5;
  const innerRadius = radius * 0.6;
  const cornerRadius = 6;
  const padAngle = 0;

  const filteredData = useMemo(() => {
    return data.filter((_, i) => !hideIndex.includes(i));
  }, [hideIndex]);

  const colorScale = scaleOrdinal({
    domain: data.map((d) => d.label),
    range: data.map((d) => d.color),
  });

  return (
    <div
      style={{
        position: 'relative',
        textAlign: 'center',
        height,
        width,
      }}
    >
      <h4
        style={{
          margin: '4px 0 12px 0',
          textAlign: 'left',
        }}
      >
        Trade Capture
      </h4>

      {/* Legend */}
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 0 0 0">
          {(labels) => (
            <div
              style={{
                display: 'flex',
                width,
                flexWrap: 'wrap',
                // justifyContent: 'space-around',
              }}
            >
              {labels.map((label, index) => {
                if (index > data.length - 1) {
                  return null;
                }

                return (
                  <div
                    key={index}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      marginRight: 'auto',
                      cursor: 'pointer',
                      userSelect: 'none',
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
                        marginRight: 7,
                        marginTop: '2px',
                        marginBottom: 'auto',
                        borderRadius: '20px',
                      }}
                    ></div>
                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '2px',
                        alignItems: 'flex-start',
                      }}
                    >
                      <h5
                        style={{
                          margin: 0,
                          fontWeight: 'normal',
                        }}
                      >
                        {label.datum}
                      </h5>
                      {data?.[label.index]?.value && (
                        <h3
                          style={{
                            margin: 0,
                            fontWeight: 'normal',
                          }}
                        >
                          {data?.[label?.index]?.value}
                        </h3>
                      )}
                    </div>
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
            startAngle={-Math.PI / 2}
            endAngle={Math.PI / 2}
            outerRadius={radius}
            innerRadius={innerRadius}
            padAngle={padAngle}
            pieSortValues={(a, b) => a - b}
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
                      cursor: 'pointer',
                      opacity: isHovered ? 1 : 0.5,
                      scale: hoveredArc === arc.data.label ? 1.1 : 1,
                      transition: 'all 0.250s ease-in-out',
                    }}
                  >
                    <path
                      d={arcGenerator(arc)}
                      fill={colorScale(arc.data.label)}
                      stroke={'white'}
                      strokeWidth={2}
                      style={{
                        transition: 'all 0.250s ease-in-out',
                      }}
                    />
                    {hoveredArc === arc.data.label && (
                      <path
                        d={shadowArcGenerator(arc)}
                        fill={colorScale(arc.data.label)}
                        opacity={0.2}
                        style={{
                          // filter: "blur(2.5px)",
                          transition: 'all 0.250s ease-in-out',
                        }}
                      />
                    )}
                    {/* <text
                      x={centroidX}
                      y={centroidY}
                      dy=".33em"
                      fill="white"
                      fontSize={10}
                      textAnchor="middle"
                      fontWeight={
                        hoveredArc?.index === index ? 'bold' : 'normal'
                      }
                    >
                      {arc.data.label}
                    </text> */}
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
            position: 'absolute',
            top: tooltipTop,
            left: tooltipLeft,
            backgroundColor: 'white',
            color: '#333',
            padding: '10px',
            borderRadius: '6px',
            boxShadow: '0px 4px 8px rgba(0,0,0,0.2)',
            border: '1px solid #ddd',
            fontSize: '12px',
            fontWeight: 'bold',
            pointerEvents: 'none',
            transform: 'translate(-50%, -100%)',
            whiteSpace: 'nowrap',
            transition: 'all 0.250s ease-in-out',
          }}
        >
          <div style={{ marginBottom: '5px', textAlign: 'center' }}>
            {tooltipData.label}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {tooltipData.value}
          </div>
        </div>
      )}

      <span
        style={{
          position: 'absolute',
          bottom: 0,
          right: 10,
          fontSize: 12,
          color: '#aaa',
        }}
      >
        Last Update: {new Date().toLocaleString('en-US', { timeZone: 'UTC' })}
      </span>
    </div>
  );
};

export default DonutChart;
