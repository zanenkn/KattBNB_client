import React from 'react';
import { PriceLabel } from '../../UI-Components';

const Marker = ({ cluster, available, id, onClick, total, pointCount }) => {
  return (
    <div
      style={{
        transform: cluster ? 'translate(calc(-50% + 30px), -50%)' : 'translate(-50%, -50%)',
        position: 'absolute',
        display: cluster ? 'flex' : 'block',
      }}
      onClick={(e) => onClick(id, available)}
    >
      <PriceLabel color={available ? 'success' : 'neutral'} id={id}>
        {total}&nbsp;kr
      </PriceLabel>
      {cluster && (
        <div
          style={{
            height: '25px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '25px',
            fontSize: '10px',
            fontWeight: 'bold',
            backgroundColor: '#c90c61',
            color: '#ffffff',
            borderRadius: '9999px',
            marginLeft: '5px',
          }}
        >
          +{pointCount - 1}
        </div>
      )}
    </div>
  );
};

export default Marker;
