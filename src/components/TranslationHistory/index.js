import "./style.scss"
import {useTranslation} from "react-i18next";
import React, {forwardRef, createRef} from 'react';
import {apiPathTranslationHistory, apiPathTranslationSave} from "../../common/routes";
import Moment from 'react-moment';


import {thickPartOfText} from "../../common/utils";
import {LANGUAGES, ROLE_ADMIN, STATUSES} from "../../common/constants";
import DataTable from "../DataTable";


function TranslationHistory({dataLanguage, tableRef, filters, translationId, userId, showTranslationKey}) {
    const {t} = useTranslation('common')

    const statuses = STATUSES()

    const formatFieldName = fieldName => {
        const [name, language] = fieldName.split('_')
        if (name == "state") {
            return (
                <p>{t('State')}<span className="languageBag">{language}</span></p>
            )
        } else if(name == "value") {
            return (
                <p>{t('Value')}<span className="languageBag">{language}</span></p>
            )
        }
        return fieldName
    }

    let extraColumns = []
    if (!userId) {
        extraColumns.push({
            title: t('User'),
            field: `user`,
            render: rowData => thickPartOfText(rowData?.user?.username, filters?.username || ""),
        })
    }
    if (showTranslationKey) {
        extraColumns.push({
            title: t('Key'),
            field: 'key',
            render: rowData => thickPartOfText(rowData?.key, filters?.key || ""),
        })
    }

    return (
        <DataTable
            dataUrl={apiPathTranslationHistory}
            title={t("History")}
            tableRef={tableRef}
            options={{
                sorting: false,
            }}
            columns={[
                {
                    title: t('Date'),
                    field: 'date',
                    render: rowData => (
                        <div>
                            <p><Moment format="YYYY-MM-DD">{rowData.date}</Moment></p>
                            <p><Moment format="HH:mm:ss">{rowData.date}</Moment></p>
                        </div>
                    )
                },
                ...extraColumns,
                {
                    title: t('Changes'),
                    field: `diff`,
                    render: rowData => {
                        const rows = rowData.diff.sort((a, b) => {
                            return a.field > b.field
                        }).map((v, i) => {
                            return <tr key={i}>
                                <td>{formatFieldName(v.field)}</td>
                                {
                                    v.field.startsWith('state_') ?
                                    <>
                                        <td><span data-status={v.old} className="status">{statuses.get(v.old)}</span></td>
                                        <td><span data-status={v.new} className="status">{statuses.get(v.new)}</span></td>
                                    </>
                                    :
                                    <>
                                        <td>{v.old}</td>
                                        <td>{v.new}</td>
                                    </>
                                }
                                
                            </tr>
                        })
                        return (
                            <>
                            {
                                rows.length ?
                                <table class="diffTable">
                                    <tr>
                                        <th>{t('Field')}</th>
                                        <th>{t('Old value')}</th>
                                        <th>{t('New value')}</th>
                                    </tr>
                                    {rows}
                                </table>
                                :
                                <p>
                                    {rowData.type==='+' && t('Created')}
                                    {rowData.type==='~' && t('Unknown changes')}
                                </p>
                            }
                            </>
                        )
                    }
                    
                }
            ]}
            filters={{
                ...(translationId && {translation_id: translationId}),
                ...(userId && {user_id: userId}),
            }}
        />

    )
}

TranslationHistory.propTypes = {}
export default TranslationHistory;
