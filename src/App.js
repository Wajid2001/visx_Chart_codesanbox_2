import "./styles.css";
import DonutChart from "./components/DonutChart";
import DualAxisChart from "./components/DualAxisChartv1";
import DualAxisChartv2 from "./components/DualAxisChartv2";
import StackedBarChart from "./components/StackedBar";
import TreeMapChart from "./components/TreeMap";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { useParentSize } from '@visx/responsive';
import HalfDonutChart from './components/HalfDonutChart';
import { Container } from '@mui/material';
import { useEffect, useState } from 'react';

export default function App() {
  const { parentRef, width, height } = useParentSize({
    debounceTime: 150,
    resizeObserverPolyfill: ResizeObserver,
  });
  const {
    parentRef: parentRefWide,
    width: widthWide,
    height: heightWide,
  } = useParentSize({
    debounceTime: 150,
    resizeObserverPolyfill: ResizeObserver,
  });
  const [refreshCharts, setRefreshCharts] = useState(0);

  useEffect(() => {
    const handleResize = () => {
      setRefreshCharts((prev) => prev + 1);
    };

    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          flexGrow: 1,
          border: '1px solid royalblue',
          borderRadius: '8px',
          padding: '4px',
        }}
        className="App"
      >
        <Box sx={{ display: 'none' }}>{refreshCharts}</Box>

        <Grid container>
          <Grid item className="grid" sm={12} md={4}>
            <Box className="grid-card" ref={parentRef}>
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
            </Box>
          </Grid>
          <Grid item className="grid" sm={12} md={8}>
            <Box className="grid-card" ref={parentRefWide}>
              <DualAxisChart
                sizes={{
                  width: widthWide,
                  height: heightWide,
                }}
              />
            </Box>
          </Grid>

          <Grid item className="grid" sm={12} md={4}>
            <Box className="grid-card">
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
            </Box>
          </Grid>

          <Grid item className="grid" sm={12} md={4}>
            <Box className="grid-card">
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
            </Box>
          </Grid>
          <Grid item className="grid" sm={12} md={4}>
            <Box className="grid-card">
              <StackedBarChart
                sizes={{
                  width,
                  height,
                }}
              />
            </Box>
          </Grid>

          <Grid item className="grid" sm={12} md={8}>
            <Box className="grid-card">
              <DualAxisChart
                sizes={{
                  width: widthWide,
                  height: heightWide,
                }}
              />
            </Box>
          </Grid>
          <Grid item className="grid" sm={12} md={4}>
            <Box className="grid-card" width={width} height={height}>
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
            </Box>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}

