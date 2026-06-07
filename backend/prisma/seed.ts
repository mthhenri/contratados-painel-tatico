import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const conditions = [
  {
    name: 'Abalado',
    description:
      '-5 iniciativa, -1 dado em todos os testes (exceto para se afastar da fonte)',
  },
  {
    name: 'Agarrado',
    description: 'Impossibilitado de agir; pode apenas reagir',
  },
  {
    name: 'Amedrontado',
    description:
      '-1 dado em testes ao ver o causador; -2 dados ao perdê-lo de vista',
  },
  {
    name: 'Atordoado',
    description: '-1 dado em todos os testes',
  },
  {
    name: 'Breu',
    description:
      '+1 dado Sentidos (audição), -1 dado nos demais testes (exceto Intelecto)',
  },
  {
    name: 'Cansado',
    description: '-2 dados em Destreza, Força, Luta e Pontaria',
  },
  {
    name: 'Cego',
    description: '-2 dados em Luta e Pontaria; não pode mirar',
  },
  {
    name: 'Debilitado',
    description: '-3 por ponto de lesão restante no atributo afetado',
  },
  {
    name: 'Eletrificado',
    description: '-1 dado em Destreza e Luta por 1 turno',
  },
  {
    name: 'Em Chamas',
    description:
      '2D6 dano Físico-Químico por turno até superar DT Destreza do causador',
  },
  {
    name: 'Envenenado',
    description:
      '3D4 + Intelecto dano Químico por turno até superar DT Intelecto com Vigor',
  },
  {
    name: 'Escuridão',
    description:
      '+2 dados Sentidos (audição), -2 dados nos demais testes (exceto Intelecto)',
  },
  {
    name: 'Fascinado',
    description: 'Cessa ações hostis; -5 em todos os testes (exceto Vontade)',
  },
  {
    name: 'Flanqueando',
    description:
      '+1 dado de dano (requer aliado em paralelo que atacou no turno anterior)',
  },
  {
    name: 'Furtivo',
    description:
      '+1 dado em ataques; inibe reações do alvo; deslocamento pela metade',
  },
  {
    name: 'Hesitante',
    description: '-5 na iniciativa',
  },
  {
    name: 'Imobilizado',
    description: 'Impossibilitado de agir e reagir',
  },
  {
    name: 'Inconsciente',
    description: 'Impossibilitado de agir ou reagir; recebe Vulnerável',
  },
  {
    name: 'Insano',
    description: 'Ataca qualquer ser ao redor com tudo que pode',
  },
  {
    name: 'Lentidão',
    description: '-2 metros de deslocamento',
  },
  {
    name: 'Machucado',
    description:
      'Golpe removeu metade da vida; remove apenas ao recuperar 100% de HP',
  },
  {
    name: 'Morrendo',
    description: 'Teste de Vigor por turno (DT 5 +5/turno); falhar = morte',
  },
  {
    name: 'Paralisado',
    description:
      'Incapaz de agir ou reagir (habilidades passivas ainda funcionam)',
  },
  {
    name: 'Provocado',
    description:
      'Todos os ataques devem ser direcionados ao causador da condição',
  },
  {
    name: 'Sangramento',
    description:
      '2D6 + Força dano Físico por turno até superar DT Força com Vigor',
  },
  {
    name: 'Sobrecarregado',
    description:
      'Deslocamento 4m; -2 dados em FOR, DES, LUT, VIG, PON e MED; -5 Defesa',
  },
  {
    name: 'Surdo',
    description:
      '-1 dado em Sentidos auditivos; percepção reduzida a Sentidos × 3 metros',
  },
  {
    name: 'Vulnerável',
    description: '+1 dado de dano dos atacantes; -5 Defesa',
  },
];

async function main() {
  console.log('Iniciando seed de condições...');

  for (const condition of conditions) {
    await prisma.condition.upsert({
      where: { name: condition.name },
      update: { description: condition.description },
      create: condition,
    });
  }

  const total = await prisma.condition.count();
  console.log(`Seed concluído. Total de condições no banco: ${total}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
