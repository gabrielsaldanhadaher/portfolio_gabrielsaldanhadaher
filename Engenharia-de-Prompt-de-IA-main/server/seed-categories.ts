import * as db from "./db";

export const categoriesData = [
  // Front-End
  {
    name: "Front-End",
    slug: "frontend",
    description: "Desenvolvimento de interfaces e experiência do usuário",
    color: "#61DAFB",
    icon: "palette",
    subcategories: [
      {
        name: "React",
        slug: "react",
        description: "React e ecossistema",
        color: "#61DAFB",
        icon: "react",
      },
      {
        name: "Vue.js",
        slug: "vue",
        description: "Vue e composables",
        color: "#4FC08D",
        icon: "vue",
      },
      {
        name: "Angular",
        slug: "angular",
        description: "Angular e TypeScript",
        color: "#DD0031",
        icon: "angular",
      },
      {
        name: "Mobile (React Native)",
        slug: "react-native",
        description: "React Native e Expo",
        color: "#61DAFB",
        icon: "mobile",
      },
      {
        name: "UI/UX Design",
        slug: "uiux",
        description: "Design de interfaces e experiência",
        color: "#FF6B6B",
        icon: "design",
      },
      {
        name: "Testes Front-End",
        slug: "frontend-testing",
        description: "Jest, Cypress, Testing Library",
        color: "#61DAFB",
        icon: "test",
      },
    ],
  },

  // Back-End
  {
    name: "Back-End",
    slug: "backend",
    description: "Desenvolvimento de servidores e APIs",
    color: "#68A063",
    icon: "server",
    subcategories: [
      {
        name: "Node.js / Express",
        slug: "nodejs",
        description: "Node.js, Express, NestJS",
        color: "#68A063",
        icon: "nodejs",
      },
      {
        name: "Python",
        slug: "python",
        description: "Django, FastAPI, Flask",
        color: "#3776AB",
        icon: "python",
      },
      {
        name: "Java / Spring Boot",
        slug: "java",
        description: "Java, Spring Boot, Quarkus",
        color: "#007396",
        icon: "java",
      },
      {
        name: "Go / Rust",
        slug: "go-rust",
        description: "Go, Rust, sistemas de baixo nível",
        color: "#CE3262",
        icon: "code",
      },
      {
        name: "PHP / Laravel",
        slug: "php",
        description: "PHP, Laravel, Symfony",
        color: "#777BB4",
        icon: "php",
      },
      {
        name: "Testes Back-End",
        slug: "backend-testing",
        description: "Testes unitários, integração, E2E",
        color: "#68A063",
        icon: "test",
      },
    ],
  },

  // Full Stack
  {
    name: "Full Stack",
    slug: "fullstack",
    description: "Desenvolvimento completo (front + back)",
    color: "#FF9500",
    icon: "layers",
    subcategories: [
      {
        name: "MERN Stack",
        slug: "mern",
        description: "MongoDB, Express, React, Node.js",
        color: "#61DAFB",
        icon: "code",
      },
      {
        name: "MEAN Stack",
        slug: "mean",
        description: "MongoDB, Express, Angular, Node.js",
        color: "#DD0031",
        icon: "code",
      },
      {
        name: "Django + React",
        slug: "django-react",
        description: "Python + React",
        color: "#3776AB",
        icon: "code",
      },
      {
        name: "Outros Full Stack",
        slug: "other-fullstack",
        description: "Outras combinações de stacks",
        color: "#FF9500",
        icon: "code",
      },
    ],
  },

  // Banco de Dados
  {
    name: "Banco de Dados",
    slug: "database",
    description: "Gestão e design de dados",
    color: "#336791",
    icon: "database",
    subcategories: [
      {
        name: "SQL",
        slug: "sql",
        description: "PostgreSQL, MySQL, SQL Server",
        color: "#336791",
        icon: "database",
      },
      {
        name: "NoSQL",
        slug: "nosql",
        description: "MongoDB, Firebase, Cassandra",
        color: "#13AA52",
        icon: "database",
      },
      {
        name: "Cache",
        slug: "cache",
        description: "Redis, Memcached",
        color: "#DC382D",
        icon: "zap",
      },
      {
        name: "Data Warehousing",
        slug: "data-warehouse",
        description: "BigQuery, Snowflake, Redshift",
        color: "#336791",
        icon: "database",
      },
    ],
  },

  // Segurança
  {
    name: "Segurança",
    slug: "security",
    description: "Segurança de aplicações e infraestrutura",
    color: "#FF0000",
    icon: "shield",
    subcategories: [
      {
        name: "Segurança de Aplicações",
        slug: "app-security",
        description: "OWASP, vulnerabilidades, pentesting",
        color: "#FF0000",
        icon: "shield",
      },
      {
        name: "Infraestrutura e DevOps",
        slug: "infra-security",
        description: "Firewalls, VPN, Kubernetes security",
        color: "#FF6B6B",
        icon: "server",
      },
      {
        name: "Criptografia",
        slug: "cryptography",
        description: "Algoritmos, SSL/TLS, hashing",
        color: "#FF0000",
        icon: "lock",
      },
      {
        name: "Segurança em Nuvem",
        slug: "cloud-security",
        description: "AWS, Azure, GCP security",
        color: "#FF9500",
        icon: "cloud",
      },
    ],
  },

  // DevOps
  {
    name: "DevOps",
    slug: "devops",
    description: "Infraestrutura, CI/CD e operações",
    color: "#FF6B6B",
    icon: "wrench",
    subcategories: [
      {
        name: "CI/CD",
        slug: "cicd",
        description: "GitHub Actions, Jenkins, GitLab CI",
        color: "#FF6B6B",
        icon: "zap",
      },
      {
        name: "Containerização",
        slug: "containers",
        description: "Docker, Kubernetes, Podman",
        color: "#2496ED",
        icon: "box",
      },
      {
        name: "Cloud Computing",
        slug: "cloud",
        description: "AWS, Azure, GCP",
        color: "#FF9500",
        icon: "cloud",
      },
      {
        name: "Monitoramento",
        slug: "monitoring",
        description: "Prometheus, Grafana, ELK Stack",
        color: "#FF6B6B",
        icon: "activity",
      },
    ],
  },

  // IA e Machine Learning
  {
    name: "IA e Machine Learning",
    slug: "ai-ml",
    description: "Inteligência Artificial e Aprendizado de Máquina",
    color: "#FF9500",
    icon: "brain",
    subcategories: [
      {
        name: "Machine Learning",
        slug: "machine-learning",
        description: "TensorFlow, PyTorch, Scikit-learn",
        color: "#FF9500",
        icon: "brain",
      },
      {
        name: "Deep Learning",
        slug: "deep-learning",
        description: "Redes neurais, CNNs, RNNs",
        color: "#FF6B6B",
        icon: "brain",
      },
      {
        name: "NLP",
        slug: "nlp",
        description: "Processamento de linguagem natural",
        color: "#FF9500",
        icon: "message-square",
      },
      {
        name: "Computer Vision",
        slug: "computer-vision",
        description: "Visão computacional, OpenCV",
        color: "#FF6B6B",
        icon: "eye",
      },
    ],
  },

  // Arquitetura
  {
    name: "Arquitetura de Software",
    slug: "architecture",
    description: "Design patterns e arquitetura",
    color: "#9B59B6",
    icon: "layout",
    subcategories: [
      {
        name: "Microserviços",
        slug: "microservices",
        description: "Arquitetura de microserviços",
        color: "#9B59B6",
        icon: "layers",
      },
      {
        name: "Design Patterns",
        slug: "design-patterns",
        description: "Padrões de design e boas práticas",
        color: "#9B59B6",
        icon: "layout",
      },
      {
        name: "Clean Code",
        slug: "clean-code",
        description: "Código limpo e manutenível",
        color: "#27AE60",
        icon: "check-circle",
      },
      {
        name: "SOLID",
        slug: "solid",
        description: "Princípios SOLID",
        color: "#9B59B6",
        icon: "layers",
      },
    ],
  },
];

export async function seedCategories() {
  try {
    for (const category of categoriesData) {
      await db.createCategory({
        name: category.name,
        slug: category.slug,
        description: category.description,
        color: category.color,
        icon: category.icon,
      });

      // Create subcategories
      if (category.subcategories) {
        const parentCategory = await db.getCategoryBySlug(category.slug);
        if (parentCategory) {
          for (const subcat of category.subcategories) {
            await db.createCategory({
              name: subcat.name,
              slug: subcat.slug,
              description: subcat.description,
              color: subcat.color,
              icon: subcat.icon,
              parentId: parentCategory.id,
            });
          }
        }
      }
    }
    console.log("Categories seeded successfully!");
  } catch (error) {
    console.error("Error seeding categories:", error);
  }
}
