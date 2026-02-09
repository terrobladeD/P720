import * as Location from 'expo-location';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import MapView, { Marker, Region } from 'react-native-maps';

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

export default function MapPage() {
  const mapRef = useRef<MapView | null>(null);
  const [loading, setLoading] = useState(true);
  const [permissionDenied, setPermissionDenied] = useState(false);
  const [userRegion, setUserRegion] = useState<Region | null>(null);

  const locateMe = useCallback(async () => {
    setLoading(true);
    setPermissionDenied(false);

    const permission = await Location.requestForegroundPermissionsAsync();
    if (permission.status !== 'granted') {
      setPermissionDenied(true);
      setLoading(false);
      return;
    }

    const position = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    const nextRegion: Region = {
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
      latitudeDelta: 0.01,
      longitudeDelta: 0.01,
    };

    setUserRegion(nextRegion);
    mapRef.current?.animateToRegion(nextRegion, 500);
    setLoading(false);
  }, []);

  useEffect(() => {
    void locateMe();
  }, [locateMe]);

  if (Platform.OS === 'web') {
    return (
      <View style={styles.centerContainer}>
        <Text style={styles.title}>Map Page</Text>
        <Text style={styles.subtitle}>Web 暂不启用原生地图，请在 iOS/Android 预览。</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <MapView
        ref={mapRef}
        style={StyleSheet.absoluteFill}
        initialRegion={userRegion ?? DEFAULT_REGION}
        showsUserLocation
        showsMyLocationButton>
        {userRegion ? (
          <Marker
            coordinate={{ latitude: userRegion.latitude, longitude: userRegion.longitude }}
            title="You"
            description="Current location"
          />
        ) : null}
      </MapView>

      {loading ? (
        <View style={styles.overlay}>
          <ActivityIndicator size="large" />
          <Text style={styles.overlayText}>Locating...</Text>
        </View>
      ) : null}

      {permissionDenied ? (
        <View style={styles.permissionCard}>
          <Text style={styles.permissionTitle}>Location Permission Needed</Text>
          <Text style={styles.permissionText}>需要定位权限来展示你在地图上的位置。</Text>
          <Pressable style={styles.primaryButton} onPress={() => void locateMe()}>
            <Text style={styles.primaryButtonText}>Retry</Text>
          </Pressable>
        </View>
      ) : null}

      <Pressable style={styles.fab} onPress={() => void locateMe()}>
        <Text style={styles.fabText}>定位我</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
  overlay: {
    position: 'absolute',
    top: 24,
    alignSelf: 'center',
    backgroundColor: 'rgba(255,255,255,0.95)',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 10,
    alignItems: 'center',
    gap: 4,
  },
  overlayText: {
    fontSize: 13,
    color: '#374151',
  },
  permissionCard: {
    position: 'absolute',
    left: 16,
    right: 16,
    bottom: 88,
    backgroundColor: 'white',
    borderRadius: 14,
    padding: 14,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
    gap: 8,
  },
  permissionTitle: {
    fontSize: 16,
    fontWeight: '700',
  },
  permissionText: {
    fontSize: 14,
    color: '#4b5563',
  },
  primaryButton: {
    alignSelf: 'flex-start',
    backgroundColor: '#111827',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
  },
  primaryButtonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  fab: {
    position: 'absolute',
    right: 16,
    bottom: 24,
    backgroundColor: '#111827',
    borderRadius: 999,
    paddingHorizontal: 14,
    paddingVertical: 10,
  },
  fabText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
});
