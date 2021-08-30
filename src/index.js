import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './components/App';
import reportWebVitals from './reportWebVitals';
import {Provider} from "react-redux"
import store from './store'
import {I18nextProvider} from "react-i18next";
import i18next from "i18next";
import common_en from "./translations/en/common.json"
import common_pl from "./translations/pl/common.json"

i18next.init({
    interpolation: { escapeValue: false },  // React already does escaping
    lng: 'en',                              // language to use
    resources: {
        en: {
            common: common_en               // 'common' is our custom namespace
        },
        pl: {
            common: common_pl
        },
    },
});

ReactDOM.render(
    <React.StrictMode>
        <I18nextProvider i18n={i18next}>
            <Provider store={store}>
                <App/>
            </Provider>
        </I18nextProvider>
    </React.StrictMode>
    ,
    document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
