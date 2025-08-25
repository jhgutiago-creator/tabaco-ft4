import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { Send, MapPin, Users } from 'lucide-react-native';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Message {
  id: string;
  user_id: string;
  user: string;
  message: string;
  time: string;
  isOwn: boolean;
  created_at: string;
}

interface User {
  id: string;
  name: string;
  city: string;
  isOnline: boolean;
}

const mockMessages: Message[] = [
  {
    id: '1',
    user: 'Maria Silva',
    message: 'Bom dia pessoal! Como estão se sentindo hoje?',
    time: '09:15',
    isOwn: false,
  },
  {
    id: '2',
    user: 'Carlos Santos',
    message: 'Olá Maria! Estou no meu 5º dia livre. Ainda tenho algumas fissuras, mas estou resistindo!',
    time: '09:18',
    isOwn: false,
  },
  {
    id: '3',
    user: 'Você',
    message: 'Parabéns Carlos! Você está indo muito bem. Eu estou no 12º dia e posso dizer que fica mais fácil.',
    time: '09:22',
    isOwn: true,
  },
  {
    id: '4',
    user: 'Ana Costa',
    message: 'Que inspiração! Vocês me motivam a continuar. Hoje completo uma semana!',
    time: '09:25',
    isOwn: false,
  },
];

const mockUsers: User[] = [
  { id: '1', name: 'Maria Silva', city: 'São Paulo', isOnline: true },
  { id: '2', name: 'Carlos Santos', city: 'São Paulo', isOnline: true },
  { id: '3', name: 'Ana Costa', city: 'São Paulo', isOnline: false },
  { id: '4', name: 'Pedro Lima', city: 'São Paulo', isOnline: true },
  { id: '5', name: 'Julia Oliveira', city: 'São Paulo', isOnline: false },
];

