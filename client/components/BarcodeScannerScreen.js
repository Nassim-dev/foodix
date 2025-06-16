import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { View, Text, Button, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

export default function BarcodeScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={styles.container}>
        <Text style={styles.message}>On a besoin de la permission caméra.</Text>
        <Button onPress={requestPermission} title="Autoriser" />
      </View>
    );
  }

  const handleBarcodeScanned = ({ type, data }) => {
    if (!scanned) {
      setScanned(true);
      setBarcodeData(data);

      setTimeout(() => {
        navigation.replace('Home', { code: data });
      }, 1000);

    }
  };

  return (
    <View style={styles.container}>
      {!showCamera ? (
        <View style={styles.startContainer}>
          <Button title="Scanner un produit" onPress={() => setShowCamera(true)} />
          {barcodeData && (
            <Text style={styles.result}>Dernier scan : {barcodeData}</Text>
          )}
        </View>
      ) : (
        <CameraView
          style={styles.camera}
          onBarcodeScanned={handleBarcodeScanned}
          barcodeScannerSettings={{
            barcodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
          }}
        >
          {/* ✅ Rectangle dynamique */}
          <View
            style={[
              styles.scanBox,
              { borderColor: scanned ? 'green' : 'orange' },
            ]}
          />
        </CameraView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: { flex: 1 },
  scanBox: {
    position: 'absolute',
    top: '30%',
    left: '15%',
    width: '70%',
    height: 200,
    borderWidth: 3,
    borderRadius: 12,
    backgroundColor: 'transparent',
  },
  result: {
    marginTop: 20,
    fontSize: 16,
  },
  message: {
    textAlign: 'center',
    padding: 10,
  },
});
