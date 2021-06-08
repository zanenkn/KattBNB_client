import React from 'react';
import { useTranslation } from 'react-i18next';
import Spinner from '../ReusableComponents/Spinner';

const Partners = () => {
  const { t, ready } = useTranslation('Partners');
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <div className='content-wrapper'>
  //       <Header as='h1'>{t('reusable:title.partners')}</Header>
  //       <p style={{ textAlign: 'center' }}>{t('Partners:p1')}</p>
  //       <div style={{ maxWidth: '200px', margin: 'auto' }}>
  //         <a href='https://craftacademy.se/' target='_blank' rel='noopener noreferrer'>
  //           <Image src='craftacademylogo.png' style={{ maxWidth: '200px', margin: 'auto', cursor: 'pointer' }}></Image>
  //         </a>
  //       </div>
  //     </div>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default Partners;
