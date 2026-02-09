import { StyleSheet, Text, View } from 'react-native';

export default function FriendsPage() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Friends Page</Text>
      <Text style={styles.subtitle}>Placeholder</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  title: {
    fontSize: 24,
    fontWeight: '600',
  },
  subtitle: {
    fontSize: 14,
    color: '#6b7280',
  },
});
