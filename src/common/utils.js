import i18n from 'i18next';
import {
  ROLE_ADMIN,
  ROLE_COORDINATOR,
  ROLE_NONE,
  ROLE_TRANSLATOR,
} from './constants';
import en from '../static/images/flags/us.png';
import pl from '../static/images/flags/pl.png';
import de from '../static/images/flags/de.png';
import ru from '../static/images/flags/ru.png';
import cs from '../static/images/flags/cz.png';
import it from '../static/images/flags/it.png';

export const convertedRole = (textRole) => {
  switch (textRole) {
    case 'ADMIN':
      return ROLE_ADMIN;
    case 'COORDINATOR':
      return ROLE_COORDINATOR;
    case 'TRANSLATOR':
      return ROLE_TRANSLATOR;
    default:
      return ROLE_NONE;
  }
};

export function langCodeToLangName(langCode) {
  switch (langCode) {
    case 'en':
      return i18n.t('common:English');
    case 'pl':
      return i18n.t('common:Polish');
    case 'de':
      return i18n.t('common:German');
    case 'ru':
      return i18n.t('common:Russian');
    case 'cs':
      return i18n.t('common:Czech');
    case 'it':
      return i18n.t('common:Italian');
    default:
  }
}

export function roleIdToText(roleId, roleLang) {
  switch (roleId) {
    case 1:
      return `${i18n.t('common:Translator')} [${roleLang}]`;
    case 2:
      return `${i18n.t('common:Coordinator')} [${roleLang}]`;
    case 3:
      return i18n.t('common:Admin');
    default:
      return i18n.t('common:Guest');
  }
}

export function roleCodeToText(roleId, roleLang) {
  switch (roleId) {
    case 'TRANSLATOR':
      return i18n.t('common:Translator') + (roleLang ? ` [${roleLang}]` : '');
    case 'COORDINATOR':
      return i18n.t('common:Coordinator') + (roleLang ? ` [${roleLang}]` : '');
    case 'ADMIN':
      return i18n.t('common:Admin');
    default:
      return i18n.t('common:Guest');
  }
}

export function thickPartOfText(text, part) {
  if (part.length === 0) {
    return text;
  }
  const leftIndex = text.toLowerCase().search(part.toLowerCase());
  if (leftIndex === -1) {
    return text;
  }
  const rightIndex = leftIndex + part.length;
  return (
    <>
      {text.slice(0, leftIndex)}
      <span className="text-found">{text.slice(leftIndex, rightIndex)}</span>
      {text.slice(rightIndex)}
    </>
  );
}

export function setCookie(cname, cvalue, exdays) {
  const d = new Date();
  d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
  const expires = `expires=${d.toUTCString()}`;
  document.cookie = `${cname}=${cvalue};${expires};path=/`;
}

export function getCookie(cname) {
  const name = `${cname}=`;
  const decodedCookie = decodeURIComponent(document.cookie);
  const ca = decodedCookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }
    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }
  return '';
}

export const langCodeToIcon = {
  en,
  pl,
  de,
  ru,
  cs,
  it,
};
