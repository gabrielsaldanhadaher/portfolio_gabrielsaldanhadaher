# 🔒 Segurança e Validações

## 1. Validação de Entrada

### Implementado
- ✅ Validação com Zod em `lib/validations.ts`
- ✅ Schemas para Login, SignUp, Community, Member, Meeting
- ✅ Função `validate()` para validar dados

### Exemplo de Uso
```typescript
import { LoginSchema, validate } from "@/lib/validations";

const result = validate(LoginSchema, { email, password });
if (!result.success) {
  Alert.alert("Erro", result.error);
  return;
}
```

## 2. Sanitização de Dados

### HTML Sanitization
```typescript
import DOMPurify from "isomorphic-dompurify";

function sanitizeHTML(html: string): string {
  return DOMPurify.sanitize(html);
}
```

### String Sanitization
```typescript
function sanitizeString(str: string): string {
  return str
    .trim()
    .replace(/[<>]/g, "") // Remove < e >
    .slice(0, 255); // Limitar tamanho
}
```

## 3. Proteção contra XSS

### Implementação
- ✅ Usar `Text` em vez de `dangerouslySetInnerHTML`
- ✅ Escapar strings de usuários
- ✅ Validar URLs antes de usar

### Exemplo
```typescript
// ❌ Evitar
<Text>{userInput}</Text> // Se userInput contém HTML

// ✅ Fazer
<Text>{sanitizeString(userInput)}</Text>
```

## 4. Proteção contra CSRF

### Token CSRF
```typescript
// No servidor
app.use(csrf());

// No cliente
const token = document.querySelector('meta[name="csrf-token"]')?.content;
headers["X-CSRF-Token"] = token;
```

## 5. Rate Limiting

### Implementação Recomendada
```typescript
import rateLimit from "express-rate-limit";

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutos
  max: 100, // 100 requisições por IP
  message: "Muitas requisições, tente novamente mais tarde",
});

app.use("/api/", limiter);
```

## 6. CORS Seguro

### Configuração
```typescript
app.use(cors({
  origin: process.env.ALLOWED_ORIGINS?.split(",") || ["http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"],
}));
```

## 7. Autenticação e Autorização

### JWT
```typescript
// Gerar token
const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET, {
  expiresIn: "7d",
});

// Verificar token
const decoded = jwt.verify(token, process.env.JWT_SECRET);
```

### Middleware de Autenticação
```typescript
function requireAuth(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });
  
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.userId;
    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
}
```

## 8. Proteção de Dados Sensíveis

### Variáveis de Ambiente
```bash
# .env (NUNCA commitar)
DATABASE_URL=mysql://user:pass@localhost/db
JWT_SECRET=super_secret_key_change_this
JITSI_API_KEY=your_jitsi_key
```

### Criptografia de Senhas
```typescript
import bcrypt from "bcrypt";

// Hash
const hashedPassword = await bcrypt.hash(password, 10);

// Verificar
const isValid = await bcrypt.compare(password, hashedPassword);
```

## 9. Logging de Segurança

### Implementado
- ✅ Logger estruturado em `lib/logger.ts`
- ✅ Rastrear tentativas de login
- ✅ Registrar mudanças de dados sensíveis

### Exemplo
```typescript
logger.info("auth", "User login attempt", { userId, email });
logger.warn("auth", "Failed login attempt", { email, attempts: 3 });
logger.error("auth", "Unauthorized access", error);
```

## 10. Checklist de Segurança

- [ ] Todas as entradas são validadas
- [ ] Senhas são hasheadas com bcrypt
- [ ] Tokens JWT têm expiração
- [ ] CORS está configurado corretamente
- [ ] Rate limiting está ativo
- [ ] Logs de segurança são registrados
- [ ] Variáveis sensíveis estão em .env
- [ ] HTTPS é obrigatório em produção
- [ ] SQL Injection é prevenido (usar ORM)
- [ ] XSS é prevenido (sanitizar entrada)

## 11. Vulnerabilidades Conhecidas e Soluções

### SQL Injection
- ✅ Usar Drizzle ORM (prepared statements)
- ✅ Nunca concatenar strings em queries

### XSS (Cross-Site Scripting)
- ✅ Validar e sanitizar entrada
- ✅ Usar `Text` em vez de HTML
- ✅ Escapar dados de usuários

### CSRF (Cross-Site Request Forgery)
- ✅ Usar tokens CSRF
- ✅ Validar origin/referer
- ✅ SameSite cookies

### Brute Force
- ✅ Rate limiting
- ✅ Lockout após N tentativas
- ✅ CAPTCHA para login

## 12. Monitoramento de Segurança

### Ferramentas Recomendadas
- **OWASP ZAP**: Teste de segurança
- **Snyk**: Verificação de vulnerabilidades
- **npm audit**: Auditoria de dependências
- **SonarQube**: Análise de código

### Comandos
```bash
# Verificar vulnerabilidades
npm audit

# Atualizar dependências
npm audit fix

# Teste de segurança
npm run security-check
```

## 13. Política de Privacidade

### Dados Coletados
- Nome, email, ID do usuário
- Comunidades que participa
- Histórico de reuniões
- Logs de atividade

### Retenção
- Dados de usuário: Enquanto conta ativa
- Logs: 90 dias
- Backups: 30 dias

### Direitos do Usuário
- Direito de acesso
- Direito de correção
- Direito de exclusão
- Direito de portabilidade