export default function ChatScreen() {
  const [messageText, setMessageText] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Carregar usuário atual
  useEffect(() => {
    getCurrentUser();
  }, []);

  // Carregar mensagens quando o usuário for carregado
  useEffect(() => {
    if (currentUser) {
      loadMessages();
    }
  }, [currentUser]);

  const getCurrentUser = async () => {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        // Buscar dados do perfil
        const { data: profile } = await supabase
          .from('user_profiles')
          .select('nome_completo')
          .eq('id', user.id)
          .single();
        
        setCurrentUser({
          id: user.id,
          name: profile?.nome_completo || 'Usuário'
        });
      }
    } catch (error) {
      console.error('Erro ao carregar usuário:', error);
    }
  };

  const loadMessages = async () => {
    try {
      console.log('📥 Carregando mensagens do chat...');
      
      const { data: messagesData, error } = await supabase
        .from('chat_messages')
        .select(`
          id,
          user_id,
          message,
          created_at,
          user_profiles!inner(nome_completo)
        `)
        .order('created_at', { ascending: true });

      if (error) {
        console.error('❌ Erro ao carregar mensagens:', error);
        return;
      }

      console.log('📊 Mensagens carregadas:', messagesData?.length || 0);

      const formattedMessages: Message[] = (messagesData || []).map((msg: any) => ({
        id: msg.id,
        user_id: msg.user_id,
        user: msg.user_profiles.nome_completo || 'Usuário',
        message: msg.message,
        time: new Date(msg.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: msg.user_id === currentUser?.id,
        created_at: msg.created_at
      }));

      setMessages(formattedMessages);
    } catch (error) {
      console.error('💥 Erro geral ao carregar mensagens:', error);
    } finally {
      setLoading(false);
    }
  };

  const sendMessage = async () => {
    if (!messageText.trim() || !currentUser) {
      console.log('❌ Mensagem vazia ou usuário não logado');
      return;
    }

    try {
      console.log('📤 Enviando mensagem...');
      
      const { data, error } = await supabase
        .from('chat_messages')
        .insert([
          {
            user_id: currentUser.id,
            message: messageText.trim()
          }
        ])
        .select(`
          id,
          user_id,
          message,
          created_at
        `)
        .single();

      if (error) {
        console.error('❌ Erro ao enviar mensagem:', error);
        alert('Erro ao enviar mensagem: ' + error.message);
        return;
      }

      console.log('✅ Mensagem enviada com sucesso!');

      // Adicionar mensagem ao estado local
      const newMessage: Message = {
        id: data.id,
        user_id: data.user_id,
        user: currentUser.name,
        message: data.message,
        time: new Date(data.created_at).toLocaleTimeString('pt-BR', { 
          hour: '2-digit', 
          minute: '2-digit' 
        }),
        isOwn: true,
        created_at: data.created_at
      };

      setMessages(prev => [...prev, newMessage]);
      setMessageText('');

    } catch (error) {
      console.error('💥 Erro geral ao enviar mensagem:', error);
      alert('Erro ao enviar mensagem. Tente novamente.');
    }
  };

  const renderMessage = ({ item }: { item: Message }) => (
    <View style={[
      styles.messageContainer,
      item.isOwn ? styles.ownMessage : styles.otherMessage
    ]}>
      {!item.isOwn && (
        <Text style={styles.senderName}>{item.user}</Text>
      )}
      <Text style={[
        styles.messageText,
        item.isOwn ? styles.ownMessageText : styles.otherMessageText
      ]}>
        {item.message}
      </Text>
      <Text style={[
        styles.messageTime,
        item.isOwn ? styles.ownMessageTime : styles.otherMessageTime
      ]}>
        {item.time}
      </Text>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingContainer}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 0} // Ajuste conforme necessário
      >
        <LinearGradient
          colors={['#F59E0B', '#EF4444']}
          style={styles.header}
        >
          <Text style={styles.headerTitle}>Chat da Comunidade</Text>
          <View style={styles.locationInfo}>
            <MapPin size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.locationText}>São Paulo, SP</Text>
          </View>
          <View style={styles.onlineInfo}>
            <Users size={16} color="rgba(255, 255, 255, 0.8)" />
            <Text style={styles.onlineText}>3 pessoas online</Text>
          </View>
        </LinearGradient>

        <ScrollView style={styles.usersContainer} horizontal showsHorizontalScrollIndicator={false}>
          {mockUsers.map((user) => (
            <View key={user.id} style={styles.userCard}>
              <View style={styles.userAvatar}>
                <View style={[
                  styles.onlineIndicator,
                  { backgroundColor: user.isOnline ? '#22C55E' : '#9CA3AF' }
                ]} />
                <Text style={styles.userInitial}>
                  {user.name.split(' ').map(n => n[0]).join('')}
                </Text>
              </View>
              <Text style={styles.userName} numberOfLines={1}>
                {user.name.split(' ')[0]}
              </Text>
            </View>
          ))}
        </ScrollView>

        <FlatList
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesContainer}
          contentContainerStyle={styles.messagesContent}
        />

        <View style={styles.inputContainer}>
          <TextInput
            style={styles.messageInput}
            value={messageText}
            onChangeText={setMessageText}
            placeholder="Digite sua mensagem..."
            placeholderTextColor="#9CA3AF"
            multiline
            maxLength={500}
          />
          <TouchableOpacity
            style={styles.sendButton}
            onPress={sendMessage}
            disabled={!messageText.trim()}
          >
            <Send size={20} color="white" />
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  keyboardAvoidingContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 20,
    borderBottomLeftRadius: 25,
    borderBottomRightRadius: 25,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  locationInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
  },
  locationText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  onlineInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  onlineText: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
    marginLeft: 5,
  },
  usersContainer: {
    maxHeight: 100,
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  userCard: {
    alignItems: 'center',
    marginHorizontal: 10,
    width: 60,
  },
  userAvatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E5E7EB',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 5,
    position: 'relative',
  },
  onlineIndicator: {
    position: 'absolute',
    top: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: 'white',
  },
  userInitial: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#374151',
  },
  userName: {
    fontSize: 12,
    color: '#6B7280',
    textAlign: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 15,
  },
  messagesContent: {
    paddingVertical: 10,
  },
  messageContainer: {
    marginVertical: 5,
    maxWidth: '80%',
    padding: 12,
    borderRadius: 18,
  },
  ownMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#22C55E',
    borderBottomRightRadius: 4,
  },
  otherMessage: {
    alignSelf: 'flex-start',
    backgroundColor: 'white',
    borderBottomLeftRadius: 4,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  senderName: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6B7280',
    marginBottom: 4,
  },
  messageText: {
    fontSize: 16,
    lineHeight: 20,
  },
  ownMessageText: {
    color: 'white',
  },
  otherMessageText: {
    color: '#111827',
  },
  messageTime: {
    fontSize: 11,
    marginTop: 4,
  },
  ownMessageTime: {
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'right',
  },
  otherMessageTime: {
    color: '#9CA3AF',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    padding: 15,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  messageInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 10,
    fontSize: 16,
    maxHeight: 100,
    marginRight: 10,
    backgroundColor: '#F9FAFB',
  },
  sendButton: {
    backgroundColor: '#22C55E',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
});