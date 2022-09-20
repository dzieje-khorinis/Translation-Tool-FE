import './style.scss';
import { useTranslation } from 'react-i18next';
import { apiPathUserCreate, reactPathUsers } from '../../common/routes';
import { LANGUAGES, ROLE_ADMIN } from '../../common/constants';
import { langCodeToLangName } from '../../common/utils';
import DjangoForm from '../DjangoForm';

function UserCreate({ user }) {
  const { t } = useTranslation('common');
  const languages = LANGUAGES();
  const roleOptions = [
    {
      value: 'TRANSLATOR',
      title: t('Translator'),
    },
  ];
  const roleLangOptions = [];

  if (user.role >= ROLE_ADMIN) {
    roleOptions.push({
      value: 'COORDINATOR',
      title: t('Coordinator'),
    });
    const items = [...languages.keys()].map((langCode) => {
      return {
        value: langCode,
        title: languages.get(langCode),
      };
    });
    roleLangOptions.push(...items);
  } else {
    roleLangOptions.push({
      value: user.roleLang,
      title: langCodeToLangName(user.roleLang),
    });
  }

  return (
    <DjangoForm
      fields={[
        {
          id: 'username',
          type: 'text',
          tag: 'input',
          title: t('Username'),
          required: true,
          autoComplete: 'username',
        },
        {
          id: 'role',
          tag: 'select',
          title: t('Role'),
          required: true,
          options: roleOptions,
        },
        {
          id: 'role_related_language',
          tag: 'select',
          title: t('Role related language'),
          required: true,
          options: roleLangOptions,
        },
        {
          id: 'password1',
          type: 'password',
          tag: 'input',
          title: t('Password'),
          required: true,
          autoComplete: 'new-password',
        },
        {
          id: 'password2',
          type: 'password',
          tag: 'input',
          title: t('Password confirmation'),
          required: true,
          autoComplete: 'new-password',
        },
      ]}
      submitName={t('ADD USER')}
      apiUrl={apiPathUserCreate}
      redirectUrl={reactPathUsers}
      title={t('Add user')}
    />
  );
}

UserCreate.propTypes = {};
export default UserCreate;
