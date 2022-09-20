import './style.scss';
import { useTranslation } from 'react-i18next';
import React from 'react';
import Edit from '@material-ui/icons/Edit';
import PropTypes from 'prop-types';
import { apiPathTranslations } from '../../common/routes';
import { thickPartOfText } from '../../common/utils';
import DataTable from '../DataTable';

function TranslationsTable({
  filters,
  tableRef,
  setAggregations,
  openEditModal,
  setPageState,
}) {
  const { t } = useTranslation('common');

  const dataLanguage = filters.dataLanguage || 'en';

  return (
    <section className="translation">
      <div className="translation-wrapper">
        <DataTable
          dataUrl={apiPathTranslations}
          tableRef={tableRef}
          title={t('Translations')}
          columns={[
            {
              title: t('Key'),
              field: 'key',
              render: (rowData) =>
                thickPartOfText(rowData.key, filters.searchTerm),
            },
            {
              title: t('Value'),
              field: `value_${dataLanguage}`,
              render: (rowData) =>
                thickPartOfText(
                  rowData[`value_${dataLanguage}`],
                  filters.searchTerm
                ),
            },
            {
              title: t('State'),
              field: `state_${dataLanguage}`,
              lookup: {
                NEW: (
                  <span className="status" data-status="NEW">
                    {t('New')}
                  </span>
                ),
                TODO: (
                  <span className="status" data-status="TODO">
                    {t('To do')}
                  </span>
                ),
                READY_TO_REVIEW: (
                  <span className="status" data-status="READY_TO_REVIEW">
                    {t('Ready to review')}
                  </span>
                ),
                NEEDS_WORK: (
                  <span className="status" data-status="NEEDS_WORK">
                    {t('Needs work')}
                  </span>
                ),
                ACCEPTED: (
                  <span className="status" data-status="ACCEPTED">
                    {t('Accepted')}
                  </span>
                ),
              },
            },
          ]}
          actions={[
            {
              icon: Edit,
              tooltip: t('Edit'),
              onClick: (event, rowData) => openEditModal(rowData),
            },
          ]}
          filters={filters}
          dataReceiveCallback={(data) => {
            setAggregations(data.aggregations);
            setPageState(data.page - 1);
          }}
        />
      </div>
    </section>
  );
}

TranslationsTable.propTypes = {
  filters: PropTypes.exact({
    dataLanguage: PropTypes.string.isRequired,
    searchTerm: PropTypes.string.isRequired,
  }).isRequired,
  tableRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
  setAggregations: PropTypes.func.isRequired,
  openEditModal: PropTypes.func.isRequired,
  setPageState: PropTypes.func.isRequired,
};
export default TranslationsTable;
