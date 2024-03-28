import React from 'react';
import { observer } from 'mobx-react-lite';
import { toJS } from 'mobx';
import { commonStore } from 'renderer/stores';
import { MaterialUISwitch } from './ThemeToggle.styled';

export const ThemeToggle = observer(() => {
  const changeToggle = (e: React.ChangeEvent<HTMLInputElement>) => {
    window.electron.ipcRenderer.sendMessage('settings-save', {
      ...toJS(commonStore.settings),
      theme: e.target.checked ? 'dark' : 'light',
    });
  };

  return (
    <MaterialUISwitch
      sx={{ m: 1 }}
      checked={commonStore.settings?.theme === 'dark'}
      onChange={changeToggle}
    />
  );
});
