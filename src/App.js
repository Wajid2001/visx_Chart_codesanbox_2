import "./styles.css";
import DonutChart from "./components/DonutChart";
import DualAxisChart from "./components/DualAxisChartv1";
import DualAxisChartv2 from "./components/DualAxisChartv2";
import StackedBarChart from "./components/StackedBar";
import TreeMapChart from "./components/TreeMap";
import Grid from "@mui/material/Grid2";
import { useParentSize } from '@visx/responsive';
import HalfDonutChart from './components/HalfDonutChart';

export default function App() {
  const { parentRef, width, height } = useParentSize({ debounceTime: 150 });
  const {
    parentRef: parentRefWide,
    width: widthWide,
    height: heightWide,
  } = useParentSize({ debounceTime: 150 });

  return (
    <div className="App">
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid size={4} className="grid-card" ref={parentRef}>
          <HalfDonutChart
            data={[
              { label: 'Successful Trades', value: 85, color: '#fed8cc' },
              { label: 'Failed Trades', value: 15, color: '#f9804e' },
            ]}
            sizes={{
              width,
              height,
            }}
          />
        </Grid>
        <Grid size={8} className="grid-card" ref={parentRefWide}>
          <DualAxisChart
            sizes={{
              width: widthWide,
              height: heightWide,
            }}
          />
        </Grid>

        <Grid size={4} className="grid-card">
          <DonutChart
            title="Trade Notification"
            sizes={{
              width,
              height,
            }}
            data={[
              { label: 'Scheduled', value: 60, color: '#9bc5ef' },
              { label: 'Completed', value: 15, color: '#407abc' },
              { label: 'Seat', value: 25, color: '#50c1c2' },
            ]}
          />
        </Grid>

        <Grid size={4} className="grid-card">
          <TreeMapChart
            sizes={{
              width,
              height,
            }}
            data={[
              { name: 'Equity', size: 45, color: '#4177cd' },
              { name: 'Fixed Income', size: 15, color: '#9ac7f0' },
              { name: 'Forex', size: 35, color: '#4f135d' },
            ]}
            title="Asset Class Concentration"
          />
        </Grid>
        <Grid size={4} className="grid-card">
          <StackedBarChart
            sizes={{
              width,
              height,
            }}
          />
        </Grid>

        <Grid size={8} className="grid-card">
          <DualAxisChart
            sizes={{
              width: widthWide,
              height: heightWide,
            }}
          />
        </Grid>
        <Grid size={4} className="grid-card">
          <DonutChart
            title="EOD P&L"
            sizes={{
              width,
              height,
            }}
            data={[
              { label: 'Completed', value: 80, color: '#407abc' },
              { label: 'Finding', value: 20, color: '#fad175' },
            ]}
          />
        </Grid>
      </Grid>
    </div>
  );
}
