import { Box, Fab as FabMui } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Fab = styled(FabMui)`
  position: absolute;
  bottom: 16px;
  right: 16px;
`;

export const Empty = styled(Box)`
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  padding-top: 64px;
  color: ${({ theme }) => theme.palette.text.primary};
`;
