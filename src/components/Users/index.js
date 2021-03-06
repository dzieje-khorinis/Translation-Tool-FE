import './style.scss';
import {useEffect, useState} from "react";
import {apiPathUserActivate, apiPathUsers, reactPathUserCreate} from "../../common/routes";
import {Link} from "react-router-dom";
import {useTranslation} from "react-i18next";
import {apiClient} from "../../common/apiClient";
import {roleCodeToText} from "../../common/utils";

function Users() {
    const {t} = useTranslation('common');
    const [processing, setProcessing] = useState(false);
    const [users, setUsers] = useState([]);
    const [usersProcessed, setUsersProcessed] = useState(new Set())

    useEffect(() => {
        setProcessing(true)
        apiClient.get(apiPathUsers).then(({status, data}) => {
            setProcessing(false)
            if (status === 200) {
                setUsers(data)
            }
        })
    }, [])

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

            if (status === 200) {
                let usersCopy = [...users]
                let user = {...usersCopy[index]}
                user.is_active = activate
                usersCopy[index] = user
                setUsers(usersCopy)
            }
        })
    }

    return (
        <>
            {
                processing ?
                    <div className="spinner"></div> :
                    <table className="generic">
                        <thead>
                        <tr>
                            <th>{t('User')}</th>
                            <th>{t('Role')}</th>
                            <th>{t('Activated')}</th>
                            <th>{t('Online')}</th>
                            <th>{t('Actions')}</th>
                        </tr>

                        </thead>
                        <tbody>
                        {
                            users.map((user, i) => {
                                let className = "odd"
                                if (i % 2 === 0) {
                                    className = "even"
                                }

                                return <tr key={i} className={className}>
                                    <td>{user.username}</td>
                                    <td>{roleCodeToText(user.role, user.role_related_language)}</td>
                                    <td className="bigFont">{user.is_active ? <span className="tick">???</span> : <span className="cross">???</span>}</td>
                                    <td></td>
                                    <td style={{width: "145px"}}>
                                        {
                                            usersProcessed.has(user.id) ?
                                                <p>...</p> :
                                                <p onClick={() => userActivation(user.id, !user.is_active, i)}
                                                   className="link">{user.is_active ? <span className="deactivate">{t('Deactivate')}</span> : <span className="activate">{t('Activate')}</span>}</p>
                                        }
                                    </td>

                                </tr>
                            })
                        }
                        </tbody>
                    </table>
            }


            <div className="centered"><span className="button"><Link to={reactPathUserCreate}>{t('Add User')}</Link></span></div>
        </>
    );
}

Users.propTypes = {}
export default Users;
