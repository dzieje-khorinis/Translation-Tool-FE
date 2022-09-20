import './style.scss';
import {useState} from "react";
import {apiPathUserActivate, apiPathUsers, reactPathUserCreate} from "../../common/routes";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {apiClient} from "../../common/apiClient";
import {roleCodeToText} from "../../common/utils";
import historyIcon from "../../static/images/history.svg"
import closeIcon from "../../static/images/x-solid.svg"
import TranslationHistory from '../TranslationHistory';
import DataTable from '../DataTable';


function Users() {
    const {t} = useTranslation('common');
    const [users, setUsers] = useState([]);
    const [usersProcessed, setUsersProcessed] = useState(new Set())
    const [historyViewOpen, setHistoryViewOpen] = useState(false)

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

                <DataTable
                    dataUrl={apiPathUsers}
                    title={t("Users")}
                    options={{
                        sorting: false,
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
                    dataReceiveCallback={(data) => {
                        setUsers(data.data.reduce(function(map, obj) {
                            map[obj.id] = obj;
                            return map;
                        }, {}))
                    }}
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
