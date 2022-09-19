import './style.scss';
import {useEffect, useState, forwardRef} from "react";
import {apiPathUserActivate, apiPathUsers, reactPathUserCreate} from "../../common/routes";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {apiClient} from "../../common/apiClient";
import {roleCodeToText} from "../../common/utils";
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
import {apiPathTranslations} from "../../common/routes";
import {thickPartOfText} from "../../common/utils";
import {LANGUAGES, ROLE_ADMIN, STATUSES} from "../../common/constants";
import MaterialTable from "material-table";
import historyIcon from "../../static/images/history.svg"
import closeIcon from "../../static/images/x-solid.svg"
import TranslationHistory from '../TranslationHistory';


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


function Users() {
    const {t} = useTranslation('common');
    const [processing, setProcessing] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersProcessed, setUsersProcessed] = useState(new Set())

    const [historyViewOpen, setHistoryViewOpen] = useState(false)
    const [historyData, setHistoryData] = useState([])

    const [userId, setUserId] = useState();
    const [username, setUsername] = useState();

    const openHistory = (userId, username) => {
        setUsername(username)
        setUserId(userId)
        setHistoryViewOpen(true)
    }


    const userActivation = (userId, activate, index) => {
        
        setUsersProcessed(users => {
            let usersProcessedCopy = new Set(users)
            usersProcessedCopy.add(userId)
            return usersProcessedCopy
        })
        
        apiClient.post(apiPathUserActivate, {user_id: userId, activate: activate}).then(({status, data}) => {
            setUsersProcessed(users => {
                let usersProcessedCopy = new Set(users)
                usersProcessedCopy.delete(userId)
                return usersProcessedCopy
            })

            setUsers(prevState => {
                const user = {}
                user[userId] = {
                    ...prevState[userId],
                    is_active: activate,
                }
                return {
                    ...prevState,
                    ...user,
                }
            })
        })
    }

    return (
        <>
            <div className="users-wrapper">
                <div className="users-actions">
                    <span className="button"><Link to={reactPathUserCreate}>{t('Add User')}</Link></span>
                </div>

                <MaterialTable
                    icons={tableIcons}
                    title={t("Users")}
                    // tableRef={tableRef}
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
                        sorting: false,
                        draggable: false,
                        pageSize: 10,
                        emptyRowsWhenPaging: false,
                        pageSizeOptions: [10],
                    }}
                    columns={[
                        {
                            title: t('User'),
                            field: 'user',
                            render: rowData => <>{users[rowData.id].is_active ? <span className="active">{rowData.username}</span> : <span className="inactive">{rowData.username}</span>}</>,
                        },
                        {
                            title: t('Role'),
                            field: `role`,
                            render: rowData => <>{roleCodeToText(rowData.role)}<span className="languageBag">{rowData.role_related_language}</span></>,
                        },
                        {
                            title: t('Online'),
                        },
                        {
                            title: t('Actions'),
                            render: rowData => {
                                return <div style={{display: 'flex'}}>
                                    <span onClick={e => openHistory(rowData.id, rowData.username)} className="link history_view"><img title={t('History')} src={historyIcon}/></span>

                                    {
                                        usersProcessed.has(rowData.id) ?
                                            <p className="activation">...</p> :
                                            <p className="activation link">
                                                {
                                                users[rowData.id].is_active
                                                ? <span onClick={() => userActivation(rowData.id, !users[rowData.id].is_active, rowData.tableData.id)} className="activation deactivate">{t('Deactivate')}</span>
                                                : <span onClick={() => userActivation(rowData.id, !users[rowData.id].is_active, rowData.tableData.id)} className="activation activate">{t('Activate')}</span>
                                                }
                                            </p>
                                    }


                                </div>
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
                            }
                            apiClient.get(apiPathUsers, requestData).then(({status, data}) => {
                                setUsers(data.data.reduce(function(map, obj) {
                                    map[obj.id] = obj;
                                    return map;
                                }, {}))
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

            {
                historyViewOpen &&
                <section className="history-modal" onClick={e => setHistoryViewOpen(false)}>
                    <div className="history-wrapper" onClick={e => e.stopPropagation()}>
                        
                        <span onClick={e => setHistoryViewOpen(false)} className="link close_modal"><img title={t('Close')} src={closeIcon}/></span>
                        <p className='username'>{username}</p>
        
                        <TranslationHistory
                            userId={userId}
                        />
                    </div>
                </section>
            }
        </>
    );
}

Users.propTypes = {}
export default Users;
