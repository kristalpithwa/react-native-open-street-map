import { useState } from 'react';
import { View, ActivityIndicator, StyleSheet } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';

interface MapMarker {
  latitude: number;
  longitude: number;
  name?: string;
  icon?:
    | string
    | {
        url?: string;
        svg?: string;
        size?: [number, number];
        anchor?: [number, number];
        popupAnchor?: [number, number];
        className?: string;
      };
  draggable?: boolean;
  [key: string]: any;
}

interface MapViewProps {
  markers?: MapMarker[];
  initialCenter?: { lat: number; lng: number };
  initialZoom?: number;
  fitToMarkers?: boolean;
  draggable?: boolean;
  onMarkerDragEnd?: (marker: MapMarker) => void;
  onMarkerPress?: (marker: MapMarker) => void;
  onMarkerHover?: (event: {
    marker: MapMarker;
    type: 'enter' | 'leave';
  }) => void;
}

const MapView = ({
  markers = [],
  initialCenter,
  initialZoom,
  fitToMarkers = true,
  draggable = false,
  onMarkerDragEnd,
  onMarkerPress,
  onMarkerHover,
}: MapViewProps) => {
  const [loading, setLoading] = useState<boolean>(true);

  const HtmlMap = () => `
  <!DOCTYPE html>
<html>
  <head>
    <meta name="viewport" content="initial-scale=1.0, width=device-width" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet/dist/leaflet.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.css" />
    <link rel="stylesheet" href="https://unpkg.com/leaflet.markercluster/dist/MarkerCluster.Default.css" />
    <style>
      html, body, #map {
        height: 100%;
        margin: 0;
        padding: 0;
      }
    </style>
  </head>

  <body>
    <div id="map"></div>
    <script src="https://unpkg.com/leaflet/dist/leaflet.js"></script>
    <script src="https://unpkg.com/leaflet.markercluster/dist/leaflet.markercluster.js"></script>

    <script>
      // Injected data from React Native
      const markers = ${JSON.stringify(markers || [])};
      const initialCenter = ${JSON.stringify(initialCenter)};
      const initialZoom = ${JSON.stringify(initialZoom)};
      const fitToMarkers = ${JSON.stringify(fitToMarkers)};
      const draggable = ${JSON.stringify(draggable)};
      const onMarkerDragEnd = ${JSON.stringify(onMarkerDragEnd)};
      const onMarkerPress = ${JSON.stringify(onMarkerPress)};
      const onMarkerHover = ${JSON.stringify(onMarkerHover)};

      const map = L.map('map');

      // Function to create custom marker icon
      function createCustomIcon(marker) {
        if (!marker.icon) {
          return new L.Icon.Default();
        }

        const iconConfig = typeof marker.icon === 'string' 
          ? { url: marker.icon }
          : marker.icon;

        return L.icon({
          iconUrl: iconConfig.url || iconConfig.svg,
          iconSize: iconConfig.size || [32, 32],
          iconAnchor: iconConfig.anchor || [16, 32],
          popupAnchor: iconConfig.popupAnchor || [0, -32],
          className: iconConfig.className || 'custom-marker-icon'
        });
      }

      // Add OpenStreetMap tiles
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; OpenStreetMap contributors'
      }).addTo(map);

      const hasMarkers = markers.length > 0;

      if (hasMarkers) {
        // Create marker cluster group
        const markerClusterGroup = L.markerClusterGroup({
          maxClusterRadius: 80,
          disableClusteringAtZoom: 18
        });

        const bounds = [];
        markers.forEach(m => {
          const customIcon = createCustomIcon(m);
          const marker = L.marker([m.latitude, m.longitude], { 
            icon: customIcon,
            draggable: draggable || m.draggable
          })
            .bindPopup(m.name);

          // Handle drag end event
          if (draggable || m.draggable) {
            marker.on('dragend', function() {
              const latlng = marker.getLatLng();
              const updatedMarker = {
                ...m,
                latitude: latlng.lat,
                longitude: latlng.lng
              };
              // Send message to React Native
              if (window.ReactNativeWebView) {
                window.ReactNativeWebView.postMessage(JSON.stringify({
                  type: 'markerDragEnd',
                  marker: updatedMarker
                }));
              }
            });
          }

          // Handle marker click/press event
          marker.on('click', function() {
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerPress',
                marker: m
              }));
            }
          });

          // Handle marker hover events
          marker.on('mouseover', function() {
            marker.setOpacity(0.7);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerHoverStart',
                marker: m
              }));
            }
          });

          marker.on('mouseout', function() {
            marker.setOpacity(1);
            if (window.ReactNativeWebView) {
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'markerHoverEnd',
                marker: m
              }));
            }
          });

          markerClusterGroup.addLayer(marker);
          bounds.push([m.latitude, m.longitude]);
        });

        map.addLayer(markerClusterGroup);

        if (fitToMarkers) {
          map.fitBounds(bounds, { padding: [20, 20], maxZoom: 12 });
        } else if (initialCenter) {
          map.setView([initialCenter.lat, initialCenter.lng], initialZoom || 10);
        } else {
          map.setView([0, 0], 2);
        }
      } else if (initialCenter) {
        map.setView([initialCenter.lat, initialCenter.lng], initialZoom || 10);
      } else {
        map.setView([0, 0], 2);
      }
    </script>
  </body>
</html>
`;

  return (
    <View style={styles.container}>
      {loading && (
        <ActivityIndicator size="large" color="blue" style={styles.loader} />
      )}
      <WebView
        style={{ flex: 1 }}
        source={{ html: HtmlMap() }}
        onLoadEnd={() => setLoading(false)}
        onLoadStart={() => setLoading(true)}
        onMessage={(event: WebViewMessageEvent) => {
          const data = JSON.parse(event.nativeEvent.data);
          if (data.type === 'markerDragEnd' && onMarkerDragEnd) {
            onMarkerDragEnd(data.marker);
          }
          if (data.type === 'markerPress' && onMarkerPress) {
            onMarkerPress(data.marker);
          }
          if (data.type === 'markerHoverStart' && onMarkerHover) {
            onMarkerHover({ marker: data.marker, type: 'enter' });
          }
          if (data.type === 'markerHoverEnd' && onMarkerHover) {
            onMarkerHover({ marker: data.marker, type: 'leave' });
          }
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loader: {
    top: '50%',
    alignSelf: 'center',
    position: 'absolute',
  },
});

export default MapView;
