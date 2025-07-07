# 📁 Organizador de Pastas

Uma aplicação web moderna para criar pastas organizadas com subpastas padronizadas para seus projetos.

## ✨ Funcionalidades

- **Interface moderna e responsiva** com design elegante
- **Preview em tempo real** da estrutura de pastas que será criada
- **Validação de entrada** com sanitização automática de nomes
- **Conversão automática para maiúsculas** no nome da pasta
- **Nomes com espaços** (sem hífens entre palavras)
- **Numeração opcional** com formatação automática (001. , 002. , etc.)
- **Notificações visuais** para feedback do usuário
- **Design responsivo** que funciona em desktop e mobile
- 🤖 **Integração com IA** - Extração automática de informações de múltiplas imagens
- 📋 **Área de Transferência** - Cole imagens diretamente com Ctrl+V ou botão dedicado
- 🖼️ **Múltiplas Imagens** - Adicione e processe várias imagens de uma vez
- 🧹 **Limpeza automática** - Remove códigos entre aspas, parênteses e colchetes
- 📊 **Status Visual** - Acompanhe o progresso de cada imagem em tempo real

## 🗂️ Estrutura de Pastas Criada

Para cada pasta criada, o sistema automaticamente cria as seguintes subpastas:

### Exemplo com número:
```
001. MEU PROJETO/
├── _layout/
├── final/
├── preview/
├── texto/
└── referencias/
```

### Exemplo sem número:
```
MEU PROJETO/
├── _layout/
├── final/
├── preview/
├── texto/
└── referencias/
```

### Exemplo com IA e limpeza automática:
**Entrada da imagem:**
```
#6287 · FUNCIONALIDADE UNLOCK SURPRISE (MKT)
├── 1. STORY E ANUNCIO ADS [SOCIAL]
├── 2. REELS E ANUNCIO ADS "V2"
├── 3. POP-UP HOME NUTRITION {WEB}
```

**Resultado após processamento:**
```
6287. FUNCIONALIDADE UNLOCK SURPRISE/
├── _layout/
├── final/
├── preview/
├── texto/
├── referencias/
├── 1. STORY E ANUNCIO ADS/      (Imagem 1 - Jira)
├── 2. REELS E ANUNCIO ADS/      (Imagem 1 - Jira)
├── 3. POP-UP HOME NUTRITION/    (Imagem 1 - Jira)
├── 4. ASSETS DESIGN/            (Imagem 2 - Figma)
├── 5. DOCUMENTACAO TECNICA/     (Imagem 3 - Explorer)
└── 6. ENTREGAVEIS FINAIS/       (Imagem 4 - Documentos)
```

## 🔄 Combinação de Múltiplas Imagens

Quando você processa múltiplas imagens, o sistema **combina** as informações em vez de sobrescrever:

### Como Funciona:
1. **Primeira Imagem**: Define pasta principal e adiciona suas subpastas
2. **Imagens Seguintes**: Mantém pasta principal, adiciona novas subpastas
3. **Anti-Duplicação**: Subpastas com mesmo nome são automaticamente removidas
4. **Resultado**: Estrutura completa com informações de todas as imagens

### 🔍 Detecção Avançada de Numeração (Novo!)

A IA agora detecta **6 tipos diferentes** de numeração em prints:
- **Números Inteiros**: `1. DESIGN`, `2. DESENVOLVIMENTO`
- **Números Decimais**: `6.1 PRODUCAO PASTA FICHARIO`, `6.2 ANALISE COMPETITIVA`
- **Números com Letras**: `1a. PRIMEIRA VERSÃO`, `1b. SEGUNDA VERSÃO`
- **Números Romanos**: `I. PLANEJAMENTO`, `II. EXECUÇÃO`
- **Letras**: `A. CONCEITO`, `B. DESENVOLVIMENTO`
- **Bullet Points**: `• ITEM UM`, `→ ITEM DOIS`

> 🎯 **Melhor Precisão**: Modelo atualizado para GPT-4o com prompts mais específicos
> 
> 🧹 **Preserva Acentos**: Mantém caracteres especiais em português
> 
> 📊 **Logs Detalhados**: Console do navegador mostra exatamente o que foi detectado

