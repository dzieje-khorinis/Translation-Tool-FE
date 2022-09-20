import './style.scss';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';

function LogoutConfirmation({ setShowLogoutConfirmation, logout }) {
  const { t } = useTranslation('common');

  return (
    <>
      <div
        className="logout_background"
        onClick={() => setShowLogoutConfirmation(false)}
      />
      <div className="logout_confirmation">
        <p>{t('Are you sure you want to log out?')}</p>
        <button
          type="button"
          data-decision="NO"
          onClick={() => setShowLogoutConfirmation(false)}
        >
          {t('No')}
        </button>
        <button type="button" data-decision="YES" onClick={logout}>
          {t('Yes')}
        </button>
      </div>
    </>
  );
}

LogoutConfirmation.propTypes = {
  setShowLogoutConfirmation: PropTypes.func.isRequired,
  logout: PropTypes.func.isRequired,
};
export default LogoutConfirmation;
