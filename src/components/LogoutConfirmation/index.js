import './style.scss';
import { useTranslation } from "react-i18next";
import {useState} from "react";


function LogoutConfirmation({setShowLogoutConfirmation, logout}) {
    const {t} = useTranslation('common')

    return (
        <>
        <div className='logout_background' onClick={e => setShowLogoutConfirmation(false)}></div>
        <div className='logout_confirmation'>
            <p>{t('Are you sure you want to log out?')}</p>
            <button data-decision='NO' onClick={e => setShowLogoutConfirmation(false)}>{t('No')}</button>
            <button data-decision='YES' onClick={logout}>{t('Yes')}</button>
        </div>
        </>
    );


}

LogoutConfirmation.propTypes = {}
export default LogoutConfirmation;