### Exemplo Prático:
```
📸 Imagem 1 (Jira): #6287 · FUNCIONALIDADE UNLOCK SURPRISE
   └── 1. STORY ADS, 2. REELS ADS, 3. POP-UP HOME

📸 Imagem 2 (Figma): Assets de Design  
   └── 4. ASSETS DESIGN, 5. LAYOUTS RESPONSIVOS

📸 Imagem 3 (Explorer): Documentação
   └── 6. DOCUMENTACAO TECNICA, 7. TESTES

✅ Resultado Final: 7 subpastas combinadas automaticamente!
```

## 🚀 Como Usar

### Método Manual:
1. **Abra o arquivo `index.html`** em seu navegador
2. **Digite o número** (opcional) no campo à esquerda
3. **Digite o nome da pasta** no campo de entrada
4. **Veja o preview** da estrutura que será criada
5. **Clique em "Salvar Pastas"** para abrir o seletor de local
6. **Escolha onde salvar** no seu computador
7. **Confirme a criação** das pastas

### 🤖 Método com IA (Novo!):
1. **Configure sua chave API** no arquivo `script.js` (uma única vez)
2. **Adicione imagens** de 3 formas:
   - **📸 Adicionar Print das Pastas**: Selecione arquivos do computador
   - **📋 Colar da Área de Transferência**: Cole diretamente após Print Screen
   - **Ctrl+V**: Atalho rápido para colar em qualquer lugar da página
3. **Escolha múltiplos screenshots** da sua estrutura de pastas
4. **Processe individualmente** ou **"🔍 Processar Todas as Imagens"**
5. **Acompanhe o status** de cada imagem na galeria visual
6. **Os campos serão preenchidos automaticamente**
7. **Revise e ajuste** se necessário
8. **Clique em "Salvar Pastas"** para criar a estrutura

> 🎯 **Detecção Inteligente**: A IA prioriza títulos com "#" (ex: "#6287 · FUNCIONALIDADE UNLOCK SURPRISE") para a pasta principal!

> 🧹 **Limpeza Automática**: Remove automaticamente códigos entre aspas, parênteses, colchetes e chaves!

> 🔄 **Combinação Inteligente**: Múltiplas imagens são combinadas automaticamente, sem sobrescrever informações!

> 📖 **Documentação completa**:
> - [INTEGRAÇÃO_IA.md](INTEGRAÇÃO_IA.md) - Instruções detalhadas da funcionalidade de IA
> - [EXEMPLO_CLIPBOARD.md](EXEMPLO_CLIPBOARD.md) - Como colar da área de transferência
> - [EXEMPLO_DETECÇÃO_TITULO.md](EXEMPLO_DETECÇÃO_TITULO.md) - Como funciona a detecção de títulos com "#"
> - [EXEMPLO_MULTIPLAS_IMAGENS.md](EXEMPLO_MULTIPLAS_IMAGENS.md) - Guia prático para múltiplas imagens
 > - [MELHORIAS_DETECÇÃO_AI.md](MELHORIAS_DETECÇÃO_AI.md) - Melhorias na detecção de números decimais e diferentes formatos
> - [DESIGN_ROXO_GLASS.md](DESIGN_ROXO_GLASS.md) - Novo design moderno com gradiente roxo e efeito glass
> - [CONFIGURACAO_API_FIXA.md](CONFIGURACAO_API_FIXA.md) - Como configurar API Key fixa no código

### 🌟 Benefícios da Combinação de Múltiplas Imagens:
- **Projetos Complexos**: Capture diferentes aspectos em imagens separadas
- **Fontes Diversas**: Combine Jira + Figma + Documentos + Explorer
- **Estrutura Completa**: Obtenha uma visão abrangente do projeto
- **Eficiência**: Economize tempo processando tudo de uma vez
- **Precisão**: Cada imagem contribui com suas informações específicas

