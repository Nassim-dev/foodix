import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, Button } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';

export default function HomeScreen({ navigation, route }) {
  const code = route?.params?.code;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!code) return;

    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/product/${code}?essential=true`);
        setProduct(response.data);
      } catch (error) {
        console.error('Erreur API:', error);
        setProduct({ product_name: 'Erreur de chargement' });
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [code]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Foodix 🍏</Text>

      {code ? <Text style={styles.code}>Dernier code scanné : {code}</Text> : <Button title="Scanner un produit" onPress={() => navigation.navigate('Scan')} />}

      {!code && <Text>Aucun produit scanné</Text>}
      {loading && <ActivityIndicator size="large" color="#ff6600" />}

      {product && (
        <View style={styles.card}>
          <Text style={styles.name}>{product.product_name}</Text>
          {product.image_url && (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          )}
          <Text>Nutri-Score : {product.nutriscore.grade.toUpperCase()} ({product.nutriscore.score})</Text>
          <Text>Éco-Score : {product.ecoscore.grade.toUpperCase()} ({product.ecoscore.score})</Text>
          <Text>Nova Group : {product.nova_group}</Text>

          <View style={{ marginTop: 10 }}>
            <Text style={styles.subtitle}>⚠️ Risques santé :</Text>
            <Text>Sucres : {product.health_risks.sugars} g</Text>
            <Text>Graisses : {product.health_risks.fat} g</Text>
            <Text>Gr. saturées : {product.health_risks.saturated_fat} g</Text>
            <Text>Sel : {product.health_risks.salt} g</Text>
            <Text>Huile de palme : {product.health_risks.palm_oil ? 'Oui' : 'Non'}</Text>
            <Text>Additifs : {product.health_risks.additives.join(', ')}</Text>
            <Text>Allergènes : {product.health_risks.allergens.join(', ')}</Text>
          </View>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, alignItems: 'center' },
  title: { fontSize: 22, marginVertical: 10 },
  card: { marginTop: 20, alignItems: 'center' },
  name: { fontSize: 18, fontWeight: 'bold', marginBottom: 10 },
  subtitle: { fontSize: 16, marginTop: 10, fontWeight: '600' },
  image: { width: 150, height: 150, marginBottom: 10, borderRadius: 12 },
});
