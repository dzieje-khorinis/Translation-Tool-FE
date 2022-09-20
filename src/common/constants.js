import i18n from 'i18next';

export const ROLE_GUEST = -1;
export const ROLE_NONE = 0;
export const ROLE_TRANSLATOR = 1;
export const ROLE_COORDINATOR = 2;
export const ROLE_ADMIN = 3;
// export const ROLE_SUPERADMIN = 4

export const LANG_EN = 'en';
export const LANG_PL = 'pl';

export const REQUIRE_GUEST = 1;
export const REQUIRE_LOGGED_IN = 2;

export const LANGUAGES = () =>
  new Map([
    ['en', i18n.t('common:English')],
    ['pl', i18n.t('common:Polish')],
    ['de', i18n.t('common:German')],
    ['ru', i18n.t('common:Russian')],
    ['cs', i18n.t('common:Czech')],
    ['it', i18n.t('common:Italian')],
  ]);

export const STATUSES = () =>
  new Map([
    ['NEW', i18n.t('common:New')],
    ['TODO', i18n.t('common:To do')],
    ['READY_TO_REVIEW', i18n.t('common:Ready to review')],
    ['NEEDS_WORK', i18n.t('common:Needs work')],
    ['ACCEPTED', i18n.t('common:Accepted')],
  ]);

export const STATUS_TO_COLOR = new Map([
  ['NEW', '#2FDAF770'],
  ['TODO', '#FFE300A8'],
  ['READY_TO_REVIEW', '#FF8F00A8'],
  ['NEEDS_WORK', '#F7422FA8'],
  ['ACCEPTED', '#3FF72F69'],
]);

export const THEMES = ['dark-theme', 'light-theme'];
