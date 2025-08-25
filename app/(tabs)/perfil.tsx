import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { useRouter } from 'expo-router';
import { User, Mail, Phone, MapPin, Calendar, Award, TrendingUp, Heart, Settings, LogOut, CreditCard as Edit } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function PerfilScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState<any>(null);
  const [userStats, setUserStats] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);

  useEffect(() => {
    loadUserData();
  }, []);

  const loadUserData = async () => {
    try {
      console.log('👤 Carregando dados do perfil...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        router.replace('/');
        return;
      }

      // Carregar perfil do usuário
      const { data: profile, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (profileError) {
        console.error('❌ Erro ao carregar perfil:', profileError);
      } else {
        console.log('✅ Perfil carregado:', profile);
        setUserProfile(profile);
      }

      // Carregar estatísticas do usuário
      const { data: stats, error: statsError } = await supabase
        .from('user_stats')
        .select('*')
        .eq('user_id', user.id)
        .single();

      if (statsError && statsError.code !== 'PGRST116') {
        console.error('❌ Erro ao carregar estatísticas:', statsError);
      } else {
        console.log('📊 Estatísticas carregadas:', stats);
        setUserStats(stats);
      }

      // Carregar progresso do usuário
      const { data: progress, error: progressError } = await supabase
        .from('user_progress')
        .select('*')
        .eq('user_id', user.id)
        .order('week_number', { ascending: false })
        .limit(1)
        .single();

      if (progressError && progressError.code !== 'PGRST116') {
        console.error('❌ Erro ao carregar progresso:', progressError);
      } else {
        console.log('📈 Progresso carregado:', progress);
        setUserProgress(progress);
      }

      // Carregar dados de motivação para nível atual
      const { data: motivacao, error: motivacaoError } = await supabase
        .from('anamnese_motivacao')
        .select('nivel_motivacao')
        .eq('user_id', user.id)
        .single();

      if (motivacaoError && motivacaoError.code !== 'PGRST116') {
        console.error('❌ Erro ao carregar motivação:', motivacaoError);
      } else {
        console.log('💪 Motivação carregada:', motivacao);
      }

    } catch (error) {
      console.error('💥 Erro geral ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDaysFree = () => {
    if (!userStats?.quit_date) return 0;
    const quitDate = new Date(userStats.quit_date);
    const today = new Date();
    const diffTime = Math.abs(today.getTime() - quitDate.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const calculateWeeksCompleted = () => {
    const daysFree = calculateDaysFree();
    return Math.floor(daysFree / 7);
  };

  const calculateMoneySaved = () => {
    if (!userStats?.money_saved) return 0;
    return userStats.money_saved;
  };

  const getMotivationLevel = () => {
    // Buscar nível de motivação da anamnese ou usar padrão
    return '8/10'; // Placeholder - pode ser calculado baseado nos dados
  };

  const generateAchievements = () => {
    const daysFree = calculateDaysFree();
    
    return [
      { 
        title: 'Primeiro dia', 
        description: 'Parabéns por dar o primeiro passo!', 
        completed: daysFree >= 1 
      },
      { 
        title: 'Uma semana livre', 
        description: 'Primeira semana completada', 
        completed: daysFree >= 7 
      },
      { 
        title: 'Duas semanas', 
        description: 'Duas semanas de conquista', 
        completed: daysFree >= 14 
      },
      { 
        title: 'Um mês livre', 
        description: 'Um mês completo sem vícios', 
        completed: daysFree >= 30 
      },
      { 
        title: 'Três meses', 
        description: 'Trimestre de vitórias', 
        completed: daysFree >= 90 
      },
      { 
        title: 'Seis meses', 
        description: 'Meio ano de conquistas', 
        completed: daysFree >= 180 
      },
    ];
  };

  const handleLogout = async () => {
    Alert.alert(
      'Sair da conta',
      'Tem certeza que deseja sair?',
      [
        { text: 'Cancelar', style: 'cancel' },
        { 
          text: 'Sair', 
          style: 'destructive', 
          onPress: async () => {
            await supabase.auth.signOut();
            router.replace('/');
          }
        }
      ]
    );
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando perfil...</Text>
        </View>
      </SafeAreaView>
    );
  }

  const stats = [
    { 
      label: 'Dias livre', 
      value: calculateDaysFree().toString(), 
      icon: Calendar, 
      color: '#22C55E' 
    },
    { 
      label: 'Semanas completas', 
      value: calculateWeeksCompleted().toString(), 
      icon: Award, 
      color: '#F59E0B' 
    },
    { 
      label: 'Dinheiro economizado', 
      value: `R$ ${calculateMoneySaved()}`, 
      icon: TrendingUp, 
      color: '#3B82F6' 
    },
    { 
      label: 'Motivação atual', 
      value: getMotivationLevel(), 
      icon: Heart, 
      color: '#EF4444' 
    },
  ];

  const achievements = generateAchievements();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <LinearGradient
          colors={['#8B5CF6', '#7C3AED']}
          style={styles.header}
        >
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <View style={styles.avatar}>
                <User size={40} color="white" />
              </View>
              <TouchableOpacity style={styles.editButton}>
                <Edit size={16} color="#8B5CF6" />
              </TouchableOpacity>
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>
                {userProfile?.nome_completo || 'Usuário'}
              </Text>
              <Text style={styles.userJoined}>
                Membro desde {userProfile?.created_at ? 
                  new Date(userProfile.created_at).toLocaleDateString('pt-BR', { 
                    month: 'long', 
                    year: 'numeric' 
                  }) : 'Janeiro 2024'}
              </Text>
            </View>
          </View>
        </LinearGradient>

        <View style={styles.content}>
          <View style={styles.infoSection}>
            <Text style={styles.sectionTitle}>Informações Pessoais</Text>
            <View style={styles.infoCard}>
              <View style={styles.infoItem}>
                <Mail size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>E-mail</Text>
                <Text style={styles.infoValue}>
                  {userProfile?.email || 'Não informado'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <Phone size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Telefone</Text>
                <Text style={styles.infoValue}>
                  {userProfile?.telefone || 'Não informado'}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.infoItem}>
                <MapPin size={20} color="#6B7280" />
                <Text style={styles.infoLabel}>Localização</Text>
                <Text style={styles.infoValue}>
                  {userProfile?.cidade_estado || 'Não informado'}
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsSection}>
            <Text style={styles.sectionTitle}>Suas Estatísticas</Text>
            <View style={styles.statsGrid}>
              {stats.map((stat, index) => (
                <View key={index} style={styles.statCard}>
                  <View style={[styles.statIcon, { backgroundColor: stat.color + '20' }]}>
                    <stat.icon size={24} color={stat.color} />
                  </View>
                  <Text style={styles.statValue}>{stat.value}</Text>
                  <Text style={styles.statLabel}>{stat.label}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.achievementsSection}>
            <Text style={styles.sectionTitle}>Conquistas</Text>
            <View style={styles.achievementsList}>
              {achievements.map((achievement, index) => (
                <View key={index} style={styles.achievementItem}>
                  <View style={[
                    styles.achievementIcon,
                    { backgroundColor: achievement.completed ? '#22C55E' : '#E5E7EB' }
                  ]}>
                    <Award 
                      size={20} 
                      color={achievement.completed ? 'white' : '#9CA3AF'} 
                    />
                  </View>
                  <View style={styles.achievementInfo}>
                    <Text style={[
                      styles.achievementTitle,
                      { color: achievement.completed ? '#111827' : '#9CA3AF' }
                    ]}>
                      {achievement.title}
                    </Text>
                    <Text style={[
                      styles.achievementDescription,
                      { color: achievement.completed ? '#6B7280' : '#9CA3AF' }
                    ]}>
                      {achievement.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.actionsSection}>
            <TouchableOpacity 
              style={styles.actionButton}
              onPress={() => router.push('/anamnese')}
            >
              <User size={20} color="#6B7280" />
              <Text style={styles.actionText}>Atualizar Anamnese</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton}>
              <Settings size={20} color="#6B7280" />
              <Text style={styles.actionText}>Configurações</Text>
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.actionButton} onPress={handleLogout}>
              <LogOut size={20} color="#EF4444" />
              <Text style={[styles.actionText, { color: '#EF4444' }]}>Sair da conta</Text>
            </TouchableOpacity>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 5,
  },
  userJoined: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 15,
  },
  infoSection: {
    marginBottom: 25,
  },
  infoCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 5,
  },
  infoLabel: {
    fontSize: 16,
    color: '#6B7280',
    marginLeft: 15,
    flex: 1,
  },
  infoValue: {
    fontSize: 16,
    color: '#111827',
    fontWeight: '500',
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 15,
  },
  statsSection: {
    marginBottom: 25,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 15,
  },
  statCard: {
    backgroundColor: 'white',
    flex: 1,
    minWidth: '45%',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  statIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 5,
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  achievementsSection: {
    marginBottom: 25,
  },
  achievementsList: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  achievementItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  achievementIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  achievementInfo: {
    flex: 1,
  },
  achievementTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  achievementDescription: {
    fontSize: 14,
  },
  actionsSection: {
    gap: 15,
  },
  actionButton: {
    backgroundColor: 'white',
    flexDirection: 'row',
    alignItems: 'center',
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
  actionText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#374151',
    marginLeft: 15,
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
});