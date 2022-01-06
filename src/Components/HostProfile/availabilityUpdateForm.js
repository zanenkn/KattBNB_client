import { useState, useEffect } from 'react';

import axios from 'axios';
import { useTranslation } from 'react-i18next';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import { detectLanguage } from '../../Modules/detectLanguage';
import { wipeCredentials } from '../../Modules/wipeCredentials';
import { formValidation } from '../../Modules/formValidation';

import { Flexbox, Text, Notice, Button } from '../../UI-Components';

const AvailabilityUpdateForm = ({ id, availability, incomingBookings, closeAllForms, setElement }) => {
  const { t } = useTranslation('HostProfileForm');
  const lang = detectLanguage();

  const today = new Date();

  const [errors, setErrors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newAvailability, setNewAvailability] = useState(availability);

  const validator = formValidation({
    fields: [
      {
        condition: window.navigator.onLine === false,
        error: 'reusable:errors:window-navigator',
      },
    ],
    errorSetter: (val) => setErrors(val),
  });

  useEffect(() => {
    return () => {
      setNewAvailability(availability);
    };
  }, []);

  const handleDayClick = (day, { selected, disabled }) => {
    if (disabled) return;
    const utc = Date.UTC(day.getUTCFullYear(), day.getUTCMonth(), day.getUTCDate());
    const clicked = new Date(utc).getTime();
    setNewAvailability((prev) => [
      ...new Set(selected ? [...prev.filter((date) => date !== clicked)] : [...prev, clicked]),
    ]);
  };

  const updateAvailability = () => {
    setLoading(true);

    if (availability.length === newAvailability.length && availability.every((el) => newAvailability.includes(el))) {
      closeAllForms();
      return;
    }

    const path = `/api/v1/host_profiles/${id}`;
    const headers = {
      uid: window.localStorage.getItem('uid'),
      client: window.localStorage.getItem('client'),
      'access-token': window.localStorage.getItem('access-token'),
    };

    const payload = {
      availability: newAvailability.filter((date) => date > today.getTime()).sort((a, b) => a - b),
      locale: lang,
    };

    axios
      .patch(path, payload, { headers: headers })
      .then(() => {
        setElement('availability', payload.availability);
        closeAllForms();
      })
      .catch((error) => {
        setLoading(false);
        if (error.response === undefined) {
          setErrors(['reusable:errors.unknown']);
        } else if (error.response.status === 500) {
          setErrors(['reusable:errors.500']);
        } else if (error.response.status === 401) {
          window.alert(t('reusable:errors:401'));
          wipeCredentials('/');
        } else {
          setErrors([error.response.data.error]);
        }
      });
  };

  return (
    <>
      <Text>{t('HostProfileForm:helpers.availability')}</Text>
      <DayPicker
        showWeekNumbers
        firstDayOfWeek={1}
        selectedDays={newAvailability.map((day) => new Date(day))}
        fromMonth={today}
        disabledDays={[{ before: today }, ...incomingBookings.map((date) => new Date(date))]}
        onDayClick={(day, { selected, disabled }) => handleDayClick(day, { selected, disabled })}
        localeUtils={MomentLocaleUtils}
        locale={lang}
      />
      {errors.length > 0 && (
        <Notice nature='danger'>
          <ul>
            {errors.map((error) => (
              <li key={error}>{t(error, { timestamp: new Date().getTime() })}</li>
            ))}
          </ul>
        </Notice>
      )}
      <Flexbox spaceItemsX={2}>
        <Button secondary color='neutral' id='availability-close-button' onClick={() => closeAllForms()}>
          {t('reusable:cta.cancel')}
        </Button>
        <Button
          id='availability-submit-button'
          color='info'
          loading={loading}
          disabled={loading}
          onClick={() => validator.onSubmit(updateAvailability)}
        >
          {t('reusable:cta.save')}
        </Button>
      </Flexbox>
    </>
  );
};

export default AvailabilityUpdateForm;
