import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { ChevronRight, Calendar, CircleCheck, Clock, Book, Heart, Lightbulb } from 'lucide-react-native';

import { supabase } from '../../lib/supabase';
import { useEffect, useState } from 'react';
import { ProgramWeek, UserProgress } from '../types/database';
import { programWeeksData } from '../../program_weeks_data';

export default function ProgramaScreen() {
  const router = useRouter();
  const [programData, setProgramData] = useState<ProgramWeek[]>([]);
  const [userProgress, setUserProgress] = useState<UserProgress[]>([]);  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadProgramData();
  }, []);

  const loadProgramData = async () => {
    try {
      // Carregar dados do programa do arquivo local
      setProgramData(programWeeksData);

      // Carregar progresso do usuário do Supabase
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data: progress, error: progressError } = await supabase
          .from('user_progress')
          .select('*')
          .eq('user_id', user.id);
        if (progressError) throw progressError;
        setUserProgress(progress || []);
      }

      setLoading(false);
    } catch (error) {
      console.error('Erro ao carregar dados do programa:', error);
      setLoading(false);
    }
  };

  const getThemeColor = (theme: string) => {
    switch (theme) {
      case "Preparação e Consciência":
        return "#3B82F6";
      case "Fortalecimento e Mudança":
        return "#E67C00"; // Laranja mais escuro
      case "Consoluição e Nova Vida":
        return "#8E56C0"; // Roxo mais escuro
      default:
        return "#6B5280";
    }
  };

  const renderWeekCard = (week: ProgramWeek, index: number) => {
    const themeColor = getThemeColor(week.theme);
    // Determinar se a semana está completa ou é a semana atual com base no progresso real do usuário
    const completed = userProgress.some(p => p.week_number === week.week_number && p.completed);
    const currentWeekData = userProgress.find(p => p.current_week);
    const current = currentWeekData ? currentWeekData.week_number === week.week_number : false;
    
    return (
      <TouchableOpacity 
        key={week.week_number} 
        style={[
          styles.weekCard,
          current && styles.currentWeekCard,
          completed && styles.completedWeekCard
        ]}
        onPress={() => {
          // Navegar para uma tela de detalhes da semana, passando os dados da semana
          router.push({ pathname: `/semana/${week.week_number}`, params: { weekData: JSON.stringify(week) } });
        }}
      >
        <View style={styles.weekHeader}>
          <View style={styles.weekNumber}>
            {completed ? (
              <CircleCheck size={24} color="#22C55E" />
            ) : current ? (
              <Clock size={24} color="#F59E0B" />
            ) : (
              <Text style={styles.weekNumberText}>{week.week_number}</Text>
            )}
          </View>
          <View style={styles.weekInfo}>
            <Text style={styles.weekTitle}>{week.title}</Text>
            <View style={[styles.themeBadge, { backgroundColor: themeColor + '20' }]}>
              <Text style={[styles.themeText, { color: themeColor }]}>
                {week.theme}
              </Text>
            </View>
          </View>
          <ChevronRight size={20} color="#9CA3AF" />
        </View>
        <LinearGradient
          colors={["#FFFFFF", "#F9FAFB"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={styles.weekCardContent}
        >
          <View style={styles.contentItem}>
            <Book size={16} color="#6B7280" />
            <Text style={styles.contentLabel}>Aula:</Text>
            <Text style={styles.contentText}>{week.lesson}</Text>
          </View>
          
          <View style={styles.contentItem}>
            <Calendar size={16} color="#6B7280" />
            <Text style={styles.contentLabel}>Roda:</Text>
            <Text style={styles.contentText}>{week.circle}</Text>
          </View>

          <View style={styles.contentItem}>
            <CircleCheck size={16} color="#6B7280" />
            <Text style={styles.contentLabel}>Atividade:</Text>
            <Text style={styles.contentText}>{week.activity}</Text>
          </View>
        </LinearGradient>

        <View style={styles.taskSection}>
          <View style={styles.taskHeader}>
            <Heart size={16} color="#EF4444" />
            <Text style={styles.taskTitle}>{week.task_title}</Text>
          </View>
          <Text style={styles.taskDescription}>{week.task_description}</Text>
          
          <View style={styles.tipsContainer}>
            <View style={styles.tipsHeader}>
              <Lightbulb size={14} color="#166534" />
              <Text style={styles.tipsTitle}>Dicas para esta semana</Text>
            </View>
            {week.tips.map((tip, tipIndex) => (
              <View key={tipIndex} style={styles.tipItem}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        </View>

        {current && (
          <LinearGradient
            colors={["#F59E0B", "#F97316"]}
            style={styles.currentBadge}
          >
            <Text style={styles.currentBadgeText}>Semana Atual</Text>
          </LinearGradient>
        )}
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando programa...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const totalWeeks = programData.length;
  const completedWeeksCount = userProgress.filter(p => p.completed).length;
  const progressPercentage = totalWeeks > 0 ? (completedWeeksCount / totalWeeks) * 100 : 0;

  const monthSections = [
    {
      title: "Mês 1 - Preparação e Consciência",
      weeks: programData.filter(w => w.week_number >= 1 && w.week_number <= 4),
      color: "#3B82F6"
    },
    {
      title: "Mês 2 - Fortalecimento e Mudança", 
      weeks: programData.filter(w => w.week_number >= 5 && w.week_number <= 8),
      color: "#E67C00"
    },
    {
      title: "Mês 3 - Consolidação e Nova Vida",
      weeks: programData.filter(w => w.week_number >= 9 && w.week_number <= 12),
      color: "#8E56C0"
    }
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={["#22C55E", "#16A34A"]}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Programa 12 Semanas</Text>
          <Text style={styles.headerSubtitle}>
            Jornada de Transformação - Método Breno
          </Text>
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View style={[
                styles.progressFill,
                { width: `${progressPercentage}%` }
              ]} />
            </View>
            <Text style={styles.progressText}>{completedWeeksCount} de {totalWeeks} semanas completadas</Text>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {monthSections.map((section, index) => (
            <View key={index} style={styles.monthSection}>
              <View style={styles.monthHeader}>
                <View style={[styles.monthIndicator, { backgroundColor: section.color }]} />
                <Text style={styles.monthTitle}>{section.title}</Text>
              </View>
              {section.weeks.map((week) => renderWeekCard(week, programData.indexOf(week)))}
            </View>
          ))}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: '#6B7280',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    padding: 20,
    paddingVertical: 30,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  progressContainer: {
    marginTop: 10,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.9)',
  },
  content: {
    padding: 20,
  },
  monthSection: {
    marginBottom: 30,
  },
  monthHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  monthIndicator: {
    width: 4,
    height: 20,
    borderRadius: 2,
    marginRight: 12,
  },
  monthTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  weekCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 8,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  currentWeekCard: {
    border_width: 2,
    border_color: '#F59E0B',
    backgroundColor: '#FFFBEB',
  },
  completedWeekCard: {
    opacity: 0.7,
  },
  weekHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    paddingBottom: 15,
    backgroundColor: '#F9FAFB',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  weekNumber: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  weekNumberText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#374127',
  },
  weekInfo: {
    flex: 1,
  },
  weekTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
  },
  themeBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
    alignSelf: 'flex_start',
  },
  themeText: {
    fontSize: 12,
    fontWeight: '500',
  },
  weekCardContent: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    gap: 8,
  },
  contentItem: {
    flexDirection: 'row',
    alignItems: 'flex_start',
    gap: 8,
  },
  content_label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374_51',
    min_width: 70,
  },
  contentText: {
    fontSize: 14,
    color: '#6B7280',
    flex: 1,
    lineHeight: 20,
  },
  current_badge: {
    position: 'absolute',
    top: 0,
    right: 0,
    padding_horizontal: 12,
    padding_vertical: 6,
    borderBottomLeftRadius: 15,
  },
  currentBadgeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  taskSection: {
    padding_horizontal: 20,
    padding_bottom: 15,
    borderTopWidth: 1,
    borderColor: '#E5E7EB',
    marginTop: 10,
    padding_top: 15,
  },
  taskHeader: {
    flexDirection: 'row',
    alignItems: 'flex_start',
    marginBottom: 8,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    marginLeft: 6,
  },
  taskDescription: {
    fontSize: 13,
    color: '#374151',
    lineHeight: 18,
    marginBottom_of_text: 12,
    fontStyle: 'italic',
  },
  tipsContainer: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 10,
    borderLeftWidth: 3,
    border_left_color: '#22C55E',
  },
  tipsHeader: {
    flexDirection: 'row',
    alignItems: 'flex_start',
    marginBottom: 8,
  },
  tipsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#166534',
    marginLeft: 6,
  },
  tipItem: {
    flexDirection: 'row',
    align_items: 'flex_start',
    marginBottom: 6,
  },
  tipBullet: {
    fontSize: 14,
    color: '#22C55E',
    marginRight: 6,
    marginTop: 1,
  },
  tipText: {
    fontSize: 12,
    color: '#166534',
    lineHeight: 16,
    flex: 1,
  },
});

