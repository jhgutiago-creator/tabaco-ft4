import { View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Alert, Modal, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { Calendar, MessageCircle, User, Award, TrendingUp, Heart, ChevronLeft, ChevronRight, MapPin, Clock, X, Star, Trophy, Target, Activity } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface CalendarEvent {
  date: string;
  title: string;
  time: string;
  type: 'aula' | 'roda' | 'atividade';
}

interface Symptom {
  id: string;
  name: string;
  selected: boolean;
}

interface UserData {
  profile: {
    nome_completo: string;
    email: string;
  } | null;
  stats: {
    quit_date: string;
    days_smoke_free: number;
    money_saved: number;
    cigarettes_not_smoked: number;
    aulas_assistidas: number;
    rodas_participadas: number;
    atividades_concluidas: number;
  } | null;
  progress: {
    current_week: number;
    completed_weeks: number;
    total_weeks: number;
  } | null;
}

const mockEvents: CalendarEvent[] = [
  { date: '2025-01-15', title: 'Roda: Minha história com a substância', time: '19:00', type: 'roda' },
  { date: '2025-01-17', title: 'Aula: Como o vício age no cérebro', time: '20:00', type: 'aula' },
  { date: '2025-01-20', title: 'Atividade: Diário de hábitos', time: '18:00', type: 'atividade' },
  { date: '2025-01-22', title: 'Roda: O que me motiva a mudar?', time: '19:00', type: 'roda' },
  { date: '2025-01-24', title: 'Aula: O impacto na saúde', time: '20:00', type: 'aula' },
];

const symptoms: Symptom[] = [
  { id: '1', name: 'Ansiedade', selected: false },
  { id: '2', name: 'Medo', selected: false },
  { id: '3', name: 'Dor de cabeça', selected: false },
  { id: '4', name: 'Agitação', selected: false },
  { id: '5', name: 'Irritabilidade', selected: false },
  { id: '6', name: 'Ganho de peso', selected: false },
  { id: '7', name: 'Tosse', selected: false },
  { id: '8', name: 'Dor de garganta', selected: false },
  { id: '9', name: 'Constipação', selected: false },
  { id: '10', name: 'Impaciência', selected: false },
];

export default function HomeScreen() {
  const router = useRouter();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedSymptoms, setSelectedSymptoms] = useState<Symptom[]>(symptoms);
  const [diaryText, setDiaryText] = useState('');
  const [showReportModal, setShowReportModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [userData, setUserData] = useState<UserData>({
    profile: null,
    stats: null,
    progress: null
  });
  const [loadingUserData, setLoadingUserData] = useState(true);

  const today = new Date();

  // Buscar dados reais do usuário
  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      setLoadingUserData(true);
      
      // Verificar autenticação
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError || !user) {
        console.error('Usuário não autenticado:', userError);
        return;
      }

      // Buscar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('nome_completo, email')
        .eq('id', user.id)
        .single();

      // Buscar estatísticas do usuário
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      // Buscar progresso do usuário
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('week_number, completed, current_week')
        .eq('user_id', user.id);

      // Calcular progresso
      let progressData = null;
      if (progress && progress.length > 0) {
        const completedWeeks = progress.filter(p => p.completed).length;
        const currentWeek = progress.find(p => p.current_week)?.week_number || 1;
        progressData = {
          current_week: currentWeek,
          completed_weeks: completedWeeks,
          total_weeks: 12
        };
      }

      setUserData({
        profile: profile || null,
        stats: stats || null,
        progress: progressData
      });

    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
    } finally {
      setLoadingUserData(false);
    }
  };

  const getContextualMessage = () => {
    const daysSinceQuit = userData.stats?.days_smoke_free || 0;
    
    if (daysSinceQuit <= 3) {
      return "Os primeiros dias são os mais desafiadores. Seu corpo está se adaptando à ausência da nicotina. É normal sentir ansiedade e irritabilidade.";
    } else if (daysSinceQuit <= 7) {
      return "Você está superando a fase mais difícil! Sua circulação está melhorando e o paladar voltando ao normal.";
    } else if (daysSinceQuit <= 14) {
      return "Parabéns! Duas semanas é um marco importante. Sua capacidade pulmonar está aumentando e você tem mais energia.";
    } else if (daysSinceQuit <= 30) {
      return "Excelente progresso! Um mês livre do cigarro. Sua pele está mais saudável e o risco de infecções diminuiu.";
    } else {
      return "Você é uma inspiração! Continue assim, cada dia livre é uma vitória para sua saúde e bem-estar.";
    }
  };

  const toggleSymptom = (symptomId: string) => {
    setSelectedSymptoms(prev => 
      prev.map(symptom => 
        symptom.id === symptomId 
          ? { ...symptom, selected: !symptom.selected }
          : symptom
      )
    );
  };

  const saveDailyReport = async () => {
    try {
      setIsLoading(true);
      console.log('🚀 Iniciando salvamento do relatório diário...');
      
      // Verificar autenticação
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      
      if (userError) {
        console.error('❌ Erro na verificação de usuário:', userError);
        Alert.alert('Erro', 'Erro na autenticação: ' + userError.message);
        return;
      }
      
      if (!user) {
        console.error('❌ Usuário não autenticado');
        Alert.alert('Erro', 'Você precisa estar logado para salvar o relatório');
        return;
      }
      
      console.log('✅ Usuário autenticado:', user.id);
      
      // Preparar dados do relatório
      const selectedSymptomNames = selectedSymptoms
        .filter(s => s.selected)
        .map(s => s.name);
      
      const reportData = {
        user_id: user.id,
        report_date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
        symptoms: selectedSymptomNames,
        diary_text: diaryText || null,
        mood_level: null, // Pode ser adicionado futuramente
        craving_level: null, // Pode ser adicionado futuramente
      };
      
      console.log('📝 Dados do relatório preparados:', reportData);
      
      // Verificar se já existe um relatório para hoje
      const { data: existingReport, error: checkError } = await supabase
        .from('daily_reports')
        .select('id')
        .eq('user_id', user.id)
        .eq('report_date', reportData.report_date)
        .single();
      
      console.log('🔍 Verificação de relatório existente:', { existing: existingReport, error: checkError });
      
      let result, error;
      
      if (existingReport) {
        // Atualizar relatório existente
        console.log('🔄 Atualizando relatório existente...');
        const updateResult = await supabase
          .from('daily_reports')
          .update(reportData)
          .eq('user_id', user.id)
          .eq('report_date', reportData.report_date)
          .select();
        
        result = updateResult.data;
        error = updateResult.error;
      } else {
        // Criar novo relatório
        console.log('➕ Criando novo relatório...');
        const insertResult = await supabase
          .from('daily_reports')
          .insert([reportData])
          .select();
        
        result = insertResult.data;
        error = insertResult.error;
      }
      
      console.log('📊 Resultado do salvamento:', { result, error });
      
      if (error) {
        console.error('❌ Erro ao salvar relatório:', error);
        Alert.alert('Erro', 'Erro ao salvar relatório: ' + error.message);
        return;
      }
      
      console.log('✅ Relatório salvo com sucesso!');
      
      // Mostrar sucesso e resetar formulário
      Alert.alert(
        'Relatório salvo!',
        'Obrigado por compartilhar como você está se sentindo hoje. Continue assim!',
        [{ 
          text: 'OK', 
          onPress: () => {
            // Reset form
            setSelectedSymptoms(symptoms);
            setDiaryText('');
            setShowReportModal(false);
          }
        }]
      );
      
    } catch (error) {
      console.error('💥 Erro geral ao salvar relatório:', error);
      Alert.alert(
        'Erro',
        'Ocorreu um erro ao salvar seu relatório. Tente novamente.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  const getCalendarDays = () => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const currentDateStr = new Date();
    
    for (let i = 0; i < 42; i++) {
      const date = new Date(startDate);
      date.setDate(startDate.getDate() + i);
      
      const dateStr = date.toISOString().split('T')[0];
      const hasEvent = mockEvents.some(event => event.date === dateStr);
      const isToday = date.toDateString() === currentDateStr.toDateString();
      const isCurrentMonth = date.getMonth() === month;
      
      days.push({
        date,
        dateStr,
        hasEvent,
        isToday,
        isCurrentMonth,
        day: date.getDate()
      });
    }
    
    return days;
  };

  const getEventTypeColor = (type: string) => {
    switch (type) {
      case 'aula': return '#3B82F6';
      case 'roda': return '#F59E0B';
      case 'atividade': return '#8B5CF6';
      default: return '#6B7280';
    }
  };

  const todayEvents = mockEvents.filter(event => 
    event.date === today.toISOString().split('T')[0]
  );

  // Função para obter o primeiro nome
  const getFirstName = (fullName: string | null | undefined) => {
    if (!fullName) return 'Usuário';
    return fullName.split(' ')[0];
  };

  // Função para formatar moeda
  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header redesenhado com dados reais */}
        <LinearGradient
          colors={['#1E40AF', '#3B82F6', '#60A5FA']}
          style={styles.header}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <View style={styles.headerContent}>
            {/* Avatar e saudação */}
            <View style={styles.userSection}>
              <View style={styles.avatarContainer}>
                <View style={styles.avatar}>
                  <User size={32} color="#FFFFFF" />
                </View>
                <View style={styles.onlineIndicator} />
              </View>
              <View style={styles.greetingSection}>
                <Text style={styles.greeting}>
                  Olá, {loadingUserData ? 'Carregando...' : getFirstName(userData.profile?.nome_completo)}! 👋
                </Text>
                <Text style={styles.subtitle}>
                  {userData.stats?.days_smoke_free 
                    ? `Dia ${userData.stats.days_smoke_free} livre do cigarro`
                    : 'Sua jornada está começando!'
                  }
                </Text>
                <Text style={styles.dateText}>
                  {formatDate(today)}
                </Text>
              </View>
            </View>

            {/* Estatísticas principais */}
            <View style={styles.mainStatsContainer}>
              <View style={styles.primaryStat}>
                <View style={styles.primaryStatIcon}>
                  <Trophy size={28} color="#FCD34D" />
                </View>
                <View style={styles.primaryStatContent}>
                  <Text style={styles.primaryStatNumber}>
                    {userData.stats?.days_smoke_free || 0}
                  </Text>
                  <Text style={styles.primaryStatLabel}>Dias Livre</Text>
                </View>
              </View>

              <View style={styles.secondaryStats}>
                <View style={styles.secondaryStat}>
                  <Text style={styles.secondaryStatNumber}>
                    {formatCurrency(userData.stats?.money_saved || 0)}
                  </Text>
                  <Text style={styles.secondaryStatLabel}>💰 Economizado</Text>
                </View>
                <View style={styles.secondaryStat}>
                  <Text style={styles.secondaryStatNumber}>
                    {userData.stats?.cigarettes_not_smoked || 0}
                  </Text>
                  <Text style={styles.secondaryStatLabel}>🚭 Cigarros evitados</Text>
                </View>
              </View>
            </View>

            {/* Progresso do programa */}
            {userData.progress && (
              <View style={styles.progressSection}>
                <View style={styles.progressHeader}>
                  <Text style={styles.progressTitle}>Programa 12 Semanas</Text>
                  <Text style={styles.progressSubtitle}>
                    Semana {userData.progress.current_week} de {userData.progress.total_weeks}
                  </Text>
                </View>
                <View style={styles.progressBarContainer}>
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { width: `${(userData.progress.completed_weeks / userData.progress.total_weeks) * 100}%` }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressPercentage}>
                    {Math.round((userData.progress.completed_weeks / userData.progress.total_weeks) * 100)}%
                  </Text>
                </View>
              </View>
            )}

            {/* Conquistas */}
            <View style={styles.achievementsSection}>
              <Text style={styles.achievementsTitle}>Suas Conquistas</Text>
              <View style={styles.achievementsList}>
                <View style={styles.achievement}>
                  <Star size={16} color="#FCD34D" />
                  <Text style={styles.achievementText}>
                    {userData.stats?.aulas_assistidas || 0} Aulas
                  </Text>
                </View>
                <View style={styles.achievement}>
                  <MessageCircle size={16} color="#FCD34D" />
                  <Text style={styles.achievementText}>
                    {userData.stats?.rodas_participadas || 0} Rodas
                  </Text>
                </View>
                <View style={styles.achievement}>
                  <Target size={16} color="#FCD34D" />
                  <Text style={styles.achievementText}>
                    {userData.stats?.atividades_concluidas || 0} Atividades
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          {/* Calendário */}
          <View style={styles.calendarSection}>
            <View style={styles.calendarHeader}>
              <Text style={styles.sectionTitle}>Eventos do Polo - São Paulo</Text>
              <View style={styles.calendarNavigation}>
                <TouchableOpacity 
                  onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1))}
                >
                  <ChevronLeft size={20} color="#6B7280" />
                </TouchableOpacity>
                <Text style={styles.monthYear}>
                  {currentDate.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' })}
                </Text>
                <TouchableOpacity 
                  onPress={() => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1))}
                >
                  <ChevronRight size={20} color="#6B7280" />
                </TouchableOpacity>
              </View>
            </View>

            <View style={styles.calendar}>
              <View style={styles.weekDays}>
                {['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'].map(day => (
                  <Text key={day} style={styles.weekDayText}>{day}</Text>
                ))}
              </View>
              
              <View style={styles.calendarGrid}>
                {getCalendarDays().map((day, index) => (
                  <TouchableOpacity key={index} style={styles.calendarDay}>
                    <Text style={[
                      styles.calendarDayText,
                      !day.isCurrentMonth && styles.inactiveDay,
                      day.isToday && styles.todayText
                    ]}>
                      {day.day}
                    </Text>
                    {day.hasEvent && (
                      <View style={styles.eventIndicator}>
                        <View style={styles.eventDot} />
                        <View style={styles.eventPulse} />
                      </View>
                    )}
                    {day.isToday && (
                      <View style={styles.todayIndicator} />
                    )}
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.calendarLegend}>
              <View style={styles.legendItem}>
                <View style={styles.legendDot} />
                <Text style={styles.legendText}>Dia com evento</Text>
              </View>
              <View style={styles.legendItem}>
                <View style={styles.legendTodayDot} />
                <Text style={styles.legendText}>Hoje</Text>
              </View>
            </View>

            {todayEvents.length > 0 && (
              <View style={styles.todayEvents}>
                <View style={styles.todayEventsHeader}>
                  <Text style={styles.todayEventsTitle}>🔔 Eventos de hoje - Não esqueça!</Text>
                  <View style={styles.urgentBadge}>
                    <Text style={styles.urgentBadgeText}>HOJE</Text>
                  </View>
                </View>
                {todayEvents.map((event, index) => (
                  <View key={index} style={styles.eventItem}>
                    <View style={[styles.eventTypeIndicator, { backgroundColor: getEventTypeColor(event.type) }]} />
                    <View style={styles.eventInfo}>
                      <Text style={styles.eventTitle}>{event.title}</Text>
                      <View style={styles.eventTime}>
                        <Clock size={14} color="#6B7280" />
                        <Text style={styles.eventTimeText}>{event.time}</Text>
                      </View>
                    </View>
                  </View>
                ))}
              </View>
            )}
          </View>

          {/* Contexto do dia */}
          <View style={styles.contextSection}>
            <Text style={styles.sectionTitle}>Como você pode estar se sentindo hoje</Text>
            <View style={styles.contextCard}>
              <Heart size={24} color="#EF4444" />
              <Text style={styles.contextText}>{getContextualMessage()}</Text>
            </View>
          </View>

          {/* Questionário de sintomas */}
          <View style={styles.symptomsSection}>
            <Text style={styles.sectionTitle}>Como você está se sentindo?</Text>
            <Text style={styles.symptomsSubtitle}>
              Selecione os sintomas que você está sentindo hoje:
            </Text>
            
            <View style={styles.symptomsGrid}>
              {selectedSymptoms.map((symptom) => (
                <TouchableOpacity
                  key={symptom.id}
                  style={[
                    styles.symptomChip,
                    symptom.selected && styles.symptomChipSelected
                  ]}
                  onPress={() => toggleSymptom(symptom.id)}
                >
                  <Text style={[
                    styles.symptomText,
                    symptom.selected && styles.symptomTextSelected
                  ]}>
                    {symptom.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* Diário */}
          <View style={styles.diarySection}>
            <Text style={styles.sectionTitle}>Diário do dia</Text>
            <Text style={styles.diarySubtitle}>
              Descreva como você está se sentindo hoje:
            </Text>
            
            <TextInput
              style={styles.diaryInput}
              value={diaryText}
              onChangeText={setDiaryText}
              placeholder="Escreva aqui seus pensamentos, sentimentos e experiências do dia..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={6}
              textAlignVertical="top"
            />

            <TouchableOpacity 
              style={[styles.saveButton, isLoading && styles.saveButtonDisabled]} 
              onPress={saveDailyReport}
              disabled={isLoading}
            >
              <Text style={styles.saveButtonText}>
                {isLoading ? 'Salvando...' : 'Salvar Relatório do Dia'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Acesso rápido */}
          <View style={styles.quickAccessSection}>
            <Text style={styles.sectionTitle}>Acesso Rápido</Text>
            
            <View style={styles.quickActions}>
              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/programa')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#E0F2FE' }]}>
                  <Calendar size={24} color="#0284C7" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Programa 12 Semanas</Text>
                  <Text style={styles.actionDescription}>
                    Continue sua jornada de transformação
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/chat')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#F3E8FF' }]}>
                  <MessageCircle size={24} color="#7C3AED" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Chat da Comunidade</Text>
                  <Text style={styles.actionDescription}>
                    Converse com outros participantes
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.actionCard}
                onPress={() => router.push('/(tabs)/perfil')}
              >
                <View style={[styles.actionIcon, { backgroundColor: '#FEF3C7' }]}>
                  <User size={24} color="#D97706" />
                </View>
                <View style={styles.actionInfo}>
                  <Text style={styles.actionTitle}>Meu Perfil</Text>
                  <Text style={styles.actionDescription}>
                    Veja seu progresso e conquistas
                  </Text>
                </View>
                <ChevronRight size={20} color="#9CA3AF" />
              </TouchableOpacity>
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
    backgroundColor: '#F8FAFC',
  },
  scrollContent: {
    flexGrow: 1,
  },
  header: {
    paddingTop: 20,
    paddingBottom: 30,
    paddingHorizontal: 20,
    borderBottomLeftRadius: 30,
    borderBottomRightRadius: 30,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  headerContent: {
    gap: 20,
  },
  userSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  avatarContainer: {
    position: 'relative',
  },
  avatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#10B981',
    borderWidth: 2,
    borderColor: '#FFFFFF',
  },
  greetingSection: {
    flex: 1,
  },
  greeting: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 2,
  },
  dateText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.7)',
  },
  mainStatsContainer: {
    gap: 16,
  },
  primaryStat: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 20,
    padding: 20,
    gap: 16,
  },
  primaryStatIcon: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: 'rgba(252, 211, 77, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  primaryStatContent: {
    flex: 1,
  },
  primaryStatNumber: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
    lineHeight: 36,
  },
  primaryStatLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 2,
  },
  secondaryStats: {
    flexDirection: 'row',
    gap: 12,
  },
  secondaryStat: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  secondaryStatNumber: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  secondaryStatLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  progressSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  progressHeader: {
    marginBottom: 12,
  },
  progressTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 2,
  },
  progressSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  progressBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  progressBar: {
    flex: 1,
    height: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 4,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#FCD34D',
    borderRadius: 4,
  },
  progressPercentage: {
    fontSize: 14,
    fontWeight: '600',
    color: '#FFFFFF',
    minWidth: 40,
    textAlign: 'right',
  },
  achievementsSection: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 16,
    padding: 16,
  },
  achievementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
    marginBottom: 12,
  },
  achievementsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  achievement: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  achievementText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.9)',
    fontWeight: '500',
  },
  content: {
    padding: 20,
    gap: 24,
  },
  calendarSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#1F2937',
  },
  calendarNavigation: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  monthYear: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    textTransform: 'capitalize',
  },
  calendar: {
    marginBottom: 16,
  },
  weekDays: {
    flexDirection: 'row',
    marginBottom: 8,
  },
  weekDayText: {
    flex: 1,
    textAlign: 'center',
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    paddingVertical: 8,
  },
  calendarGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  calendarDay: {
    width: '14.28%',
    aspectRatio: 1,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
  },
  calendarDayText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  inactiveDay: {
    color: '#D1D5DB',
  },
  todayText: {
    color: '#3B82F6',
    fontWeight: 'bold',
  },
  todayIndicator: {
    position: 'absolute',
    bottom: 4,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3B82F6',
  },
  eventIndicator: {
    position: 'absolute',
    top: 4,
    right: 4,
  },
  eventDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
  },
  eventPulse: {
    position: 'absolute',
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#F59E0B',
    opacity: 0.3,
  },
  calendarLegend: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 16,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  legendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F59E0B',
  },
  legendTodayDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#3B82F6',
  },
  legendText: {
    fontSize: 12,
    color: '#6B7280',
  },
  todayEvents: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  todayEventsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  todayEventsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#F59E0B',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  urgentBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  eventItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 8,
  },
  eventTypeIndicator: {
    width: 4,
    height: 32,
    borderRadius: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#92400E',
    marginBottom: 2,
  },
  eventTime: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  eventTimeText: {
    fontSize: 12,
    color: '#6B7280',
  },
  contextSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  contextCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 16,
    backgroundColor: '#FEF2F2',
    borderRadius: 12,
    padding: 16,
    marginTop: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#EF4444',
  },
  contextText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
    color: '#374151',
  },
  symptomsSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  symptomsSubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 16,
  },
  symptomsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  symptomChip: {
    backgroundColor: '#F3F4F6',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  symptomChipSelected: {
    backgroundColor: '#3B82F6',
    borderColor: '#3B82F6',
  },
  symptomText: {
    fontSize: 14,
    color: '#374151',
    fontWeight: '500',
  },
  symptomTextSelected: {
    color: '#FFFFFF',
  },
  diarySection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  diarySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    marginBottom: 16,
  },
  diaryInput: {
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    fontSize: 14,
    color: '#374151',
    borderWidth: 1,
    borderColor: '#E5E7EB',
    minHeight: 120,
    marginBottom: 16,
  },
  saveButton: {
    backgroundColor: '#3B82F6',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
  },
  saveButtonDisabled: {
    backgroundColor: '#9CA3AF',
  },
  saveButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  quickAccessSection: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 3,
  },
  quickActions: {
    gap: 12,
    marginTop: 16,
  },
  actionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
    borderRadius: 12,
    padding: 16,
    gap: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  actionInfo: {
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1F2937',
    marginBottom: 2,
  },
  actionDescription: {
    fontSize: 14,
    color: '#6B7280',
  },
});

