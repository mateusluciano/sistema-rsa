import { Request, Response } from 'express';
import { prisma } from '../index';

// Obter todas as caçambas
export const getAllCacambas = async (req: Request, res: Response) => {
  try {
    const cacambas = await prisma.cacamba.findMany({
      orderBy: {
        numero: 'asc',
      },
    });
    
    return res.status(200).json(cacambas);
  } catch (error) {
    console.error('Erro ao buscar caçambas:', error);
    return res.status(500).json({ error: 'Erro ao buscar caçambas' });
  }
};

// Obter caçamba por ID
export const getCacambaById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Caçamba não encontrada' });
    }
    
    return res.status(200).json(cacamba);
  } catch (error) {
    console.error('Erro ao buscar caçamba:', error);
    return res.status(500).json({ error: 'Erro ao buscar caçamba' });
  }
};

// Criar nova caçamba
export const createCacamba = async (req: Request, res: Response) => {
  try {
    const { numero, status, localizacaoAtual, observacoes } = req.body;
    
    // Verificar se o número já existe
    const existingCacamba = await prisma.cacamba.findUnique({
      where: { numero },
    });
    
    if (existingCacamba) {
      return res.status(400).json({ error: 'Já existe uma caçamba com este número' });
    }
    
    const newCacamba = await prisma.cacamba.create({
      data: {
        numero,
        status: status || 'DISPONIVEL',
        localizacaoAtual,
        observacoes,
      },
    });
    
    return res.status(201).json(newCacamba);
  } catch (error) {
    console.error('Erro ao criar caçamba:', error);
    return res.status(500).json({ error: 'Erro ao criar caçamba' });
  }
};

// Atualizar caçamba
export const updateCacamba = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { status, localizacaoAtual, observacoes } = req.body;
    
    const cacamba = await prisma.cacamba.findUnique({
      where: { id },
    });
    
    if (!cacamba) {
      return res.status(404).json({ error: 'Caçamba não encontrada' });
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
    
    return res.status(200).json(updatedCacamba);
  } catch (error) {
    console.error('Erro ao atualizar caçamba:', error);
    return res.status(500).json({ error: 'Erro ao atualizar caçamba' });
  }
};

// Excluir caçamba
export const deleteCacamba = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Caçamba não encontrada' });
    }
    
    // Verificar se a caçamba possui locações ou movimentações
    if (cacamba.locacoes.length > 0 || cacamba.movimentacoes.length > 0) {
      return res.status(400).json({ 
        error: 'Não é possível excluir a caçamba pois ela possui locações ou movimentações associadas' 
      });
    }
    
    await prisma.cacamba.delete({
      where: { id },
    });
    
    return res.status(200).json({ message: 'Caçamba excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir caçamba:', error);
    return res.status(500).json({ error: 'Erro ao excluir caçamba' });
  }
};

// Buscar caçambas por status
export const getCacambasByStatus = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;
    
    if (!status || !['DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO'].includes(status as string)) {
      return res.status(400).json({ error: 'Status inválido' });
    }
    
    const cacambas = await prisma.cacamba.findMany({
      where: {
        status: status as any,
      },
      orderBy: {
        numero: 'asc',
      },
    });
    
    return res.status(200).json(cacambas);
  } catch (error) {
    console.error('Erro ao buscar caçambas por status:', error);
    return res.status(500).json({ error: 'Erro ao buscar caçambas por status' });
  }
};
