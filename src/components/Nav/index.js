import './style.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import {
  reactPathIndex,
  reactPathProfile,
  reactPathUsers,
  reactPathHistory,
} from '../../common/routes';
import { ROLE_COORDINATOR } from '../../common/constants';
import LangChange from '../LangChange';
import logoutIcon from '../../static/images/logout.svg';
import usersIcon from '../../static/images/users.svg';
import profileIcon from '../../static/images/profile.svg';
import houseIcon from '../../static/images/house.svg';
import dayNightIcon from '../../static/images/daynight.svg';
import historyIcon from '../../static/images/history.svg';

function Nav({
  user,
  loggedIn,
  interfaceLang,
  languageChange,
  logoutClick,
  changeTheme,
}) {
  const { t } = useTranslation('common');

  return (
    <nav>
      <Link to={reactPathIndex} className="logo">
        <div>
          {loggedIn && (
            <>
              <img title={t('Homepage')} src={houseIcon} alt="" />
              <span>{t('Homepage')}</span>
            </>
          )}
        </div>
      </Link>

      <ul>
        {loggedIn && (
          <>
            <li>
              <Link to={reactPathHistory} className="link">
                <img title={t('History')} src={historyIcon} alt="" />
              </Link>
            </li>
            {user.role >= ROLE_COORDINATOR && (
              <li>
                <Link to={reactPathUsers} className="link">
                  <img title={t('Users')} src={usersIcon} alt="" />
                </Link>
              </li>
            )}
            <li>
              <Link to={reactPathProfile} className="link">
                <img title={t('Profile')} src={profileIcon} alt="" />
              </Link>
            </li>
            <li>
              <span onClick={changeTheme} className="link">
                <img title={t('Change theme')} src={dayNightIcon} alt="" />
              </span>
            </li>
            <li>
              <span onClick={logoutClick} className="link">
                <img title={t('Logout')} src={logoutIcon} alt="" />
              </span>
            </li>
          </>
        )}
        <li>
          <LangChange
            languageChange={languageChange}
            interfaceLang={interfaceLang}
          />
        </li>
      </ul>
    </nav>
  );
}

Nav.propTypes = {
  loggedIn: PropTypes.bool.isRequired,
  languageChange: PropTypes.func.isRequired,
  logoutClick: PropTypes.func.isRequired,
  changeTheme: PropTypes.func.isRequired,
  interfaceLang: PropTypes.string.isRequired,
  user: PropTypes.exact({
    name: PropTypes.string,
    email: PropTypes.string,
    role: PropTypes.number,
    roleLang: PropTypes.string,
  }).isRequired,
};

export default Nav;
