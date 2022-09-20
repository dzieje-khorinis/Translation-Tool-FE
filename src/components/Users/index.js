import './style.scss';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  apiPathUserActivate,
  apiPathUsers,
  reactPathUserCreate,
} from '../../common/routes';
import { apiClient } from '../../common/apiClient';
import { roleCodeToText } from '../../common/utils';
import historyIcon from '../../static/images/history.svg';
import closeIcon from '../../static/images/x-solid.svg';
import TranslationHistory from '../TranslationHistory';
import DataTable from '../DataTable';

function Users() {
  const { t } = useTranslation('common');
  const [users, setUsers] = useState([]);
  const [usersProcessed, setUsersProcessed] = useState(new Set());
  const [historyViewOpen, setHistoryViewOpen] = useState(false);

  const [userId, setUserId] = useState();
  const [username, setUsername] = useState();

  const openHistory = (newUserId, newUsername) => {
    setUsername(newUsername);
    setUserId(newUserId);
    setHistoryViewOpen(true);
  };

  const userActivation = (newUserId, activate) => {
    setUsersProcessed((prevState) => {
      const usersProcessedCopy = new Set(prevState);
      usersProcessedCopy.add(newUserId);
      return usersProcessedCopy;
    });

    apiClient
      .post(apiPathUserActivate, { user_id: userId, activate })
      .then(() => {
        setUsersProcessed((prevState) => {
          const usersProcessedCopy = new Set(prevState);
          usersProcessedCopy.delete(userId);
          return usersProcessedCopy;
        });

        setUsers((prevState) => {
          const user = {};
          user[userId] = {
            ...prevState[userId],
            is_active: activate,
          };
          return {
            ...prevState,
            ...user,
          };
        });
      });
  };

  return (
    <>
      <div className="users-wrapper">
        <div className="users-actions">
          <span className="button">
            <Link to={reactPathUserCreate}>{t('Add User')}</Link>
          </span>
        </div>

        <DataTable
          dataUrl={apiPathUsers}
          title={t('Users')}
          options={{
            sorting: false,
          }}
          columns={[
            {
              title: t('User'),
              field: 'user',
              render: (rowData) =>
                users[rowData.id].is_active ? (
                  <span className="active">{rowData.username}</span>
                ) : (
                  <span className="inactive">{rowData.username}</span>
                ),
            },
            {
              title: t('Role'),
              field: 'role',
              render: (rowData) => (
                <>
                  {roleCodeToText(rowData.role)}
                  <span className="languageBag">
                    {rowData.role_related_language}
                  </span>
                </>
              ),
            },
            {
              title: t('Online'),
            },
            {
              title: t('Actions'),
              render: (rowData) => (
                <div style={{ display: 'flex' }}>
                  <span
                    onClick={() => openHistory(rowData.id, rowData.username)}
                    className="link history_view"
                  >
                    <img title={t('History')} src={historyIcon} alt="" />
                  </span>

                  {usersProcessed.has(rowData.id) ? (
                    <p className="activation">...</p>
                  ) : (
                    <p className="activation link">
                      {users[rowData.id].is_active ? (
                        <span
                          onClick={() =>
                            userActivation(
                              rowData.id,
                              !users[rowData.id].is_active,
                              rowData.tableData.id
                            )
                          }
                          className="activation deactivate"
                        >
                          {t('Deactivate')}
                        </span>
                      ) : (
                        <span
                          onClick={() =>
                            userActivation(
                              rowData.id,
                              !users[rowData.id].is_active,
                              rowData.tableData.id
                            )
                          }
                          className="activation activate"
                        >
                          {t('Activate')}
                        </span>
                      )}
                    </p>
                  )}
                </div>
              ),
            },
          ]}
          dataReceiveCallback={(data) => {
            setUsers(
              /* eslint-disable no-param-reassign */
              data.data.reduce((map, obj) => {
                map[obj.id] = obj;
                return map;
              }, {})
              /* eslint-enable no-param-reassign */
            );
          }}
        />
      </div>

      {historyViewOpen && (
        <section
          className="history-modal"
          onClick={() => setHistoryViewOpen(false)}
        >
          <div className="history-wrapper" onClick={(e) => e.stopPropagation()}>
            <span
              onClick={() => setHistoryViewOpen(false)}
              className="link close_modal"
            >
              <img title={t('Close')} src={closeIcon} alt="" />
            </span>
            <p className="username">{username}</p>

            <TranslationHistory userId={userId} />
          </div>
        </section>
      )}
    </>
  );
}

Users.propTypes = {};
export default Users;
