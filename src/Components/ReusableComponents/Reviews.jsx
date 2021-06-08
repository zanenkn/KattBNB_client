import React from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

const Reviews = () => {
  const { t, ready } = useTranslation('Reviews');
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <>
  //       <Header as='h3' style={{ textAlign: 'left' }}>
  //         {t('Reviews:main-header')}
  //       </Header>
  //       <Segment placeholder style={{ textAlign: 'center' }}>
  //         {t('Reviews:description')}
  //       </Segment>
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default Reviews;
