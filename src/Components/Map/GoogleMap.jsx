import React, { useState, useRef } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import Marker from './Marker';
import ClusterMarker from './ClusterMarker';
import mapStyles from '../../Modules/MapStyle.js';

const GoogleMap = (props) => {
  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);

  const points = props.allAvailableHosts.map(host => ({
    type: "Feature",
    properties: {
      cluster: false,
      id: host.user.id,
      total: host.total,
      available: host.available
    },
    geometry: {
      type: "Point",
      coordinates: [
        parseFloat(host.lng),
        parseFloat(host.lat)
      ]
    }
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  return (
    <div id='map-wrapper'>
      <GoogleMapReact
        defaultCenter={{ lat: 59.330651, lng: 18.068562 }}
        center={{
          lat: props.mapCenterLat,
          lng: props.mapCenterLong,
        }}
        defaultZoom={12}
        options={{
          styles: mapStyles,
          restriction: {
            latLngBounds: {
              east: 31.817221,
              north: 71.185669,
              south: 51.080991,
              west: 3.221893,
            },
          },
        }}
        onGoogleApiLoaded={({ map }) => {
          mapRef.current = map;
        }}
        onChange={({ zoom, bounds }) => {
          setZoom(zoom);
          setBounds([
            bounds.nw.lng,
            bounds.se.lat,
            bounds.se.lng,
            bounds.nw.lat
          ]);
        }}
        yesIWantToUseGoogleMapApiInternals
        bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
      >
        {clusters.map(cluster => {
          const [longitude, latitude] = cluster.geometry.coordinates;
          const {
            cluster: isCluster,
            point_count: pointCount
          } = cluster.properties;

          if (isCluster) {
            return (
              <ClusterMarker key={`cluster-${cluster.id}`}
                id={cluster.properties.id}
                lat={latitude}
                lng={longitude}
                points={supercluster.getLeaves(cluster.id, 1, 0)}
                pointCount={pointCount}
                onLabelClick={() => {
                  const expansionZoom = Math.min(
                    supercluster.getClusterExpansionZoom(cluster.id),
                    20
                  );
                  mapRef.current.setZoom(expansionZoom);
                  mapRef.current.panTo({ lat: latitude, lng: longitude });
                }}
              />
            );
          }

          return (
            <Marker
              key={`host-${cluster.properties.id}`}
              id={cluster.properties.id}
              lat={latitude}
              lng={longitude}
              total={cluster.properties.total}
              available={cluster.properties.available}
              handleDatapointClick={props.handleDatapointClick}
            >
            </Marker>
          );
        })}
      </GoogleMapReact>
    </div>
  );

}

export default GoogleMap;
