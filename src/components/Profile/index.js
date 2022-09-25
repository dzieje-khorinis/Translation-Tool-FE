import './style.scss';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import PropTypes from 'prop-types';
import { reactPathChangePassword } from '../../common/routes';
import { roleIdToText } from '../../common/utils';

function Profile({ user }) {
  const { t } = useTranslation('common');

  const role = roleIdToText(user.role, user.roleLang);

  return (
    <section className="account-panel">
      <div className="account-panel-wrapper">
        <h1 className="account-panel-header">{t('My Profile')}</h1>
        <h2 className="account-panel-header">{t('Data')}</h2>
        <div className="account-panel-info">
          <span className="account-panel-key">{t('Username')}</span>
          <span className="account-panel-value">{user.name}</span>
        </div>
        <div className="account-panel-info">
          <span className="account-panel-key">{t('Email')}</span>
          <span className="account-panel-value">{user.email}</span>
        </div>
        <div className="account-panel-info">
          <span className="account-panel-key">{t('Role')}</span>
          <span className="account-panel-value">{role}</span>
        </div>
        <h2 className="account-panel-header">{t('Actions')}</h2>
        <div className="account-panel-links-wrapper">
          <Link to={reactPathChangePassword} className="account-panel-link">
            {t('Change password')}
          </Link>
        </div>
      </div>
    </section>
  );
}

Profile.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.number,
    roleLang: PropTypes.string,
    name: PropTypes.string,
    email: PropTypes.string,
  }).isRequired,
};
export default Profile;
