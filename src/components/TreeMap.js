import React from "react";
import { Treemap, treemapBinary } from "@visx/hierarchy";
import { hierarchy } from "d3-hierarchy";
import { scaleLinear } from "@visx/scale";
import { Group } from "@visx/group";

const width = 375;
const height = 375;

const data = {
  name: "Asset Class Concentration",
  children: [
    { name: "Equity", size: 45, color: "#4177cd" },
    { name: "Fixed Income", size: 15, color: "#9ac7f0" },
    { name: "Forex", size: 35, color: "#4f135d" },
  ],
};

const textScale = scaleLinear({
  domain: [0, 50],
  range: [10, 20],
});

const TreeMapChart = () => {
  return (
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
              return node.depth === 1 ? (
                <g key={`node-${i}`} transform={`translate(${x0},${y0})`}>
                  <rect
                    width={x1 - x0}
                    height={y1 - y0}
                    fill={node.data.color}
                    stroke="#fff"
                    strokeWidth={2}
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
  );
};

export default TreeMapChart;
