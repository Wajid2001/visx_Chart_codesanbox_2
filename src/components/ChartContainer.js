import { Box } from '@mui/material';
import { useParentSize } from '@visx/responsive';
import { useEffect, useRef } from 'react';

// grid-card padding + margin
const BASE_PADDING_MARGIN = 40;

export const ChartContainer = ({ children }) => {
  const baseRef = useRef();
  const { parentRef, width, height } = useParentSize({ debounceTime: 0 });

  useEffect(() => {
    if (baseRef.current) {
      parentRef.current = baseRef.current.parentElement;
    }
  }, [baseRef]);

  return (
    <Box className={'grid-card '} ref={baseRef}>
      {children({
        width: width - BASE_PADDING_MARGIN,
        height: height - BASE_PADDING_MARGIN,
      })}
    </Box>
  );
};
