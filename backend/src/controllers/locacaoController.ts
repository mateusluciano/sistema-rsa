import { Request, Response } from 'express';

// Corrigido: definido o tipo Handler para retornar Promise<void>
type Handler = (req: Request, res: Response) => Promise<void>;

import { prisma } from '../index';

// Obter todas as locações
export const getAllLocacoes: Handler = async (req: Request, res: Response) => {
  try {
    const locacoes = await prisma.locacao.findMany({
      orderBy: {
        dataInicio: 'desc',
      },
      include: {
        cliente: true,
        cacamba: true,
      },
    });
    // Corrigido: removido o "return" antes de res.status()
    res.status(200).json(locacoes);
  } catch (error) {
    console.error('Erro ao buscar locações:', error);
    res.status(500).json({ error: 'Erro ao buscar locações' });
  }
};

// Obter locação por ID
export const getLocacaoById: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const locacao = await prisma.locacao.findUnique({
      where: { id },
      include: {
        cliente: true,
        cacamba: true,
        movimentacoes: {
          orderBy: {
            dataHora: 'desc',
          },
          include: {
            destinadora: true,
          },
        },
      },
    });

    if (!locacao) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Locação não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    res.status(200).json(locacao);
  } catch (error) {
    console.error('Erro ao buscar locação:', error);
    res.status(500).json({ error: 'Erro ao buscar locação' });
  }
};

// Criar nova locação
export const createLocacao: Handler = async (req: Request, res: Response) => {
  try {
    const {
      clienteId,
      cacambaId,
      dataInicio,
      enderecoEntrega,
      valor,
      tipoResiduo,
      taxaAdicional,
      diasExtras,
      valorDiaExtra,
      observacoes
    } = req.body;

    // Verificar se o cliente existe
    const cliente = await prisma.cliente.findUnique({
      where: { id: clienteId },
    });

    if (!cliente) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Cliente não encontrado' });
      return; // Adicionado return para evitar execução adicional
    }

    // Verificar se a caçamba existe e está disponível
    const cacamba = await prisma.cacamba.findUnique({
      where: { id: cacambaId },
    });

    if (!cacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Caçamba não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    if (cacamba.status !== 'DISPONIVEL') {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Caçamba não está disponível' });
      return; // Adicionado return para evitar execução adicional
    }

    // Calcular data fim prevista com base no tipo de cliente
    const dataInicioObj = new Date(dataInicio);
    let dataFimPrevista = new Date(dataInicioObj);

    if (cliente.tipo === 'PF') {
      // Para PF: 4 dias úteis (sem contar domingo)
      let diasAdicionados = 0;
      while (diasAdicionados < 4) {
        dataFimPrevista.setDate(dataFimPrevista.getDate() + 1);
        // Pular domingos
        if (dataFimPrevista.getDay() !== 0) {
          diasAdicionados++;
        }
      }

      // Se terminar no sábado, ajustar para segunda-feira
      if (dataFimPrevista.getDay() === 6) {
        dataFimPrevista.setDate(dataFimPrevista.getDate() + 2);
      }
    } else {
      // Para PJ: 7 dias corridos
      dataFimPrevista.setDate(dataFimPrevista.getDate() + 7);
    }

    // Criar a locação
    const newLocacao = await prisma.locacao.create({
      data: {
        clienteId,
        cacambaId,
        dataInicio: dataInicioObj,
        dataFimPrevista,
        enderecoEntrega,
        status: 'AGENDADA',
        valor,
        tipoResiduo,
        taxaAdicional,
        diasExtras,
        valorDiaExtra,
        observacoes,
      },
    });

    // Atualizar status da caçamba
    await prisma.cacamba.update({
      where: { id: cacambaId },
      data: {
        status: 'EM_USO',
        localizacaoAtual: enderecoEntrega,
        dataUltimaMovimentacao: new Date(),
      },
    });

    res.status(201).json(newLocacao);
  } catch (error) {
    console.error('Erro ao criar locação:', error);
    res.status(500).json({ error: 'Erro ao criar locação' });
  }
};