### ⌨️ Atalhos de Teclado:
- **Print Screen**: Captura tela inteira para área de transferência
- **Alt + Print Screen**: Captura apenas janela ativa
- **Windows + Shift + S**: Ferramenta de recorte do Windows
- **Ctrl + V**: Cola imagem da área de transferência (funciona em qualquer lugar da página)
- **Cmd + V**: Cola no macOS

## 📋 Requisitos

### Requisitos Básicos:
- **Navegador moderno** com suporte à API File System Access:
  - Chrome 86+
  - Edge 86+
  - Firefox 111+
- JavaScript habilitado
- Permissões para acessar o sistema de arquivos

### Requisitos Adicionais para IA:
- **Chave API do OpenAI** configurada no código JavaScript (ver [CONFIGURACAO_API_FIXA.md](CONFIGURACAO_API_FIXA.md))
- **Conexão com internet** (para comunicação com a API)
- **Créditos na conta OpenAI** (custo aproximado: $0.05-0.09 por imagem)

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript ES6+** - Funcionalidade interativa
- **File System Access API** - Criação de pastas no sistema
- **OpenAI GPT-4o-mini** - Processamento de imagens e extração de texto
- **Fetch API** - Comunicação com a API do OpenAI

## 📱 Responsividade

A aplicação é totalmente responsiva e funciona perfeitamente em:
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (até 767px)

## 🔒 Compatibilidade e Segurança

### Navegadores Suportados
- ✅ **Chrome 86+** - Suporte completo
- ✅ **Edge 86+** - Suporte completo  
- ✅ **Firefox 111+** - Suporte completo
- ❌ **Safari** - Não suporta File System Access API

### Permissões
O site solicitará permissão para acessar o sistema de arquivos. Esta permissão é necessária para:
- Selecionar onde salvar as pastas
- Criar a estrutura de pastas no local escolhido
- Não acessa outros arquivos sem sua autorização

## 🔧 Personalização

### Alterando as Subpastas

Para modificar as subpastas criadas, edite o arquivo `script.js` na linha 12:

```javascript
this.subfolders = ['_layout', 'final', 'preview', 'texto', 'referencias'];
```

### Modificando o Design

O arquivo `styles.css` contém todas as configurações de estilo. Você pode:
- Alterar as cores do gradiente de fundo
- Modificar os raios de borda
- Ajustar as animações
- Personalizar as notificações

## 🔮 Próximas Funcionalidades

- [x] ✅ Criação real de pastas no sistema de arquivos
- [x] ✅ Integração com IA para extração de informações de imagens
- [x] ✅ Drag and drop para reorganizar subpastas
- [x] ✅ **Detecção inteligente de hashtags (#6287 · TÍTULO)**
- [x] ✅ **Compatibilidade com sistemas de gerenciamento de projetos**
- [x] ✅ **Limpeza automática de códigos e categorias**
- [x] ✅ **Múltiplas imagens com galeria visual**
- [x] ✅ **Processamento em lote de imagens**
- [x] ✅ **Status visual por imagem**
- [x] ✅ **Colar da área de transferência (Ctrl+V)**
- [x] ✅ **Botão dedicado para clipboard**
- [x] ✅ **Atalhos globais de teclado**
- [x] ✅ **Design moderno com gradiente roxo e efeito glass**
- [x] ✅ **Interface glassmorphism com transparência e blur**
- [x] ✅ **API Key fixa no código para maior segurança e praticidade**
- [ ] Exportação da estrutura em diferentes formatos
- [ ] Templates personalizáveis
- [ ] Suporte a múltiplas estruturas de pastas
- [ ] Integração com outros modelos de IA (Claude, Gemini)
- [ ] Reconhecimento de texto em imagens (OCR local)
- [ ] Integração direta com Jira/Trello APIs

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

### 🧪 Teste e Debug

Para testar e debugar problemas relacionados ao JSON:
- **Arquivo de teste**: `test_json_cleanup.html`
- **Propósito**: Validar a funcionalidade de limpeza de JSON
- **Uso**: Abra o arquivo no navegador e teste diferentes formatos de resposta da IA

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório do projeto.

---

**Desenvolvido com ❤️ para organizar seus projetos de forma eficiente!** 