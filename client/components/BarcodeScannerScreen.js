import React, { useState, useEffect, useRef } from 'react';
import { Text, View, StyleSheet, Button } from 'react-native';
import { Camera } from 'expo-camera';

export default function BarcodeScannerScreen() {
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [barcodeData, setBarcodeData] = useState(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    (async () => {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const handleBarCodeScanned = ({ type, data }) => {
    setScanned(true);
    setBarcodeData(data);
    alert(`Code-barres scanné : ${data}`);
  };

  if (hasPermission === null) return <Text>Demande de permission...</Text>;
  if (hasPermission === false) return <Text>Accès caméra refusé</Text>;

  return (
    <View style={styles.container}>
      <Camera
        style={StyleSheet.absoluteFillObject}
        ref={cameraRef}
        onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
        barCodeScannerSettings={{
          barCodeTypes: ['ean13', 'ean8', 'upc_a', 'upc_e'],
        }}
      />
      {scanned && <Button title="Scanner à nouveau" onPress={() => setScanned(false)} />}
      {barcodeData && <Text style={styles.text}>Code : {barcodeData}</Text>}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  text: {
    backgroundColor: '#fff',
    padding: 16,
    textAlign: 'center',
  },
});
