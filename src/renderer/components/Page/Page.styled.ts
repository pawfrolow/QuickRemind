import { Box } from '@mui/material';
import { styled } from '@mui/material/styles';

export const Page = styled(Box)`
  width: 100vw;
  height: 100vh;
  position: relative;
  padding: 16px;
  background: ${({ theme }) => theme.palette.background.default};
  display: flex;
  flex-direction: column;
`;
