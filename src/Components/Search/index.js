import React, { Component } from 'react';
import LOCATION_OPTIONS from '../../Modules/locationData.json';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { connect } from 'react-redux';
import DayPickerInput from 'react-day-picker/DayPickerInput';
//import '../NpmPackageCSS/react-day-picker-range.css';
import { detectLanguage } from '../../Modules/detectLanguage';
import MomentLocaleUtils, { formatDate, parseDate } from 'react-day-picker/moment';
import { withTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';
import { Helmet } from 'react-helmet';
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
} from '../../UI-Components';

class Search extends Component {
  constructor(props) {
    super(props);
    this.handleFromChange = this.handleFromChange.bind(this);
    this.handleToChange = this.handleToChange.bind(this);
    this.state = {
      errors: '',
      location: this.props.location,
      cats: '',
      from: undefined,
      to: undefined,
    };
  }

  componentDidMount() {
    if (this.props.history.location.state !== undefined) {
      this.setState({
        from: this.props.history.location.state.checkInDate,
        to: this.props.history.location.state.checkOutDate,
        location: this.props.history.location.state.location,
        cats: this.props.history.location.state.numberOfCats,
      });
    }
  }

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  showFromMonth() {
    const { from, to } = this.state;
    if (!from) {
      return;
    }
    // if (moment(to).diff(moment(from), 'months') < 2) {
    //   this.to.getDayPicker().showMonth(from);
    // }
  }

  async handleFromChange(from) {
    await this.setState({ from });
    this.to.getInput().focus();
  }

  handleToChange(to) {
    this.setState({ to }, this.showFromMonth);
  }

  clearDates = () => {
    this.setState({
      from: undefined,
      to: undefined,
      errors: '',
    });
  };

  listenEnterKeySearch = (event) => {
    if (event.key === 'Enter') {
      this.search(event);
    }
  };

  search = (e) => {
    e.preventDefault();
    if (this.state.cats <= 0 || this.state.cats % 1 !== 0) {
      this.setState({
        errors: ['Search:error-1'],
      });
    } else if (this.state.location === '' || this.state.location === undefined) {
      this.setState({
        errors: ['Search:error-2'],
      });
    } else if (this.state.to === undefined || this.state.from === undefined) {
      this.setState({
        errors: ['Search:error-3'],
      });
    } else {
      let utcFrom = Date.UTC(
        this.state.from.getUTCFullYear(),
        this.state.from.getUTCMonth(),
        this.state.from.getUTCDate()
      );
      let msFrom = new Date(utcFrom).getTime();
      let utcTo = Date.UTC(this.state.to.getUTCFullYear(), this.state.to.getUTCMonth(), this.state.to.getUTCDate());
      let msTo = new Date(utcTo).getTime();
      this.props.history.push({
        pathname: '/search-results',
        search: `?from=${msFrom}&to=${msTo}&cats=${this.state.cats}&location=${this.state.location}&view=map`,
      });
    }
  };

  render() {
    const { t, tReady } = this.props;
    const lang = detectLanguage();
    const { from, to } = this.state;
    const modifiers = { start: from, end: to };
    const today = new Date();

    if (!tReady) return <Spinner />;

    return (
      <>
        <Helmet>
          <title>KattBNB - boka kattvakt online!</title>
          <meta
            name='description'
            content='Det är inte enkelt att hitta en pålitlig kattvakt. Men lugn, vi löser det. På KattBNB bokar du kattvakt online - snabbt och enkelt!'
          />
          <link rel='canonical' href='https://kattbnb.se/search' />
          <meta property='og:title' content='KattBNB - boka kattvakt online!' />
          <meta property='og:url' content='https://kattbnb.se/search' />
          <meta property='og:type' content='website' />
          <meta
            property='og:description'
            content='Ställ inte in din semester. Vi har kattvakt till din katt. På KattBNB bokar du kattpassning online - snabbt och enkelt!'
          />
          <meta property='og:image' content='https://kattbnb.se/KattBNB_og.jpg' />
        </Helmet>
        <Header color='primary' centered>
          {t('Search:title')}
        </Header>
        <Whitebox>
          <div id='search-form' style={{ margin: 'auto', maxWidth: '177px' }}>
            <DayPicker
              label={t('Search:checkin')}
              required
              id='from'
              value={from}
              onChange={this.handleFromChange}
              format='LL'
              formatDate={formatDate}
              parseDate={parseDate}
              inputProps={{ readOnly: true }}
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
              dayPickerRef={(el) => (this.to = el)}
              label={t('Search:checkout')}
              required
              id='from'
              value={to || ''}
              onChange={this.handleToChange}
              format='LL'
              formatDate={formatDate}
              parseDate={parseDate}
              inputProps={this.state.from === undefined ? { disabled: true } : { disabled: false, readOnly: true }}
              dayPickerProps={{
                selectedDays: [from, { from, to }],
                disabledDays: this.state.from !== undefined ? { before: from } : { before: today },
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

            <div style={this.state.from === undefined && this.state.to === undefined ? { visibility: 'hidden' } : {}}>
              <InlineLink style={{ textAlign: 'right' }} onClick={this.clearDates}>
                {t('Search:reset')}
              </InlineLink>
            </div>
            <Dropdown
              label={t('Search:where')}
              data={LOCATION_OPTIONS}
              id='location'
              onChange={(val) => this.setState({ location: val })}
              onKeyPress={this.listenEnterKeySearch}
            />
            <TextField
              label={t('Search:how-many')}
              type='number'
              required
              id='cats'
              value={this.state.cats}
              onChange={this.onChangeHandler}
              onKeyPress={this.listenEnterKeySearch}
            />
          </div>

          {this.state.errors !== '' && (
            <Notice nature='danger'>
              <Text bold centered>
                {t('Search:error-header')}
              </Text>
              <ul>
                {this.state.errors.map((error) => (
                  <li key={error}>{t(error)}</li>
                ))}
              </ul>
            </Notice>
          )}

          <Button id='search-button' onClick={this.search}>
            {t('Search:cta')}
          </Button>
          <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <InlineLink as={Link} to='/area-list' discreet>
              {t('Search:sitters-near-you')}
            </InlineLink>
          </div>
        </Whitebox>
      </>
    );
  }
}

const mapStateToProps = (state) => ({ location: state.reduxTokenAuth.currentUser.attributes.location });

export default withTranslation('Search')(connect(mapStateToProps)(Search));
