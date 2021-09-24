import './style.scss';
import {Link} from "react-router-dom";
import {reactPathIndex, reactPathProfile, reactPathUsers} from "../../common/routes";
import {useTranslation} from "react-i18next";
import PropTypes from "prop-types";
import {ROLE_COORDINATOR} from "../../common/constants";
import LangChange from "../LangChange";


function Nav({user, loggedIn, interfaceLang, languageChange, logoutClick}) {
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
                <LangChange
                    languageChange={languageChange}
                    interfaceLang={interfaceLang}
                />
            </li>
        </ul>

    </nav>
}

Nav.propTypes = {
    languageChange: PropTypes.func.isRequired,
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