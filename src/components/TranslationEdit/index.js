import "./style.scss"
import {useTranslation} from "react-i18next";
import {LANGUAGES, ROLE_ADMIN, ROLE_COORDINATOR, ROLE_TRANSLATOR, STATUSES} from "../../common/constants";
import {useEffect, useState} from "react";
import {apiClient} from "../../common/apiClient";
import {apiPathTranslationSave} from "../../common/routes";

function TranslationEdit({user, dataLanguage, translationData, closeEditModal, editCallback}) {
    const {t} = useTranslation('common');

    const [processing, setProcessing] = useState(false)

    const [languageToRead, setLanguageToRead] = useState(dataLanguage)
    const [languageToWrite, setLanguageToWrite] = useState(dataLanguage)

    const [textToRead, setTextToRead] = useState(translationData[`value_${dataLanguage}`])
    const [textToWrite, setTextToWrite] = useState(translationData[`value_${dataLanguage}`])
    const [newState, setNewState] = useState(translationData[`state_${dataLanguage}`])

    useEffect(() => {
        setTextToRead(translationData[`value_${languageToRead}`])
    }, [languageToRead, translationData])

    useEffect(() => {
        setTextToWrite(translationData[`value_${languageToWrite}`])
        setNewState(translationData[`state_${languageToWrite}`])
    }, [languageToWrite, translationData])

    const statusCode = translationData[`state_${languageToWrite}`]

    // const value = translationData[`value_${dataLanguage}`]
    const languages = LANGUAGES()
    let languageItems = [...languages.keys()].map(langCode => {
        return {
            value: langCode,
            title: languages.get(langCode)
        }
    })

    const statuses = STATUSES()
    let statusItems = [...statuses.keys()].map(statusCode => {
        return {
            value: statusCode,
            title: statuses.get(statusCode)
        }
    })

    function getPossibleActions() {
        let possibleActions = []
        if (user.role <= ROLE_COORDINATOR && languageToWrite !== user.roleLang) {
            return possibleActions
        }

        if (user.role === ROLE_TRANSLATOR && statusCode === 'ACCEPTED') {
            return possibleActions
        }
        possibleActions.push('TODO', 'READY_TO_REVIEW')
        if (user.role === ROLE_TRANSLATOR) {
            return possibleActions
        }
        possibleActions.push('NEEDS_WORK', 'ACCEPTED')
        if (user.role === ROLE_COORDINATOR) {
            return possibleActions
        }
        possibleActions = ['NEW', ...possibleActions]
        return possibleActions
    }

    let possibleActions = getPossibleActions()

    const onTranslationSave = (e) => {
        console.log('onTranslationSave')
        console.log('newState', newState)
        console.log('textToWrite', textToWrite)
        console.log('languageToWrite', languageToWrite)

        setProcessing(true)
        apiClient.post(apiPathTranslationSave, {
            translation_id: translationData.id,
            state: newState,
            text: textToWrite,
            language: languageToWrite,
        }).then(({status, data}) => {
            setProcessing(false)
            closeEditModal()
            editCallback()
        })

    }

    return (
        <section className="translation-editor" onClick={e => closeEditModal()}>
            <div className="translation-wrapper" onClick={e => e.stopPropagation()}>
                <h3 className="translation-header">{translationData.key}<span id="translation-status"
                                                                              data-status={statusCode}>{statuses.get(statusCode)}</span>
                </h3>
                <p className="filepath">{translationData.file}:{translationData.line}</p>
                <br/>
                <fieldset>
                    <label className="translation-header" htmlFor="id_read_translation">{t('Show translation')}:</label>
                    <select name="read_translation" id="id_read_translation" value={languageToRead}
                            onChange={(e) => setLanguageToRead(e.target.value)}>
                        {
                            languageItems.map((item, i) => <option key={i} value={item.value}>{item.title}</option>)
                        }
                    </select>
                </fieldset>

                <div className="translation-content">
                    <textarea id="show-translation" className="translation-content" disabled value={textToRead}/>
                </div>


                <fieldset>
                    <label className="translation-header"
                           htmlFor="id_write_translation">{t('Enter translation')}{user.role < ROLE_ADMIN && ` (${t('English')})`}:</label>

                    {
                        user.role >= ROLE_ADMIN &&
                        <select name="rite_translation" id="id_write_translation" value={languageToWrite}
                                onChange={(e) => setLanguageToWrite(e.target.value)}>
                            {
                                languageItems.map((item, i) => <option key={i} value={item.value}>{item.title}</option>)
                            }

                        </select>
                    }
                </fieldset>


                <div className="translation-content">
                    <textarea id="enter-translation" className="translation-content" value={textToWrite}
                              onChange={(e) => setTextToWrite(e.target.value)}/>
                </div>


                {/*<p>{roleIdToText(user.role, user.roleLang)}</p>*/}
                {
                    possibleActions.length > 0 &&
                    <label className="translation-header">{t('Translation state')}:</label>
                }

                <fieldset>
                    {
                        statusItems.map((item, i) =>
                            (
                                possibleActions.includes(item.value) &&
                                <div style={{display: "inline"}} onChange={e => setNewState(e.target.value)}>
                                    <label className={`translation-action${newState === item.value ? ' active' : ''}`}
                                           htmlFor={`id_radio-${item.value}`}>{item.title}</label>
                                    <input className="translation-action" type="radio" value={item.value}
                                           name="translation-status"
                                           id={`id_radio-${item.value}`} checked={newState === item.value}/>
                                </div>
                            )
                        )
                    }
                </fieldset>


                {
                    processing ? <div className="spinner"></div>
                        :
                        possibleActions.length > 0 &&
                        <input type="submit" className="translation-save" value={t('Save')}
                               onClick={onTranslationSave}/>

                }


            </div>
        </section>
    )
}

TranslationEdit.propTypes =
    {}
export default TranslationEdit;
