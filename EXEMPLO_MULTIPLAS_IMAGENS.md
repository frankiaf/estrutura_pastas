# 📸 Exemplo: Como Usar Múltiplas Imagens

## Cenário Real: Projeto Complexo

Imagine que você tem um projeto grande com múltiplas telas/sistemas para documentar:

### Situação
- **Projeto**: `#6287 · FUNCIONALIDADE UNLOCK SURPRISE`
- **Sistemas**: Jira, Figma, Documentos, Estrutura de Pastas
- **Objetivo**: Criar estrutura de pastas completa com todas as informações

## Passo a Passo

### 1. Prepare as Imagens

**Tire screenshots de:**
- 📊 **Jira**: Lista de tarefas do projeto
- 🎨 **Figma**: Estrutura de design
- 📁 **Windows Explorer**: Pasta atual do projeto
- 📝 **Documentos**: Lista de entregáveis

### 2. Adicione as Imagens

1. **Abra o Organizador de Pastas**
2. **Cole sua chave API do OpenAI**
3. **Clique em "📸 Adicionar Print das Pastas"**
4. **Selecione todas as 4 imagens de uma vez** (Ctrl+clique)
5. **Veja as imagens aparecerem na galeria**

### 3. Processe as Imagens

**Opção A - Processamento Individual:**
```
Imagem 1 (Jira) → Clique "▶ Processar" → Status: 🟢 Concluído
Imagem 2 (Figma) → Clique "▶ Processar" → Status: 🟢 Concluído
Imagem 3 (Explorer) → Clique "▶ Processar" → Status: 🟢 Concluído
Imagem 4 (Docs) → Clique "▶ Processar" → Status: 🟢 Concluído
```

**Opção B - Processamento em Lote:**
```
Clique "🔍 Processar Todas as Imagens" → Aguarde → Todas: 🟢 Concluído
```

### 4. Resultado Esperado

**Campos preenchidos automaticamente:**
- **Número**: `6287` (da primeira imagem)
- **Nome**: `FUNCIONALIDADE UNLOCK SURPRISE` (da primeira imagem)
- **Subpastas combinadas**:
  - `1. STORY E ANUNCIO ADS` (Imagem 1 - Jira)
  - `2. REELS E ANUNCIO ADS` (Imagem 1 - Jira)
  - `3. POP-UP HOME NUTRITION` (Imagem 1 - Jira)
  - `4. ADAPTAÇÃO FOLDER COLLAGEN` (Imagem 1 - Jira)
  - `5. ASSETS DESIGN` (Imagem 2 - Figma)
  - `6. LAYOUTS RESPONSIVOS` (Imagem 2 - Figma)
  - `7. DOCUMENTACAO TECNICA` (Imagem 3 - Explorer)
  - `8. TESTES` (Imagem 4 - Documentos)
  - `9. ENTREGAVEIS FINAIS` (Imagem 4 - Documentos)

**Total**: 9 subpastas criadas automaticamente!

## Exemplo Visual

```
🖼️ Galeria de Imagens:
┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐  ┌─────────────────┐
│ [IMG] jira.png  │  │ [IMG] figma.png │  │ [IMG] pasta.png │  │ [IMG] docs.png  │
│ 🟢 Concluído    │  │ 🟢 Concluído    │  │ 🟢 Concluído    │  │ 🟢 Concluído    │
│ ▶ Processar  ✕  │  │ ▶ Processar  ✕  │  │ ▶ Processar  ✕  │  │ ▶ Processar  ✕  │
└─────────────────┘  └─────────────────┘  └─────────────────┘  └─────────────────┘

🔍 Processar Todas as Imagens    🗑️ Limpar Todas
```

## Status das Imagens

Durante o processamento você verá:

- **🟡 Aguardando**: Imagem carregada, esperando processamento
- **🔵 Processando**: IA está analisando a imagem
- **🟢 Concluído**: Informações extraídas com sucesso
- **🔴 Erro**: Falha no processamento

## Dicas Importantes

### ✅ Faça Isso:
- **Imagens claras** com texto legível
- **Diferentes perspectivas** do mesmo projeto
- **Screenshots em alta resolução**
- **Combine fontes diversas** (Jira + Figma + Documentos)

### ❌ Evite Isso:
- **Imagens muito pequenas** ou pixelizadas
- **Texto ilegível** ou borrado
- **Sobreposição de janelas** nos screenshots
- **Imagens duplicadas** (sistema detecta e avisa)

