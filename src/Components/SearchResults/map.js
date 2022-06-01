import React, { useState, useRef, useLayoutEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import useSupercluster from 'use-supercluster';
import mapStyles from '../../Modules/MapStyle.js';
import { DatapointCounter } from './styles';
import Marker from './marker';

const GoogleMap = ({ allAvailableHosts, byLocationAvailableHosts, handleDatapointClick, onUnmount, config }) => {
  useLayoutEffect(() => {
    debugger
    return () => {
      onUnmount(mapRef.current.getCenter().lat(), mapRef.current.getCenter().lng(), mapRef.current.zoom);
    };
  }, []);

  const mapRef = useRef();
  const [bounds, setBounds] = useState(null);
  const [zoom, setZoom] = useState(12);

  const hostsToDisplay = allAvailableHosts.length > 0 ? allAvailableHosts : byLocationAvailableHosts;

  const points = hostsToDisplay.map(({ available, lat, lng, total, user }) => ({
    type: 'Feature',
    properties: {
      cluster: false,
      hostId: user.id,
      total: total,
      available: available,
    },
    geometry: {
      type: 'Point',
      coordinates: [parseFloat(lng), parseFloat(lat)],
    },
  }));

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 125, maxZoom: 20 },
  });

  const zoomAndPan = (zoom, lat, lng) => {
    mapRef.current.setZoom(zoom);
    mapRef.current.panTo({ lat: lat, lng: lng });
  };

  return (
    <GoogleMapReact
      defaultCenter={{ lat: 59.330651, lng: 18.068562 }}
      center={{
        lat: config.lat,
        lng: config.lng,
      }}
      defaultZoom={config.zoom}
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
        setBounds([bounds.nw.lng, bounds.se.lat, bounds.se.lng, bounds.nw.lat]);
      }}
      yesIWantToUseGoogleMapApiInternals
      bootstrapURLKeys={{ key: process.env.REACT_APP_GOOGLE_MAPS_KEY }}
    >
      {clusters.map((cluster) => {
        const [clusterLng, clusterLat] = cluster.geometry.coordinates;
        const { cluster: isCluster, point_count: pointCount } = cluster.properties;
        if (isCluster) {
          if (zoom < 10) {
            return (
              <DatapointCounter
                lat={clusterLat}
                lng={clusterLng}
                key={`cluster-${cluster.id}`}
                onClick={() => zoomAndPan(12, clusterLat, clusterLng)}
                pointCount={pointCount}
                pointLength={points.length}
                available={supercluster.getLeaves(cluster.id).some((host) => host.properties.available)}
                expandable
              >
                {pointCount}
              </DatapointCounter>
            );
          } else {
            const clusterMarker =
              supercluster.getLeaves(cluster.id).find((host) => host.properties.available) ||
              supercluster.getLeaves(cluster.id, 1, 0)[0];
            const { id, total, available } = clusterMarker.properties;
            return (
              <Marker
                key={`cluster-${cluster.id}`}
                lat={clusterMarker.geometry.coordinates[1]}
                lng={clusterMarker.geometry.coordinates[0]}
                id={id}
                total={total}
                available={available}
                onClick={() =>
                  zoomAndPan(Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20), clusterLat, clusterLng)
                }
                cluster
                pointCount={pointCount}
              />
            );
          }
        }

        return (
          <Marker
            key={`host-${cluster.properties.hostId}`}
            id={cluster.properties.hostId}
            lat={clusterLat}
            lng={clusterLng}
            total={cluster.properties.total}
            available={cluster.properties.available}
            onClick={handleDatapointClick}
          />
        );
      })}
    </GoogleMapReact>
  );
};

export default GoogleMap;
