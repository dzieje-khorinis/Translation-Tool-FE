import "./style.scss"
import {useTranslation} from "react-i18next";
import MaterialTable from "material-table";
import React, {forwardRef} from 'react';

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


function TranslationsTable({
                               filters,
                               tableRef,
                               setAggregations,
                               setTranslationsData,
                               openEditModal,
                               refreshTable,
                               setRefreshTable,
                               setPageState,
                           }) {
    const {t} = useTranslation('common');

    let dataLanguage = filters.dataLanguage || 'en'

    return (
        <section className="translation">
            <div className="translation-wrapper">
                <MaterialTable
                    // page={3}
                    tableRef={tableRef}
                    icons={tableIcons}
                    title={t("Translations")}
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
                            title: t('Key'),
                            field: 'key',
                            render: rowData => thickPartOfText(rowData.key, filters.searchTerm)
                        },
                        {
                            title: t('Value'),
                            field: `value_${dataLanguage}`,
                            render: rowData => thickPartOfText(rowData[`value_${dataLanguage}`], filters.searchTerm)
                        },
                        {
                            title: t('State'),
                            field: `state_${dataLanguage}`,
                            lookup: {
                                NEW: <span className="status" data-status="NEW">{t('New')}</span>,
                                TODO: <span className="status" data-status="TODO">{t('To do')}</span>,
                                READY_TO_REVIEW: <span className="status"
                                                       data-status="READY_TO_REVIEW">{t('Ready to review')}</span>,
                                NEEDS_WORK: <span className="status" data-status="NEEDS_WORK">{t('Needs work')}</span>,
                                ACCEPTED: <span className="status" data-status="ACCEPTED">{t('Accepted')}</span>,
                            }
                        }
                    ]}
                    actions={[
                        {
                            icon: Edit,
                            tooltip: t('Edit'),
                            onClick: (event, rowData) => openEditModal(rowData)
                        }
                    ]}
                    data={query =>
                        new Promise((resolve, reject) => {
                            console.log('query', query, 'filters', filters)
                            let requestData = {
                                per_page: query.pageSize,
                                page: query.page + 1,
                                order_by: query.orderBy?.field || "",
                                order_direction: query.orderDirection || "asc",
                                ...filters,
                            }
                            apiClient.get(apiPathTranslations, requestData).then(({status, data}) => {
                                setAggregations(data.aggregations)
                                setTranslationsData(data.data)
                                setPageState(data.page - 1)
                                resolve({
                                    data: data.data,
                                    page: data.page - 1,
                                    totalCount: data.total,
                                })
                            })
                        })
                    }
                />
            </div>
        </section>
    )
}

export default TranslationsTable;
