import './style.scss';
import {Link} from "react-router-dom";
import {reactPathIndex, reactPathProfile, reactPathUsers} from "../../common/routes";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {ROLE_COORDINATOR} from "../../common/constants";

function Nav({user, loggedIn, interfaceLang, languageChangeHandle, logoutClick}) {
    const {t} = useTranslation('common');

    return <nav>

        <Link to={reactPathIndex} className="logo">
            <div>{loggedIn && t('Homepage')}</div>
        </Link>

        <ul>
            {
                loggedIn &&
                <>
                    {
                        user.role >= ROLE_COORDINATOR &&
                        <li><Link to={reactPathUsers} className="link">{t('Users')}</Link></li>
                    }
                    <li><Link to={reactPathProfile} className="link">{t('Profile')}</Link></li>
                    <li><span onClick={logoutClick} className="link">{t('Logout')}</span></li>
                </>
            }
            <li>
                <select name="language" onChange={languageChangeHandle} defaultValue={interfaceLang}>
                    <option value="en">English (EN)</option>
                    <option value="pl">polski (PL)</option>
                </select>
            </li>
        </ul>
    </nav>
}

Nav.propTypes = {
    languageChangeHandle: PropTypes.func.isRequired,
    logoutClick: PropTypes.func.isRequired,
    interfaceLang: PropTypes.string,
    user: PropTypes.exact({
        name: PropTypes.string,
        email: PropTypes.string,
        role: PropTypes.number,
        roleLang: PropTypes.string,
    }),
}

export default Nav