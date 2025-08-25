import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Book, Users, SquareCheck as CheckSquare, Heart, Lightbulb } from 'lucide-react-native';

export default function Semana3Screen() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#3B82F6', '#2563EB']}
          style={styles.header}
        >
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="white" />
          </TouchableOpacity>
          
          <Text style={styles.headerTitle}>Semana 3</Text>
          <Text style={styles.headerSubtitle}>Lidando com a abstinência</Text>
          <View style={styles.themeBadge}>
            <Text style={styles.themeText}>Preparação e Consciência</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Book size={24} color="#6B7280" />
            </View>
            <Text style={styles.statusText}>Próxima Semana</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Book size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Aula da Semana</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Estratégias para crises e fissuras</Text>
              <Text style={styles.cardDescription}>
                Aprenda técnicas comprovadas para superar momentos de fissura intensa e crises de abstinência.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Roda de Conversa</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Compartilhando técnicas que ajudam</Text>
              <Text style={styles.cardDescription}>
                Troque experiências sobre estratégias que funcionaram para você e aprenda com outros participantes.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckSquare size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Atividade Prática</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Testar respiração diafragmática</Text>
              <Text style={styles.cardDescription}>
                Pratique a técnica de respiração diafragmática por 10 minutos, 3 vezes ao dia, para controlar ansiedade e fissura.
              </Text>
            </View>
          </View>

          <View style={styles.taskSection}>
            <View style={styles.taskHeader}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.taskTitle}>Como você pode estar se sentindo</Text>
            </View>
            <Text style={styles.taskDescription}>
              Na terceira semana, os sintomas físicos diminuem, mas podem surgir fissuras psicológicas intensas. É comum sentir irritabilidade e dificuldade de concentração.
            </Text>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Lightbulb size={16} color="#166534" />
                <Text style={styles.tipsTitle}>Dicas para esta semana</Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Técnica 5-4-3-2-1:</Text> Identifique 5 coisas que vê, 4 que ouve, 3 que toca, 2 que cheira, 1 que saboreia para controlar ansiedade.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Mudança de ambiente:</Text> Quando sentir fissura, mude imediatamente de local. Vá para outro cômodo ou saia de casa.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Atividade física:</Text> 15 minutos de exercício liberam endorfinas que combatem naturalmente a fissura.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Distração ativa:</Text> Tenha sempre uma lista de atividades de 5 minutos: ligar para alguém, fazer palavras cruzadas, organizar algo.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Marco de saúde:</Text> Em 2 semanas, sua circulação melhora significativamente e o risco de ataque cardíaco diminui.
                </Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    alignSelf: 'flex-start',
    marginBottom: 15,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 18,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  themeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'flex-start',
  },
  themeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 20,
  },
  statusCard: {
    backgroundColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#D1D5DB',
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
  },
  section: {
    marginBottom: 25,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 10,
  },
  card: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  cardDescription: {
    fontSize: 14,
    color: '#6B7280',
    lineHeight: 20,
  },
  taskSection: {
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginLeft: 10,
  },
  taskDescription: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
    marginBottom: 15,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: '#F0FDF4',
    padding: 15,
    borderRadius: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#22C55E',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  tipsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    marginLeft: 8,
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  tipBullet: {
    fontSize: 16,
    color: '#22C55E',
    marginRight: 8,
    marginTop: 2,
  },
  tipText: {
    fontSize: 14,
    color: '#166534',
    lineHeight: 20,
    flex: 1,
  },
  tipBold: {
    fontWeight: '600',
  },
});