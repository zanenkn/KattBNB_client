import React from 'react';
import Spinner from '../ReusableComponents/Spinner';
import { Trans, useTranslation } from 'react-i18next';

const IncRequestPopup = (props) => {
  const { t, ready } = useTranslation('IncRequestPopup');
  return <div>a</div>
  // if (ready) {
  //   return (
  //     <>
  //       <div style={{ margin: '-2rem -2rem 2rem', background: '#c90c61', padding: '2rem' }}>
  //         <Header as='h2' style={{ color: '#ffffff', textAlign: 'left' }}>
  //           {t('IncRequestPopup:main-header')}
  //         </Header>
  //         <p style={{ color: '#ffffff', fontSize: 'small' }}>
  //           <Trans count={parseInt(props.number_of_cats)} i18nKey='IncRequestPopup:desc'>
  //             A stay for <strong>{{ count: props.number_of_cats }} cat</strong> for the dates of
  //             <strong>{{ startDate: props.startDate }}</strong> until <strong>{{ endDate: props.endDate }}</strong>
  //           </Trans>
  //         </p>
  //       </div>
  //       <div style={{ display: 'flex', alignItems: 'center' }}>
  //         <Image
  //           src={
  //             props.avatar === null
  //               ? `https://ui-avatars.com/api/?name=${props.nickname}&size=150&length=3&font-size=0.3&rounded=true&background=d8d8d8&color=c90c61&uppercase=false`
  //               : props.avatar
  //           }
  //           size='small'
  //           style={{ borderRadius: '50%', width: '3rem', height: '3rem' }}
  //         ></Image>
  //         <Header style={{ margin: '0 1rem' }}>{props.nickname}</Header>
  //       </div>
  //       <p style={{ fontSize: 'small', fontStyle: 'italic', margin: '1rem 0 0' }}>{props.message}</p>
  //     </>
  //   );
  // } else {
  //   return <Spinner />;
  // }
};

export default IncRequestPopup;
