# 🗺️ React Native Open Street Map View

[![npm version](https://img.shields.io/npm/v/react-native-open-street-map-view.svg)](https://www.npmjs.com/package/react-native-open-street-map-view)
[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![Platform](https://img.shields.io/badge/platform-ios%20%7C%20android-blue.svg)](https://www.npmjs.com/package/react-native-open-street-map-view)
[![Downloads](https://img.shields.io/npm/dm/react-native-open-street-map-view.svg)](https://www.npmjs.com/package/react-native-open-street-map-view)

A lightweight, highly customizable OpenStreetMap component for React Native, built with **Leaflet** and **WebView**. Designed for simplicity and performance.

---

## ✨ Features

- **🗺️ OpenStreetMap Integration**: Seamlessly render OSM tiles using Leaflet.
- **📍 Smart Clustering**: Native-like performance with built-in marker clustering.
- **🎨 Custom Markers**: Support for remote images, SVGs, and custom styling.
- **👆 Interactive Events**: Drag, press, and hover support.
- **📱 Cross-Platform**: Consistent behavior on iOS and Android.
- **⚡ TypeScript**: Fully typed for a robust development experience.

---

## 📦 Installation

```sh
yarn add react-native-open-street-map-view react-native-webview
```

or

```sh
npm install react-native-open-street-map-view react-native-webview
```

> **Note**: This library peer-depends on `react-native-webview`. Ensure it is installed and linked in your project.

---

## 🚀 Usage

Here is a simple example to get you started:

```tsx
import React from 'react';
import { StyleSheet, View, Alert } from 'react-native';
import { MapView, type MapMarker } from 'react-native-open-street-map-view';

export default function App() {
  const markers: MapMarker[] = [
    {
      latitude: 51.505,
      longitude: -0.09,
      name: 'London',
      icon: 'https://cdn-icons-png.flaticon.com/512/447/447031.png', // Custom Icon
    },
    {
      latitude: 51.51,
      longitude: -0.1,
      name: 'Camden Town',
    },
  ];

  return (
    <View style={styles.container}>
      <MapView
        markers={markers}
        initialZoom={13}
        initialCenter={{ lat: 51.505, lng: -0.09 }}
        fitToMarkers={true}
        onMarkerPress={(marker) => Alert.alert('Marker Pressed', marker.name)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

---

## ⚙️ Props

| Prop              | Type                           | Default     | Description                                                |
| ----------------- | ------------------------------ | ----------- | ---------------------------------------------------------- |
| `markers`         | `MapMarker[]`                  | `[]`        | Array of objects defining marker positions and appearance. |
| `initialCenter`   | `{ lat: number, lng: number }` | `undefined` | The initial coordinate to center the map on.               |
| `initialZoom`     | `number`                       | `10`        | The zoom level when the map loads (0-18).                  |
| `fitToMarkers`    | `boolean`                      | `true`      | If `true`, the map auto-zooms to fit all provided markers. |
| `draggable`       | `boolean`                      | `false`     | Global switch to enable dragging for all markers.          |
| `onMarkerPress`   | `(marker: MapMarker) => void`  | `-`         | Callback fired when a marker is tapped.                    |
| `onMarkerDragEnd` | `(marker: MapMarker) => void`  | `-`         | Callback fired when a marker drag completes.               |

### `MapMarker` Interface

```ts
interface MapMarker {
  latitude: number;
  longitude: number;
  name?: string; // Tooltip/Popup text
  draggable?: boolean; // Override global draggable prop
  icon?:
    | string
    | {
        url?: string;
        size?: [number, number]; // e.g. [32, 32]
        anchor?: [number, number]; // e.g. [16, 32]
      };
  [key: string]: any; // Allow passing extra data
}
```

---

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 👨‍💻 Hire an Expert!

Maintained by a Senior React Native Developer (5+ years experience)
🌐 [https://kristalpithwa.vercel.app](https://kristalpithwa.vercel.app)

## 📄 License

MIT © [Kristal Pithwa](https://github.com/kristalpithwa)
