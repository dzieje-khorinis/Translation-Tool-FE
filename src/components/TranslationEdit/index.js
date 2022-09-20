import './style.scss';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import {
  LANGUAGES,
  ROLE_ADMIN,
  ROLE_COORDINATOR,
  ROLE_TRANSLATOR,
  STATUSES,
} from '../../common/constants';
import { apiClient } from '../../common/apiClient';
import { apiPathTranslationSave } from '../../common/routes';
import { langCodeToIcon, langCodeToLangName } from '../../common/utils';
import closeIcon from '../../static/images/x-solid.svg';
import historyIcon from '../../static/images/history.svg';
import editIcon from '../../static/images/edit.svg';
import TranslationHistory from '../TranslationHistory';

const { Option } = components;

function TranslationEdit({
  user,
  dataLanguage,
  translationData,
  closeEditModal,
  editCallback,
}) {
  const { t } = useTranslation('common');

  const [processing, setProcessing] = useState(false);
  const [historyViewOpen, setHistoryViewOpen] = useState(false);

  const [languageToRead, setLanguageToRead] = useState(dataLanguage);
  const [languageToWrite, setLanguageToWrite] = useState(dataLanguage);

  const [textToRead, setTextToRead] = useState(
    translationData[`value_${dataLanguage}`]
  );
  const [textToWrite, setTextToWrite] = useState(
    translationData[`value_${dataLanguage}`]
  );
  const [newState, setNewState] = useState(
    translationData[`state_${dataLanguage}`]
  );

  useEffect(() => {
    setTextToRead(translationData[`value_${languageToRead}`]);
  }, [languageToRead, translationData]);

  useEffect(() => {
    setTextToWrite(translationData[`value_${languageToWrite}`]);
    setNewState(translationData[`state_${languageToWrite}`]);
  }, [languageToWrite, translationData]);

  const statusCode = translationData[`state_${languageToWrite}`];

  const languages = LANGUAGES();

  const statuses = STATUSES();
  const statusItems = [...statuses.keys()].map((tmpStatusCode) => {
    return {
      value: tmpStatusCode,
      title: statuses.get(tmpStatusCode),
    };
  });

  function getPossibleActions() {
    let possibleActions = [];
    if (user.role <= ROLE_COORDINATOR && languageToWrite !== user.roleLang) {
      return possibleActions;
    }

    if (user.role === ROLE_TRANSLATOR && statusCode === 'ACCEPTED') {
      return possibleActions;
    }
    possibleActions.push('TODO', 'READY_TO_REVIEW');
    if (user.role === ROLE_TRANSLATOR) {
      return possibleActions;
    }
    possibleActions.push('NEEDS_WORK', 'ACCEPTED');
    if (user.role === ROLE_COORDINATOR) {
      return possibleActions;
    }
    possibleActions = ['NEW', ...possibleActions];
    return possibleActions;
  }

  const possibleActions = getPossibleActions();

  const onTranslationSave = () => {
    setProcessing(true);
    apiClient
      .post(apiPathTranslationSave, {
        translation_id: translationData.id,
        state: newState,
        text: textToWrite,
        language: languageToWrite,
      })
      .then(() => {
        setProcessing(false);
        closeEditModal();
        editCallback();
      });
  };

  return (
    <section className="translation-editor" onClick={() => closeEditModal()}>
      <div
        className={`translation-wrapper ${
          historyViewOpen ? 'history-view' : 'edit-view'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <span onClick={() => closeEditModal()} className="link close_modal">
          <img title={t('Close')} src={closeIcon} alt="" />
        </span>

        {historyViewOpen ? (
          <>
            <span
              onClick={() => setHistoryViewOpen(false)}
              className="link back_to_edit_view"
            >
              <img title={t('Back')} src={editIcon} alt="" />
            </span>
            <TranslationHistory translationId={translationData.id} />
          </>
        ) : (
          <>
            <span
              onClick={() => setHistoryViewOpen(true)}
              className="link history_view"
            >
              <img title={t('History')} src={historyIcon} alt="" />
            </span>

            <h3 className="translation-header">
              {translationData.key}
              <span id="translation-status" data-status={statusCode}>
                {statuses.get(statusCode)}
              </span>
            </h3>
            <p className="filepath">
              {translationData.file}:{translationData.line}
            </p>
            <br />
            <fieldset>
              <label htmlFor="language_to_read" className="translation-header">
                {t('Show translation')}:
              </label>
              <div className="langSelectWrapper">
                <Select
                  inputId="language_to_read"
                  value={{
                    value: languageToRead.value,
                    label: `${languages.get(
                      languageToRead
                    )} (${languageToRead})`,
                  }}
                  isDisabled={false}
                  isLoading={false}
                  isClearable={false}
                  isRtl={false}
                  isSearchable={false}
                  onChange={(option) => setLanguageToRead(option.value)}
                  options={Array.from(languages).map(([key, value]) => {
                    return {
                      value: key,
                      label: `${value} (${key})`,
                      icon: langCodeToIcon[key],
                    };
                  })}
                  components={{
                    /* eslint-disable */
                    Option: (props) => (
                      <Option {...props}>
                        <img src={props.data.icon} alt={props.data.label} />
                        <span style={{ marginLeft: 10 }}>
                          {props.data.label}
                        </span>
                      </Option>
                    ),
                    /* eslint-enable */
                  }}
                />
              </div>
            </fieldset>

            <div className="translation-content">
              <textarea
                id="show-translation"
                className="translation-content"
                disabled
                value={textToRead}
              />
            </div>

            <fieldset>
              <label htmlFor="language_to_write" className="translation-header">
                {t('Enter translation')}
                {user.role < ROLE_ADMIN &&
                  ` (${langCodeToLangName(languageToWrite)})`}
                :
              </label>

              {user.role >= ROLE_ADMIN && (
                <div className="langSelectWrapper">
                  <Select
                    inputId="language_to_write"
                    value={{
                      value: languageToWrite.value,
                      label: `${languages.get(
                        languageToWrite
                      )} (${languageToWrite})`,
                    }}
                    isDisabled={false}
                    isLoading={false}
                    isClearable={false}
                    isRtl={false}
                    isSearchable={false}
                    onChange={(option) => setLanguageToWrite(option.value)}
                    options={Array.from(languages).map(([key, value]) => {
                      return {
                        value: key,
                        label: `${value} (${key})`,
                        icon: langCodeToIcon[key],
                      };
                    })}
                    components={{
                      /* eslint-disable */
                      Option: (props) => (
                        <Option {...props}>
                          <img src={props.data.icon} alt={props.data.label} />
                          <span style={{ marginLeft: 10 }}>
                            {props.data.label}
                          </span>
                        </Option>
                      ),
                      /* eslint-enable */
                    }}
                  />
                </div>
              )}
            </fieldset>

            <div className="translation-content">
              <textarea
                id="enter-translation"
                className="translation-content"
                value={textToWrite}
                onChange={(e) => setTextToWrite(e.target.value)}
              />
            </div>

            {possibleActions.length > 0 && (
              <p className="translation-header">{t('Translation state')}:</p>
            )}

            <fieldset>
              {statusItems.map(
                (item) =>
                  possibleActions.includes(item.value) && (
                    <div
                      style={{ display: 'inline' }}
                      onChange={(e) => setNewState(e.target.value)}
                    >
                      <label
                        data-status={item.value}
                        className={`translation-action${
                          newState === item.value ? ' active' : ''
                        }`}
                        htmlFor={`id_radio-${item.value}`}
                      >
                        {item.title}
                      </label>
                      <input
                        className="translation-action"
                        type="radio"
                        value={item.value}
                        name="translation-status"
                        id={`id_radio-${item.value}`}
                        checked={newState === item.value}
                      />
                    </div>
                  )
              )}
            </fieldset>
            {processing ? (
              <div className="spinner" />
            ) : (
              possibleActions.length > 0 && (
                <input
                  type="submit"
                  className="translation-save"
                  value={t('Save')}
                  onClick={onTranslationSave}
                />
              )
            )}
          </>
        )}
      </div>
    </section>
  );
}

TranslationEdit.defaultProps = {};
TranslationEdit.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.string,
    roleLang: PropTypes.string,
  }).isRequired,
  translationData: PropTypes.shape({
    id: PropTypes.number,
    key: PropTypes.string,
    file: PropTypes.string,
    line: PropTypes.number,
  }).isRequired,
  dataLanguage: PropTypes.string.isRequired,
  closeEditModal: PropTypes.func.isRequired,
  editCallback: PropTypes.func.isRequired,
};
export default TranslationEdit;
