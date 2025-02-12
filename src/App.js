import { Container } from '@mui/material';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import DonutChart from './components/DonutChart';
import DualAxisChart from './components/DualAxisChartv1';
import HalfDonutChart from './components/HalfDonutChart';
import StackedBarChart from './components/StackedBar';
import TreeMapChart from './components/TreeMap';
import './styles.css';
import { ChartContainer } from './components/ChartContainer';

export default function App() {
  return (
    <Container maxWidth="xl">
      <Box
        sx={{
          flexGrow: 1,
          border: '1px solid royalblue',
          borderRadius: '8px',
          padding: '4px',
        }}
        className="App"
      >
        <Grid container>
          <Grid item className="grid" xs={12} sm={12} md={4}>
            <ChartContainer>
              {({ width, height }) => (
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
              )}
            </ChartContainer>
          </Grid>
          <Grid item className="grid" xs={12} sm={12} md={8}>
            <ChartContainer>
              {({ width, height }) => (
                <DualAxisChart
                  sizes={{
                    width,
                    height,
                  }}
                />
              )}
            </ChartContainer>
          </Grid>

          <Grid item className="grid" xs={12} sm={12} md={4}>
            <ChartContainer>
              {({ width, height }) => (
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
              )}
            </ChartContainer>
          </Grid>

          <Grid item className="grid" xs={12} sm={12} md={4}>
            <ChartContainer>
              {({ width, height }) => (
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
              )}
            </ChartContainer>
          </Grid>
          <Grid item className="grid" xs={12} sm={12} md={4}>
            <ChartContainer>
              {({ width, height }) => (
                <StackedBarChart
                  sizes={{
                    width,
                    height,
                  }}
                />
              )}
            </ChartContainer>
          </Grid>

          <Grid item className="grid" xs={12} sm={12} md={8}>
            <ChartContainer>
              {({ width, height }) => (
                <DualAxisChart
                  sizes={{
                    width,
                    height,
                  }}
                />
              )}
            </ChartContainer>
          </Grid>
          <Grid item className="grid" xs={12} sm={12} md={4}>
            <ChartContainer>
              {({ width, height }) => (
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
              )}
            </ChartContainer>
          </Grid>
        </Grid>
      </Box>
    </Container>
  );
}
