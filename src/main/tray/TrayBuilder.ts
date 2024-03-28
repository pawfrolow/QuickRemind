import { Menu, Tray, nativeImage } from 'electron';
import { TNullable } from 'main/types';
import { getAssetPath } from 'main/utils';
import { config } from 'main/config';
import {
  getAboutSettingsMenu,
  getAddMenu,
  getPlannedMenu,
  getQuitMenu,
} from './submenu';

export default class TrayBuilder {
  tray: TNullable<Tray> = null;

  constructor() {
    const icon = nativeImage.createFromPath(
      `${getAssetPath()}/icon-template.png`,
    );
    icon.setTemplateImage(true);
    this.tray = new Tray(icon);
    this.tray.setToolTip(config.appName);

    this.rebuildMenu();
  }

  rebuildMenu = () => {
    const contextMenu = Menu.buildFromTemplate([
      ...getAboutSettingsMenu(),
      ...getPlannedMenu(),
      ...getAddMenu(),
      ...getQuitMenu(),
    ]);
    this.tray!.setContextMenu(contextMenu);
  };
}
