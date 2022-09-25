import './style.scss';
import { useTranslation } from 'react-i18next';
import React, { useEffect, useState } from 'react';
import Select, { components } from 'react-select';
import { Chart } from 'react-google-charts';
import PropTypes from 'prop-types';
import AutoInput from '../AutoInput';
import {
  apiPathFilePathsSearch,
  apiPathFileTreeNodes,
  apiPathFileTreeRoot,
} from '../../common/routes';
import { LANGUAGES, ROLE_ADMIN, STATUSES } from '../../common/constants';
import { langCodeToIcon, langCodeToLangName } from '../../common/utils';
import FileTree from '../FileTree';

const { Option } = components;

function SidePane({ user, filters, setFilters, aggregations, themeName }) {
  const { t } = useTranslation('common');

  const [searchTermTemp, setSearchTermTemp] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (searchTermTemp !== filters.searchTerm) {
        setFilters({ searchTerm: searchTermTemp });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [filters.searchTerm, searchTermTemp, setFilters]);

  const statuses = STATUSES();
  const statusItems = [...statuses.keys()].map((statusCode) => {
    return {
      value: statusCode,
      label: statuses.get(statusCode),
    };
  });

  const languages = LANGUAGES();
  const dataLang = filters.dataLanguage;

  return (
    <section className="side-pane">
      <div className="input_wrapper">
        <label htmlFor="id_state_lang">{t('DATA LANGUAGE')}</label>
        {user.role >= ROLE_ADMIN ? (
          <Select
            value={{
              value: dataLang,
              label: `${languages.get(dataLang)} (${dataLang})`,
            }}
            isDisabled={false}
            isLoading={false}
            isClearable={false}
            isRtl={false}
            isSearchable={false}
            onChange={(option) => {
              setFilters({ dataLanguage: option.value });
            }}
            options={Array.from(languages).map(([key, value]) => {
              return {
                value: key,
                label: `${value} (${key})`,
                icon: langCodeToIcon[key],
              };
            })}
            components={{
              /* eslint-disable */
              Option: (props) => (
                <Option {...props}>
                  <img src={props.data.icon} alt={props.data.label} />
                  <span style={{ marginLeft: 10 }}>{props.data.label}</span>
                </Option>
              ),
              /* eslint-enable */
            }}
          />
        ) : (
          <p>
            {langCodeToLangName(user.roleLang)} ({user.roleLang})
          </p>
        )}
      </div>

      <div className="input_wrapper">
        <label htmlFor="id_search">{t('SEARCH TERM')}</label>
        <input
          className="custom_input"
          id="id_search"
          name="search"
          type="text"
          value={searchTermTemp}
          onChange={(e) => setSearchTermTemp(e.target.value)}
        />
      </div>

      <div className="input_wrapper">
        <label htmlFor="id_group">{t('FILEPATH')}</label>
        <AutoInput
          language={filters.dataLanguage}
          name="path"
          url={apiPathFilePathsSearch}
          value={filters.path}
          setValue={(value) => {
            setFilters({ path: value });
          }}
          optionName="path"
        />
      </div>

      <div className="input_wrapper">
        <label htmlFor="id_group">{t('FILE TREE')}</label>
        <FileTree
          rootUrl={apiPathFileTreeRoot}
          getChildrenUrl={(parentId) =>
            apiPathFileTreeNodes.replace('{parent_id}', parentId)
          }
          filters={filters}
          setFilters={setFilters}
        />
      </div>

      <div className="input_wrapper">
        <label htmlFor="id_state">{t('STATE')}</label>
        <Select
          placeholder=""
          options={statusItems}
          value={filters.states.map((element) => {
            return {
              value: element,
              label: statuses.get(element),
            };
          })}
          onChange={(option) => {
            setFilters({ states: option.map((element) => element.value) });
          }}
          isMulti
        />
      </div>

      <div className="input_wrapper">
        <table>
          <tbody>
            {statusItems.map((item) => (
              <tr>
                <td>
                  <span data-status={item.value} className="statusCircle" />
                  <span className="statusTitle">{item.label}</span>
                </td>
                <td>
                  {item.value && aggregations[item.value]
                    ? aggregations[item.value][0]
                    : 0}
                </td>
                <td>
                  {item.value && aggregations[item.value]
                    ? aggregations[item.value][1]
                    : 0}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <Chart
          width="100%"
          height="300px"
          chartType="PieChart"
          backgroundColor="red"
          options={{
            legend: 'none',
            chartArea: {
              left: 0,
              height: 250,
              width: 600,
            },
            backgroundColor: themeName === 'dark-theme' ? '#16202F' : '#FFF',
            legendTextStyle: {
              color: 'white',
              fontSize: 15,
            },
            is3D: true,
            colors: ['287d98', 'b4a828', 'b4701e', 'ad3a34', '3a7f38'],
            sliceVisibilityThreshold: 0,
          }}
          data={[
            ['', ''],
            ...statusItems.map((item) => [
              item.label,
              item.value && aggregations[item.value]
                ? aggregations[item.value][0]
                : 0,
            ]),
          ]}
        />
      </div>
    </section>
  );
}

SidePane.defaultProps = {};
SidePane.propTypes = {
  user: PropTypes.shape({
    role: PropTypes.number,
    roleLang: PropTypes.string,
  }).isRequired,
  filters: PropTypes.shape({
    dataLanguage: PropTypes.string,
    searchTerm: PropTypes.string,
    path: PropTypes.string,
    states: PropTypes.arrayOf(PropTypes.string),
  }).isRequired,
  setFilters: PropTypes.func.isRequired,
  themeName: PropTypes.string.isRequired,
  aggregations: PropTypes.exact({
    NEW: PropTypes.arrayOf(PropTypes.number),
    TODO: PropTypes.arrayOf(PropTypes.number),
    READY_TO_REVIEW: PropTypes.arrayOf(PropTypes.number),
    NEEDS_WORK: PropTypes.arrayOf(PropTypes.number),
    ACCEPTED: PropTypes.arrayOf(PropTypes.number),
  }).isRequired,
};
export default SidePane;
