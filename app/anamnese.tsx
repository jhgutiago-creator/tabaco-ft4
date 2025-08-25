import { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { LinearGradient } from 'expo-linear-gradient';
import { ArrowLeft, ArrowRight, Check, User, Heart, Brain, Target } from 'lucide-react-native';
import { supabase } from '../lib/supabase';

interface AnamneseData {
  // Identificação
  nomeCompleto: string;
  dataNascimento: string;
  idade: string;
  sexo: string;
  cpf: string;
  endereco: string;
  cidadeEstado: string;
  telefone: string;
  email: string;
  
  // Histórico de Tabagismo
  idadeComecou: string;
  tempoTotal: string;
  quantidadeAtual: string;
  maiorQuantidade: string;
  jaTentouParar: string;
  quantasVezes: string;
  metodosUtilizados: string[];
  motivoRecaida: string;
  primeiraVontade: string;
  
  // Histórico de Saúde
  doencasAtuais: string[];
  medicamentos: string;
  alergias: string;
  
  // Outras Substâncias
  alcool: string;
  outrasDrogas: string;
  outrasDrogasQuais: string;
  cafeina: string;
  cafeinaQuantidade: string;
  
  // Motivação e Apoio
  motivoPrincipal: string;
  nivelMotivacao: string;
  apoioFamilia: string;
  
  // Aspectos Psicológicos
  ansiosoSemFumar: string;
  usaCigarroEm: string[];
  acompanhamentoPsicologico: string;
  
  // Fagerström
  tempoAposAcordar: string;
  dificilNaoFumar: string;
  cigarroMaisDificil: string;
  quantosCigarrosDia: string;
  fumaMaisManha: string;
  fumaDoente: string;
  
  // Objetivo
  dataDesejada: string;
  expectativas: string;
}

const initialData: AnamneseData = {
  nomeCompleto: '',
  dataNascimento: '',
  idade: '',
  sexo: '',
  cpf: '',
  endereco: '',
  cidadeEstado: '',
  telefone: '',
  email: '',
  idadeComecou: '',
  tempoTotal: '',
  quantidadeAtual: '',
  maiorQuantidade: '',
  jaTentouParar: '',
  quantasVezes: '',
  metodosUtilizados: [],
  motivoRecaida: '',
  primeiraVontade: '',
  doencasAtuais: [],
  medicamentos: '',
  alergias: '',
  alcool: '',
  outrasDrogas: '',
  outrasDrogasQuais: '',
  cafeina: '',
  cafeinaQuantidade: '',
  motivoPrincipal: '',
  nivelMotivacao: '',
  apoioFamilia: '',
  ansiosoSemFumar: '',
  usaCigarroEm: [],
  acompanhamentoPsicologico: '',
  tempoAposAcordar: '',
  dificilNaoFumar: '',
  cigarroMaisDificil: '',
  quantosCigarrosDia: '',
  fumaMaisManha: '',
  fumaDoente: '',
  dataDesejada: '',
  expectativas: '',
};

const steps = [
  { title: 'Identificação', icon: User },
  { title: 'Histórico de Tabagismo', icon: Heart },
  { title: 'Saúde e Substâncias', icon: Brain },
  { title: 'Motivação e Objetivo', icon: Target },
];

export default function AnamneseScreen() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(0);
  const [data, setData] = useState<AnamneseData>(initialData);
  const [loading, setLoading] = useState(true);

  // Carregar dados existentes do usuário
  const loadExistingData = async () => {
    try {
      console.log('📥 Carregando dados existentes da anamnese...');
      
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) {
        console.log('❌ Usuário não autenticado');
        setLoading(false);
        return;
      }

      console.log('👤 Usuário autenticado:', user.id);

      // Carregar dados de tabagismo
      const { data: tabagismoData, error: tabagismoError } = await supabase
        .from('anamnese_tabagismo')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🚬 Dados de tabagismo:', { data: tabagismoData, error: tabagismoError });

      // Carregar dados de saúde
      const { data: saudeData, error: saudeError } = await supabase
        .from('anamnese_saude')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('🏥 Dados de saúde:', { data: saudeData, error: saudeError });

      // Carregar dados de motivação
      const { data: motivacaoData, error: motivacaoError } = await supabase
        .from('anamnese_motivacao')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('💪 Dados de motivação:', { data: motivacaoData, error: motivacaoError });

      // Carregar dados de Fagerström
      const { data: fagerstromData, error: fagerstromError } = await supabase
        .from('anamnese_fagerstrom')
        .select('*')
        .eq('user_id', user.id)
        .single();

      console.log('📊 Dados de Fagerström:', { data: fagerstromData, error: fagerstromError });

      // Carregar perfil do usuário
      const { data: profileData, error: profileError } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      console.log('👤 Dados do perfil:', { data: profileData, error: profileError });

      // Mapear dados carregados para o estado
      if (profileData || tabagismoData || saudeData || motivacaoData || fagerstromData) {
        console.log('🔄 Mapeando dados carregados para o estado...');
        
        const mappedData = {
          // Dados do perfil
          nomeCompleto: profileData?.nome_completo || "",
          dataNascimento: profileData?.data_nascimento ? 
            (() => {
              const date = new Date(profileData.data_nascimento);
              return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
            })() : "",
          idade: profileData?.idade?.toString() || "",
          sexo: profileData?.sexo || "",
          cpf: profileData?.cpf || "",
          endereco: profileData?.endereco || "",
          cidadeEstado: profileData?.cidade_estado || "",
          telefone: profileData?.telefone || "",
          email: profileData?.email || "",
          
          // Dados de tabagismo
          idadeComecou: tabagismoData?.idade_comecou?.toString() || "",
          tempoTotal: tabagismoData?.tempo_total_anos?.toString() || "",
          quantidadeAtual: tabagismoData?.quantidade_atual_dia?.toString() || "",
          maiorQuantidade: tabagismoData?.maior_quantidade_dia?.toString() || "",
          jaTentouParar: tabagismoData?.ja_tentou_parar ? "Sim" : "Não",
          quantasVezes: tabagismoData?.quantas_vezes_tentou?.toString() || "",
          metodosUtilizados: tabagismoData?.metodos_utilizados || [],
          motivoRecaida: tabagismoData?.motivo_recaida || "",
          primeiraVontade: tabagismoData?.primeira_vontade_acordar || "",
          
          // Dados de saúde
          doencasAtuais: saudeData?.doencas_atuais || [],
          medicamentos: saudeData?.medicamentos_uso || "",
          alergias: saudeData?.alergias_conhecidas || "",
          alcool: saudeData?.consumo_alcool || "",
          outrasDrogas: saudeData?.outras_drogas ? "Sim" : "Não",
          outrasDrogasQuais: saudeData?.outras_drogas_quais || "",
          cafeina: saudeData?.consumo_cafeina ? "Sim" : "Não",
          cafeinaQuantidade: saudeData?.cafeina_quantidade_dia || "",
          
          // Dados de motivação
          motivoPrincipal: motivacaoData?.motivo_principal || "",
          nivelMotivacao: motivacaoData?.nivel_motivacao?.toString() || "",
          apoioFamilia: motivacaoData?.apoio_familia ? "Sim" : "Não",
          ansiosoSemFumar: motivacaoData?.ansioso_sem_fumar ? "Sim" : "Não",
          usaCigarroEm: motivacaoData?.usa_cigarro_em || [],
          acompanhamentoPsicologico: motivacaoData?.acompanhamento_psicologico ? "Sim" : "Não",
          dataDesejada: motivacaoData?.data_desejada_parar ? 
            (() => {
              const date = new Date(motivacaoData.data_desejada_parar);
              return `${date.getDate().toString().padStart(2, "0")}/${(date.getMonth() + 1).toString().padStart(2, "0")}/${date.getFullYear()}`;
            })() : "",
          expectativas: motivacaoData?.expectativas_programa || "",
          
          // Dados de Fagerström
          tempoAposAcordar: fagerstromData?.tempo_apos_acordar || "",
          dificilNaoFumar: fagerstromData?.dificil_nao_fumar ? "Sim" : "Não",
          cigarroMaisDificil: fagerstromData?.cigarro_mais_dificil || "",
          quantosCigarrosDia: fagerstromData?.quantos_cigarros_dia || "",
          fumaMaisManha: fagerstromData?.fuma_mais_manha ? "Sim" : "Não",
          fumaDoente: fagerstromData?.fuma_doente ? "Sim" : "Não",
        };
        
        console.log('✅ Dados mapeados:', mappedData);
        setData(mappedData);
      } else {
        console.log('ℹ️ Nenhum dado existente encontrado - usando dados vazios');
      }

    } catch (error) {
      console.error('Erro ao carregar dados existentes:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadExistingData();
  }, []);

  const updateData = (field: keyof AnamneseData, value: any) => {
    setData(prev => ({ ...prev, [field]: value }));
  };

  const toggleArrayItem = (field: keyof AnamneseData, item: string) => {
    const currentArray = data[field] as string[];
    const newArray = currentArray.includes(item)
      ? currentArray.filter(i => i !== item)
      : [...currentArray, item];
    updateData(field, newArray);
  };

  const nextStep = async () => {
        if (currentStep < steps.length - 1) {
          setCurrentStep(currentStep + 1);
        } else {
          // Último passo - salvar dados
          try {
            console.log('🚀 Iniciando salvamento da anamnese...');
            
            // Verificar autenticação com logs detalhados
            const { data: { user }, error: userError } = await supabase.auth.getUser();
            
            console.log('👤 Verificação de usuário:', { user: user?.id, error: userError });
            
            if (userError) {
              console.error('❌ Erro na verificação de usuário:', userError);
              Alert.alert('Erro', 'Erro na autenticação: ' + userError.message);
              return;
            }
            
            if (!user) {
              console.error('❌ Usuário não autenticado');
              Alert.alert('Erro', 'Você precisa estar logado para salvar a anamnese');
              return;
            }
            
            console.log('✅ Usuário autenticado:', user.id);
            
            // Verificar se o usuário existe na tabela user_profiles
            const { data: profileCheck, error: profileError } = await supabase
              .from('user_profiles')
              .select('id')
              .eq('id', user.id)
              .single();
              
            console.log('👤 Verificação de perfil:', { profile: profileCheck, error: profileError });
            
            if (profileError && profileError.code !== 'PGRST116') {
              console.error('❌ Erro ao verificar perfil:', profileError);
              Alert.alert('Erro', 'Erro ao verificar perfil do usuário: ' + profileError.message);
              return;
            }
            
            // Atualizar ou criar perfil do usuário
            const profileData = {
              id: user.id,
              nome_completo: data.nomeCompleto || "Usuário",
              data_nascimento: data.dataNascimento && data.dataNascimento.includes("/") ? 
                (() => {
                  const [day, month, year] = data.dataNascimento.split("/");
                  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
                })() : 
                data.dataNascimento || null,
              idade: data.idade ? parseInt(data.idade) : null,
              sexo: data.sexo || null,
              cpf: data.cpf || null,
              endereco: data.endereco || null,
              cidade_estado: data.cidadeEstado || null,
              telefone: data.telefone || null,
              email: data.email || user.email,
            };

            if (!profileCheck) {
              console.log("⚠️ Perfil não encontrado, criando...");
              const { error: createProfileError } = await supabase
                .from("user_profiles")
                .insert([profileData]);

              if (createProfileError) {
                console.error("❌ Erro ao criar perfil:", createProfileError);
                Alert.alert("Erro", "Erro ao criar perfil: " + createProfileError.message);
                return;
              }

              console.log("✅ Perfil criado com sucesso");
            } else {
              console.log("🔄 Atualizando perfil existente...");
              const { error: updateProfileError } = await supabase
                .from("user_profiles")
                .update(profileData)
                .eq("id", user.id);

              if (updateProfileError) {
                console.error("❌ Erro ao atualizar perfil:", updateProfileError);
                Alert.alert("Erro", "Erro ao atualizar perfil: " + updateProfileError.message);
                return;
              }

              console.log("✅ Perfil atualizado com sucesso");
            }
        // Calcular pontuação Fagerström
        const fagerstromScore = calculateFagerstrom();
        const fagerstromLevel = getFagerstromLevel(fagerstromScore);
        
        console.log('📊 Fagerström calculado:', { score: fagerstromScore, level: fagerstromLevel });

        // Preparar dados para salvamento
        const tabagismoData = {
          user_id: user.id,
          idade_comecou: parseInt(data.idadeComecou) || null,
          tempo_total_anos: parseInt(data.tempoTotal) || null,
          quantidade_atual_dia: parseInt(data.quantidadeAtual) || null,
          maior_quantidade_dia: parseInt(data.maiorQuantidade) || null,
          ja_tentou_parar: data.jaTentouParar === 'Sim',
          quantas_vezes_tentou: parseInt(data.quantasVezes) || null,
          metodos_utilizados: data.metodosUtilizados,
          motivo_recaida: data.motivoRecaida || null,
          primeira_vontade_acordar: data.primeiraVontade || null,
        };

        const saudeData = {
          user_id: user.id,
          doencas_atuais: data.doencasAtuais,
          medicamentos_uso: data.medicamentos || null,
          alergias_conhecidas: data.alergias || null,
          consumo_alcool: data.alcool || null,
          outras_drogas: data.outrasDrogas === 'Sim',
          outras_drogas_quais: data.outrasDrogasQuais || null,
          consumo_cafeina: data.cafeina === 'Sim',
          cafeina_quantidade_dia: data.cafeinaQuantidade || null,
        };

        const motivacaoData = {
          user_id: user.id,
          motivo_principal: data.motivoPrincipal || null,
          nivel_motivacao: data.nivelMotivacao && !isNaN(parseInt(data.nivelMotivacao)) ? 
            Math.max(0, Math.min(10, parseInt(data.nivelMotivacao))) : null,
          apoio_familia: data.apoioFamilia === 'Sim',
          ansioso_sem_fumar: data.ansiosoSemFumar === 'Sim',
          usa_cigarro_em: data.usaCigarroEm || [],
          acompanhamento_psicologico: data.acompanhamentoPsicologico === 'Sim',
          data_desejada_parar: data.dataDesejada && data.dataDesejada.includes("/") ? 
            (() => {
              const [day, month, year] = data.dataDesejada.split("/");
              return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
            })() : 
            data.dataDesejada || null,
          expectativas_programa: data.expectativas || null,
        };

        const fagerstromData = {
          user_id: user.id,
          tempo_apos_acordar: data.tempoAposAcordar || null,
          dificil_nao_fumar: data.dificilNaoFumar === 'Sim',
          cigarro_mais_dificil: data.cigarroMaisDificil || null,
          quantos_cigarros_dia: data.quantosCigarrosDia || null,
          fuma_mais_manha: data.fumaMaisManha === 'Sim',
          fuma_doente: data.fumaDoente === 'Sim',
          pontuacao_total: fagerstromScore,
          nivel_dependencia: fagerstromLevel,
        };

        console.log('📝 Dados preparados para salvamento');
        console.log('🔍 Dados de motivação:', motivacaoData);
        console.log('🔍 Nível motivação original:', data.nivelMotivacao);
        console.log('🔍 Nível motivação processado:', motivacaoData.nivel_motivacao);

        // Salvar dados de tabagismo (UPDATE ou INSERT)
        console.log('💾 Salvando tabagismo...');
        
        // Verificar se já existe registro
        const { data: existingTabagismo } = await supabase
          .from('anamnese_tabagismo')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let tabagismoResult, tabagismoError;
        
        if (existingTabagismo) {
          console.log('🔄 Atualizando tabagismo existente...');
          const result = await supabase
            .from('anamnese_tabagismo')
            .update(tabagismoData)
            .eq('user_id', user.id)
            .select();
          tabagismoResult = result.data;
          tabagismoError = result.error;
        } else {
          console.log('➕ Criando novo registro de tabagismo...');
          const result = await supabase
            .from('anamnese_tabagismo')
            .insert([tabagismoData])
            .select();
          tabagismoResult = result.data;
          tabagismoError = result.error;
        }

        console.log('📊 Resultado tabagismo:', { result: tabagismoResult, error: tabagismoError });

        if (tabagismoError) {
          console.error('❌ Erro ao salvar tabagismo:', tabagismoError);
          Alert.alert('Erro', 'Erro ao salvar dados de tabagismo: ' + tabagismoError.message);
          return;
        }

        // Salvar dados de saúde (UPDATE ou INSERT)
        console.log('💾 Salvando saúde...');
        
        const { data: existingSaude } = await supabase
          .from('anamnese_saude')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let saudeResult, saudeError;
        
        if (existingSaude) {
          console.log('🔄 Atualizando saúde existente...');
          const result = await supabase
            .from('anamnese_saude')
            .update(saudeData)
            .eq('user_id', user.id)
            .select();
          saudeResult = result.data;
          saudeError = result.error;
        } else {
          console.log('➕ Criando novo registro de saúde...');
          const result = await supabase
            .from('anamnese_saude')
            .insert([saudeData])
            .select();
          saudeResult = result.data;
          saudeError = result.error;
        }

        console.log('📊 Resultado saúde:', { result: saudeResult, error: saudeError });

        if (saudeError) {
          console.error('❌ Erro ao salvar saúde:', saudeError);
          Alert.alert('Erro', 'Erro ao salvar dados de saúde: ' + saudeError.message);
          return;
        }

        // Salvar dados de motivação (UPDATE ou INSERT)
        console.log('💾 Salvando motivação...');
        
        const { data: existingMotivacao } = await supabase
          .from('anamnese_motivacao')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let motivacaoResult, motivacaoError;
        
        if (existingMotivacao) {
          console.log('🔄 Atualizando motivação existente...');
          const result = await supabase
            .from('anamnese_motivacao')
            .update(motivacaoData)
            .eq('user_id', user.id)
            .select();
          motivacaoResult = result.data;
          motivacaoError = result.error;
        } else {
          console.log('➕ Criando novo registro de motivação...');
          const result = await supabase
            .from('anamnese_motivacao')
            .insert([motivacaoData])
            .select();
          motivacaoResult = result.data;
          motivacaoError = result.error;
        }

        console.log('📊 Resultado motivação:', { result: motivacaoResult, error: motivacaoError });

        if (motivacaoError) {
          console.error('❌ Erro ao salvar motivação:', motivacaoError);
          Alert.alert('Erro', 'Erro ao salvar dados de motivação: ' + motivacaoError.message);
          return;
        }

        // Salvar dados do teste Fagerström (UPDATE ou INSERT)
        console.log('💾 Salvando Fagerström...');
        
        const { data: existingFagerstrom } = await supabase
          .from('anamnese_fagerstrom')
          .select('id')
          .eq('user_id', user.id)
          .single();

        let fagerstromResult, fagerstromError;
        
        if (existingFagerstrom) {
          console.log('🔄 Atualizando Fagerström existente...');
          const result = await supabase
            .from('anamnese_fagerstrom')
            .update(fagerstromData)
            .eq('user_id', user.id)
            .select();
          fagerstromResult = result.data;
          fagerstromError = result.error;
        } else {
          console.log('➕ Criando novo registro de Fagerström...');
          const result = await supabase
            .from('anamnese_fagerstrom')
            .insert([fagerstromData])
            .select();
          fagerstromResult = result.data;
          fagerstromError = result.error;
        }

        console.log('📊 Resultado Fagerström:', { result: fagerstromResult, error: fagerstromError });

        if (fagerstromError) {
          console.error('❌ Erro ao salvar Fagerström:', fagerstromError);
          Alert.alert('Erro', 'Erro ao salvar dados do teste Fagerström: ' + fagerstromError.message);
          return;
        }

        console.log('✅ Todos os dados salvos com sucesso!');
        console.log(`📊 Teste Fagerström: ${fagerstromScore} pontos - Nível: ${fagerstromLevel}`);
        console.log('🔄 Redirecionando automaticamente para o perfil...');

        // Redirecionamento automático para o perfil
        try {
          router.push('/(tabs)/perfil');
        } catch (error) {
          console.log('❌ Erro no push, tentando replace...');
          try {
            router.replace('/(tabs)/perfil');
          } catch (error2) {
            console.log('❌ Erro no replace, tentando navigate...');
            router.navigate('/(tabs)/perfil' as any);
          }
        }

      } catch (error) {
        console.error('💥 Erro geral ao salvar anamnese:', error);
        Alert.alert(
          'Erro',
          'Ocorreu um erro ao salvar suas informações. Verifique o console para mais detalhes.',
          [{ text: 'OK' }]
        );
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const calculateFagerstrom = () => {
    let score = 0;
    
    // Tempo após acordar
    if (data.tempoAposAcordar === '≤ 5 min') score += 3;
    else if (data.tempoAposAcordar === '6–30 min') score += 2;
    else if (data.tempoAposAcordar === '31–60 min') score += 1;
    
    // Difícil não fumar
    if (data.dificilNaoFumar === 'Sim') score += 1;
    
    // Cigarro mais difícil
    if (data.cigarroMaisDificil === 'O primeiro da manhã') score += 1;
    
    // Quantidade por dia
    if (data.quantosCigarrosDia === '31 ou mais') score += 3;
    else if (data.quantosCigarrosDia === '21–30') score += 2;
    else if (data.quantosCigarrosDia === '11–20') score += 1;
    
    // Fuma mais de manhã
    if (data.fumaMaisManha === 'Sim') score += 1;
    
    // Fuma doente
    if (data.fumaDoente === 'Sim') score += 1;
    
    return score;
  };

  const getFagerstromLevel = (score: number) => {
    if (score <= 2) return 'Baixa dependência';
    if (score <= 4) return 'Dependência leve';
    if (score <= 7) return 'Dependência moderada';
    return 'Dependência elevada';
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Identificação do Paciente</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nome completo</Text>
              <TextInput
                style={styles.input}
                value={data.nomeCompleto}
                onChangeText={(text) => updateData('nomeCompleto', text)}
                placeholder="Digite seu nome completo"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Data de nascimento</Text>
                <TextInput
                  style={styles.input}
                  value={data.dataNascimento}
                  onChangeText={(text) => updateData('dataNascimento', text)}
                  placeholder="DD/MM/AAAA"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Idade</Text>
                <TextInput
                  style={styles.input}
                  value={data.idade}
                  onChangeText={(text) => updateData('idade', text)}
                  placeholder="Idade"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Sexo</Text>
              <View style={styles.optionsRow}>
                {['Masculino', 'Feminino', 'Outro'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.sexo === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('sexo', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.sexo === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>CPF</Text>
              <TextInput
                style={styles.input}
                value={data.cpf}
                onChangeText={(text) => updateData('cpf', text)}
                placeholder="000.000.000-00"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Endereço</Text>
              <TextInput
                style={styles.input}
                value={data.endereco}
                onChangeText={(text) => updateData('endereco', text)}
                placeholder="Rua, número, bairro"
              />
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Cidade/Estado</Text>
                <TextInput
                  style={styles.input}
                  value={data.cidadeEstado}
                  onChangeText={(text) => updateData('cidadeEstado', text)}
                  placeholder="São Paulo, SP"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Telefone</Text>
                <TextInput
                  style={styles.input}
                  value={data.telefone}
                  onChangeText={(text) => updateData('telefone', text)}
                  placeholder="(11) 99999-9999"
                  keyboardType="phone-pad"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>E-mail</Text>
              <TextInput
                style={styles.input}
                value={data.email}
                onChangeText={(text) => updateData('email', text)}
                placeholder="seu@email.com"
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>
        );

      case 1:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Histórico de Tabagismo</Text>
            
            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Idade que começou a fumar</Text>
                <TextInput
                  style={styles.input}
                  value={data.idadeComecou}
                  onChangeText={(text) => updateData('idadeComecou', text)}
                  placeholder="Ex: 16"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Tempo total (anos)</Text>
                <TextInput
                  style={styles.input}
                  value={data.tempoTotal}
                  onChangeText={(text) => updateData('tempoTotal', text)}
                  placeholder="Ex: 10"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.row}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Cigarros/dia atual</Text>
                <TextInput
                  style={styles.input}
                  value={data.quantidadeAtual}
                  onChangeText={(text) => updateData('quantidadeAtual', text)}
                  placeholder="Ex: 20"
                  keyboardType="numeric"
                />
              </View>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <Text style={styles.label}>Maior quantidade/dia</Text>
                <TextInput
                  style={styles.input}
                  value={data.maiorQuantidade}
                  onChangeText={(text) => updateData('maiorQuantidade', text)}
                  placeholder="Ex: 40"
                  keyboardType="numeric"
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Já tentou parar de fumar antes?</Text>
              <View style={styles.optionsRow}>
                {['Sim', 'Não'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.jaTentouParar === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('jaTentouParar', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.jaTentouParar === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {data.jaTentouParar === 'Sim' && (
              <>
                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Quantas vezes tentou?</Text>
                  <TextInput
                    style={styles.input}
                    value={data.quantasVezes}
                    onChangeText={(text) => updateData('quantasVezes', text)}
                    placeholder="Ex: 3"
                    keyboardType="numeric"
                  />
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Métodos utilizados</Text>
                  <View style={styles.checkboxContainer}>
                    {['Sem ajuda', 'Medicamentos', 'Adesivos/Nicotina', 'Terapia/Grupo de apoio', 'Outro'].map((method) => (
                      <TouchableOpacity
                        key={method}
                        style={[
                          styles.checkboxOption,
                          data.metodosUtilizados.includes(method) && styles.checkboxOptionSelected
                        ]}
                        onPress={() => toggleArrayItem('metodosUtilizados', method)}
                      >
                        <Text style={[
                          styles.checkboxText,
                          data.metodosUtilizados.includes(method) && styles.checkboxTextSelected
                        ]}>
                          {method}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={styles.inputGroup}>
                  <Text style={styles.label}>Motivo da recaída</Text>
                  <TextInput
                    style={styles.textArea}
                    value={data.motivoRecaida}
                    onChangeText={(text) => updateData('motivoRecaida', text)}
                    placeholder="Descreva o que levou à recaída..."
                    multiline
                    numberOfLines={3}
                  />
                </View>
              </>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Primeira vontade de fumar após acordar</Text>
              <View style={styles.checkboxContainer}>
                {['Menos de 5 min', '6-30 min', '31-60 min', 'Mais de 1h'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.checkboxOption,
                      data.primeiraVontade === option && styles.checkboxOptionSelected
                    ]}
                    onPress={() => updateData('primeiraVontade', option)}
                  >
                    <Text style={[
                      styles.checkboxText,
                      data.primeiraVontade === option && styles.checkboxTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>
        );

      case 2:
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Histórico de Saúde e Outras Substâncias</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Doenças atuais ou prévias</Text>
              <View style={styles.checkboxContainer}>
                {[
                  'Hipertensão',
                  'Diabetes', 
                  'Doença cardíaca',
                  'Doença pulmonar (DPOC, asma, bronquite)',
                  'Câncer',
                  'Depressão / Ansiedade',
                  'Outro'
                ].map((doenca) => (
                  <TouchableOpacity
                    key={doenca}
                    style={[
                      styles.checkboxOption,
                      data.doencasAtuais.includes(doenca) && styles.checkboxOptionSelected
                    ]}
                    onPress={() => toggleArrayItem('doencasAtuais', doenca)}
                  >
                    <Text style={[
                      styles.checkboxText,
                      data.doencasAtuais.includes(doenca) && styles.checkboxTextSelected
                    ]}>
                      {doenca}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Medicamentos em uso</Text>
              <TextInput
                style={styles.textArea}
                value={data.medicamentos}
                onChangeText={(text) => updateData('medicamentos', text)}
                placeholder="Liste os medicamentos que você usa atualmente..."
                multiline
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Alergias conhecidas</Text>
              <TextInput
                style={styles.input}
                value={data.alergias}
                onChangeText={(text) => updateData('alergias', text)}
                placeholder="Liste suas alergias..."
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consumo de álcool</Text>
              <View style={styles.optionsRow}>
                {['Não', 'Socialmente', 'Frequentemente'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.alcool === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('alcool', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.alcool === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Outras drogas</Text>
              <View style={styles.optionsRow}>
                {['Não', 'Sim'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.outrasDrogas === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('outrasDrogas', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.outrasDrogas === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {data.outrasDrogas === 'Sim' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quais drogas?</Text>
                <TextInput
                  style={styles.input}
                  value={data.outrasDrogasQuais}
                  onChangeText={(text) => updateData('outrasDrogasQuais', text)}
                  placeholder="Especifique..."
                />
              </View>
            )}

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Consumo de cafeína</Text>
              <View style={styles.optionsRow}>
                {['Não', 'Sim'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.cafeina === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('cafeina', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.cafeina === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {data.cafeina === 'Sim' && (
              <View style={styles.inputGroup}>
                <Text style={styles.label}>Quantidade média por dia</Text>
                <TextInput
                  style={styles.input}
                  value={data.cafeinaQuantidade}
                  onChangeText={(text) => updateData('cafeinaQuantidade', text)}
                  placeholder="Ex: 3 xícaras de café"
                />
              </View>
            )}
          </View>
        );

      case 3:
        const fagerstromScore = calculateFagerstrom();
        const fagerstromLevel = getFagerstromLevel(fagerstromScore);
        
        return (
          <View style={styles.stepContent}>
            <Text style={styles.stepTitle}>Motivação e Avaliação</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Motivo principal para querer parar de fumar</Text>
              <TextInput
                style={styles.textArea}
                value={data.motivoPrincipal}
                onChangeText={(text) => updateData('motivoPrincipal', text)}
                placeholder="Descreva sua principal motivação..."
                multiline
                numberOfLines={4}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Nível de motivação (0 a 10)</Text>
              <TextInput
                style={styles.input}
                value={data.nivelMotivacao}
                onChangeText={(text) => updateData('nivelMotivacao', text)}
                placeholder="Ex: 8"
                keyboardType="numeric"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Tem apoio de familiares/amigos?</Text>
              <View style={styles.optionsRow}>
                {['Sim', 'Não'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.apoioFamilia === option && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('apoioFamilia', option)}
                  >
                    <Text style={[
                      styles.optionText,
                      data.apoioFamilia === option && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Usa cigarro em situações de:</Text>
              <View style={styles.checkboxContainer}>
                {['Estresse', 'Ansiedade', 'Tristeza', 'Festas/social', 'Após refeições', 'Outro'].map((situacao) => (
                  <TouchableOpacity
                    key={situacao}
                    style={[
                      styles.checkboxOption,
                      data.usaCigarroEm.includes(situacao) && styles.checkboxOptionSelected
                    ]}
                    onPress={() => toggleArrayItem('usaCigarroEm', situacao)}
                  >
                    <Text style={[
                      styles.checkboxText,
                      data.usaCigarroEm.includes(situacao) && styles.checkboxTextSelected
                    ]}>
                      {situacao}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <Text style={styles.sectionSubtitle}>Avaliação Fagerström</Text>
            
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quanto tempo após acordar você fuma o primeiro cigarro?</Text>
              <View style={styles.checkboxContainer}>
                {['≤ 5 min (3 pts)', '6–30 min (2 pts)', '31–60 min (1 pt)', '> 60 min (0 pt)'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.checkboxOption,
                      data.tempoAposAcordar === option.split(' (')[0] && styles.checkboxOptionSelected
                    ]}
                    onPress={() => updateData('tempoAposAcordar', option.split(' (')[0])}
                  >
                    <Text style={[
                      styles.checkboxText,
                      data.tempoAposAcordar === option.split(' (')[0] && styles.checkboxTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>É difícil não fumar em locais proibidos?</Text>
              <View style={styles.optionsRow}>
                {['Sim (1 pt)', 'Não (0 pt)'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.optionButton,
                      data.dificilNaoFumar === option.split(' (')[0] && styles.optionButtonSelected
                    ]}
                    onPress={() => updateData('dificilNaoFumar', option.split(' (')[0])}
                  >
                    <Text style={[
                      styles.optionText,
                      data.dificilNaoFumar === option.split(' (')[0] && styles.optionTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Quantos cigarros você fuma por dia?</Text>
              <View style={styles.checkboxContainer}>
                {['10 ou menos (0 pt)', '11–20 (1 pt)', '21–30 (2 pts)', '31 ou mais (3 pts)'].map((option) => (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.checkboxOption,
                      data.quantosCigarrosDia === option.split(' (')[0] && styles.checkboxOptionSelected
                    ]}
                    onPress={() => updateData('quantosCigarrosDia', option.split(' (')[0])}
                  >
                    <Text style={[
                      styles.checkboxText,
                      data.quantosCigarrosDia === option.split(' (')[0] && styles.checkboxTextSelected
                    ]}>
                      {option}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            <View style={styles.fagerstromResult}>
              <Text style={styles.fagerstromTitle}>Resultado Fagerström</Text>
              <Text style={styles.fagerstromScore}>Pontuação: {fagerstromScore}/10</Text>
              <Text style={styles.fagerstromLevel}>{fagerstromLevel}</Text>
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Data desejada para parar</Text>
              <TextInput
                style={styles.input}
                value={data.dataDesejada}
                onChangeText={(text) => updateData('dataDesejada', text)}
                placeholder="DD/MM/AAAA"
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Expectativas em relação ao programa</Text>
              <TextInput
                style={styles.textArea}
                value={data.expectativas}
                onChangeText={(text) => updateData('expectativas', text)}
                placeholder="Descreva suas expectativas e objetivos..."
                multiline
                numberOfLines={4}
              />
            </View>
          </View>
        );

      default:
        return null;
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {loading ? (
        <View style={styles.loadingContainer}>
          <Text style={styles.loadingText}>Carregando dados...</Text>
        </View>
      ) : (
        <>
          <LinearGradient
            colors={['#8B5CF6', '#7C3AED']}
            style={styles.header}
          >
        <TouchableOpacity 
          style={styles.backButton}
          onPress={() => router.back()}
        >
          <ArrowLeft size={24} color="white" />
        </TouchableOpacity>
        
        <Text style={styles.headerTitle}>Anamnese</Text>
        <Text style={styles.headerSubtitle}>
          Etapa {currentStep + 1} de {steps.length}
        </Text>

        <View style={styles.progressContainer}>
          <View style={styles.progressBar}>
            <View style={[
              styles.progressFill, 
              { width: `${((currentStep + 1) / steps.length) * 100}%` }
            ]} />
          </View>
        </View>

        <View style={styles.stepsIndicator}>
          {steps.map((step, index) => (
            <View key={index} style={styles.stepIndicator}>
              <View style={[
                styles.stepCircle,
                index <= currentStep && styles.stepCircleActive
              ]}>
                {index < currentStep ? (
                  <Check size={16} color="white" />
                ) : (
                  <step.icon size={16} color={index === currentStep ? "white" : "#8B5CF6"} />
                )}
              </View>
              <Text style={[
                styles.stepLabel,
                index <= currentStep && styles.stepLabelActive
              ]}>
                {step.title}
              </Text>
            </View>
          ))}
        </View>
      </LinearGradient>

      <ScrollView style={styles.content} contentContainerStyle={styles.scrollContent}>
        {renderStep()}
      </ScrollView>

      <View style={styles.navigation}>
        <TouchableOpacity
          style={[styles.navButton, currentStep === 0 && styles.navButtonDisabled]}
          onPress={prevStep}
          disabled={currentStep === 0}
        >
          <ArrowLeft size={20} color={currentStep === 0 ? "#9CA3AF" : "#6B7280"} />
          <Text style={[
            styles.navButtonText,
            currentStep === 0 && styles.navButtonTextDisabled
          ]}>
            Anterior
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.nextButton}
          onPress={nextStep}
        >
          <Text style={styles.nextButtonText}>
            {currentStep === steps.length - 1 ? 'Salvar' : 'Próximo'}
          </Text>
          {currentStep === steps.length - 1 ? (
            <Check size={20} color="white" />
          ) : (
            <ArrowRight size={20} color="white" />
          )}
        </TouchableOpacity>
      </View>
        </>
      )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 25,
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
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginBottom: 20,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 6,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 3,
  },
  progressFill: {
    height: '100%',
    backgroundColor: 'white',
    borderRadius: 3,
  },
  stepsIndicator: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  stepIndicator: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  stepCircleActive: {
    backgroundColor: 'white',
  },
  stepLabel: {
    fontSize: 12,
    color: 'rgba(255, 255, 255, 0.7)',
    textAlign: 'center',
  },
  stepLabelActive: {
    color: 'white',
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  scrollContent: {
    padding: 20,
    paddingBottom: 100,
  },
  stepContent: {
    gap: 20,
  },
  stepTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 20,
    marginBottom: 15,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
  },
  textArea: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    color: '#111827',
    minHeight: 80,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
  optionsRow: {
    flexDirection: 'row',
    gap: 10,
  },
  optionButton: {
    flex: 1,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  optionText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  optionTextSelected: {
    color: 'white',
  },
  checkboxContainer: {
    gap: 8,
  },
  checkboxOption: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
  },
  checkboxOptionSelected: {
    backgroundColor: '#8B5CF6',
    borderColor: '#8B5CF6',
  },
  checkboxText: {
    fontSize: 14,
    color: '#6B7280',
    fontWeight: '500',
  },
  checkboxTextSelected: {
    color: 'white',
  },
  fagerstromResult: {
    backgroundColor: '#FEF3C7',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginVertical: 20,
  },
  fagerstromTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#92400E',
    marginBottom: 8,
  },
  fagerstromScore: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#D97706',
    marginBottom: 5,
  },
  fagerstromLevel: {
    fontSize: 14,
    color: '#92400E',
    fontWeight: '600',
  },
  navigation: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 15,
  },
  navButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#F3F4F6',
    gap: 8,
  },
  navButtonDisabled: {
    opacity: 0.5,
  },
  navButtonText: {
    fontSize: 16,
    color: '#6B7280',
    fontWeight: '500',
  },
  navButtonTextDisabled: {
    color: '#9CA3AF',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 12,
    backgroundColor: '#8B5CF6',
    gap: 8,
    flex: 1,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
  },
});