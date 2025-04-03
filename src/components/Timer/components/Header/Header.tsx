import { memo } from 'react';

import SettingIcon from './icons/Setting';

import css from './Header.module.scss';

const Header = () => {
  return (
    <div className={css.root}>
      <button className={css.setting} aria-label="Settings">
        <SettingIcon />
      </button>
    </div>
  );
};

export default memo(Header);
