import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { prisma } from '../index';

// Interface para o payload do token JWT
interface JwtPayload {
  id: string;
  email: string;
  tipo: string;
}

// Middleware de autenticação
export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    // Verificar se o token está presente no header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Token de autenticação não fornecido' });
    }
    
    // Extrair o token
    const token = authHeader.split(' ')[1];
    
    // Verificar e decodificar o token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_key') as JwtPayload;
    
    // Verificar se o usuário existe e está ativo
    const user = await prisma.usuario.findUnique({
      where: { id: decoded.id },
    });
    
    if (!user || !user.ativo) {
      return res.status(401).json({ error: 'Usuário não encontrado ou desativado' });
    }
    
    // Adicionar informações do usuário ao request
    (req as any).user = {
      id: decoded.id,
      email: decoded.email,
      tipo: decoded.tipo,
    };
    
    next();
  } catch (error) {
    console.error('Erro no middleware de autenticação:', error);
    return res.status(401).json({ error: 'Token inválido ou expirado' });
  }
};

// Middleware para verificar se o usuário é administrador
export const adminMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userType = (req as any).user.tipo;
    
    if (userType !== 'ADMINISTRADOR') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores podem acessar este recurso.' });
    }
    
    next();
  } catch (error) {
    console.error('Erro no middleware de administrador:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões de administrador' });
  }
};

// Middleware para verificar se o usuário é administrador ou gerente
export const managerMiddleware = (req: Request, res: Response, next: NextFunction) => {
  try {
    const userType = (req as any).user.tipo;
    
    if (userType !== 'ADMINISTRADOR' && userType !== 'GERENTE') {
      return res.status(403).json({ error: 'Acesso negado. Apenas administradores e gerentes podem acessar este recurso.' });
    }
    
    next();
  } catch (error) {
    console.error('Erro no middleware de gerente:', error);
    return res.status(500).json({ error: 'Erro ao verificar permissões de gerente' });
  }
};
