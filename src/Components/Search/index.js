import React, { useState, useRef, useEffect } from 'react';
import LOCATION_OPTIONS from '../../Modules/locationData.json';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import moment from 'moment';
import { getDaysArray } from '../../utils/getDaysArray';
import { detectLanguage } from '../../Modules/detectLanguage';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import {
  Whitebox,
  Header,
  InlineLink,
  Dropdown,
  TextField,
  Button,
  Notice,
  Text,
  DayPicker,
  ContentWrapper,
} from '../../UI-Components';
import { formValidation } from '../../Modules/formValidation';
import SEO from '../ReusableComponents/SEO';

const Search = ({ history, dispatch, currentSearch }) => {
  const { t, ready } = useTranslation('Search');
  const lang = detectLanguage();

  const toField = useRef(null);
  const fromField = useRef(null);

  const today = new Date();

  const [from, setFrom] = useState(null);
  const [to, setTo] = useState(null);
  const [searchLocation, setSearchLocation] = useState(null);
  const [cats, setCats] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    if (!!Object.keys(currentSearch).length) {
      setFrom(currentSearch.start);
      setTo(currentSearch.end);
      setSearchLocation(currentSearch.location);
      setCats(currentSearch.cats);
    }
  }, []);

  // useEffect(() => {
  //   if (from !== undefined) {
  //     toField.current.getInput().focus();
  //   }
  // }, [from]);

  const handleFromChange = () => {
    const utcFrom = Date.UTC(
      fromField.current.state.month.getUTCFullYear(),
      fromField.current.state.month.getUTCMonth(),
      fromField.current.state.month.getUTCDate()
    );
    const msFrom = new Date(utcFrom).getTime();

    setFrom(msFrom);
    toField.current.getInput().focus();
  };

  const handleToChange = () => {
    const utcTo = Date.UTC(
      toField.current.state.month.getUTCFullYear(),
      toField.current.state.month.getUTCMonth(),
      toField.current.state.month.getUTCDate()
    );
    const msTo = new Date(utcTo).getTime();

    setTo(msTo);
  };

  const clearDates = () => {
    setFrom(null);
    setTo(null);
  };

  const listenEnterKeySearch = (event) => {
    if (event.key === 'Enter') {
      search(event);
    }
  };

  const validator = formValidation({
    fields: [
      {
        condition: cats <= 0 || cats % 1 !== 0,
        error: 'Search:error-1',
      },
      {
        condition: !searchLocation,
        error: 'Search:error-2',
      },
      {
        condition: !to || !from,
        error: 'Search:error-3',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  const search = () => {
    dispatch({
      type: 'NEW_SEARCH',
      currentSearch: {
        start: from,
        end: to,
        cats: cats,
        location: searchLocation,
        dates: getDaysArray(from, to),
      },
    });

    history.push({
      pathname: '/search-results',
      search: `?from=${from}&to=${to}&cats=${cats}&location=${searchLocation}&view=map`,
    });
  };

  if (!ready) return <Spinner />;

  return (
    <ContentWrapper>
      <SEO page='search' />
      <Header color='primary' centered>
        {t('Search:title')}
      </Header>
      <Whitebox>
        <div id='search-form' style={{ margin: 'auto', maxWidth: '177px' }}>
          <DayPicker
            dayPickerRef={fromField}
            label={t('Search:checkin')}
            required
            id='from'
            value={from ? moment(from).format('LL') : ''}
            onChange={() => handleFromChange()}
            format='LL'
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{ readOnly: true, placeholder: false }}
            dayPickerProps={{
              selectedDays: { from: new Date(from), to: new Date(to) },
              disabledDays: { after: new Date(to), before: today },
              fromMonth: today,
              toMonth: new Date(to),
              numberOfMonths: 1,
              firstDayOfWeek: 1,
              localeUtils: MomentLocaleUtils,
              locale: lang,
              showWeekNumbers: true,
            }}
          />
          <DayPicker
            dayPickerRef={toField}
            label={t('Search:checkout')}
            required
            id='from'
            value={to ? moment(to).format('LL') : ''}
            onChange={() => handleToChange()}
            format='LL'
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{
              disabled: !from,
              readOnly: !!from,
              placeholder: false,
            }}
            dayPickerProps={{
              selectedDays: { from: new Date(from), to: new Date(to) },
              disabledDays: { before: from ? new Date(from) : today },
              firstDayOfWeek: 1,
              showWeekNumbers: true,
              month: new Date(from),
              fromMonth: new Date(from),
              localeUtils: MomentLocaleUtils,
              locale: lang,
              numberOfMonths: 1,
            }}
          />

          <div style={{ visibility: !from && !to ? 'hidden' : 'visible' }}>
            <InlineLink style={{ textAlign: 'right' }} onClick={() => clearDates()}>
              {t('Search:reset')}
            </InlineLink>
          </div>
          <Dropdown
            defaultValue={currentSearch.location}
            label={t('Search:where')}
            data={LOCATION_OPTIONS}
            id='location'
            onChange={(val) => setSearchLocation(val)}
            onKeyPress={(e) => listenEnterKeySearch(e)}
          />
          <TextField
            label={t('Search:how-many')}
            type='number'
            required
            id='cats'
            value={cats}
            onChange={(e) => setCats(e.target.value)}
            onKeyPress={(e) => listenEnterKeySearch(e)}
          />
        </div>

        {errors.length > 0 && (
          <Notice nature='danger'>
            <Text bold centered>
              {t('Search:error-header')}
            </Text>
            <ul>
              {errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Notice>
        )}

        <Button id='search-button' onClick={() => validator.onSubmit(search)}>
          {t('Search:cta')}
        </Button>
        <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <InlineLink as={Link} to='/area-list' discreet>
            {t('Search:sitters-near-you')}
          </InlineLink>
        </div>
      </Whitebox>
    </ContentWrapper>
  );
};

const mapStateToProps = (state) => ({
  location: state.reduxTokenAuth.currentUser.attributes.location,
  currentSearch: state.currentSearch,
});

export default connect(mapStateToProps)(Search);
