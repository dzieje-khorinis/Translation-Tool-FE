import './style.scss';
import { useTranslation } from 'react-i18next';
import React, { forwardRef, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import Select, { components } from 'react-select';
import PropTypes from 'prop-types';
import { langCodeToIcon } from '../../common/utils';
import { LANGUAGES } from '../../common/constants';
import TranslationHistory from '../TranslationHistory';
import 'react-datepicker/dist/react-datepicker.css';

const { Option } = components;

function GlobalTranslationHistory({ tableRef }) {
  const { t } = useTranslation('common');

  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    language: '',
    username: '',
    key: '',
  });
  const startDate = filters.startDate || null;
  const endDate = filters.endDate || null;

  const updateFilters = (filtersToUpdate) => {
    setFilters({ ...filters, ...filtersToUpdate });
    tableRef.current.onChangePage({}, 0);
  };

  const setStartDate = (date) => {
    const newDate = date || '';
    if (newDate !== filters.startDate) {
      updateFilters({ startDate: newDate });
    }
  };

  const setEndDate = (date) => {
    const newDate = date || '';
    if (newDate !== filters.endDate) {
      updateFilters({ endDate: newDate });
    }
  };

  const [usernameTemp, setUsernameTemp] = useState('');
  const [keyTemp, setKeyTemp] = useState('');

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (usernameTemp !== filters.username) {
        updateFilters({ username: usernameTemp });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [usernameTemp]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyTemp !== filters.key) {
        updateFilters({ key: keyTemp });
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyTemp]);

  const languages = LANGUAGES();

  /* eslint-disable-next-line react/no-unstable-nested-components, react/prop-types */
  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      className="custom_input"
      type="text"
      onClick={onClick}
      ref={ref}
      value={value}
      onChange={() => {}}
    />
  ));

  return (
    <div className="translation-history-wrapper">
      {/* <p>{filters.language} | {filters.username} | {filters.key} | {String(filters.startDate)} | {String(filters.endDate)} </p> */}

      <div className="translation-history-filters">
        <div className="input_wrapper">
          <label htmlFor="date_from">{t('DATE FROM')}</label>

          <DatePicker
            id="date_from"
            selected={startDate}
            onChange={setStartDate}
            selectsStart
            startDate={startDate}
            endDate={endDate}
            maxDate={endDate}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            showTimeSelect
            customInput={<ExampleCustomInput />}
            isClearable
          />
        </div>

        <div className="input_wrapper">
          <label htmlFor="date_to">{t('DATE TO')}</label>
          <DatePicker
            id="date_to"
            selected={endDate}
            onChange={setEndDate}
            selectsEnd
            startDate={startDate}
            endDate={endDate}
            minDate={startDate}
            dateFormat="yyyy-MM-dd HH:mm"
            timeFormat="HH:mm"
            showTimeSelect
            customInput={<ExampleCustomInput />}
            isClearable
          />
        </div>

        <div className="input_wrapper" style={{ zIndex: 11 }}>
          <label htmlFor="language">{t('LANGUAGE')}</label>

          <Select
            inputId="language"
            isDisabled={false}
            isLoading={false}
            isClearable
            isRtl={false}
            isSearchable={false}
            onChange={(option) => updateFilters({ language: option?.value })}
            placeholder=""
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
        </div>

        <div className="input_wrapper">
          <label htmlFor="username">{t('USERNAME')}</label>
          <input
            id="username"
            className="custom_input"
            type="text"
            value={usernameTemp}
            onChange={(e) => setUsernameTemp(e.target.value)}
          />
        </div>

        <div className="input_wrapper">
          <label htmlFor="key">{t('KEY')}</label>
          <input
            id="key"
            className="custom_input"
            type="text"
            value={keyTemp}
            onChange={(e) => setKeyTemp(e.target.value)}
          />
        </div>
      </div>

      <TranslationHistory
        showTranslationKey
        tableRef={tableRef}
        filters={{
          ...filters,
          language: filters.language || '',
          startDate: startDate?.getTime() || '',
          endDate: endDate?.getTime() || '',
        }}
      />
    </div>
  );
}

GlobalTranslationHistory.propTypes = {
  tableRef: PropTypes.oneOfType([
    PropTypes.func,
    PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
  ]).isRequired,
};
export default GlobalTranslationHistory;
