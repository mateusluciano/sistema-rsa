import { Request, Response } from 'express';
import { prisma } from '../index';

// Obter todos os clientes
export const getAllClientes = async (req: Request, res: Response) => {
  try {
    const clientes = await prisma.cliente.findMany({
      orderBy: {
        nomeCompleto: 'asc',
      },
    });
    
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes:', error);
    return res.status(500).json({ error: 'Erro ao buscar clientes' });
  }
};

// Obter cliente por ID
export const getClienteById = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente:', error);
    return res.status(500).json({ error: 'Erro ao buscar cliente' });
  }
};

// Criar novo cliente
export const createCliente = async (req: Request, res: Response) => {
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
      return res.status(400).json({ error: 'Já existe um cliente com este documento' });
    }
    
    // Validar tipo de cliente
    if (!['PF', 'PJ'].includes(tipo)) {
      return res.status(400).json({ error: 'Tipo de cliente inválido' });
    }
    
    // Validar campos obrigatórios conforme tipo
    if (tipo === 'PF' && !nomeCompleto) {
      return res.status(400).json({ error: 'Nome completo é obrigatório para pessoa física' });
    }
    
    if (tipo === 'PJ' && !razaoSocial) {
      return res.status(400).json({ error: 'Razão social é obrigatória para pessoa jurídica' });
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
    
    return res.status(201).json(newCliente);
  } catch (error) {
    console.error('Erro ao criar cliente:', error);
    return res.status(500).json({ error: 'Erro ao criar cliente' });
  }
};

// Atualizar cliente
export const updateCliente = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Cliente não encontrado' });
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
    
    return res.status(200).json(updatedCliente);
  } catch (error) {
    console.error('Erro ao atualizar cliente:', error);
    return res.status(500).json({ error: 'Erro ao atualizar cliente' });
  }
};

// Buscar clientes por tipo
export const getClientesByTipo = async (req: Request, res: Response) => {
  try {
    const { tipo } = req.query;
    
    if (!tipo || !['PF', 'PJ'].includes(tipo as string)) {
      return res.status(400).json({ error: 'Tipo inválido' });
    }
    
    const clientes = await prisma.cliente.findMany({
      where: {
        tipo: tipo as any,
      },
      orderBy: {
        nomeCompleto: 'asc',
      },
    });
    
    return res.status(200).json(clientes);
  } catch (error) {
    console.error('Erro ao buscar clientes por tipo:', error);
    return res.status(500).json({ error: 'Erro ao buscar clientes por tipo' });
  }
};

// Buscar cliente por documento (CPF/CNPJ)
export const getClienteByDocumento = async (req: Request, res: Response) => {
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
      return res.status(404).json({ error: 'Cliente não encontrado' });
    }
    
    return res.status(200).json(cliente);
  } catch (error) {
    console.error('Erro ao buscar cliente por documento:', error);
    return res.status(500).json({ error: 'Erro ao buscar cliente por documento' });
  }
};
