import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { ChevronLeft, BookOpen, Users, CheckCircle, Heart, Lightbulb, Star } from 'lucide-react-native';
import { ProgramWeek } from '../../types/database';
import { LinearGradient } from 'expo-linear-gradient';

export default function WeekDetailsScreen() {
  const router = useRouter();
  const { id, weekData } = useLocalSearchParams();
  const week: ProgramWeek = JSON.parse(weekData as string);

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case "Preparação e Consciência":
        return "#3B82F6";
      case "Fortalecimento e Mudança":
        return "#F59E0B";
      case "Consolidação e Nova Vida":
        return "#8B5CF6";
      default:
        return "#6B7280";
    }
  };

  const themeColor = getThemeColor(week.theme);

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={[themeColor, themeColor + 'B3']}
          style={styles.header}
        >
          <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
            <ChevronLeft size={24} color="#FFFFFF" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{week.title}</Text>
          <View style={[styles.themeBadge, { backgroundColor: 'rgba(255, 255, 255, 0.2)' }]}>
            <Text style={[styles.themeText, { color: '#FFFFFF' }]}>{week.theme}</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <BookOpen size={20} color={themeColor} />
              <Text style={styles.sectionTitle}>Aula da Semana</Text>
            </View>
            <Text style={styles.sectionContent}>{week.lesson}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Users size={20} color={themeColor} />
              <Text style={styles.sectionTitle}>Roda de Conversa</Text>
            </View>
            <Text style={styles.sectionContent}>{week.circle}</Text>
          </View>

          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <CheckCircle size={20} color={themeColor} />
              <Text style={styles.sectionTitle}>Atividade Prática</Text>
            </View>
            <Text style={styles.sectionContent}>{week.activity}</Text>
          </View>

          <View style={styles.taskSection}>
            <View style={styles.sectionHeader}>
              <Heart size={20} color="#EF4444" />
              <Text style={styles.sectionTitle}>Sua Missão da Semana</Text>
            </View>
            <Text style={styles.taskDescription}>{week.task_description}</Text>
          </View>

          <View style={styles.tipsSection}>
            <View style={styles.sectionHeader}>
              <Lightbulb size={20} color="#F59E0B" />
              <Text style={styles.sectionTitle}>Dicas de Ouro</Text>
            </View>
            {week.tips.map((tip, index) => (
              <View key={index} style={styles.tipItem}>
                <Star size={14} color="#F59E0B" style={styles.tipIcon} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
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
    paddingTop: 50,
    paddingBottom: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  backButton: {
    position: 'absolute',
    top: 50,
    left: 20,
    zIndex: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    marginBottom: 10,
  },
  themeBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 15,
    alignSelf: 'center',
  },
  themeText: {
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    padding: 20,
    gap: 20,
  },
  section: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 3,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  sectionContent: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
  taskSection: {
    backgroundColor: '#FEF2F2',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#EF4444',
  },
  taskDescription: {
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
    fontStyle: 'italic',
  },
  tipsSection: {
    backgroundColor: '#FFFBEB',
    borderRadius: 15,
    padding: 20,
    borderLeftWidth: 5,
    borderLeftColor: '#F59E0B',
  },
  tipItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    marginBottom: 10,
  },
  tipIcon: {
    marginTop: 4,
  },
  tipText: {
    flex: 1,
    fontSize: 16,
    lineHeight: 24,
    color: '#374151',
  },
});