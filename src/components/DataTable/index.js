import './style.scss';
import { useTranslation } from 'react-i18next';
import MaterialTable from 'material-table';
import React, { forwardRef } from 'react';

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
import PropTypes from 'prop-types';
import { apiClient } from '../../common/apiClient';

/* eslint-disable react/jsx-props-no-spreading */
const tableIcons = {
  Add: forwardRef((props, ref) => <AddBox {...props} ref={ref} />),
  Check: forwardRef((props, ref) => <Check {...props} ref={ref} />),
  Clear: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Delete: forwardRef((props, ref) => <DeleteOutline {...props} ref={ref} />),
  DetailPanel: forwardRef((props, ref) => (
    <ChevronRight {...props} ref={ref} />
  )),
  Edit: forwardRef((props, ref) => <Edit {...props} ref={ref} />),
  Export: forwardRef((props, ref) => <SaveAlt {...props} ref={ref} />),
  Filter: forwardRef((props, ref) => <FilterList {...props} ref={ref} />),
  FirstPage: forwardRef((props, ref) => <FirstPage {...props} ref={ref} />),
  LastPage: forwardRef((props, ref) => <LastPage {...props} ref={ref} />),
  NextPage: forwardRef((props, ref) => <ChevronRight {...props} ref={ref} />),
  PreviousPage: forwardRef((props, ref) => (
    <ChevronLeft {...props} ref={ref} />
  )),
  ResetSearch: forwardRef((props, ref) => <Clear {...props} ref={ref} />),
  Search: forwardRef((props, ref) => <Search {...props} ref={ref} />),
  SortArrow: forwardRef((props, ref) => <ArrowDownward {...props} ref={ref} />),
  ThirdStateCheck: forwardRef((props, ref) => <Remove {...props} ref={ref} />),
  ViewColumn: forwardRef((props, ref) => <ViewColumn {...props} ref={ref} />),
};
/* eslint-enable react/jsx-props-no-spreading */

function DataTable({
  tableRef,
  title,
  options,
  columns,
  actions,
  dataUrl,
  filters,
  dataReceiveCallback,
}) {
  const { t } = useTranslation('common');
  return (
    <MaterialTable
      tableRef={tableRef}
      icons={tableIcons}
      title={title}
      components={{
        Toolbar: () => null,
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
        draggable: false,
        pageSize: 10,
        emptyRowsWhenPaging: false,
        pageSizeOptions: [10],
        ...options,
      }}
      columns={columns}
      actions={actions}
      data={(query) =>
        new Promise((resolve) => {
          const requestData = {
            per_page: query.pageSize,
            page: query.page + 1,
            order_by: query.orderBy?.field || '',
            order_direction: query.orderDirection || 'asc',
            ...filters,
          };
          apiClient.get(dataUrl, requestData).then(({ data }) => {
            if (dataReceiveCallback) {
              dataReceiveCallback(data);
            }
            resolve({
              data: data.data,
              page: data.page - 1,
              totalCount: data.total,
            });
          });
        })
      }
    />
  );
}

DataTable.defaultProps = {
  dataReceiveCallback: () => {},
  filters: {},
  options: {},
  columns: [],
  actions: [],
  tableRef: null,
};

DataTable.propTypes = {
  filters: PropTypes.shape({
    searchTerm: PropTypes.string,
  }),
  options: PropTypes.shape({
    search: PropTypes.bool,
  }),

  columns: PropTypes.arrayOf(
    PropTypes.shape({
      title: PropTypes.string,
      field: PropTypes.string,
      render: PropTypes.func,
    })
  ),
  actions: PropTypes.arrayOf(
    PropTypes.shape({
      icon: PropTypes.shape({}),
      tooltip: PropTypes.string,
      onClick: PropTypes.func,
    })
  ),
  tableRef: PropTypes.shape({
    current: PropTypes.instanceOf(Element),
  }),
  title: PropTypes.string.isRequired,
  dataReceiveCallback: PropTypes.func,
  dataUrl: PropTypes.string.isRequired,
};
export default DataTable;
