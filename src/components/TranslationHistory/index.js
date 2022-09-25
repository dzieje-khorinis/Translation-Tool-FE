import './style.scss';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Moment from 'react-moment';
import PropTypes from 'prop-types';
import { apiPathTranslationHistory } from '../../common/routes';

import { thickPartOfText } from '../../common/utils';
import { STATUSES } from '../../common/constants';
import DataTable from '../DataTable';

function TranslationHistory({
  tableRef,
  filters,
  translationId,
  userId,
  showTranslationKey,
}) {
  const { t } = useTranslation('common');

  const statuses = STATUSES();

  const formatFieldName = (fieldName) => {
    const [name, language] = fieldName.split('_');
    if (name === 'state') {
      return (
        <p>
          {t('State')}
          <span className="languageBag">{language}</span>
        </p>
      );
    }
    if (name === 'value') {
      return (
        <p>
          {t('Value')}
          <span className="languageBag">{language}</span>
        </p>
      );
    }
    return fieldName;
  };

  const extraColumns = [];
  if (!userId) {
    extraColumns.push({
      title: t('User'),
      field: 'user',
      render: (rowData) =>
        thickPartOfText(rowData?.user?.username, filters?.username || ''),
    });
  }
  if (showTranslationKey) {
    extraColumns.push({
      title: t('Key'),
      field: 'key',
      render: (rowData) => thickPartOfText(rowData?.key, filters?.key || ''),
    });
  }

  return (
    <DataTable
      dataUrl={apiPathTranslationHistory}
      title={t('History')}
      tableRef={tableRef}
      options={{
        sorting: false,
      }}
      columns={[
        {
          title: t('Date'),
          field: 'date',
          render: (rowData) => (
            <div>
              <p>
                <Moment format="YYYY-MM-DD">{rowData.date}</Moment>
              </p>
              <p>
                <Moment format="HH:mm:ss">{rowData.date}</Moment>
              </p>
            </div>
          ),
        },
        ...extraColumns,
        {
          title: t('Changes'),
          field: 'diff',
          render: (rowData) => {
            const rows = rowData.diff
              .sort((a, b) => a.field > b.field)
              .map((v) => (
                <tr>
                  <td>{formatFieldName(v.field)}</td>
                  {v.field.startsWith('state_') ? (
                    <>
                      <td>
                        <span data-status={v.old} className="status">
                          {statuses.get(v.old)}
                        </span>
                      </td>
                      <td>
                        <span data-status={v.new} className="status">
                          {statuses.get(v.new)}
                        </span>
                      </td>
                    </>
                  ) : (
                    <>
                      <td>{v.old}</td>
                      <td>{v.new}</td>
                    </>
                  )}
                </tr>
              ));
            return rows.length ? (
              <table className="diffTable">
                <thead>
                  <tr>
                    <th>{t('Field')}</th>
                    <th>{t('Old value')}</th>
                    <th>{t('New value')}</th>
                  </tr>
                </thead>
                <tbody>{rows}</tbody>
              </table>
            ) : (
              <p>
                {rowData.type === '+' && t('Created')}
                {rowData.type === '~' && t('Unknown changes')}
              </p>
            );
          },
        },
      ]}
      filters={{
        ...(translationId && { translation_id: translationId }),
        ...(userId && { user_id: userId }),
        ...filters,
      }}
    />
  );
}

TranslationHistory.defaultProps = {
  tableRef: null,
  filters: {},
  translationId: undefined,
  userId: undefined,
  showTranslationKey: false,
};
TranslationHistory.propTypes = {
  tableRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]),

  filters: PropTypes.shape({
    language: PropTypes.string.isRequired,
    startDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    endDate: PropTypes.oneOfType([PropTypes.number, PropTypes.string])
      .isRequired,
    username: PropTypes.string,
    key: PropTypes.string,
  }),
  translationId: PropTypes.number,
  userId: PropTypes.number,
  showTranslationKey: PropTypes.bool,
};
export default TranslationHistory;
