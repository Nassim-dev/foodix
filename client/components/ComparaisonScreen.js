import { View, Text, StyleSheet } from 'react-native';
import { commonStyles } from '../styles';

export default function ComparaisonScreen() {
  return (
    <View style={commonStyles.container}>
      <Text style={styles.text}>Comparaison</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 18 },
});
