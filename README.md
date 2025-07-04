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

## 🚀 Como Usar

1. **Abra o arquivo `index.html`** em seu navegador
2. **Digite o número** (opcional) no campo à esquerda
3. **Digite o nome da pasta** no campo de entrada
4. **Veja o preview** da estrutura que será criada
5. **Clique em "Salvar Pastas"** para abrir o seletor de local
6. **Escolha onde salvar** no seu computador
7. **Confirme a criação** das pastas

## 📋 Requisitos

- **Navegador moderno** com suporte à API File System Access:
  - Chrome 86+
  - Edge 86+
  - Firefox 111+
- JavaScript habilitado
- Permissões para acessar o sistema de arquivos

## 🛠️ Tecnologias Utilizadas

- **HTML5** - Estrutura da página
- **CSS3** - Estilização moderna com gradientes e animações
- **JavaScript ES6+** - Funcionalidade interativa
- **File System Access API** - Criação de pastas no sistema

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
- [ ] Exportação da estrutura em diferentes formatos
- [ ] Templates personalizáveis
- [ ] Drag and drop para reorganizar subpastas
- [ ] Suporte a múltiplas estruturas de pastas

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para:
- Reportar bugs
- Sugerir novas funcionalidades
- Enviar pull requests

## 📞 Suporte

Se você encontrar algum problema ou tiver dúvidas, abra uma issue no repositório do projeto.

---

**Desenvolvido com ❤️ para organizar seus projetos de forma eficiente!** 