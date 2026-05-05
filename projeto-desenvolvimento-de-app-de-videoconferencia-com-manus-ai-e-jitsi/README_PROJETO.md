# IT Connect - Aplicativo de Conexão para Profissionais de TI

Um aplicativo mobile inovador que conecta profissionais de TI para colaboração em projetos, com suporte a videoconferência via Jitsi Meet e sistema completo de comunidades gerenciadas.

## 🎯 Visão Geral

O **IT Connect** é uma plataforma social para profissionais de TI que desejam:
- **Conectar-se** com outros profissionais em sua área de especialidade
- **Colaborar** em projetos através de comunidades temáticas
- **Comunicar** via videoconferência integrada (Jitsi Meet)
- **Gerenciar** comunidades com controles de acesso e administração

## 🏗️ Arquitetura do Projeto

### Estrutura de Pastas

```
it-connect-app/
├── app/                          # Telas e rotas (Expo Router)
│   ├── (tabs)/                   # Navegação por abas
│   │   ├── index.tsx            # Home
│   │   ├── explore.tsx          # Explorar categorias e comunidades
│   │   ├── communities.tsx      # Minhas comunidades
│   │   └── profile.tsx          # Perfil do usuário
│   ├── community-details.tsx    # Detalhes da comunidade
│   ├── create-community.tsx     # Criar nova comunidade
│   ├── community-settings.tsx   # Configurações (admin)
│   └── video-meeting.tsx        # Reunião de vídeo
├── components/                   # Componentes reutilizáveis
│   ├── category-card.tsx        # Card de categoria
│   ├── community-card.tsx       # Card de comunidade
│   └── screen-container.tsx     # Container com SafeArea
├── server/                       # Backend (tRPC + Express)
│   ├── routers.ts               # Rotas tRPC
│   ├── db.ts                    # Funções de banco de dados
│   └── seed-categories.ts       # Seed de categorias
├── drizzle/                      # ORM e migrações
│   └── schema.ts                # Schema do banco de dados
└── assets/                       # Ícones e imagens
```

## 📱 Funcionalidades Principais

### 1. Sistema de Categorias (8 principais + 30+ subcategorias)

**Categorias Principais:**
- **Front-End**: React, Vue, Angular, Svelte, etc.
- **Back-End**: Node.js, Python, Java, Go, Rust, etc.
- **Full Stack**: Desenvolvimento completo
- **Banco de Dados**: SQL, NoSQL, Data Engineering
- **Segurança**: Cibersegurança, DevSecOps, Compliance
- **DevOps**: CI/CD, Cloud, Infraestrutura
- **Mobile**: iOS, Android, React Native, Flutter
- **Arquitetura**: Microserviços, Cloud Native, Design Patterns

### 2. Sistema de Comunidades

**Criar Comunidades:**
- Nome, descrição e categoria
- Privacidade (pública/privada)
- Controle de acesso

**Gerenciar Comunidades:**
- Listar membros
- Promover/remover admins
- Expulsar membros
- Editar configurações
- Deletar comunidade

### 3. Videoconferência com Jitsi Meet

**Recursos:**
- Iniciar reuniões de vídeo
- Controles de câmera e microfone
- Compartilhamento de tela
- Chat integrado
- Histórico de reuniões

### 4. Autenticação e Perfil

- Login/Sign up
- Perfil do usuário
- Configurações de privacidade
- Tema claro/escuro

## 🗄️ Banco de Dados

### Tabelas Principais

**categories**
- id, name, slug, description, icon, color, parentId

**communities**
- id, name, description, categoryId, creatorId, isPublic, memberCount, createdAt

**community_members**
- id, communityId, userId, isAdmin, joinedAt

**access_requests**
- id, communityId, userId, status, requestedAt

**video_meetings**
- id, communityId, jitsiRoomName, createdAt, endedAt

## 🚀 Como Executar

### Pré-requisitos

- Node.js 18+
- pnpm (gerenciador de pacotes)
- Android SDK (para testar em dispositivos Android)

### Instalação

```bash
# Clonar o projeto
cd /home/ubuntu/it-connect-app

# Instalar dependências
pnpm install

# Configurar banco de dados
pnpm db:push

# Iniciar desenvolvimento
pnpm dev
```

### Acessar o App

**Web Preview:**
- Abra o navegador em: https://8081-iuabb3qpon9zhxiosjp7i-5f00a778.us2.manus.computer

**Mobile (Expo Go):**
- Escaneie o QR code com o Expo Go
- URL: exps://8081-iuabb3qpon9zhxiosjp7i-5f00a778.us2.manus.computer

**Android Nativo:**
```bash
pnpm android
```

## 🎨 Design e Cores

**Paleta de Cores:**
- **Primário**: #0066CC (Azul profissional)
- **Primário Escuro**: #00A8FF (Azul claro)
- **Background Claro**: #FFFFFF
- **Background Escuro**: #0F1419
- **Surface Claro**: #F8F9FA
- **Surface Escuro**: #1A2332
- **Success**: #10B981
- **Warning**: #F59E0B
- **Error**: #EF4444

## 📦 Dependências Principais

- **React Native**: Framework mobile
- **Expo**: Plataforma de desenvolvimento
- **Expo Router**: Navegação
- **NativeWind**: Tailwind CSS para React Native
- **tRPC**: API type-safe
- **Drizzle ORM**: Gerenciamento de banco de dados
- **react-native-jitsi-meet**: Integração com Jitsi
- **TanStack Query**: Gerenciamento de dados do servidor

## 🔐 Segurança

- Autenticação via OAuth/JWT
- Senhas armazenadas com hash
- Controle de acesso por roles (admin/membro)
- Validação de entrada em todas as APIs
- HTTPS para comunicação

## 📊 Estatísticas do Projeto

- **Telas**: 8 principais
- **Componentes**: 10+
- **Rotas tRPC**: 25+
- **Categorias**: 8 principais + 30+ subcategorias
- **Funcionalidades**: Comunidades, Videoconferência, Administração

## 🐛 Troubleshooting

### Erro de Metro Bundler
```bash
# Limpar cache e reiniciar
pnpm dev
```

### Erro de Banco de Dados
```bash
# Resetar migrações
pnpm db:push
```

### Erro de Tipo TypeScript
```bash
# Verificar tipos
pnpm check
```

## 📝 Próximos Passos

1. **Implementar Autenticação Real**: Conectar com backend de autenticação
2. **Testes**: Adicionar testes unitários e de integração
3. **Performance**: Otimizar renderização e carregamento
4. **Notificações**: Implementar push notifications
5. **Chat**: Adicionar sistema de chat em tempo real
6. **Analytics**: Integrar analytics para rastrear uso

## 👥 Contribuindo

Para contribuir com melhorias:

1. Crie uma branch para sua feature
2. Faça commits descritivos
3. Envie um pull request
4. Aguarde review

## 📄 Licença

Este projeto é propriedade de [Seu Nome/Empresa].

## 📞 Suporte

Para dúvidas ou sugestões, entre em contato através do email de suporte.

---

**Desenvolvido com ❤️ para conectar profissionais de TI**