## Casos de Uso Comuns

### 1. **Projeto de Design**
```
Imagem 1: Briefing do cliente
Imagem 2: Estrutura no Figma
Imagem 3: Lista de entregas
Imagem 4: Pasta atual no computador
```

### 2. **Desenvolvimento de Software**
```
Imagem 1: Issues do Jira
Imagem 2: Estrutura de código
Imagem 3: Documentação técnica
Imagem 4: Diagramas de arquitetura
```

### 3. **Campanha de Marketing**
```
Imagem 1: Briefing estratégico
Imagem 2: Cronograma de entregas
Imagem 3: Lista de assets
Imagem 4: Estrutura de arquivos
```

## Solução de Problemas

### "Imagem já foi adicionada"
- **Causa**: Você tentou adicionar a mesma imagem duas vezes
- **Solução**: Sistema detecta automaticamente e avisa

### "Erro ao processar imagem"
- **Causa**: Texto ilegível ou imagem muito complexa
- **Solução**: Tire um screenshot mais claro ou simplifique a imagem

### "Não é possível limpar enquanto há processamento"
- **Causa**: Tentativa de limpar imagens durante processamento
- **Solução**: Aguarde todas as imagens terminarem de processar

## 🔄 Como Funciona a Combinação

### Processamento Sequencial
1. **Primeira Imagem**: Limpa campos e adiciona suas informações
2. **Segunda Imagem**: Mantém dados da primeira, adiciona novas subpastas
3. **Terceira Imagem**: Adiciona mais subpastas, evita duplicatas
4. **Quarta Imagem**: Completa a estrutura final

### Exemplo Visual do Processo

```
🖼️ IMAGEM 1 (Jira) - Processada
📋 Pasta: #6287 · FUNCIONALIDADE UNLOCK SURPRISE
└── Subpastas: 1. STORY ADS, 2. REELS ADS, 3. POP-UP HOME

🖼️ IMAGEM 2 (Figma) - Processada
📋 Pasta: (mantém #6287 · FUNCIONALIDADE UNLOCK SURPRISE)
└── Subpastas: 1. STORY ADS, 2. REELS ADS, 3. POP-UP HOME
              + 4. ASSETS DESIGN, 5. LAYOUTS RESPONSIVOS

🖼️ IMAGEM 3 (Explorer) - Processada
📋 Pasta: (mantém #6287 · FUNCIONALIDADE UNLOCK SURPRISE)
└── Subpastas: 1. STORY ADS, 2. REELS ADS, 3. POP-UP HOME,
              4. ASSETS DESIGN, 5. LAYOUTS RESPONSIVOS
              + 6. DOCUMENTACAO TECNICA

🖼️ IMAGEM 4 (Documentos) - Processada
📋 Pasta: (mantém #6287 · FUNCIONALIDADE UNLOCK SURPRISE)
└── Subpastas: 1. STORY ADS, 2. REELS ADS, 3. POP-UP HOME,
              4. ASSETS DESIGN, 5. LAYOUTS RESPONSIVOS,
              6. DOCUMENTACAO TECNICA
              + 7. TESTES, 8. ENTREGAVEIS FINAIS

✅ RESULTADO FINAL: 8 subpastas únicas combinadas!
```

### Detecção de Duplicatas

O sistema automaticamente remove duplicatas:

```
❌ ANTES (com duplicatas):
- 1. DESIGN
- 2. DESENVOLVIMENTO  
- 3. DESIGN (duplicata)
- 4. TESTES
- 5. DESENVOLVIMENTO (duplicata)

✅ DEPOIS (sem duplicatas):
- 1. DESIGN
- 2. DESENVOLVIMENTO
- 3. TESTES
```

## Custo Estimado

**Exemplo com 4 imagens:**
- **Custo por imagem**: ~$0.05-0.09
- **Total**: ~$0.20-0.36
- **Benefício**: Estrutura completa criada automaticamente
- **Economia**: Horas de trabalho manual poupadas

## Próximos Passos

1. **Revise** as informações extraídas
2. **Ajuste** se necessário
3. **Clique "Salvar Pastas"**
4. **Escolha o local** no seu computador
5. **Confirme** a criação da estrutura

---

**💡 Dica Final**: Comece com 2-3 imagens para se familiarizar com o processo, depois use quantas precisar! 