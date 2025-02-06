import React, { useMemo, useState } from 'react';
import { Treemap, treemapBinary } from '@visx/hierarchy';
import { hierarchy } from 'd3-hierarchy';
import { scaleLinear, scaleOrdinal } from '@visx/scale';
import { Group } from '@visx/group';
import { LegendOrdinal } from '@visx/legend';
import { useTooltip } from '@visx/tooltip';

const width = 375;
const height = 375;

const textScale = scaleLinear({
  domain: [0, 50],
  range: [10, 20],
});

const TreeMapChart = ({ sizes, data: _data, title }) => {
  const { width } = sizes;

  const {
    showTooltip,
    hideTooltip,
    tooltipData,
    tooltipLeft,
    tooltipTop,
    tooltipOpen,
  } = useTooltip();
  const [hoveredBox, setHoveredBox] = useState(null);
  const [hideIndex, setHideIndex] = useState([]);

  const filteredData = useMemo(() => {
    return _data.filter((_, i) => !hideIndex.includes(i));
  }, [hideIndex]);

  const data = useMemo(
    () => ({
      name: 'Asset Class Concentration',
      children: filteredData,
    }),
    [filteredData]
  );

  const colorScale = scaleOrdinal({
    domain: _data.map((d) => d.label),
    range: _data.map((d) => d.color),
  });

  return (
    <>
      {/* Legend */}
      <div
        style={{
          width: '100%',
        }}
      >
        {title && (
          <h4
            style={{
              margin: '4px 0 12px 0',
              textAlign: 'left',
            }}
          >
            {title}
          </h4>
        )}

        <LegendOrdinal scale={colorScale} direction="row" labelMargin="0 0 0 0">
          {(labels) => (
            <div
              style={{
                display: 'flex',
                width,
                flexWrap: 'wrap',
              }}
            >
              {labels.map((label, index) => {
                console.log(label, _data, 'wajid');
                // if (index > data.length - 1) {
                //   return null;
                // }

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
                      setHoveredBox(_data?.[label?.index].name);
                    }}
                    onMouseLeave={() => {
                      setHoveredBox(null);
                    }}
                  >
                    <div
                      style={{
                        width: 12,
                        height: 12,
                        backgroundColor: _data?.[label?.index].color,
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
                        {_data?.[label?.index]?.name}
                      </h5>
                      {_data?.[label.index]?.size && (
                        <h3
                          style={{
                            margin: 0,
                            fontWeight: 'normal',
                          }}
                        >
                          {_data?.[label?.index]?.size}
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
        <Treemap
          root={hierarchy(data)
            .sum((d) => d.size)
            .sort((a, b) => b.value - a.value)}
          size={[width, height]}
          tile={treemapBinary}
        >
          {(treemap) => (
            <Group>
              {treemap.descendants().map((node, i) => {
                const { x0, x1, y0, y1 } = node;
                const isHovered = hoveredBox && hoveredBox !== node.data.name;
                return node.depth === 1 ? (
                  <g
                    key={`node-${i}`}
                    transform={`translate(${x0},${y0})`}
                    onMouseEnter={(event) => {
                      showTooltip({
                        tooltipData: node.data,
                        tooltipLeft: event.clientX + 25,
                        tooltipTop: event.clientY + height,
                      });
                      setHoveredBox(node.data.name);
                    }}
                    onMouseLeave={() => {
                      hideTooltip();
                      setHoveredBox(null);
                    }}
                  >
                    <rect
                      width={x1 - x0}
                      height={y1 - y0}
                      fill={node.data.color}
                      stroke="#fff"
                      strokeWidth={2}
                      style={{
                        transition: 'all 0.250s ease-in-out',
                        opacity: isHovered ? 0.8 : 1,
                      }}
                    />
                    <text
                      x={(x1 - x0) / 2}
                      y={(y1 - y0) / 2}
                      textAnchor="middle"
                      fontSize={textScale(node.value)}
                      fill="white"
                      fontWeight="bold"
                    >
                      {node.data.name}
                    </text>
                  </g>
                ) : null;
              })}
            </Group>
          )}
        </Treemap>
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
            {tooltipData.name}
          </div>
          <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
            {tooltipData.size}
          </div>
        </div>
      )}
      <span
        style={{
          position: 'absolute',
          bottom: 10,
          right: 10,
          fontSize: 12,
          color: '#aaa',
        }}
      >
        Last Update: {new Date().toLocaleString('en-US', { timeZone: 'UTC' })}
      </span>
    </>
  );
};

export default TreeMapChart;
