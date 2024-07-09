import { Box } from '@mui/material';
import React, { CSSProperties } from 'react';

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
  style?: CSSProperties;
}

export function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <Box
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      style={{ height: '100%' }}
      {...other}
    >
      {value === index && children}
    </Box>
  );
}
