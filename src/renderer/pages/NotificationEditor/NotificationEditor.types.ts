import { Dayjs } from 'dayjs';
import { TRepeat } from 'renderer/types';

export type TNotificationEditorForm = {
  title: string;
  description: string;
  step: number;
  repeat: boolean;
  date: Dayjs;
  repeatNumber: string;
  repeatPeriod: TRepeat['period'];
};

export type TTimePreset = {
  title: string;
  number: number;
  unit: 'minute' | 'hour' | 'day';
};
