import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ArrowLeft, Book, Users, SquareCheck as CheckSquare, Heart, Lightbulb, Clock } from 'lucide-react-native';

export default function Semana2Screen() {
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
          
          <Text style={styles.headerTitle}>Semana 2</Text>
          <Text style={styles.headerSubtitle}>Motivação para mudança</Text>
          <View style={styles.themeBadge}>
            <Text style={styles.themeText}>Preparação e Consciência</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.statusCard}>
            <View style={styles.statusIcon}>
              <Clock size={24} color="#F59E0B" />
            </View>
            <Text style={styles.statusText}>Semana Atual</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Book size={20} color="#3B82F6" />
              <Text style={styles.sectionTitle}>Aula da Semana</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>O impacto na saúde, família e vida</Text>
              <Text style={styles.cardDescription}>
                Explore como o tabagismo afeta não apenas sua saúde física, mas também seus relacionamentos e qualidade de vida geral.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Roda de Conversa</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>O que me motiva a mudar?</Text>
              <Text style={styles.cardDescription}>
                Compartilhe suas motivações pessoais e descubra o que realmente impulsiona sua decisão de parar de fumar.
              </Text>
            </View>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckSquare size={20} color="#8B5CF6" />
              <Text style={styles.sectionTitle}>Atividade Prática</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.cardTitle}>Lista de motivos pessoais</Text>
              <Text style={styles.cardDescription}>
                Crie uma lista detalhada dos seus motivos para parar de fumar. Mantenha-a sempre à mão para momentos difíceis.
              </Text>
            </View>
          </View>

          <View style={styles.taskSection}>
            <View style={styles.taskHeader}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.taskTitle}>Como você pode estar se sentindo</Text>
            </View>
            <Text style={styles.taskDescription}>
              Na segunda semana, a fissura física diminui, mas pode surgir ansiedade emocional. É normal questionar sua decisão - isso faz parte do processo.
            </Text>
            
            <View style={styles.tipsContainer}>
              <View style={styles.tipsHeader}>
                <Lightbulb size={16} color="#166534" />
                <Text style={styles.tipsTitle}>Dicas para esta semana</Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Lista de motivações:</Text> Releia sua lista de motivos 3x ao dia, especialmente nos momentos de fissura.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Visualização:</Text> Imagine-se daqui a 1 ano, saudável e livre. Dedique 5 minutos diários a essa prática.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Recompensas:</Text> Calcule quanto já economizou e planeje uma pequena recompensa para si mesmo.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Apoio social:</Text> Conte para 3 pessoas próximas sobre sua decisão e peça apoio delas.
                </Text>
              </View>
              
              <View style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>
                  <Text style={styles.tipBold}>Marco de saúde:</Text> Em 12 horas, o nível de monóxido de carbono no sangue normaliza completamente.
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
    backgroundColor: '#FEF3C7',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 15,
    borderRadius: 12,
    marginBottom: 25,
    borderWidth: 1,
    borderColor: '#F59E0B',
  },
  statusIcon: {
    marginRight: 10,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#92400E',
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