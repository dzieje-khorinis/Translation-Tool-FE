import './style.scss';
import {apiPathAuthToken} from "../../common/routes";
import PropTypes from "prop-types";
import {useTranslation} from "react-i18next";
import DjangoForm from "../DjangoForm";

function Login({successCallback}) {
    const {t} = useTranslation('common');

    return (
        <DjangoForm
            fields={[
                {
                    id: "username",
                    type: "text",
                    tag: "input",
                    title: t('Username'),
                    required: true,
                    autoComplete: "username",
                },
                {
                    id: "password",
                    type: "password",
                    tag: "input",
                    title: t('Password'),
                    required: true,
                    autoComplete: "current-password",
                },
            ]}
            submitName={t('LOGIN')}
            apiUrl={apiPathAuthToken}
            redirectUrl={null}
            title={t('Login')}
            successCallback={successCallback}
        />
    )
}

Login.propTypes = {
    successCallback: PropTypes.func.isRequired,
}
export default Login;
