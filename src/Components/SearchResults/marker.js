import React from 'react';
import { PriceLabel } from '../../UI-Components';
import { DatapointCounter } from './styles';

const Marker = ({ cluster, available, id, onClick, total, pointCount }) => {
  return (
    <div
      style={{
        transform: cluster ? 'translate(calc(-50% + 30px), -50%)' : 'translate(-50%, -50%)',
        position: 'absolute',
        display: cluster ? 'flex' : 'block',
      }}
      onClick={() => onClick(id, available)}
    >
      <PriceLabel color={available ? 'success' : 'neutral'} id={id}>
        {total}&nbsp;kr
      </PriceLabel>

      {cluster && <DatapointCounter available={available}>+{pointCount - 1}</DatapointCounter>}
    </div>
  );
};

export default Marker;
