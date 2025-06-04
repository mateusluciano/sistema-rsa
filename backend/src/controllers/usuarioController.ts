import { Request, Response } from 'express';
import { prisma } from '../index';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Registrar novo usuário
export const registerUser = async (req: Request, res: Response) => {
  try {
    const { nome, email, senha, tipo } = req.body;
    
    // Verificar se o email já está em uso
    const existingUser = await prisma.usuario.findUnique({
      where: { email },
    });
    
    if (existingUser) {
      return res.status(400).json({ error: 'Email já está em uso' });
    }
    
    // Hash da senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(senha, salt);
    
    // Criar usuário
    const newUser = await prisma.usuario.create({
      data: {
        nome,
        email,
        senha: hashedPassword,
        tipo: tipo || 'OPERACIONAL',
      },
    });
    
    // Remover a senha do objeto de resposta
    const { senha: _, ...userWithoutPassword } = newUser;
    
    return res.status(201).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao registrar usuário:', error);
    return res.status(500).json({ error: 'Erro ao registrar usuário' });
  }
};

// Login de usuário
export const loginUser = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    // Verificar se o usuário existe
    const user = await prisma.usuario.findUnique({
      where: { email },
    });
    
    if (!user) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    
    // Verificar se o usuário está ativo
    if (!user.ativo) {
      return res.status(400).json({ error: 'Usuário desativado' });
    }
    
    // Verificar senha
    const isPasswordValid = await bcrypt.compare(senha, user.senha);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Credenciais inválidas' });
    }
    
    // Gerar token JWT
    const token = jwt.sign(
      { id: user.id, email: user.email, tipo: user.tipo },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );
    
    // Remover a senha do objeto de resposta
    const { senha: _, ...userWithoutPassword } = user;
    
    return res.status(200).json({
      user: userWithoutPassword,
      token,
    });
  } catch (error) {
    console.error('Erro ao fazer login:', error);
    return res.status(500).json({ error: 'Erro ao fazer login' });
  }
};

// Obter usuário atual
export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    // O middleware de autenticação já verificou o token e adicionou o usuário ao request
    const userId = (req as any).user.id;
    
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Remover a senha do objeto de resposta
    const { senha: _, ...userWithoutPassword } = user;
    
    return res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error('Erro ao obter usuário atual:', error);
    return res.status(500).json({ error: 'Erro ao obter usuário atual' });
  }
};

// Obter todos os usuários (apenas para administradores)
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    // Verificar se o usuário é administrador
    const userType = (req as any).user.tipo;
    
    if (userType !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    const users = await prisma.usuario.findMany({
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return res.status(200).json(users);
  } catch (error) {
    console.error('Erro ao buscar usuários:', error);
    return res.status(500).json({ error: 'Erro ao buscar usuários' });
  }
};

// Atualizar usuário
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { nome, email, tipo, ativo } = req.body;
    
    // Verificar se o usuário existe
    const user = await prisma.usuario.findUnique({
      where: { id },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar permissões
    const requestingUserType = (req as any).user.tipo;
    const requestingUserId = (req as any).user.id;
    
    // Apenas administradores podem alterar tipo e status ativo
    // Ou o próprio usuário pode alterar seus dados básicos
    if (requestingUserType !== 'ADMINISTRADOR' && requestingUserId !== id) {
      return res.status(403).json({ error: 'Acesso negado' });
    }
    
    // Preparar dados para atualização
    const updateData: any = {};
    
    if (nome) updateData.nome = nome;
    
    // Apenas administradores podem alterar email, tipo e status ativo
    if (requestingUserType === 'ADMINISTRADOR') {
      if (email) updateData.email = email;
      if (tipo) updateData.tipo = tipo;
      if (ativo !== undefined) updateData.ativo = ativo;
    }
    
    // Atualizar usuário
    const updatedUser = await prisma.usuario.update({
      where: { id },
      data: updateData,
      select: {
        id: true,
        nome: true,
        email: true,
        tipo: true,
        ativo: true,
        createdAt: true,
        updatedAt: true,
      },
    });
    
    return res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Erro ao atualizar usuário:', error);
    return res.status(500).json({ error: 'Erro ao atualizar usuário' });
  }
};

// Alterar senha
export const changePassword = async (req: Request, res: Response) => {
  try {
    const { senhaAtual, novaSenha } = req.body;
    const userId = (req as any).user.id;
    
    // Verificar se o usuário existe
    const user = await prisma.usuario.findUnique({
      where: { id: userId },
    });
    
    if (!user) {
      return res.status(404).json({ error: 'Usuário não encontrado' });
    }
    
    // Verificar senha atual
    const isPasswordValid = await bcrypt.compare(senhaAtual, user.senha);
    
    if (!isPasswordValid) {
      return res.status(400).json({ error: 'Senha atual incorreta' });
    }
    
    // Hash da nova senha
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(novaSenha, salt);
    
    // Atualizar senha
    await prisma.usuario.update({
      where: { id: userId },
      data: {
        senha: hashedPassword,
      },
    });
    
    return res.status(200).json({ message: 'Senha alterada com sucesso' });
  } catch (error) {
    console.error('Erro ao alterar senha:', error);
    return res.status(500).json({ error: 'Erro ao alterar senha' });
  }
};
