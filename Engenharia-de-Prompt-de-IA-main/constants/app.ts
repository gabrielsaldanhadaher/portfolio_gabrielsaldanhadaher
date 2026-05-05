/**
 * Constantes centralizadas da aplicação
 */

// API
export const API_TIMEOUT = 30000; // 30 segundos
export const API_RETRY_COUNT = 3;
export const API_RETRY_DELAY = 1000; // 1 segundo

// Cache
export const CACHE_TTL = 5 * 60 * 1000; // 5 minutos
export const CACHE_KEYS = {
  CATEGORIES: "categories",
  COMMUNITIES: "communities",
  MEMBERS: "members",
  MEETINGS: "meetings",
} as const;

// Paginação
export const DEFAULT_PAGE_SIZE = 20;
export const MAX_PAGE_SIZE = 100;

// Validação
export const MIN_PASSWORD_LENGTH = 6;
export const MAX_NAME_LENGTH = 255;
export const MAX_DESCRIPTION_LENGTH = 1000;

// Timeouts
export const DEBOUNCE_DELAY = 500; // 500ms para busca
export const THROTTLE_DELAY = 1000; // 1s para scroll

// Jitsi
export const JITSI_SERVER = "https://meet.jit.si";
export const JITSI_ROOM_PREFIX = "community";

// Animações
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
} as const;

// Erros
export const ERROR_MESSAGES = {
  NETWORK: "Erro de conexão. Verifique sua internet.",
  TIMEOUT: "Requisição expirou. Tente novamente.",
  UNAUTHORIZED: "Você não tem permissão para fazer isso.",
  NOT_FOUND: "Recurso não encontrado.",
  VALIDATION: "Dados inválidos. Verifique os campos.",
  GENERIC: "Algo deu errado. Tente novamente.",
} as const;

// Categorias de TI
export const IT_CATEGORIES = {
  FRONTEND: "front-end",
  BACKEND: "back-end",
  FULLSTACK: "full-stack",
  DATABASE: "banco-de-dados",
  SECURITY: "seguranca",
  DEVOPS: "devops",
  MOBILE: "mobile",
  CLOUD: "cloud",
} as const;

// Status
export const STATUS = {
  PENDING: "pending",
  ACTIVE: "active",
  INACTIVE: "inactive",
  DELETED: "deleted",
} as const;
