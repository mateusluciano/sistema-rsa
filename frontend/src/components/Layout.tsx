import React from 'react';
import { useAuth } from '../contexts/AuthContext';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Barra de navegação superior */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <span className="text-xl font-bold">Sistema de Gestão de Caçambas</span>
              </div>
            </div>
            <div className="flex items-center">
              <div className="ml-3 relative">
                <div className="flex items-center">
                  <span className="mr-2">{user?.nome}</span>
                  <button
                    onClick={logout}
                    className="bg-blue-700 hover:bg-blue-800 px-3 py-1 rounded-md text-sm"
                  >
                    Sair
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Conteúdo principal com menu lateral */}
      <div className="flex">
        {/* Menu lateral */}
        <div className="w-64 bg-white shadow-lg h-screen">
          <div className="p-4">
            <ul>
              <li className="mb-2">
                <a
                  href="/"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Dashboard
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/cacambas"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Caçambas
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/clientes"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Clientes
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/locacoes"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Locações
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/movimentacoes"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Movimentações
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/destinadoras"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Destinadoras
                </a>
              </li>
              <li className="mb-2">
                <a
                  href="/relatorios"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Relatórios
                </a>
              </li>
              {user?.tipo === 'ADMINISTRADOR' && (
                <li className="mb-2">
                  <a
                    href="/usuarios"
                    className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                  >
                    Usuários
                  </a>
                </li>
              )}
              <li className="mb-2">
                <a
                  href="/configuracoes"
                  className="block p-2 rounded-md hover:bg-blue-100 transition-colors"
                >
                  Configurações
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Conteúdo principal */}
        <div className="flex-1 p-8">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
