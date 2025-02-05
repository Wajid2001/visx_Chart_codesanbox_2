import "./styles.css";
import DonutChart from "./components/DonutChart";
import DualAxisChart from "./components/DualAxisChartv1";
import DualAxisChartv2 from "./components/DualAxisChartv2";
import StackedBarChart from "./components/StackedBar";
import TreeMapChart from "./components/TreeMap";
import Grid from "@mui/material/Grid2";

export default function App() {
  return (
    <div className="App">
      <Grid container spacing={2} columns={{ xs: 4, sm: 8, md: 12 }}>
        <Grid size={4} className="grid-card">
          <DonutChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <DualAxisChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <TreeMapChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <StackedBarChart />
        </Grid>

        <Grid size={4} className="grid-card">
          <DonutChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <DualAxisChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <TreeMapChart />
        </Grid>
        <Grid size={4} className="grid-card">
          <StackedBarChart />
        </Grid>

        <Grid size={4} className="grid-card">
          <DonutChart />
        </Grid>
      </Grid>
    </div>
  );
}