// Atualizar locação
export const updateLocacao: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      status,
      dataFimReal,
      taxaAdicional,
      diasExtras,
      valorDiaExtra,
      contaAzulVendaId,
      observacoes
    } = req.body;

    const locacao = await prisma.locacao.findUnique({
      where: { id },
      include: {
        cacamba: true,
      },
    });

    if (!locacao) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Locação não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    // Atualizar a locação
    const updatedLocacao = await prisma.locacao.update({
      where: { id },
      data: {
        status: status || locacao.status,
        dataFimReal: dataFimReal ? new Date(dataFimReal) : locacao.dataFimReal,
        taxaAdicional: taxaAdicional !== undefined ? taxaAdicional : locacao.taxaAdicional,
        diasExtras: diasExtras !== undefined ? diasExtras : locacao.diasExtras,
        valorDiaExtra: valorDiaExtra !== undefined ? valorDiaExtra : locacao.valorDiaExtra,
        contaAzulVendaId: contaAzulVendaId !== undefined ? contaAzulVendaId : locacao.contaAzulVendaId,
        observacoes: observacoes !== undefined ? observacoes : locacao.observacoes,
      },
    });

    // Se a locação foi finalizada, atualizar status da caçamba para disponível
    if (status === 'FINALIZADA' && locacao.status !== 'FINALIZADA') {
      await prisma.cacamba.update({
        where: { id: locacao.cacambaId },
        data: {
          status: 'DISPONIVEL',
          localizacaoAtual: 'Pátio', // Valor padrão quando retorna ao pátio
          dataUltimaMovimentacao: new Date(),
        },
      });
    }

    res.status(200).json(updatedLocacao);
  } catch (error) {
    console.error('Erro ao atualizar locação:', error);
    res.status(500).json({ error: 'Erro ao atualizar locação' });
  }
};

// Buscar locações por status
export const getLocacoesByStatus: Handler = async (req: Request, res: Response) => {
  try {
    const { status } = req.query;

    if (!status || !['AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA'].includes(status as string)) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Status inválido' });
      return; // Adicionado return para evitar execução adicional
    }

    const locacoes = await prisma.locacao.findMany({
      where: {
        status: status as any,
      },
      include: {
        cliente: true,
        cacamba: true,
      },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    res.status(200).json(locacoes);
  } catch (error) {
    console.error('Erro ao buscar locações por status:', error);
    res.status(500).json({ error: 'Erro ao buscar locações por status' });
  }
};

// Buscar locações por cliente
export const getLocacoesByCliente: Handler = async (req: Request, res: Response) => {
  try {
    const { clienteId } = req.params;
    const locacoes = await prisma.locacao.findMany({
      where: {
        clienteId,
      },
      include: {
        cacamba: true,
      },
      orderBy: {
        dataInicio: 'desc',
      },
    });

    res.status(200).json(locacoes);
  } catch (error) {
    console.error('Erro ao buscar locações por cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar locações por cliente' });
  }
};

// Registrar movimentação de caçamba
export const registrarMovimentacao: Handler = async (req: Request, res: Response) => {
  try {
    const {
      cacambaId,
      locacaoId,
      tipo,
      origem,
      destino,
      motorista,
      destinadoraId,
      observacoes
    } = req.body;

    // Verificar se a caçamba existe
    const cacamba = await prisma.cacamba.findUnique({
      where: { id: cacambaId },
    });

    if (!cacamba) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Caçamba não encontrada' });
      return; // Adicionado return para evitar execução adicional
    }

    // Criar a movimentação
    const newMovimentacao = await prisma.movimentacao.create({
      data: {
        cacambaId,
        locacaoId,
        tipo,
        origem,
        destino,
        motorista,
        destinadoraId,
        observacoes,
      },
    });

    // Atualizar localização atual da caçamba
    await prisma.cacamba.update({
      where: { id: cacambaId },
      data: {
        localizacaoAtual: destino,
        dataUltimaMovimentacao: new Date(),
        status: tipo === 'RETIRADA' ? 'DISPONIVEL' : (tipo === 'COLOCACAO' ? 'EM_USO' : cacamba.status),
      },
    });

    // Se for uma colocação, atualizar status da locação para EM_ANDAMENTO
    if (tipo === 'COLOCACAO' && locacaoId) {
      await prisma.locacao.update({
        where: { id: locacaoId },
        data: {
          status: 'EM_ANDAMENTO',
        },
      });
    }

    // Se for uma retirada, atualizar status da locação para FINALIZADA e registrar data fim real
    if (tipo === 'RETIRADA' && locacaoId) {
      await prisma.locacao.update({
        where: { id: locacaoId },
        data: {
          status: 'FINALIZADA',
          dataFimReal: new Date(),
        },
      });
    }

    res.status(201).json(newMovimentacao);
  } catch (error) {
    console.error('Erro ao registrar movimentação:', error);
    res.status(500).json({ error: 'Erro ao registrar movimentação' });
  }
};
