import { Request, Response } from 'express';

// Corrigido: definido o tipo Handler para retornar Promise<void>
type Handler = (req: Request, res: Response) => Promise<void>;

import { prisma } from '../index';

// Obter todos os clientes
export const getAllClientes: Handler = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        nomeCompleto: 'asc',
      },
    });
    // Corrigido: removido o "return" antes de res.status()
    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

// Obter cliente por ID
export const getClienteById: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { id },
      include: {
        locacoes: {
          orderBy: {
            dataInicio: 'desc',
          },
          take: 10,
        },
      },
    });

    if (!cliente) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Cliente não encontrado' });
      return; // Adicionado return para evitar execução adicional
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

// Criar novo cliente
export const createCliente: Handler = async (req: Request, res: Response) => {
  try {
    const {
      tipo,
      documento,
      nomeCompleto,
      razaoSocial,
      telefone,
      email,
      cep,
      enderecoCompleto,
      referencia,
      metodoPagamento,
      contatoNome,
      contatoTelefone,
      contatoEmail,
      enderecoEntrega
    } = req.body;

    // Verificar se o documento já existe
    const existingCliente = await prisma.cliente.findUnique({
      where: { documento },
    });

    if (existingCliente) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Já existe um cliente com este documento' });
      return; // Adicionado return para evitar execução adicional
    }

    // Validar tipo de cliente
    if (!['PF', 'PJ'].includes(tipo)) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Tipo de cliente inválido' });
      return; // Adicionado return para evitar execução adicional
    }

    // Validar campos obrigatórios conforme tipo
    if (tipo === 'PF' && !nomeCompleto) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Nome completo é obrigatório para pessoa física' });
      return; // Adicionado return para evitar execução adicional
    }

    if (tipo === 'PJ' && !razaoSocial) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Razão social é obrigatória para pessoa jurídica' });
      return; // Adicionado return para evitar execução adicional
    }

    const newCliente = await prisma.cliente.create({
      data: {
        tipo,
        documento,
        nomeCompleto,
        razaoSocial,
        telefone,
        email,
        cep,
        enderecoCompleto,
        referencia,
        metodoPagamento,
        contatoNome,
        contatoTelefone,
        contatoEmail,
        enderecoEntrega
      },
    });

    res.status(201).json(newCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente
export const updateCliente: Handler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const {
      telefone,
      email,
      cep,
      enderecoCompleto,
      referencia,
      metodoPagamento,
      contatoNome,
      contatoTelefone,
      contatoEmail,
      enderecoEntrega
    } = req.body;

    const cliente = await prisma.cliente.findUnique({
      where: { id },
    });

    if (!cliente) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Cliente não encontrado' });
      return; // Adicionado return para evitar execução adicional
    }

    const updatedCliente = await prisma.cliente.update({
      where: { id },
      data: {
        telefone: telefone || cliente.telefone,
        email: email !== undefined ? email : cliente.email,
        cep: cep || cliente.cep,
        enderecoCompleto: enderecoCompleto || cliente.enderecoCompleto,
        referencia: referencia !== undefined ? referencia : cliente.referencia,
        metodoPagamento: metodoPagamento || cliente.metodoPagamento,
        contatoNome: contatoNome !== undefined ? contatoNome : cliente.contatoNome,
        contatoTelefone: contatoTelefone !== undefined ? contatoTelefone : cliente.contatoTelefone,
        contatoEmail: contatoEmail !== undefined ? contatoEmail : cliente.contatoEmail,
        enderecoEntrega: enderecoEntrega !== undefined ? enderecoEntrega : cliente.enderecoEntrega,
      },
    });

    res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

// Buscar clientes por tipo
export const getClientesByTipo: Handler = async (req: Request, res: Response) => {
  try {
    const { tipo } = req.query;

    if (!tipo || !['PF', 'PJ'].includes(tipo as string)) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(400).json({ error: 'Tipo inválido' });
      return; // Adicionado return para evitar execução adicional
    }

    const clientes = await prisma.cliente.findMany({
      where: {
        tipo: tipo as any,
      },
      orderBy: {
        nomeCompleto: 'asc',
      },
    });

    res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes por tipo:', error);
    res.status(500).json({ error: 'Erro ao buscar clientes por tipo' });
  }
};

// Buscar cliente por documento (CPF/CNPJ)
export const getClienteByDocumento: Handler = async (req: Request, res: Response) => {
  try {
    const { documento } = req.params;
    const cliente = await prisma.cliente.findUnique({
      where: { documento },
      include: {
        locacoes: {
          orderBy: {
            dataInicio: 'desc',
          },
          take: 5,
        },
      },
    });

    if (!cliente) {
      // Corrigido: removido o "return" antes de res.status()
      res.status(404).json({ error: 'Cliente não encontrado' });
      return; // Adicionado return para evitar execução adicional
    }

    res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente por documento:', error);
    res.status(500).json({ error: 'Erro ao buscar cliente por documento' });
  }
};
