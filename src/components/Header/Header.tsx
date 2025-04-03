import AddIcon from './icons/Add';

import css from './Header.module.scss';

const Header = () => {
  return (
    <div className={css.root}>
      <button className={css.setting} aria-label="Add">
        <AddIcon />
      </button>
    </div>
  );
};

export default Header;
 