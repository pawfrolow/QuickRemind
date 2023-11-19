import { Grid, Typography } from '@mui/material';

import { FC, ReactNode } from 'react';
import * as s from './Header.styled';

type THeaderProps = {
  title: string;
  rightPanel?: ReactNode;
};

export const Header: FC<THeaderProps> = ({ title, rightPanel }) => {
  return (
    <s.Wrapper container spacing={2}>
      <Grid item>
        <Typography variant="h6">{title}</Typography>
      </Grid>
      <Grid item style={{ marginLeft: 'auto' }}>
        {rightPanel}
      </Grid>
    </s.Wrapper>
  );
};
