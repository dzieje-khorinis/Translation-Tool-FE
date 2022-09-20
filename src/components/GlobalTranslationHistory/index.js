import './style.scss';
import { useTranslation } from 'react-i18next';
import React, { forwardRef, createRef, useState, useEffect } from 'react';
import DatePicker from 'react-datepicker';
import { langCodeToIcon, thickPartOfText } from '../../common/utils';
import { LANGUAGES, ROLE_ADMIN, STATUSES } from '../../common/constants';
import TranslationHistory from '../TranslationHistory';
import 'react-datepicker/dist/react-datepicker.css';
import Select, { components } from 'react-select';

const { Option } = components;

function GlobalTranslationHistory({ tableRef, dataLanguage, translationId }) {
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

  const setStartDate = (date) => {
    date = date || '';
    if (date != filters.startDate) {
      updateFilters({ startDate: date });
    }
  };

  const setEndDate = (date) => {
    date = date || '';
    if (date != filters.endDate) {
      updateFilters({ endDate: date });
    }
  };

  const updateFilters = (filtersToUpdate) => {
    setFilters({ ...filters, ...filtersToUpdate });
    tableRef.current.onChangePage({}, 0);
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

  const ExampleCustomInput = forwardRef(({ value, onClick }, ref) => (
    <input
      className="custom_input"
      type="text"
      onClick={onClick}
      ref={ref}
      value={value}
      onChange={(e) => {}}
    />
  ));

  return (
    <div className="translation-history-wrapper">
      {/* <p>{filters.language} | {filters.username} | {filters.key} | {String(filters.startDate)} | {String(filters.endDate)} </p> */}

      <div className="translation-history-filters">
        <div className="input_wrapper">
          <label>{t('DATE FROM')}</label>

          <DatePicker
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
          <label>{t('DATE TO')}</label>
          <DatePicker
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
          <label>{t('LANGUAGE')}</label>

          <Select
            isDisabled={false}
            isLoading={false}
            isClearable
            isRtl={false}
            isSearchable={false}
            onChange={(option, { action }) =>
              updateFilters({ language: option?.value })
            }
            placeholder=""
            options={Array.from(languages).map(([key, value]) => {
              return {
                value: key,
                label: `${value} (${key})`,
                icon: langCodeToIcon[key],
              };
            })}
            components={{
              Option: (props) => (
                <Option {...props}>
                  <img src={props.data.icon} alt={props.data.label} />
                  <span style={{ marginLeft: 10 }}>{props.data.label}</span>
                </Option>
              ),
            }}
          />
        </div>

        <div className="input_wrapper">
          <label htmlFor="id_search">{t('USERNAME')}</label>
          <input
            className="custom_input"
            type="text"
            value={usernameTemp}
            onChange={(e) => setUsernameTemp(e.target.value)}
          />
        </div>

        <div className="input_wrapper">
          <label htmlFor="id_search">{t('KEY')}</label>
          <input
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

GlobalTranslationHistory.propTypes = {};
export default GlobalTranslationHistory;
