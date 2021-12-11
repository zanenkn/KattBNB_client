import React, { useState, useRef, useEffect } from 'react';
import LOCATION_OPTIONS from '../../Modules/locationData.json';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
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

const Search = ({ history }) => {
  const { t, ready } = useTranslation('Search');
  const lang = detectLanguage();

  const toField = useRef(null);
  const fromField = useRef(null);

  const today = new Date();

  const [from, setFrom] = useState(undefined);
  const [to, setTo] = useState(undefined);
  const [searchLocation, setSearchLocation] = useState(null);
  const [cats, setCats] = useState(null);
  const [errors, setErrors] = useState([]);
  const modifiers = { start: from, end: to };

  useEffect(() => {
    if (history.location.state !== undefined) {
      setFrom(history.location.state.checkInDate);
      setTo(history.location.state.checkOutDate);
      setSearchLocation(history.location.state.locationName);
      setCats(history.location.state.numberOfCats);
    }
  }, []);

  // useEffect(() => {
  //   if (from !== undefined) {
  //     toField.current.getInput().focus();
  //   }
  // }, [from]);

  const handleFromChange = () => {
    setFrom(fromField.current.state.month);
    toField.current.getInput().focus();
  };

  const handleToChange = () => {
    setTo(toField.current.state.month);
  };

  const clearDates = () => {
    setFrom(undefined);
    setTo(undefined);
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
    const utcFrom = Date.UTC(from.getUTCFullYear(), from.getUTCMonth(), from.getUTCDate());
    const msFrom = new Date(utcFrom).getTime();
    const utcTo = Date.UTC(to.getUTCFullYear(), to.getUTCMonth(), to.getUTCDate());
    const msTo = new Date(utcTo).getTime();

    history.push({
      pathname: '/search-results',
      search: `?from=${msFrom}&to=${msTo}&cats=${cats}&location=${searchLocation}&view=map`,
    });
  };

  if (!ready) return <Spinner />;

  return (
    <ContentWrapper>
      <SEO page='search'/>
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
            value={from}
            onChange={() => handleFromChange()}
            format='LL'
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{ readOnly: true, placeholder: false }}
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: { after: to, before: today },
              fromMonth: today,
              toMonth: to,
              modifiers,
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
            value={to || ''}
            onChange={() => handleToChange()}
            format='LL'
            formatDate={formatDate}
            parseDate={parseDate}
            inputProps={{
              disabled: from === undefined,
              readOnly: !(from === undefined),
              placeholder: false,
            }}
            dayPickerProps={{
              selectedDays: [from, { from, to }],
              disabledDays: from !== undefined ? { before: from } : { before: today },
              modifiers,
              firstDayOfWeek: 1,
              showWeekNumbers: true,
              month: from,
              fromMonth: from,
              localeUtils: MomentLocaleUtils,
              locale: lang,
              numberOfMonths: 1,
            }}
          />

          <div style={{ visibility: from === undefined && to === undefined ? 'hidden' : 'visible' }}>
            <InlineLink style={{ textAlign: 'right' }} onClick={() => clearDates()}>
              {t('Search:reset')}
            </InlineLink>
          </div>
          <Dropdown
            defaultValue={history.location?.state?.locationName}
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

const mapStateToProps = (state) => ({ location: state.reduxTokenAuth.currentUser.attributes.location });

export default connect(mapStateToProps)(Search);
