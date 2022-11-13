import React from 'react';
import { PriceLabel } from '../../UI-Components';
import { DatapointCounter, MarkerWrapper } from './styles';

const Marker = ({ cluster, available, id, onClick, total, pointCount }) => {
  return (
    <MarkerWrapper cluster={cluster} onClick={() => onClick(id, available)}>
      <PriceLabel available={available} id={id} data-cy={`price-label-${id}`}>
        {total} kr
      </PriceLabel>

      {cluster && <DatapointCounter available={available}>+{pointCount - 1}</DatapointCounter>}
    </MarkerWrapper>
  );
};

export default Marker;
