# 🤖 Integração com IA - Extração de Informações de Imagens

## Visão Geral

A nova funcionalidade de integração com IA permite que você tire um print (screenshot) de uma estrutura de pastas e automaticamente extraia os nomes e números das pastas para preencher o formulário.

## Como Usar

### 1. Obtenha sua Chave API do OpenAI

1. Acesse [platform.openai.com](https://platform.openai.com)
2. Faça login ou crie uma conta
3. Vá para [API Keys](https://platform.openai.com/account/api-keys)
4. Clique em "Create new secret key"
5. Copie a chave (começa com `sk-`)

### 2. Configure a Chave API

1. No formulário, cole sua chave API no campo "Chave API OpenAI"
2. A chave será salva automaticamente no seu navegador (localStorage)

### 3. Envie uma Imagem

1. Clique no botão "📸 Enviar Print das Pastas"
2. Selecione uma imagem do seu computador
3. A imagem será exibida em um preview

### 4. Processe com IA

1. Clique no botão "🔍 Processar com IA"
2. Aguarde o processamento (barra de progresso)
3. Os campos serão preenchidos automaticamente

## Tipos de Imagens Suportadas

- **Formatos**: PNG, JPG, JPEG, GIF, WebP
- **Tamanho máximo**: 20MB
- **Conteúdo**: Screenshots de exploradores de arquivos, listas de pastas, estruturas de diretórios

## Exemplos de Uso

### ✅ Funciona bem com:
- Screenshot do Windows Explorer
- Lista de pastas numeradas
- Estruturas de diretórios
- Prints de softwares de gerenciamento de arquivos
- **Títulos com "#" (ex: "#6287 · FUNCIONALIDADE UNLOCK SURPRISE")**
- **Sistemas de gerenciamento de projetos (Jira, Trello, etc.)**
- **Listas de tarefas com numeração**
- **Estruturas hierárquicas de trabalho**

### ❌ Pode ter dificuldades com:
- Imagens muito borradas
- Texto muito pequeno
- Estruturas muito complexas
- Imagens com muito ruído visual

### 🧪 Como Testar a Funcionalidade:

1. **Crie uma estrutura de pastas no seu computador**:
   ```
   001. PROJETO_TESTE
   ├── 1. DESIGN
   ├── 2. DESENVOLVIMENTO
   └── 3. DOCUMENTACAO
   ```

2. **Tire um screenshot** da janela do Windows Explorer

3. **Teste com diferentes formatos**:
   - Screenshot da árvore de pastas
   - Lista de pastas em visualização de detalhes
   - Estrutura de diretórios no terminal

4. **Verifique a qualidade da imagem**:
   - Texto deve estar legível
   - Contraste adequado
   - Resolução suficiente (não muito pixelizada)

### 📝 Exemplos de Estruturas Que Funcionam Bem:

**Sistemas de Gerenciamento de Projetos:**
```
#6287 · FUNCIONALIDADE UNLOCK SURPRISE (MKT)
├── 1. STORY E ANUNCIO ADS [SOCIAL]
├── 2. REELS E ANUNCIO ADS VOICE OVER "V2"
├── 3. POP-UP HOME NUTRITION {WEB}
└── 4. ADAPTAÇÃO FOLDER COLLAGEN (PRINT)

Resultado após limpeza automática:
#6287 · FUNCIONALIDADE UNLOCK SURPRISE
├── 1. STORY E ANUNCIO ADS
├── 2. REELS E ANUNCIO ADS VOICE OVER
├── 3. POP-UP HOME NUTRITION
└── 4. ADAPTAÇÃO FOLDER COLLAGEN

#1234 · CAMPANHA NATAL 2024 [URGENTE]
├── 1. PLANEJAMENTO (ESTRATÉGIA)
├── 2. CRIATIVOS "FINAL"
├── 3. MÍDIA {DIGITAL}
└── 4. RELATÓRIOS

Resultado após limpeza:
#1234 · CAMPANHA NATAL 2024
├── 1. PLANEJAMENTO
├── 2. CRIATIVOS
├── 3. MÍDIA
└── 4. RELATÓRIOS
```

**Estruturas Tradicionais:**
```
001. PROJETO_MARKETING
├── 1. BRIEFING
├── 2. CRIACAO
├── 3. APROVACAO
└── 4. ENTREGA

002. WEBSITE_CLIENTE
├── 1. WIREFRAMES
├── 2. DESIGN
├── 3. DESENVOLVIMENTO
└── 4. TESTES

EVENTO_2024
├── 1. PLANEJAMENTO
├── 2. LOGISTICA
├── 3. MARKETING
└── 4. EXECUCAO
```

## Formato de Dados Extraídos

A IA procura por (em ordem de prioridade):

### 1. **Títulos com "#" (Prioridade Máxima)**
- **Padrão**: `#NUMERO · TÍTULO` ou `#NUMERO - TÍTULO`
- **Uso**: Pasta principal
- **Exemplos**:
  - `#6287 · FUNCIONALIDADE UNLOCK SURPRISE` → Número: 6287, Nome: FUNCIONALIDADE UNLOCK SURPRISE
  - `#123 - PROJETO MARKETING` → Número: 123, Nome: PROJETO MARKETING
  - `#4567 · DESENVOLVIMENTO SITE` → Número: 4567, Nome: DESENVOLVIMENTO SITE

### 🧹 **Limpeza Automática de Texto**
A IA remove automaticamente códigos e categorias desnecessárias:
- **Aspas**: `"CÓDIGO"` → removido
- **Parênteses**: `(MKT)` → removido  
- **Colchetes**: `[URGENTE]` → removido
- **Chaves**: `{CATEGORIA}` → removido

**Exemplos de limpeza:**
- `#6287 · FUNCIONALIDADE UNLOCK SURPRISE (MKT)` → **FUNCIONALIDADE UNLOCK SURPRISE**
- `#123 - PROJETO MARKETING [URGENTE]` → **PROJETO MARKETING**
- `1. DESIGN (CRIATIVO) "V2"` → **DESIGN**
- `2. DESENVOLVIMENTO {BACKEND}` → **DESENVOLVIMENTO**

### 2. **Estruturas de Pastas Tradicionais**
- **Pasta principal**: Número e nome
- **Subpastas**: Números e nomes das subpastas

Exemplo de estrutura detectada:
```
#6287 · FUNCIONALIDADE UNLOCK SURPRISE
├── 1. STORY E ANUNCIO ADS
├── 2. REELS E ANUNCIO ADS
├── 3. POP-UP HOME NUTRITION
└── 4. ADAPTAÇÃO FOLDER COLLAGEN
```

Ou estrutura tradicional:
```
001. PROJETO_PRINCIPAL
  ├── 1. DESIGN
  ├── 2. DESENVOLVIMENTO
  └── 3. MARKETING
```

## 🖼️ Múltiplas Imagens (Nova Funcionalidade)

### Como Usar Múltiplas Imagens

1. **Adicionar Imagens**:
   - **Opção 1**: Clique em "📸 Adicionar Print das Pastas" e selecione arquivos
   - **Opção 2**: Clique em "📋 Colar da Área de Transferência" após tirar um print
   - **Opção 3**: Use **Ctrl+V** em qualquer lugar da página para colar
   - Selecione múltiplas imagens (segure Ctrl/Cmd para selecionar várias)
   - Ou adicione uma por vez

2. **Gerenciar Imagens**:
   - Cada imagem aparece na galeria com preview
   - Status visual: Aguardando (🟡), Processando (🔵), Concluído (🟢), Erro (🔴)
   - Botões individuais: "▶ Processar" e "✕ Remover"

3. **Processar Imagens**:
   - **Individual**: Clique em "▶ Processar" em cada imagem
   - **Em Lote**: Clique em "🔍 Processar Todas as Imagens"
   - **Limpeza**: Botão "🗑️ Limpar Todas" para remover todas as imagens

### Vantagens das Múltiplas Imagens

- **Projetos Complexos**: Capture diferentes seções/módulos
- **Documentação Completa**: Combine informações de várias fontes
- **Backup de Dados**: Processe várias versões da mesma estrutura
- **Organização**: Mantenha todas as referências visuais organizadas

### Exemplo de Uso
```
Imagem 1: Print da estrutura geral do projeto
Imagem 2: Detalhes das subpastas de Design
Imagem 3: Lista de tarefas do Jira
Imagem 4: Estrutura de documentos

Resultado: Combinação inteligente de todas as informações
```

### Status das Imagens
- **🟡 Aguardando**: Imagem carregada, pronta para processamento
- **🔵 Processando**: IA está analisando a imagem
- **🟢 Concluído**: Informações extraídas com sucesso
- **🔴 Erro**: Falha no processamento (clique para ver detalhes)

### Controles Disponíveis
- **Processar Individual**: Processa apenas uma imagem selecionada
- **Processar Todas**: Processa todas as imagens pendentes em sequência
- **Remover**: Remove imagem específica da lista
- **Limpar Todas**: Remove todas as imagens (não disponível durante processamento)

### Combinação de Resultados
- **Pasta Principal**: A primeira imagem processada define número e nome da pasta
- **Subpastas**: Todas as imagens contribuem com suas subpastas
- **Anti-duplicação**: Subpastas com mesmo nome são automaticamente removidas
- **Resultado**: Estrutura completa com informações de todas as imagens
- **Feedback**: Sistema informa quantas subpastas foram criadas no total

## Custos

- Utiliza o modelo **GPT-4o-mini** (mais econômico)
- Custo aproximado: $0.15 por 1000 tokens
- Uma imagem típica consome ~300-600 tokens (prompt melhorado)
- Custo por processamento: ~$0.05-0.09
- **Múltiplas imagens**: Custo multiplicado pelo número de imagens processadas

## Segurança

- ✅ Chave API salva apenas no seu navegador
- ✅ Imagens processadas pela OpenAI (não armazenadas)
- ✅ Dados não são compartilhados com terceiros
- ⚠️ Não compartilhe sua chave API com outras pessoas

## Solução de Problemas

### "Erro na API do OpenAI"
- Verifique se a chave API está correta
- Confirme se há créditos na sua conta OpenAI
- Tente novamente após alguns segundos

### "Imagem muito grande"
- Reduza o tamanho da imagem
- Use formatos mais compactos (PNG, JPG)
- Limite: 20MB por imagem

### "Não foi possível extrair informações"
- Tente uma imagem mais clara
- Certifique-se de que os nomes das pastas estão visíveis
- Use uma imagem com contraste melhor

### "Erro JSON inválido" / "Unexpected token"
- **Problema**: IA retornou resposta formatada em markdown
- **Solução**: O sistema agora limpa automaticamente a resposta
- **Se persistir**: Tente novamente, o sistema tem fallback para recuperar JSON
- **Prevenção**: Use imagens mais claras para respostas mais consistentes

### "Chave API inválida"
- Verifique se a chave começa com "sk-"
- Confirme se foi copiada completamente
- Verifique se a conta OpenAI tem créditos disponíveis
- Tente gerar uma nova chave API

### "Muitas requisições"
- Aguarde 10-30 segundos entre tentativas
- Evite processar múltiplas imagens rapidamente
- Considere usar uma conta OpenAI com limites maiores

## Limitações

- Requer conexão com internet
- Depende da clareza da imagem
- Funciona melhor com texto em português/inglês
- Pode não detectar estruturas muito complexas

## Suporte

Se encontrar problemas:
1. **Abra o Console do Navegador** (F12 → Console)
2. **Procure por logs detalhados** da integração com IA
3. **Verifique as mensagens de erro específicas**
4. **Tente com uma imagem diferente**
5. **Confirme se a chave API está válida**
6. **Verifique sua conexão com internet**

### Debug no Console

O sistema registra informações detalhadas no console do navegador:

```javascript
// Exemplos de logs que você pode ver:
"Resposta original da IA: {...}"
"Resposta da IA após limpeza: {...}"
"JSON recuperado com sucesso: {...}"
"Erro ao fazer parse do JSON: SyntaxError..."
```

### Como Usar o Console para Debug:

1. **Abra as Ferramentas do Desenvolvedor** (F12)
2. **Vá para a aba "Console"**
3. **Processe uma imagem** e observe os logs
4. **Copie mensagens de erro** se precisar de ajuda
5. **Verifique se a resposta da IA está formatada corretamente**

### Exemplo de Resposta Válida:

```json
{
  "mainFolder": {
    "number": "001",
    "name": "PROJETO_PRINCIPAL"
  },
  "subfolders": [
    {
      "number": "1",
      "name": "DESIGN"
    },
    {
      "number": "2",
      "name": "DESENVOLVIMENTO"
    }
  ]
}
```

## 🆕 Atualizações Recentes

### v3.1 - Área de Transferência (Mais Recente)
- ✅ **Botão Colar**: Botão dedicado "📋 Colar da Área de Transferência"
- ✅ **Atalho Global**: Ctrl+V funciona em qualquer lugar da página
- ✅ **Clipboard API**: Leitura moderna da área de transferência
- ✅ **Compatibilidade**: Fallback para navegadores mais antigos
- ✅ **Workflow Rápido**: Print Screen + Ctrl+V = máxima eficiência
- ✅ **Tratamento de Erros**: Mensagens específicas para cada problema

### v3.0 - Múltiplas Imagens
- ✅ **Suporte a múltiplas imagens**: Adicione e gerencie várias imagens
- ✅ **Galeria visual**: Interface moderna com preview de todas as imagens
- ✅ **Processamento em lote**: Processe todas as imagens de uma vez
- ✅ **Controles individuais**: Processe ou remova imagens específicas
- ✅ **Status visual**: Acompanhe o status de cada imagem (Aguardando, Processando, Concluído, Erro)
- ✅ **Combinação inteligente**: Mescle informações de múltiplas fontes
- ✅ **Interface responsiva**: Layout adaptado para dispositivos móveis

### v2.2 - Limpeza Automática de Texto
- ✅ **Remoção automática de códigos entre aspas** `"CÓDIGO"`
- ✅ **Remoção automática de categorias entre parênteses** `(MKT)`
- ✅ **Remoção automática de tags entre colchetes** `[URGENTE]`
- ✅ **Remoção automática de categorias entre chaves** `{BACKEND}`
- ✅ **Nomes de pastas mais limpos e profissionais**

### v2.1 - Detecção de Hashtags
- ✅ **Prioridade para títulos com "#"** (ex: "#6287 · FUNCIONALIDADE UNLOCK SURPRISE")
- ✅ **Compatibilidade com sistemas de gerenciamento de projetos** (Jira, Trello, etc.)
- ✅ **Extração automática de números de tickets/tasks**
- ✅ **Suporte a separadores "·" e "-"**

### v2.0 - Tratamento Robusto de JSON
- ✅ **Correção do erro "Unexpected token"**
- ✅ **Limpeza automática de formatação markdown**
- ✅ **Fallback para recuperação de JSON**
- ✅ **Logs detalhados para debug**
- ✅ **Mensagens de erro específicas**

### v1.0 - Versão Inicial
- ✅ **Integração com OpenAI Vision API**
- ✅ **Upload e processamento de imagens**
- ✅ **Preenchimento automático de formulários**
- ✅ **Interface visual atraente**

---

**Desenvolvido com ❤️ para facilitar a organização de pastas!** 