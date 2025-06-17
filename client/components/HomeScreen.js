import { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { API_BASE_URL } from '../config';
import { commonStyles } from '../styles';

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
    <View style={commonStyles.container}>
      <Text style={commonStyles.title}>Bienvenue sur Foodix 🍏</Text>

      {code ? (
        <Text style={styles.code}>Dernier code scanné : {code}</Text>
      ) : (
        <TouchableOpacity style={commonStyles.button} onPress={() => navigation.navigate('Scan')}>
          <Text style={commonStyles.buttonText}>Scanner un produit</Text>
        </TouchableOpacity>
      )}

      {loading && <ActivityIndicator size="large" color="#FF9100" style={{ marginTop: 20 }} />}

      {!code && !loading && (
        <Text style={commonStyles.subtitle}>Aucun produit scanné</Text>
      )}

      {product && (
        <View style={styles.card}>
          <Text style={styles.name}>{product.product_name}</Text>
          {product.image_url && (
            <Image source={{ uri: product.image_url }} style={styles.image} />
          )}
          <Text style={styles.score}>Nutri-Score : {product.nutriscore.grade.toUpperCase()} ({product.nutriscore.score})</Text>
          <Text style={styles.score}>Éco-Score : {product.ecoscore.grade.toUpperCase()} ({product.ecoscore.score})</Text>
          <Text style={styles.score}>Nova Group : {product.nova_group}</Text>

          <View style={{ marginTop: 10 }}>
            <Text style={commonStyles.subtitle}>⚠️ Risques santé :</Text>
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
  code: {
    fontSize: 16,
    fontStyle: 'italic',
    color: '#4E2C00',
    marginBottom: 10,
  },
  card: {
    marginTop: 20,
    alignItems: 'center',
    backgroundColor: '#FFFDF6',
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 5,
    width: '100%',
  },
  name: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#FF3D00',
    marginBottom: 10,
    textAlign: 'center',
  },
  score: {
    fontSize: 16,
    fontWeight: '500',
    color: '#333',
    marginVertical: 2,
  },
  image: {
    width: 150,
    height: 150,
    marginBottom: 10,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#FFB84D',
  },
});
