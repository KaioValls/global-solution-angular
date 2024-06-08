export interface Ocean {
  regiao: string;
  temperaturaAgua: number;
  pH: number;
  nivelPoluicao: string;
  especies: Especies[];
  projetosConservacao: ProjetosConservacao[];
}

export interface Especies {
  nome: string;
  status: string;
}

export interface ProjetosConservacao {
  nomeProjeto: string;
  tipoProjeto: string;
  tipoParticipacao: string;
}

