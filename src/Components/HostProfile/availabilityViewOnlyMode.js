import { useTranslation } from 'react-i18next';
import DayPicker from 'react-day-picker';
import MomentLocaleUtils from 'react-day-picker/moment';

import useCurrentScope from '../../hooks/useCurrentScope';

import { Text } from '../../UI-Components';

const AvailabilityViewOnlyMode = ({ selectedDays }) => {
  const { t } = useTranslation('AvailabilityViewOnlyMode');
  const { locale } = useCurrentScope();

  if (!selectedDays.length) return <Text>{t('AvailabilityViewOnlyMode:no-dates-selected')}</Text>;

  return (
    <DayPicker
      showWeekNumbers
      firstDayOfWeek={1}
      selectedDays={selectedDays}
      month={selectedDays[0]}
      fromMonth={selectedDays[0]}
      toMonth={selectedDays[selectedDays.length - 1]}
      localeUtils={MomentLocaleUtils}
      locale={locale}
    />
  );
};

export default AvailabilityViewOnlyMode;
