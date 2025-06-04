import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Locacao {
  id: string;
  cliente: {
    id: string;
    nomeCompleto?: string;
    razaoSocial?: string;
    tipo: 'PF' | 'PJ';
  };
  cacamba: {
    id: string;
    numero: string;
  };
  dataInicio: string;
  dataFimPrevista: string;
  dataFimReal?: string;
  enderecoEntrega: string;
  status: 'AGENDADA' | 'EM_ANDAMENTO' | 'FINALIZADA' | 'CANCELADA';
  valor: number;
  tipoResiduo: string;
  taxaAdicional?: number;
  diasExtras?: number;
  valorDiaExtra?: number;
  observacoes?: string;
}

const Locacoes: React.FC = () => {
  const [locacoes, setLocacoes] = useState<Locacao[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [modalAberto, setModalAberto] = useState(false);

  useEffect(() => {
    const fetchLocacoes = async () => {
      try {
        // Em um ambiente real, esta seria uma chamada real à API
        // Simulando dados para o protótipo
        const locacoesSimuladas: Locacao[] = [
          {
            id: '1',
            cliente: {
              id: '1',
              nomeCompleto: 'João Silva',
              tipo: 'PF'
            },
            cacamba: {
              id: '1',
              numero: '001'
            },
            dataInicio: '2025-06-01T10:00:00.000Z',
            dataFimPrevista: '2025-06-05T10:00:00.000Z',
            enderecoEntrega: 'Rua das Flores, 123, Centro',
            status: 'EM_ANDAMENTO',
            valor: 350.00,
            tipoResiduo: 'CLASSE_A'
          },
          {
            id: '2',
            cliente: {
              id: '2',
              razaoSocial: 'Construções ABC Ltda',
              tipo: 'PJ'
            },
            cacamba: {
              id: '2',
              numero: '002'
            },
            dataInicio: '2025-05-28T14:30:00.000Z',
            dataFimPrevista: '2025-06-04T14:30:00.000Z',
            enderecoEntrega: 'Av. Industrial, 500, Distrito Industrial',
            status: 'EM_ANDAMENTO',
            valor: 450.00,
            tipoResiduo: 'MISTO',
            diasExtras: 2,
            valorDiaExtra: 50.00
          },
          {
            id: '3',
            cliente: {
              id: '3',
              nomeCompleto: 'Maria Oliveira',
              tipo: 'PF'
            },
            cacamba: {
              id: '3',
              numero: '003'
            },
            dataInicio: '2025-05-25T08:15:00.000Z',
            dataFimPrevista: '2025-05-29T08:15:00.000Z',
            dataFimReal: '2025-05-30T10:20:00.000Z',
            enderecoEntrega: 'Rua dos Pinheiros, 45, Jardim Europa',
            status: 'FINALIZADA',
            valor: 350.00,
            tipoResiduo: 'CLASSE_A',
            taxaAdicional: 50.00,
            observacoes: 'Resíduo misturado, taxa adicional aplicada'
          },
          {
            id: '4',
            cliente: {
              id: '4',
              razaoSocial: 'Incorporadora XYZ S.A.',
              tipo: 'PJ'
            },
            cacamba: {
              id: '4',
              numero: '004'
            },
            dataInicio: '2025-06-03T09:45:00.000Z',
            dataFimPrevista: '2025-06-10T09:45:00.000Z',
            enderecoEntrega: 'Av. Paulista, 1000, Bela Vista',
            status: 'AGENDADA',
            valor: 500.00,
            tipoResiduo: 'MADEIRA'
          }
        ];

        setLocacoes(locacoesSimuladas);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar locações:', error);
        setLoading(false);
      }
    };

    fetchLocacoes();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroStatus(e.target.value);
  };

  const locacoesFiltradas = filtroStatus 
    ? locacoes.filter(locacao => locacao.status === filtroStatus)
    : locacoes;

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'bg-yellow-100 text-yellow-800';
      case 'EM_ANDAMENTO':
        return 'bg-blue-100 text-blue-800';
      case 'FINALIZADA':
        return 'bg-green-100 text-green-800';
      case 'CANCELADA':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'AGENDADA':
        return 'Agendada';
      case 'EM_ANDAMENTO':
        return 'Em Andamento';
      case 'FINALIZADA':
        return 'Finalizada';
      case 'CANCELADA':
        return 'Cancelada';
      default:
        return status;
    }
  };

  const getTipoResiduoText = (tipo: string) => {
    switch (tipo) {
      case 'CLASSE_A':
        return 'Classe A';
      case 'MADEIRA':
        return 'Madeira';
      case 'MISTO':
        return 'Misto';
      case 'OUTROS':
        return 'Outros';
      default:
        return tipo;
    }
  };

  const formatarValor = (valor: number) => {
    return valor.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatarData = (data: string) => {
    return new Date(data).toLocaleDateString('pt-BR');
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Locações</h1>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Nova Locação
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <label htmlFor="filtroStatus" className="mr-2 font-medium">Filtrar por Status:</label>
          <select
            id="filtroStatus"
            value={filtroStatus}
            onChange={handleFiltroChange}
            className="border rounded-md p-2"
          >
            <option value="">Todos</option>
            <option value="AGENDADA">Agendada</option>
            <option value="EM_ANDAMENTO">Em Andamento</option>
            <option value="FINALIZADA">Finalizada</option>
            <option value="CANCELADA">Cancelada</option>
          </select>
        </div>
      </div>

      {/* Lista de Locações */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Caçamba</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Período</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Valor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {locacoesFiltradas.map((locacao) => (
              <tr key={locacao.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{locacao.cacamba.numero}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {locacao.cliente.nomeCompleto || locacao.cliente.razaoSocial}
                  <span className="block text-xs text-gray-500">
                    {locacao.cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{locacao.enderecoEntrega}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatarData(locacao.dataInicio)} a {formatarData(locacao.dataFimPrevista)}
                  {locacao.dataFimReal && (
                    <span className="block text-xs text-gray-500">
                      Finalizada em: {formatarData(locacao.dataFimReal)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(locacao.status)}`}>
                    {getStatusText(locacao.status)}
                  </span>
                  <span className="block text-xs text-gray-500 mt-1">
                    {getTipoResiduoText(locacao.tipoResiduo)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {formatarValor(locacao.valor)}
                  {locacao.taxaAdicional && (
                    <span className="block text-xs text-gray-500">
                      + Taxa: {formatarValor(locacao.taxaAdicional)}
                    </span>
                  )}
                  {locacao.diasExtras && locacao.valorDiaExtra && (
                    <span className="block text-xs text-gray-500">
                      + {locacao.diasExtras} dias extras: {formatarValor(locacao.diasExtras * locacao.valorDiaExtra)}
                    </span>
                  )}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                  {locacao.status === 'EM_ANDAMENTO' && (
                    <button className="text-green-600 hover:text-green-900">Agendar Retirada</button>
                  )}
                  {locacao.status === 'AGENDADA' && (
                    <button className="text-red-600 hover:text-red-900">Cancelar</button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Locação seria implementado aqui */}
    </div>
  );
};

export default Locacoes;
