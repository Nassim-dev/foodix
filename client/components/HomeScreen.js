import { View, Text, StyleSheet } from 'react-native';

export default function HomeScreen({ route }) {
  const code = route?.params?.code;

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Bienvenue sur Foodix 🍏</Text>
      
      {code ? <Text style={styles.code}>Dernier code scanné : {code}</Text> : <Button title="Scanner un produit" onPress={() => navigation.navigate('Scan')} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, marginBottom: 20 },
  code: { fontSize: 18, color: 'green' },
});
