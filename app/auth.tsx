import { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { ArrowLeft, Eye, EyeOff } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

export default function AuthScreen() {
  const router = useRouter();
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    name: '',
    phone: '',
    gender: '',
    city: '',
    state: '',
  });

  const handleSubmit = async () => {
    if (isLogin) {
      if (!formData.email || !formData.password) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }
      
      try {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: formData.email,
          password: formData.password,
        });

        if (error) {
          Alert.alert('Erro', error.message);
          return;
        }

        router.replace('/(tabs)');
      } catch (error) {
        Alert.alert('Erro', 'Erro ao fazer login. Tente novamente.');
      }
    } else {
      if (
        !formData.name ||
        !formData.email ||
        !formData.password ||
        !formData.confirmPassword ||
        !formData.phone ||
        !formData.gender ||
        !formData.city ||
        !formData.state
      ) {
        Alert.alert('Erro', 'Por favor, preencha todos os campos');
        return;
      }
      
      if (formData.password !== formData.confirmPassword) {
        Alert.alert('Erro', 'As senhas não coincidem');
        return;
      }
      
      try {
        // Criar usuário no Supabase Auth
        const { data: authData, error: authError } = await supabase.auth.signUp({
          email: formData.email,
          password: formData.password,
        });

        if (authError) {
          Alert.alert('Erro', authError.message);
          return;
        }

        if (authData.user) {
          // Criar perfil do usuário
          const { error: profileError } = await supabase
            .from('user_profiles')
            .insert([
              {
                id: authData.user.id,
                nome_completo: formData.name,
                email: formData.email,
                telefone: formData.phone,
                sexo: formData.gender,
                cidade_estado: `${formData.city} - ${formData.state}`,
              }
            ]);

          if (profileError) {
            Alert.alert('Erro', 'Erro ao criar perfil: ' + profileError.message);
            return;
          }

          Alert.alert('Sucesso', 'Cadastro realizado com sucesso!', [
            { text: 'OK', onPress: () => router.replace('/(tabs)') }
          ]);
        }
      } catch (error) {
        Alert.alert('Erro', 'Erro ao criar conta. Tente novamente.');
      }
    }
  };

  const updateFormData = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <ArrowLeft size={24} color="#22C55E" />
          </TouchableOpacity>

          <View style={styles.header}>
            <Text style={styles.title}>
              {isLogin ? 'Entrar' : 'Criar Conta'}
            </Text>
            <Text style={styles.subtitle}>
              {isLogin 
                ? 'Continue sua jornada de transformação' 
                : 'Comece sua jornada para uma vida livre'
              }
            </Text>
          </View>

          <View style={styles.form}>
            {!isLogin && (
              <View style={styles.inputContainer}>
                <Text style={styles.label}>Nome Completo</Text>
                <TextInput
                  style={styles.input}
                  value={formData.name}
                  onChangeText={(text) => updateFormData('name', text)}
                  placeholder="Digite seu nome completo"
                  placeholderTextColor="#9CA3AF"
                />
              </View>
            )}

            <View style={styles.inputContainer}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={formData.email}
                onChangeText={(text) => updateFormData('email', text)}
                placeholder="Digite seu e-mail"
                placeholderTextColor="#9CA3AF"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={styles.label}>Senha</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={styles.passwordInput}
                  value={formData.password}
                  onChangeText={(text) => updateFormData('password', text)}
                  placeholder="Digite sua senha"
                  placeholderTextColor="#9CA3AF"
                  secureTextEntry={!showPassword}
                />
                <TouchableOpacity
                  onPress={() => setShowPassword(!showPassword)}
                  style={styles.eyeButton}
                >
                  {showPassword ? (
                    <EyeOff size={20} color="#9CA3AF" />
                  ) : (
                    <Eye size={20} color="#9CA3AF" />
                  )}
                </TouchableOpacity>
              </View>
            </View>

            {!isLogin && (
              <>
                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Confirmar Senha</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.confirmPassword}
                    onChangeText={(text) => updateFormData('confirmPassword', text)}
                    placeholder="Confirme sua senha"
                    placeholderTextColor="#9CA3AF"
                    secureTextEntry={true}
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Telefone</Text>
                  <TextInput
                    style={styles.input}
                    value={formData.phone}
                    onChangeText={(text) => updateFormData('phone', text)}
                    placeholder="(00) 00000-0000"
                    placeholderTextColor="#9CA3AF"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.label}>Sexo</Text>
                  <View style={styles.genderContainer}>
                    {['Masculino', 'Feminino', 'Outro'].map((gender) => (
                      <TouchableOpacity
                        key={gender}
                        style={[
                          styles.genderOption,
                          formData.gender === gender && styles.genderOptionSelected
                        ]}
                        onPress={() => updateFormData('gender', gender)}
                      >
                        <Text style={[
                          styles.genderText,
                          formData.gender === gender && styles.genderTextSelected
                        ]}>
                          {gender}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.row}>
                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Cidade</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.city}
                      onChangeText={(text) => updateFormData('city', text)}
                      placeholder="Sua cidade"
                      placeholderTextColor="#9CA3AF"
                    />
                  </View>

                  <View style={[styles.inputContainer, styles.halfWidth]}>
                    <Text style={styles.label}>Estado</Text>
                    <TextInput
                      style={styles.input}
                      value={formData.state}
                      onChangeText={(text) => updateFormData('state', text)}
                      placeholder="UF"
                      placeholderTextColor="#9CA3AF"
                      maxLength={2}
                      autoCapitalize="characters"
                    />
                  </View>
                </View>
              </>
            )}

            <TouchableOpacity style={styles.submitButton} onPress={handleSubmit}>
              <Text style={styles.submitButtonText}>
                {isLogin ? 'Entrar' : 'Criar Conta'}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.switchButton}
              onPress={() => setIsLogin(!isLogin)}
            >
              <Text style={styles.switchText}>
                {isLogin 
                  ? 'Não tem uma conta? ' 
                  : 'Já tem uma conta? '
                }
                <Text style={styles.switchTextBold}>
                  {isLogin ? 'Cadastre-se' : 'Faça login'}
                </Text>
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 20,
  },
  backButton: {
    marginTop: 10,
    marginBottom: 20,
    alignSelf: 'flex-start',
  },
  header: {
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: '#6B7280',
    lineHeight: 24,
  },
  form: {
    flex: 1,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  passwordContainer: {
    position: 'relative',
  },
  passwordInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    paddingHorizontal: 16,
    paddingVertical: 14,
    paddingRight: 50,
    fontSize: 16,
    color: '#111827',
  },
  eyeButton: {
    position: 'absolute',
    right: 15,
    top: 17,
  },
  genderContainer: {
    flexDirection: 'row',
    gap: 10,
  },
  genderOption: {
    flex: 1,
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    alignItems: 'center',
    backgroundColor: 'white',
  },
  genderOptionSelected: {
    backgroundColor: '#22C55E',
    borderColor: '#22C55E',
  },
  genderText: {
    color: '#6B7280',
    fontSize: 14,
    fontWeight: '500',
  },
  genderTextSelected: {
    color: 'white',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  submitButton: {
    backgroundColor: '#22C55E',
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
    marginBottom: 20,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    alignItems: 'center',
    marginBottom: 30,
  },
  switchText: {
    fontSize: 14,
    color: '#6B7280',
  },
  switchTextBold: {
    fontWeight: 'bold',
    color: '#22C55E',
  },
});