# 📋 Exemplo: Detecção de Títulos com "#"

## 🎯 Como Funciona a Detecção

### ⭐ PRIORIDADE ABSOLUTA: Títulos com "#"

Quando a IA encontra um título com `#`, ele **SEMPRE** vai para os campos principais:

```
🖼️ IMAGEM CONTÉM:
#6287 · FUNCIONALIDADE UNLOCK SURPRISE

📋 RESULTADO:
✅ Campo "Número": 6287
✅ Campo "Nome da pasta": FUNCIONALIDADE UNLOCK SURPRISE
```

### 📂 PRIORIDADE SECUNDÁRIA: Listas numeradas

Itens menores numerados vão para as subpastas:

```
🖼️ IMAGEM CONTÉM:
1. STORY E ANUNCIO ADS
2. REELS E ANUNCIO ADS VOICE OVER
3. POP-UP HOME NUTRITION

📋 RESULTADO:
✅ Subpasta 1: STORY E ANUNCIO ADS
✅ Subpasta 2: REELS E ANUNCIO ADS VOICE OVER
✅ Subpasta 3: POP-UP HOME NUTRITION
```

## 🔍 Exemplo Completo

### Imagem de Input:
```
#6287 · FUNCIONALIDADE UNLOCK SURPRISE ⭐
└── Atividades sem grupo
    ├── 8. STORY E ANUNCIO ADS | COMPRADORES RECORRENTES | UNLOCK SURPRISE
    └── 7. STORY E ANUNCIO ADS | NOVOS CLIENTES - CONVERSÃO | UNLOCK SURPRISE
```

### Resultado no Sistema:
```
📋 CAMPOS PREENCHIDOS:
┌─────────────────────────────────────────────────────────────────┐
│ Número da pasta:  6287                                          │
│ Nome da pasta:    FUNCIONALIDADE UNLOCK SURPRISE               │
└─────────────────────────────────────────────────────────────────┘

📂 SUBPASTAS CRIADAS:
├── 8. STORY E ANUNCIO ADS COMPRADORES RECORRENTES
└── 7. STORY E ANUNCIO ADS NOVOS CLIENTES CONVERSAO
```

## 🧹 Limpeza Automática

### Antes da Limpeza:
```
#6287 · FUNCIONALIDADE UNLOCK SURPRISE (MKT) [URGENTE] "V2"
├── 8. STORY E ANUNCIO ADS | COMPRADORES RECORRENTES | UNLOCK SURPRISE
└── 7. STORY E ANUNCIO ADS | NOVOS CLIENTES - CONVERSÃO | UNLOCK SURPRISE
```

### Depois da Limpeza:
```
📋 Pasta Principal: #6287 · FUNCIONALIDADE UNLOCK SURPRISE
📂 Subpastas:
├── 8. STORY E ANUNCIO ADS COMPRADORES RECORRENTES
└── 7. STORY E ANUNCIO ADS NOVOS CLIENTES CONVERSAO
```

## 🎨 Exemplos de Diferentes Formatos

### Formato 1: Jira/Azure DevOps
```
🖼️ INPUT:
#6287 · FUNCIONALIDADE UNLOCK SURPRISE

🎯 OUTPUT:
Número: 6287
Nome: FUNCIONALIDADE UNLOCK SURPRISE
```

### Formato 2: Trello/Asana
```
🖼️ INPUT:
#123 - PROJETO MARKETING

🎯 OUTPUT:
Número: 123
Nome: PROJETO MARKETING
```

### Formato 3: GitHub Issues
```
🖼️ INPUT:
#4567 · DESENVOLVIMENTO SITE

🎯 OUTPUT:
Número: 4567
Nome: DESENVOLVIMENTO SITE
```

## 🚫 O que NÃO vai para Pasta Principal

### ❌ Listas numeradas simples:
```
1. DESIGN
2. DESENVOLVIMENTO
3. MARKETING
```
→ Estas vão para **subpastas**, não para pasta principal

### ❌ Números sem "#":
```
001. PROJETO PRINCIPAL
002. CLIENTE ESPECIAL
```
→ Podem ir para pasta principal se não houver título com "#"

### ❌ Texto sem numeração:
```
PASTA DOCUMENTOS
PASTA IMAGENS
```
→ Podem ir para pasta principal se não houver título com "#"

## 🔧 Debug no Console

Quando processar uma imagem, abra o Console do navegador (F12) e veja:

```javascript
📋 Dados extraídos da IA:
  📁 Pasta Principal: {number: "6287", name: "FUNCIONALIDADE UNLOCK SURPRISE"}
  📂 Subpastas: [
    {number: "8", name: "STORY E ANUNCIO ADS COMPRADORES RECORRENTES"},
    {number: "7", name: "STORY E ANUNCIO ADS NOVOS CLIENTES CONVERSAO"}
  ]
```

## 📝 Dicas para Melhores Resultados

### ✅ Faça Isso:
- **Tire screenshots claros** com texto legível
- **Certifique-se** de que o título com "#" está visível
- **Use imagens** com bom contraste
- **Mantenha** o texto principal destacado

### ❌ Evite Isso:
- **Texto muito pequeno** ou borrado
- **Múltiplos títulos** com "#" na mesma imagem
- **Sobreposição** de janelas
- **Imagens muito poluídas** visualmente

## 🎯 Resultado Final

Com a detecção correta de títulos com "#", você obtém:

```
6287. FUNCIONALIDADE UNLOCK SURPRISE/
├── _layout/
├── final/
├── preview/
├── texto/
├── referencias/
├── 8. STORY E ANUNCIO ADS COMPRADORES RECORRENTES/
└── 7. STORY E ANUNCIO ADS NOVOS CLIENTES CONVERSAO/
```

---

**💡 Lembre-se**: Títulos com "#" são **sempre** para a pasta principal, nunca para subpastas! 