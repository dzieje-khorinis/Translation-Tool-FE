import '../Login/style.scss';
import {apiPathChangePassword, reactPathIndex} from "../../common/routes";
import {useTranslation} from "react-i18next";
import DjangoForm from "../DjangoForm";

function PasswordChange() {
    const {t} = useTranslation('common');
    return (
        <DjangoForm
            fields={[
                {
                    id: "old_password",
                    type: "password",
                    tag: "input",
                    title: t('Password'),
                    required: true,
                    autoComplete: "current-password",
                },
                {
                    id: "new_password1",
                    type: "password",
                    tag: "input",
                    title: t('New password'),
                    required: true,
                    autoComplete: "new-password",
                },
                {
                    id: "new_password2",
                    type: "password",
                    tag: "input",
                    title: t('New password confirmation'),
                    required: true,
                    autoComplete: "new-password",
                },
            ]}
            submitName={t('CHANGE')}
            apiUrl={apiPathChangePassword}
            apiMethod="put"
            redirectUrl={reactPathIndex}
            title={t('Change password')}
            successCallback={(data) => {localStorage.setItem('token', data.token)}}
        />
    )
}


export default PasswordChange;
