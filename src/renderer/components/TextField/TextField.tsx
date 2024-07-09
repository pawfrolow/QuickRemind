import { TextField as MuiTextField, TextFieldProps } from '@mui/material';
import { styled } from '@mui/material/styles';
import { CSSProperties, FC } from 'react';

export const TextFieldStyle = styled(MuiTextField)`
  margin-bottom: 32px;
  width: 100%;
`;

const helperStyle: CSSProperties = {
  position: 'absolute',
  bottom: -24,
};

export const TextField: FC<TextFieldProps> = ({ children, ...props }) => {
  return (
    <TextFieldStyle FormHelperTextProps={{ style: helperStyle }} {...props}>
      {children}
    </TextFieldStyle>
  );
};
