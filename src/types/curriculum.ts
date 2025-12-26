export interface PersonalInfo {
  nome: string;
  email: string;
  telefone: string;
  cidade: string;
  linkedin?: string;
  portfolio?: string;
  endereco?: string;
  objetivo?: string;
}

export interface Experience {
  id: string;
  cargo: string;
  empresa: string;
  cidade: string;
  dataInicio: string;
  dataFim: string;
  atual: boolean;
  descricao: string;
}

export interface Education {
  id: string;
  curso: string;
  instituicao: string;
  cidade: string;
  dataInicio: string;
  dataFim: string;
  cursando: boolean;
}

export interface Skill {
  id: string;
  nome: string;
}

export interface Curriculum {
  personalInfo: PersonalInfo;
  experiences: Experience[];
  education: Education[];
  skills: Skill[];
}
