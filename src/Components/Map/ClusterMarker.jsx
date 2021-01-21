import React from 'react';

const ClusterMarker = (props) => {
  return (
    <div
      style={{
        width: `${10 + (props.pointCount / props.pointLength) * 20}px`,
        height: `${10 + (props.pointCount / props.pointLength) * 20}px`,
        color: '#fff',
        backgroundColor: '#c90c61',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: '10px',
        fontWeight: 'bold',
        borderRadius: '9999px',
        transform: 'translate(-50%, -50%)', position: 'absolute'
      }}
      onClick={props.onClick}
    >
      {props.pointCount}
    </div>
  )
}

export default ClusterMarker;
