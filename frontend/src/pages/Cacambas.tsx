import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cacamba {
  id: string;
  numero: string;
  status: 'DISPONIVEL' | 'EM_USO' | 'EM_MANUTENCAO';
  localizacaoAtual: string;
  dataUltimaMovimentacao: string;
  observacoes?: string;
}

const Cacambas: React.FC = () => {
  const [cacambas, setCacambas] = useState<Cacamba[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroStatus, setFiltroStatus] = useState<string>('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novaCacamba, setNovaCacamba] = useState({
    numero: '',
    status: 'DISPONIVEL',
    localizacaoAtual: 'Pátio',
    observacoes: ''
  });

  useEffect(() => {
    const fetchCacambas = async () => {
      try {
        // Em um ambiente real, esta seria uma chamada real à API
        // Simulando dados para o protótipo
        const cacambasSimuladas: Cacamba[] = [
          {
            id: '1',
            numero: '001',
            status: 'DISPONIVEL',
            localizacaoAtual: 'Pátio',
            dataUltimaMovimentacao: '2025-06-01T10:00:00.000Z'
          },
          {
            id: '2',
            numero: '002',
            status: 'EM_USO',
            localizacaoAtual: 'Rua das Flores, 123',
            dataUltimaMovimentacao: '2025-06-02T14:30:00.000Z'
          },
          {
            id: '3',
            numero: '003',
            status: 'EM_MANUTENCAO',
            localizacaoAtual: 'Oficina',
            dataUltimaMovimentacao: '2025-06-01T08:15:00.000Z',
            observacoes: 'Reparo na lateral'
          },
          {
            id: '4',
            numero: '004',
            status: 'EM_USO',
            localizacaoAtual: 'Av. Principal, 500',
            dataUltimaMovimentacao: '2025-06-03T09:45:00.000Z'
          },
          {
            id: '5',
            numero: '005',
            status: 'DISPONIVEL',
            localizacaoAtual: 'Pátio',
            dataUltimaMovimentacao: '2025-06-02T16:20:00.000Z'
          }
        ];

        setCacambas(cacambasSimuladas);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar caçambas:', error);
        setLoading(false);
      }
    };

    fetchCacambas();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroStatus(e.target.value);
  };

  const cacambasFiltradas = filtroStatus 
    ? cacambas.filter(cacamba => cacamba.status === filtroStatus)
    : cacambas;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovaCacamba({
      ...novaCacamba,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em um ambiente real, aqui seria feita a chamada à API para criar a caçamba
    console.log('Nova caçamba:', novaCacamba);
    
    // Simulando adição da nova caçamba
    const novaCacambaSimulada: Cacamba = {
      id: `${cacambas.length + 1}`,
      numero: novaCacamba.numero,
      status: novaCacamba.status as 'DISPONIVEL' | 'EM_USO' | 'EM_MANUTENCAO',
      localizacaoAtual: novaCacamba.localizacaoAtual,
      dataUltimaMovimentacao: new Date().toISOString(),
      observacoes: novaCacamba.observacoes
    };
    
    setCacambas([...cacambas, novaCacambaSimulada]);
    setModalAberto(false);
    setNovaCacamba({
      numero: '',
      status: 'DISPONIVEL',
      localizacaoAtual: 'Pátio',
      observacoes: ''
    });
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'bg-green-100 text-green-800';
      case 'EM_USO':
        return 'bg-blue-100 text-blue-800';
      case 'EM_MANUTENCAO':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'DISPONIVEL':
        return 'Disponível';
      case 'EM_USO':
        return 'Em Uso';
      case 'EM_MANUTENCAO':
        return 'Em Manutenção';
      default:
        return status;
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Caçambas</h1>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Nova Caçamba
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
            <option value="DISPONIVEL">Disponível</option>
            <option value="EM_USO">Em Uso</option>
            <option value="EM_MANUTENCAO">Em Manutenção</option>
          </select>
        </div>
      </div>

      {/* Lista de Caçambas */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Número</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Localização Atual</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Última Movimentação</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {cacambasFiltradas.map((cacamba) => (
              <tr key={cacamba.id}>
                <td className="px-6 py-4 whitespace-nowrap font-medium">{cacamba.numero}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(cacamba.status)}`}>
                    {getStatusText(cacamba.status)}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cacamba.localizacaoAtual}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {new Date(cacamba.dataUltimaMovimentacao).toLocaleDateString('pt-BR')}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                  <button className="text-green-600 hover:text-green-900 mr-3">Editar</button>
                  <button className="text-red-600 hover:text-red-900">Excluir</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Nova Caçamba */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">Nova Caçamba</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="numero" className="block text-sm font-medium text-gray-700 mb-1">
                  Número
                </label>
                <input
                  type="text"
                  id="numero"
                  name="numero"
                  value={novaCacamba.numero}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  name="status"
                  value={novaCacamba.status}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="DISPONIVEL">Disponível</option>
                  <option value="EM_USO">Em Uso</option>
                  <option value="EM_MANUTENCAO">Em Manutenção</option>
                </select>
              </div>
              <div className="mb-4">
                <label htmlFor="localizacaoAtual" className="block text-sm font-medium text-gray-700 mb-1">
                  Localização Atual
                </label>
                <input
                  type="text"
                  id="localizacaoAtual"
                  name="localizacaoAtual"
                  value={novaCacamba.localizacaoAtual}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              <div className="mb-4">
                <label htmlFor="observacoes" className="block text-sm font-medium text-gray-700 mb-1">
                  Observações
                </label>
                <textarea
                  id="observacoes"
                  name="observacoes"
                  value={novaCacamba.observacoes}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  rows={3}
                />
              </div>
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={() => setModalAberto(false)}
                  className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
                >
                  Salvar
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cacambas;
