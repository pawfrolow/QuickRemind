export type TTimePreset = {
  title: string;
  number: number;
  unit: 'minute' | 'hour' | 'day';
};

export const timePresets: TTimePreset[] = [
  { title: 'in15min', number: 15, unit: 'minute' },
  { title: 'in30min', number: 30, unit: 'minute' },
  { title: 'in1hour', number: 1, unit: 'hour' },
  { title: 'in2hour', number: 2, unit: 'hour' },
  { title: 'tomorrow', number: 1, unit: 'day' },
];
