import React, { Component } from 'react';
import { Header, Segment, Form, Message, Button, Popup } from 'semantic-ui-react';
import axios from 'axios';
import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import queryString from 'query-string';
import { withTranslation } from 'react-i18next';
import PasswordStrengthBar from 'react-password-strength-bar';
import Spinner from '../ReusableComponents/Spinner';

class ChangePassword extends Component {
  state = {
    errors: '',
    errorDisplay: false,
    successDisplay: false,
    loading: false,
    password: '',
    passwordConfirmation: '',
  };

  onChangeHandler = (e) => {
    this.setState({ [e.target.id]: e.target.value });
  };

  changePassword = (e) => {
    e.preventDefault();
    const { t } = this.props;
    if (window.navigator.onLine === false) {
      this.setState({
        errorDisplay: true,
        errors: ['reusable:errors:window-navigator'],
      });
    } else {
      if (
        this.state.password === this.state.passwordConfirmation &&
        this.state.password.length >= 6 &&
        this.props.location.search.length > 150
      ) {
        this.setState({ loading: true });
        const lang = detectLanguage();
        const path = '/api/v1/auth/password';
        const payload = {
          password: this.state.password,
          password_confirmation: this.state.passwordConfirmation,
          uid: queryString.parse(this.props.location.search).uid,
          'access-token': queryString.parse(this.props.location.search).token,
          client: queryString.parse(this.props.location.search).client,
          locale: lang,
        };
        axios
          .put(path, payload)
          .then(() => {
            this.setState({
              successDisplay: true,
              errorDisplay: false,
            });
            setTimeout(function () {
              window.location.replace('/login');
            }, 2000);
          })
          .catch((error) => {
            if (error.response === undefined) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 500) {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: ['reusable:errors:500'],
              });
            } else if (error.response.status === 503) {
              wipeCredentials('/is-not-available?atm');
            } else if (error.response.status === 401) {
              window.alert(t('reusable:errors:401-password'));
              wipeCredentials('/password-reset');
            } else {
              this.setState({
                loading: false,
                errorDisplay: true,
                errors: error.response.data.errors.full_messages,
              });
            }
          });
      } else if (
        this.state.password === this.state.passwordConfirmation &&
        this.state.password.length >= 6 &&
        this.props.location.search.length < 150
      ) {
        this.setState({
          errors: ['ChangePassword:error-1'],
          errorDisplay: true,
        });
      } else {
        this.setState({
          errors: ['ChangePassword:error-2'],
          errorDisplay: true,
        });
      }
    }
  };

  listenEnterKey = (event) => {
    if (event.key === 'Enter') {
      this.changePassword(event);
    }
  };

  render() {
    const { t } = this.props;
    let errorDisplay, successDisplay;

    if (this.props.tReady) {
      if (this.state.errorDisplay) {
        errorDisplay = (
          <Message negative>
            <Message.Header style={{ textAlign: 'center' }}>{t('ChangePassword:error-header')}</Message.Header>
            <ul id='message-error-list'>
              {this.state.errors.map((error) => (
                <li key={error}>{t(error)}</li>
              ))}
            </ul>
          </Message>
        );
      }

      if (this.state.successDisplay) {
        successDisplay = (
          <Message success style={{ textAlign: 'center' }}>
            {t('ChangePassword:success-msg')}
          </Message>
        );
      }

      return (
        <div className='content-wrapper'>
          <Header as='h1'>{t('ChangePassword:title')}</Header>
          <Segment className='whitebox'>
            <p style={{ textAlign: 'center' }}>{t('ChangePassword:instructions')}</p>
            <Form>
              <Popup
                trigger={
                  <Form.Input
                    required
                    id='password'
                    label={t('reusable:plch.password')}
                    value={this.state.password}
                    onChange={this.onChangeHandler}
                    placeholder={t('reusable:plch.password')}
                    type='password'
                    onKeyPress={this.listenEnterKey}
                  />
                }
                header={t('reusable:plch.pass-strength-bar-popup-header')}
                content={
                  <PasswordStrengthBar
                    password={this.state.password}
                    minLength={6}
                    scoreWords={[
                      t('reusable:plch.weak'),
                      t('reusable:plch.weak'),
                      t('reusable:plch.okay'),
                      t('reusable:plch.good'),
                      t('reusable:plch.strong'),
                    ]}
                    shortScoreWord={t('reusable:plch.pass-strength-bar')}
                  />
                }
                on='focus'
              />
              <Form.Input
                required
                id='passwordConfirmation'
                label={t('reusable:plch.password-confirmation')}
                value={this.state.passwordConfirmation}
                onChange={this.onChangeHandler}
                placeholder={t('reusable:plch.password-confirmation')}
                type='password'
                onKeyPress={this.listenEnterKey}
              />
            </Form>
            {errorDisplay}
            {successDisplay}
            <Button
              className='submit-button'
              id='change-pass-button'
              disabled={this.state.loading}
              loading={this.state.loading}
              onClick={this.changePassword}
            >
              {t('ChangePassword:title')}
            </Button>
          </Segment>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}

export default withTranslation('ChangePassword')(ChangePassword);
