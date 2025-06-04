import { Request, Response } from 'express';

// Corrigido: alterado o tipo de retorno para Promise<void> em vez de Promise<Response>
type Handler = (req: Request, res: Response) => Promise<void>;

import { prisma } from '../prisma';

// Obter todas as caçambas
export const getAllCacambas: Handler = async (req: Request, res: Response) => {
  try {
    const cacambas = await prisma.cacamba.findMany({
      orderBy: {
        numero: 'asc',
      },
    });
    // Corrigido: removido o "return" antes de res.status()
    res.status(200).json(cacambas);
  } catch (error) {
    console.error('Erro ao buscar caçambas:', error);
    res.status(500).json({ error: 'Erro ao buscar caçambas' });
  }
};

// Obter caçamba por ID
export const getCacambaById: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cacamba = await prisma.cacamba.findUnique({
      where: { id },
      include: {
        movimentacoes: {
          orderBy: {
            dataHora: 'desc',
          },
          take: 10,
        },
        locacoes: {
          orderBy: {
            dataInicio: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!cacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Caçamba não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    res.status(200).json(cacamba);
  } catch (error) {
    console.error('Erro ao buscar caçamba:', error);
    res.status(500).json({ error: 'Erro ao buscar caçamba' });
  }
};

// Criar nova caçamba
export const createCacamba: Handler = async (req: Request, res: Response) => {
  try {
    const { numero, status, localizacaoAtual, observacoes } = req.body;

    // Verificar se o número já existe
    const existingCacamba = await prisma.cacamba.findUnique({
      where: { numero },
    });

    if (existingCacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Já existe uma caçamba com este número' });
      return; // Adicionado return para evitar execução adicional
    }

    const newCacamba = await prisma.cacamba.create({
      data: {
        numero,
        status: status || 'DISPONIVEL',
        localizacaoAtual,
        observacoes,
      },
    });

    res.status(201).json(newCacamba);
  } catch (error) {
    console.error('Erro ao criar caçamba:', error);
    res.status(500).json({ error: 'Erro ao criar caçamba' });
  }
};

// Atualizar caçamba
export const updateCacamba: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, localizacaoAtual, observacoes } = req.body;

    const cacamba = await prisma.cacamba.findUnique({
      where: { id },
    });

    if (!cacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Caçamba não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    const updatedCacamba = await prisma.cacamba.update({
      where: { id },
      data: {
        status: status || cacamba.status,
        localizacaoAtual: localizacaoAtual || cacamba.localizacaoAtual,
        observacoes: observacoes !== undefined ? observacoes : cacamba.observacoes,
        dataUltimaMovimentacao: new Date(),
      },
    });

    res.status(200).json(updatedCacamba);
  } catch (error) {
    console.error('Erro ao atualizar caçamba:', error);
    res.status(500).json({ error: 'Erro ao atualizar caçamba' });
  }
};

// Excluir caçamba
export const deleteCacamba: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    // Verificar se a caçamba existe
    const cacamba = await prisma.cacamba.findUnique({
      where: { id },
      include: {
        locacoes: true,
        movimentacoes: true,
      },
    });

    if (!cacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Caçamba não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    // Verificar se a caçamba possui locações ou movimentações
    if (cacamba.locacoes.length > 0 || cacamba.movimentacoes.length > 0) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Não é possível excluir a caçamba pois ela possui locações ou movimentações associadas' });
      return; // Adicionado return para evitar execução adicional
    }

    await prisma.cacamba.delete({
      where: { id },
    });

    res.status(200).json({ message: 'Caçamba excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir caçamba:', error);
    res.status(500).json({ error: 'Erro ao excluir caçamba' });
  }
};

// Buscar caçambas por status
export const getCacambasByStatus: Handler = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    if (!status || !['DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO'].includes(status as string)) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Status inválido' });
      return; // Adicionado return para evitar execução adicional
    }

    const cacambas = await prisma.cacamba.findMany({
      where: {
        status: status as any,
      },
      orderBy: {
        numero: 'asc',
      },
    });

    res.status(200).json(cacambas);
  } catch (error) {
    console.error('Erro ao buscar caçambas por status:', error);
    res.status(500).json({ error: 'Erro ao buscar caçambas por status' });
  }
};
