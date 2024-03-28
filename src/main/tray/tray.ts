import { TNullable } from 'main/types';
import TrayBuilder from './TrayBuilder';

type TrayType = {
  main: TNullable<TrayBuilder>;
};

export const tray: TrayType = {
  main: null,
};
