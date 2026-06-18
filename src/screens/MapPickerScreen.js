import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useTranslation } from 'react-i18next';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Colors, Typography, Spacing, Radius, Shadows } from '../core/theme';
import { PrimaryButton } from '../components/SharedWidgets';
import LeafletMap from '../components/LeafletMap';

const DEFAULT_LOCATION = {
  latitude: 41.0082,
  longitude: 28.9784,
};

export default function MapPickerScreen({ navigation, route }) {
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const params = route?.params || {};

  const initialLat = params.initialLat ?? DEFAULT_LOCATION.latitude;
  const initialLng = params.initialLng ?? DEFAULT_LOCATION.longitude;

  const [selectedLocation, setSelectedLocation] = useState(
    params.initialLat != null && params.initialLng != null
      ? { latitude: params.initialLat, longitude: params.initialLng }
      : null
  );

  const handleMapPress = (lat, lng) => {
    setSelectedLocation({ latitude: lat, longitude: lng });
  };

  const handleConfirm = () => {
    if (!selectedLocation) return;
    if (typeof params.onSelect === 'function') {
      params.onSelect({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
    }
    navigation.goBack();
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}> 
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}>
          <Text style={styles.backIcon}>←</Text>
        </TouchableOpacity>
        <Text style={[Typography.heading2, { flex: 1, textAlign: 'center' }]} numberOfLines={1}>
          {t('select_delivery_location')}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.mapWrapper}>
        <LeafletMap
          lat={selectedLocation?.latitude ?? initialLat}
          lng={selectedLocation?.longitude ?? initialLng}
          markers={
            selectedLocation
              ? [{ lat: selectedLocation.latitude, lng: selectedLocation.longitude, title: t('delivery_location') }]
              : []
          }
          interactive
          onPress={handleMapPress}
        />
      </View>

      <View style={styles.footer}>
        <View style={styles.locationSummary}>
          <Text style={Typography.bodySmall}>{t('tap_map_hint')}</Text>
          <Text style={Typography.body} numberOfLines={1}>
            {selectedLocation
              ? `${selectedLocation.latitude.toFixed(5)}, ${selectedLocation.longitude.toFixed(5)}`
              : t('pick_on_map')}
          </Text>
        </View>
        <PrimaryButton
          label={t('confirm_location')}
          onPress={handleConfirm}
          disabled={!selectedLocation}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.surface,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: Spacing.md,
    paddingBottom: Spacing.sm,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    backgroundColor: Colors.surface,
  },
  backIcon: {
    fontSize: 24,
    color: Colors.textPrimary,
  },
  mapWrapper: {
    flex: 1,
    margin: Spacing.md,
    borderRadius: Radius.lg,
    overflow: 'hidden',
    backgroundColor: Colors.background,
    ...Shadows.md,
  },
  footer: {
    paddingHorizontal: Spacing.md,
    paddingBottom: Math.max(Spacing.lg, 16),
    paddingTop: Spacing.sm,
    backgroundColor: Colors.surface,
  },
  locationSummary: {
    marginBottom: Spacing.md,
    padding: Spacing.md,
    borderRadius: Radius.lg,
    backgroundColor: Colors.cardBg,
    borderWidth: 1,
    borderColor: Colors.divider,
  },
});
