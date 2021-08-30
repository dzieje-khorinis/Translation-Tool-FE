import "./style.scss"
import {useTranslation} from "react-i18next";
import MaterialTable from "material-table";
import {forwardRef, useEffect, useState} from 'react';

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


function TranslationsTable({filters, tableRef, setAggregations, setTranslationsData, openEditModal, refreshTable, setRefreshTable}) {
    const {t} = useTranslation('common');

    const [page, setPage] = useState(0)

    useEffect(() => {
        tableRef.current.onChangePage({}, 0)
        // tableRef.current.onQueryChange()

    }, [filters, tableRef])

    useEffect(() => {
        if (refreshTable) {
            setRefreshTable(false)
            tableRef.current.onChangePage({}, page)
        }
    }, [page, refreshTable, setRefreshTable, tableRef])

    let dataLanguage = filters.dataLanguage || 'en'

    return (
        <section className="translation">

            {/*{*/}
            {/*    Object.keys(filters).map((key, i) => {*/}
            {/*        return <p>{key} | {filters[key]} | ({i})</p>*/}
            {/*    })*/}
            {/*}*/}
            {/*<p>Page: {page}</p>*/}
            {/*<button onClick={(e) => {setPage(page-1);tableRef.current.onChangePage({}, page-1)}}>LEWO</button>*/}
            {/*<button onClick={(e) => {setPage(page+1);tableRef.current.onChangePage({}, page+1)}}>PRAWO</button>*/}
            <div className="translation-wrapper">
                <MaterialTable
                    // page={3}
                    tableRef={tableRef}
                    icons={tableIcons}
                    title={t("Translations")}
                    // localization={{
                    //     toolbar: {
                    //         searchPlaceholder: "DUPA"
                    //     }
                    // }}
                    // onChangePage={(page, pageSize) => {
                    //     console.log(page, pageSize)
                    // }}
                    options={{
                        // page: 4,
                        // initialPage: 1,
                        search: false,
                        filtering: false,
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10],
                    }}
                    columns={[
                        {title: 'Key', field: 'key'},
                        {title: 'Value', field: `value_${dataLanguage}`},
                        {
                            title: 'State',
                            field: `state_${dataLanguage}`,
                            lookup: {
                                NEW: t('New'),
                                TODO: t('To do'),
                                READY_TO_REVIEW: t('Ready to review'),
                                NEEDS_WORK: t('Needs work'),
                                ACCEPTED: t('Accepted'),
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
                            console.log('query', query)
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
                                setPage(data.page-1)
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
