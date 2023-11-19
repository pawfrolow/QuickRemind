import { CSSProperties, FC, ReactNode } from 'react';
import * as s from './Page.styled';

type TPageProps = {
  children: ReactNode;
  style?: CSSProperties;
};

export const Page: FC<TPageProps> = ({ children, style }) => {
  return <s.Page style={style}>{children}</s.Page>;
};
