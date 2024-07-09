import dayjs from 'dayjs';
import { TNotificationEditorForm, TTimePreset } from './NotificationEditor.types';

export const STEPS_COUNT = 3;

export const repeatPeriods = ['minute', 'hour', 'day', 'week'];

export const timePresets: TTimePreset[] = [
  { title: 'in15min', number: 15, unit: 'minute' },
  { title: 'in30min', number: 30, unit: 'minute' },
  { title: 'in1hour', number: 1, unit: 'hour' },
  { title: 'in2hour', number: 2, unit: 'hour' },
  { title: 'tomorrow', number: 1, unit: 'day' },
];

export const initialFormValues: TNotificationEditorForm = {
  title: '',
  description: '',
  step: 1,
  repeat: false,
  date: dayjs().add(10, 'minute'),
  repeatNumber: '1',
  repeatPeriod: 'hour',
};
