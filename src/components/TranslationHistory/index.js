import "./style.scss"
import {useTranslation} from "react-i18next";
import MaterialTable from "material-table";
import React, {forwardRef, createRef} from 'react';
import {apiPathTranslationHistory, apiPathTranslationSave} from "../../common/routes";
import Moment from 'react-moment';

import AddBox from '@material-ui/icons/AddBox';
import ArrowDownward from '@material-ui/icons/ArrowDownward';
import Check from '@material-ui/icons/Check';
import ChevronLeft from '@material-ui/icons/ChevronLeft';
import ChevronRight from '@material-ui/icons/ChevronRight';
import Clear from '@material-ui/icons/Clear';
import DeleteOutline from '@material-ui/icons/DeleteOutline';
import Edit from '@material-ui/icons/Edit';
import FilterList from '@material-ui/icons/FilterList';
import FirstPage from '@material-ui/icons/FirstPage';
import LastPage from '@material-ui/icons/LastPage';
import Remove from '@material-ui/icons/Remove';
import SaveAlt from '@material-ui/icons/SaveAlt';
import Search from '@material-ui/icons/Search';
import ViewColumn from '@material-ui/icons/ViewColumn';
import {apiClient} from "../../common/apiClient";
import {apiPathTranslations} from "../../common/routes";
import {thickPartOfText} from "../../common/utils";
import {LANGUAGES, ROLE_ADMIN, STATUSES} from "../../common/constants";


const tableIcons = {
    Add: forwardRef((props, ref) => <AddBox {...props} ref={ref}/>),
    Check: forwardRef((props, ref) => <Check {...props} ref={ref}/>),
    Clear: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref}/>),
    DetailPanel: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    Edit: forwardRef((props, ref) => <Edit {...props} ref={ref}/>),
    Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref}/>),
    Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref}/>),
    FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref}/>),
    LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref}/>),
    NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref}/>),
    PreviousPage: forwardRef((props, ref) => <ChevronLeft {...props} ref={ref}/>),
    ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref}/>),
    Search: forwardRef((props, ref) => <Search {...props} ref={ref}/>),
    SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref}/>),
    ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref}/>),
    ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref}/>)
};

function TranslationHistory({dataLanguage, translationId}) {
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

    return (
       
       <MaterialTable
            icons={tableIcons}
            title={t("History")}
            components={{
                Toolbar: props => (<></>),
            }}
            localization={{
                header: {
                    actions: t('Actions'),
                },
                pagination: {
                    nextTooltip: t('Next Page'),
                    previousTooltip: t('Previous Page'),
                    firstTooltip: t('First Page'),
                    lastTooltip: t('Last Page'),
                },
                body: {
                    emptyDataSourceMessage: t('No records to display'),
                },
            }}
            options={{
                search: false,
                filtering: false,
                pageSize: 10,
                emptyRowsWhenPaging: false,
                pageSizeOptions: [10],
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
                {
                    title: t('User'),
                    field: `user`,
                    render: rowData => rowData?.user?.username,
                },
                {
                    title: t('Changes'),
                    field: `diff`,
                    render: rowData => {
                        const rows = rowData.diff.map((v, i) => {
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
                                <p></p>//<{t('Created')}
                            }
                            </>
                        )
                    }
                    
                }
            ]}
            data={query =>
                new Promise((resolve, reject) => {
                    let requestData = {
                        per_page: query.pageSize,
                        page: query.page + 1,
                        order_by: query.orderBy?.field || "",
                        order_direction: query.orderDirection || "asc",
                        translation_id: translationId,
                    }
                    apiClient.get(apiPathTranslationHistory, requestData).then(({status, data}) => {
                        resolve({
                            data: data.data,
                            page: data.page - 1,
                            totalCount: data.total,
                        })
                    })
                })
            }
        />
       
    )
}

TranslationHistory.propTypes = {}
export default TranslationHistory;
