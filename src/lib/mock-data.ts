// Mock data - replace with real API when backend endpoints are available.
// This is the ONLY place for mock data (matrículas, certificados, avaliações, vendas etc).

export interface MockEnrollment {
  id: string;
  cursoId: string;
  cursoTitulo: string;
  categoria: string;
  imagem: string;
  progresso: number;
  matriculadoEm: string;
}

export interface MockCertificate {
  id: string;
  cursoTitulo: string;
  emitidoEm: string;
  codigo: string;
}

export interface MockCourseExtras {
  avaliacao: number;
  numAvaliacoes: number;
  duracao: string;
  nivel: "Iniciante" | "Intermediário" | "Avançado";
}

export const mockCourseExtras: MockCourseExtras[] = [
  { avaliacao: 4.8, numAvaliacoes: 124, duracao: "12h", nivel: "Iniciante" },
  { avaliacao: 4.6, numAvaliacoes: 89, duracao: "18h", nivel: "Intermediário" },
  { avaliacao: 4.9, numAvaliacoes: 203, duracao: "24h", nivel: "Avançado" },
  { avaliacao: 4.5, numAvaliacoes: 67, duracao: "8h", nivel: "Iniciante" },
];

export function getExtrasForCourse(id: string): MockCourseExtras {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) & 0xffff;
  return mockCourseExtras[hash % mockCourseExtras.length];
}

export const mockEnrollments: MockEnrollment[] = [
  {
    id: "e1",
    cursoId: "c1",
    cursoTitulo: "Introdução ao Mercado Financeiro",
    categoria: "Mercado Financeiro",
    imagem: "",
    progresso: 65,
    matriculadoEm: "2025-05-12",
  },
  {
    id: "e2",
    cursoId: "c2",
    cursoTitulo: "Análise Técnica Avançada",
    categoria: "Ciências Sociais e Gestão",
    imagem: "",
    progresso: 30,
    matriculadoEm: "2025-06-01",
  },
];

export const mockCertificates: MockCertificate[] = [
  { id: "cert1", cursoTitulo: "Fundamentos de Forex", emitidoEm: "2025-04-20", codigo: "ASA-2025-0421" },
];

export const mockEbooksPurchased = [
  { id: "eb1", titulo: "Guia Prático do Trader Angolano", compradoEm: "2025-05-01" },
];

// Admin dashboard mock
export const mockAdminStats = {
  receitaTotal: 12_450_000,
  vendasDia: 8,
  totalUsuarios: 342,
  matriculasAtivas: 187,
};

export const mockSalesByDay = [
  { dia: "Seg", vendas: 12, receita: 540000 },
  { dia: "Ter", vendas: 18, receita: 820000 },
  { dia: "Qua", vendas: 9, receita: 410000 },
  { dia: "Qui", vendas: 24, receita: 1080000 },
  { dia: "Sex", vendas: 31, receita: 1395000 },
  { dia: "Sáb", vendas: 15, receita: 675000 },
  { dia: "Dom", vendas: 8, receita: 360000 },
];

export const mockAdminReports = [
  { id: "r1", titulo: "Relatório de Vendas — Julho 2025", tipo: "Vendas", periodo: "Mensal", gerado: "2025-08-01" },
  { id: "r2", titulo: "Relatório Financeiro — Q2 2025", tipo: "Financeiro", periodo: "Trimestral", gerado: "2025-07-05" },
  { id: "r3", titulo: "Relatório de Matrículas — Julho 2025", tipo: "Matrículas", periodo: "Mensal", gerado: "2025-08-01" },
  { id: "r4", titulo: "Relatório de Utilizadores — Semana 28", tipo: "Utilizadores", periodo: "Semanal", gerado: "2025-07-14" },
  { id: "r5", titulo: "Relatório de Desempenho de Cursos", tipo: "Cursos", periodo: "Mensal", gerado: "2025-08-01" },
];

export const mockTopProducts = [
  { produto: "Curso Forex Pro", vendas: 42 },
  { produto: "E-book Trader AO", vendas: 35 },
  { produto: "Análise Técnica", vendas: 28 },
  { produto: "Cripto Básico", vendas: 19 },
  { produto: "Mercado Ang.", vendas: 12 },
];

export const mockRecentSales = [
  { id: "v1", produto: "Curso Forex Pro", cliente: "João M.", valor: 45000, data: "2025-07-13" },
  { id: "v2", produto: "E-book Trader AO", cliente: "Ana S.", valor: 8500, data: "2025-07-13" },
  { id: "v3", produto: "Análise Técnica", cliente: "Carlos P.", valor: 35000, data: "2025-07-12" },
  { id: "v4", produto: "Cripto Básico", cliente: "Maria L.", valor: 22000, data: "2025-07-12" },
];

export const mockUsers = [
  { id: "u1", nome: "João Manuel", email: "joao@example.ao", role: "Aluno", ativo: true, criadoEm: "2025-06-01" },
  { id: "u2", nome: "Ana Silva", email: "ana@example.ao", role: "Aluno", ativo: true, criadoEm: "2025-05-15" },
  { id: "u3", nome: "Admin Master", email: "admin@alactel.ao", role: "Administrador", ativo: true, criadoEm: "2025-01-10" },
];

// ---- Painel do Aluno ----
export const mockAlunoStats = {
  cursosAtivos: 2,
  horasEstudo: 34,
  certificados: 1,
  progressoMedio: 48,
  sequenciaDias: 5,
};

export const mockStudyByDay = [
  { dia: "Seg", horas: 1.5 },
  { dia: "Ter", horas: 2.0 },
  { dia: "Qua", horas: 0.5 },
  { dia: "Qui", horas: 2.5 },
  { dia: "Sex", horas: 1.0 },
  { dia: "Sáb", horas: 3.0 },
  { dia: "Dom", horas: 1.2 },
];

export const mockNextLessons = [
  { id: "l1", curso: "Introdução ao Mercado Financeiro", aula: "Módulo 4 — Análise de Risco", duracao: "18 min" },
  { id: "l2", curso: "Análise Técnica Avançada", aula: "Módulo 2 — Padrões de Candles", duracao: "26 min" },
];

export const mockAlunoAvisos = [
  { id: "a1", titulo: "Nova aula publicada", texto: "Módulo 4 de Mercado Financeiro já está disponível.", data: "2025-07-14" },
  { id: "a2", titulo: "Webinar ao vivo", texto: "Sessão de perguntas e respostas com o formador na sexta às 19h.", data: "2025-07-12" },
];
