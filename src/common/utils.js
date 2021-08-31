import {ROLE_ADMIN, ROLE_COORDINATOR, ROLE_NONE, ROLE_TRANSLATOR} from "./constants";
import i18n from "i18next"


export const convertedRole = (textRole) => {
    switch (textRole) {
        case 'ADMIN':
            return ROLE_ADMIN
        case 'COORDINATOR':
            return ROLE_COORDINATOR
        case 'TRANSLATOR':
            return ROLE_TRANSLATOR
        default:
            return ROLE_NONE
    }
}

export function langCodeToLangName(langCode) {
    switch (langCode) {
        case 'en':
            return i18n.t('common:English')
        case 'pl':
            return i18n.t('common:Polish')
        case 'de':
            return i18n.t('common:German')
        case 'ru':
            return i18n.t('common:Russian')
        default:
            return
    }
}

export function roleIdToText(roleId, roleLang) {
    switch (roleId) {
        case 1:
            return i18n.t('common:Translator') + ` [${roleLang}]`;
        case 2:
            return i18n.t('common:Coordinator') + ` [${roleLang}]`;
        case 3:
            return i18n.t('common:Admin');
        default:
            return i18n.t('common:Guest');
    }
}

export function roleCodeToText(roleId, roleLang) {
    switch (roleId) {
        case 'TRANSLATOR':
            return i18n.t('common:Translator') + ` [${roleLang}]`;
        case 'COORDINATOR':
            return i18n.t('common:Coordinator') + ` [${roleLang}]`;
        case 'ADMIN':
            return i18n.t('common:Admin');
        default:
            return i18n.t('common:Guest');
    }
}

export function thickPartOfText(text, part) {
    if (part.length === 0) {
        return text
    }
    let leftIndex = text.toLowerCase().search(part.toLowerCase())
    if (leftIndex === -1) {
        return text
    }
    let rightIndex = leftIndex + part.length
    return <>{text.slice(0, leftIndex)}<b>{text.slice(leftIndex, rightIndex)}</b>{text.slice(rightIndex)}</>
}