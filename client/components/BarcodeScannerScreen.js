import { CameraView, useCameraPermissions } from 'expo-camera';
import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { commonStyles } from '../styles';

export default function BarcodeScannerScreen() {
  const navigation = useNavigation();
  const [permission, requestPermission] = useCameraPermissions();
  const [scanned, setScanned] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);

  if (!permission) return <View />;
  if (!permission.granted) {
    return (
      <View style={commonStyles.container}>
        <Text style={styles.message}>On a besoin de la permission caméra.</Text>
        <TouchableOpacity style={commonStyles.button} onPress={requestPermission}>
          <Text style={commonStyles.buttonText}>Autoriser</Text>
        </TouchableOpacity>
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
    <View style={commonStyles.container}>
      {!showCamera ? (
        <View style={styles.startContainer}>
          <TouchableOpacity style={commonStyles.button} onPress={() => setShowCamera(true)}>
            <Text style={commonStyles.buttonText}>Lancer le scan</Text>
          </TouchableOpacity>
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
  startContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  camera: {
    flex: 1,
    width: '100%',
  },
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
    color: '#4E2C00',
  },
  message: {
    textAlign: 'center',
    padding: 10,
    fontSize: 16,
    color: '#4E2C00',
  },
});
