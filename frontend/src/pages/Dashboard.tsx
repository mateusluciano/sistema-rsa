import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface DashboardStats {
  cacambasDisponiveis: number;
  cacambasEmUso: number;
  entregasHoje: number;
  retiradasHoje: number;
}

interface LocacaoVencendo {
  id: string;
  cliente: {
    nomeCompleto?: string;
    razaoSocial?: string;
  };
  cacamba: {
    numero: string;
  };
  enderecoEntrega: string;
  dataFimPrevista: string;
  status: string;
}

const Dashboard: React.FC = () => {
  const [stats, setStats] = useState<DashboardStats>({
    cacambasDisponiveis: 0,
    cacambasEmUso: 0,
    entregasHoje: 0,
    retiradasHoje: 0,
  });
  const [locacoesVencendo, setLocacoesVencendo] = useState<LocacaoVencendo[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        // Em um ambiente real, estas seriam chamadas reais à API
        // Simulando dados para o protótipo
        
        // Estatísticas
        setStats({
          cacambasDisponiveis: 15,
          cacambasEmUso: 25,
          entregasHoje: 8,
          retiradasHoje: 6,
        });

        // Locações vencendo
        setLocacoesVencendo([
          {
            id: '1',
            cliente: { nomeCompleto: 'João Silva' },
            cacamba: { numero: '001' },
            enderecoEntrega: 'Rua das Flores, 123',
            dataFimPrevista: '2025-06-03T18:00:00.000Z',
            status: 'EM_ANDAMENTO',
          },
          {
            id: '2',
            cliente: { razaoSocial: 'Construções ABC Ltda' },
            cacamba: { numero: '015' },
            enderecoEntrega: 'Av. Principal, 500',
            dataFimPrevista: '2025-06-04T10:00:00.000Z',
            status: 'EM_ANDAMENTO',
          },
          {
            id: '3',
            cliente: { nomeCompleto: 'Maria Oliveira' },
            cacamba: { numero: '023' },
            enderecoEntrega: 'Rua dos Pinheiros, 45',
            dataFimPrevista: '2025-06-04T15:00:00.000Z',
            status: 'EM_ANDAMENTO',
          },
        ]);

        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar dados do dashboard:', error);
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Cards de estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Caçambas Disponíveis</h2>
          <p className="text-3xl font-bold text-green-600">{stats.cacambasDisponiveis}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Caçambas Em Uso</h2>
          <p className="text-3xl font-bold text-blue-600">{stats.cacambasEmUso}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Entregas Hoje</h2>
          <p className="text-3xl font-bold text-purple-600">{stats.entregasHoje}</p>
        </div>
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-lg font-semibold text-gray-700">Retiradas Hoje</h2>
          <p className="text-3xl font-bold text-orange-600">{stats.retiradasHoje}</p>
        </div>
      </div>

      {/* Controle Diário Digital */}
      <div className="bg-white rounded-lg shadow mb-8">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Controle Diário Digital</h2>
        </div>
        <div className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Colocações */}
            <div>
              <h3 className="text-lg font-medium mb-3">Colocações</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">João Silva</td>
                    <td className="px-6 py-4 whitespace-nowrap">Centro</td>
                    <td className="px-6 py-4 whitespace-nowrap">E</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Construções ABC</td>
                    <td className="px-6 py-4 whitespace-nowrap">Industrial</td>
                    <td className="px-6 py-4 whitespace-nowrap">J</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            {/* Retiradas */}
            <div>
              <h3 className="text-lg font-medium mb-3">Retiradas</h3>
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bairro</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Motorista</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Destino</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Maria Oliveira</td>
                    <td className="px-6 py-4 whitespace-nowrap">Jardins</td>
                    <td className="px-6 py-4 whitespace-nowrap">E</td>
                    <td className="px-6 py-4 whitespace-nowrap">Essencis</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 whitespace-nowrap">Pedro Santos</td>
                    <td className="px-6 py-4 whitespace-nowrap">Vila Nova</td>
                    <td className="px-6 py-4 whitespace-nowrap">J</td>
                    <td className="px-6 py-4 whitespace-nowrap">Citrolândia</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {/* Locações com prazo vencendo */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-4 border-b">
          <h2 className="text-xl font-semibold">Locações com Prazo Vencendo</h2>
        </div>
        <div className="p-4">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caçamba</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Vencimento</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {locacoesVencendo.map((locacao) => (
                <tr key={locacao.id}>
                  <td className="px-6 py-4 whitespace-nowrap">{locacao.cacamba.numero}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {locacao.cliente.nomeCompleto || locacao.cliente.razaoSocial}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">{locacao.enderecoEntrega}</td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {new Date(locacao.dataFimPrevista).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <button className="bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-sm mr-2">
                      Agendar Retirada
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
