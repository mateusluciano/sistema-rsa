import React, { useState, useEffect } from 'react';
import axios from 'axios';

interface Cliente {
  id: string;
  tipo: 'PF' | 'PJ';
  documento: string;
  nomeCompleto?: string;
  razaoSocial?: string;
  telefone: string;
  email?: string;
  cep: string;
  enderecoCompleto: string;
  referencia?: string;
  metodoPagamento: string;
  contatoNome?: string;
  contatoTelefone?: string;
  contatoEmail?: string;
  enderecoEntrega?: string;
}

const Clientes: React.FC = () => {
  const [clientes, setClientes] = useState<Cliente[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroTipo, setFiltroTipo] = useState<string>('');
  const [modalAberto, setModalAberto] = useState(false);
  const [novoCliente, setNovoCliente] = useState({
    tipo: 'PF',
    documento: '',
    nomeCompleto: '',
    razaoSocial: '',
    telefone: '',
    email: '',
    cep: '',
    enderecoCompleto: '',
    referencia: '',
    metodoPagamento: 'Dinheiro',
    contatoNome: '',
    contatoTelefone: '',
    contatoEmail: '',
    enderecoEntrega: ''
  });

  useEffect(() => {
    const fetchClientes = async () => {
      try {
        // Em um ambiente real, esta seria uma chamada real à API
        // Simulando dados para o protótipo
        const clientesSimulados: Cliente[] = [
          {
            id: '1',
            tipo: 'PF',
            documento: '123.456.789-00',
            nomeCompleto: 'João Silva',
            telefone: '(11) 98765-4321',
            email: 'joao.silva@email.com',
            cep: '01234-567',
            enderecoCompleto: 'Rua das Flores, 123, Centro',
            referencia: 'Próximo ao mercado',
            metodoPagamento: 'PIX'
          },
          {
            id: '2',
            tipo: 'PJ',
            documento: '12.345.678/0001-90',
            razaoSocial: 'Construções ABC Ltda',
            telefone: '(11) 3456-7890',
            email: 'contato@construcoesabc.com',
            cep: '04567-890',
            enderecoCompleto: 'Av. Industrial, 500, Distrito Industrial',
            metodoPagamento: 'Boleto',
            contatoNome: 'Carlos Ferreira',
            contatoTelefone: '(11) 98765-0987',
            contatoEmail: 'carlos@construcoesabc.com',
            enderecoEntrega: 'Rua Lateral, 100, Zona Sul'
          },
          {
            id: '3',
            tipo: 'PF',
            documento: '987.654.321-00',
            nomeCompleto: 'Maria Oliveira',
            telefone: '(11) 91234-5678',
            cep: '05678-901',
            enderecoCompleto: 'Rua dos Pinheiros, 45, Jardim Europa',
            metodoPagamento: 'Cartão'
          },
          {
            id: '4',
            tipo: 'PJ',
            documento: '98.765.432/0001-10',
            razaoSocial: 'Incorporadora XYZ S.A.',
            telefone: '(11) 2345-6789',
            email: 'contato@xyzincorporadora.com',
            cep: '06789-012',
            enderecoCompleto: 'Av. Paulista, 1000, Bela Vista',
            metodoPagamento: 'Transferência',
            contatoNome: 'Ana Souza',
            contatoTelefone: '(11) 97654-3210'
          }
        ];

        setClientes(clientesSimulados);
        setLoading(false);
      } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  const handleFiltroChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFiltroTipo(e.target.value);
  };

  const clientesFiltrados = filtroTipo 
    ? clientes.filter(cliente => cliente.tipo === filtroTipo)
    : clientes;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setNovoCliente({
      ...novoCliente,
      [name]: value
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Em um ambiente real, aqui seria feita a chamada à API para criar o cliente
    console.log('Novo cliente:', novoCliente);
    
    // Simulando adição do novo cliente
    const novoClienteSimulado: Cliente = {
      id: `${clientes.length + 1}`,
      tipo: novoCliente.tipo as 'PF' | 'PJ',
      documento: novoCliente.documento,
      nomeCompleto: novoCliente.tipo === 'PF' ? novoCliente.nomeCompleto : undefined,
      razaoSocial: novoCliente.tipo === 'PJ' ? novoCliente.razaoSocial : undefined,
      telefone: novoCliente.telefone,
      email: novoCliente.email || undefined,
      cep: novoCliente.cep,
      enderecoCompleto: novoCliente.enderecoCompleto,
      referencia: novoCliente.referencia || undefined,
      metodoPagamento: novoCliente.metodoPagamento,
      contatoNome: novoCliente.tipo === 'PJ' ? novoCliente.contatoNome : undefined,
      contatoTelefone: novoCliente.tipo === 'PJ' ? novoCliente.contatoTelefone : undefined,
      contatoEmail: novoCliente.tipo === 'PJ' ? novoCliente.contatoEmail : undefined,
      enderecoEntrega: novoCliente.tipo === 'PJ' ? novoCliente.enderecoEntrega : undefined
    };
    
    setClientes([...clientes, novoClienteSimulado]);
    setModalAberto(false);
    setNovoCliente({
      tipo: 'PF',
      documento: '',
      nomeCompleto: '',
      razaoSocial: '',
      telefone: '',
      email: '',
      cep: '',
      enderecoCompleto: '',
      referencia: '',
      metodoPagamento: 'Dinheiro',
      contatoNome: '',
      contatoTelefone: '',
      contatoEmail: '',
      enderecoEntrega: ''
    });
  };

  if (loading) {
    return <div className="flex justify-center items-center h-64">Carregando...</div>;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Gestão de Clientes</h1>
        <button 
          onClick={() => setModalAberto(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md"
        >
          Novo Cliente
        </button>
      </div>

      {/* Filtros */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex items-center">
          <label htmlFor="filtroTipo" className="mr-2 font-medium">Filtrar por Tipo:</label>
          <select
            id="filtroTipo"
            value={filtroTipo}
            onChange={handleFiltroChange}
            className="border rounded-md p-2"
          >
            <option value="">Todos</option>
            <option value="PF">Pessoa Física</option>
            <option value="PJ">Pessoa Jurídica</option>
          </select>
        </div>
      </div>

      {/* Lista de Clientes */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tipo</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Documento</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nome/Razão Social</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Telefone</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Endereço</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ações</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {clientesFiltrados.map((cliente) => (
              <tr key={cliente.id}>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className={`px-2 py-1 rounded-full text-xs ${cliente.tipo === 'PF' ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}`}>
                    {cliente.tipo === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.documento}</td>
                <td className="px-6 py-4 whitespace-nowrap font-medium">
                  {cliente.nomeCompleto || cliente.razaoSocial}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.telefone}</td>
                <td className="px-6 py-4 whitespace-nowrap">{cliente.enderecoCompleto}</td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <button className="text-blue-600 hover:text-blue-900 mr-3">Detalhes</button>
                  <button className="text-green-600 hover:text-green-900 mr-3">Editar</button>
                  <button className="text-indigo-600 hover:text-indigo-900">Nova Locação</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Novo Cliente */}
      {modalAberto && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-screen overflow-y-auto">
            <h2 className="text-xl font-bold mb-4">Novo Cliente</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="tipo" className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Cliente
                </label>
                <select
                  id="tipo"
                  name="tipo"
                  value={novoCliente.tipo}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                >
                  <option value="PF">Pessoa Física</option>
                  <option value="PJ">Pessoa Jurídica</option>
                </select>
              </div>
              
              <div className="mb-4">
                <label htmlFor="documento" className="block text-sm font-medium text-gray-700 mb-1">
                  {novoCliente.tipo === 'PF' ? 'CPF' : 'CNPJ'}
                </label>
                <input
                  type="text"
                  id="documento"
                  name="documento"
                  value={novoCliente.documento}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              
              {novoCliente.tipo === 'PF' ? (
                <div className="mb-4">
                  <label htmlFor="nomeCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                    Nome Completo
                  </label>
                  <input
                    type="text"
                    id="nomeCompleto"
                    name="nomeCompleto"
                    value={novoCliente.nomeCompleto}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
              ) : (
                <div className="mb-4">
                  <label htmlFor="razaoSocial" className="block text-sm font-medium text-gray-700 mb-1">
                    Razão Social
                  </label>
                  <input
                    type="text"
                    id="razaoSocial"
                    name="razaoSocial"
                    value={novoCliente.razaoSocial}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
              )}
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="telefone" className="block text-sm font-medium text-gray-700 mb-1">
                    Telefone
                  </label>
                  <input
                    type="text"
                    id="telefone"
                    name="telefone"
                    value={novoCliente.telefone}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={novoCliente.email}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  />
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="mb-4">
                  <label htmlFor="cep" className="block text-sm font-medium text-gray-700 mb-1">
                    CEP
                  </label>
                  <input
                    type="text"
                    id="cep"
                    name="cep"
                    value={novoCliente.cep}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                    required
                  />
                </div>
                
                <div className="mb-4">
                  <label htmlFor="metodoPagamento" className="block text-sm font-medium text-gray-700 mb-1">
                    Método de Pagamento
                  </label>
                  <select
                    id="metodoPagamento"
                    name="metodoPagamento"
                    value={novoCliente.metodoPagamento}
                    onChange={handleInputChange}
                    className="w-full border rounded-md p-2"
                  >
                    <option value="Dinheiro">Dinheiro</option>
                    <option value="Cartão">Cartão</option>
                    <option value="PIX">PIX</option>
                    <option value="Boleto">Boleto</option>
                    <option value="Transferência">Transferência</option>
                  </select>
                </div>
              </div>
              
              <div className="mb-4">
                <label htmlFor="enderecoCompleto" className="block text-sm font-medium text-gray-700 mb-1">
                  Endereço Completo
                </label>
                <input
                  type="text"
                  id="enderecoCompleto"
                  name="enderecoCompleto"
                  value={novoCliente.enderecoCompleto}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                  required
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="referencia" className="block text-sm font-medium text-gray-700 mb-1">
                  Referência
                </label>
                <input
                  type="text"
                  id="referencia"
                  name="referencia"
                  value={novoCliente.referencia}
                  onChange={handleInputChange}
                  className="w-full border rounded-md p-2"
                />
              </div>
              
              {novoCliente.tipo === 'PJ' && (
                <>
                  <h3 className="text-lg font-medium mb-3 border-t pt-3">Informações de Contato</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="mb-4">
                      <label htmlFor="contatoNome" className="block text-sm font-medium text-gray-700 mb-1">
                        Nome do Contato
                      </label>
                      <input
                        type="text"
                        id="contatoNome"
                        name="contatoNome"
                        value={novoCliente.contatoNome}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                    
                    <div className="mb-4">
                      <label htmlFor="contatoTelefone" className="block text-sm font-medium text-gray-700 mb-1">
                        Telefone do Contato
                      </label>
                      <input
                        type="text"
                        id="contatoTelefone"
                        name="contatoTelefone"
                        value={novoCliente.contatoTelefone}
                        onChange={handleInputChange}
                        className="w-full border rounded-md p-2"
                      />
                    </div>
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="contatoEmail" className="block text-sm font-medium text-gray-700 mb-1">
                      Email do Contato
                    </label>
                    <input
                      type="email"
                      id="contatoEmail"
                      name="contatoEmail"
                      value={novoCliente.contatoEmail}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                  
                  <div className="mb-4">
                    <label htmlFor="enderecoEntrega" className="block text-sm font-medium text-gray-700 mb-1">
                      Endereço de Entrega (se diferente)
                    </label>
                    <input
                      type="text"
                      id="enderecoEntrega"
                      name="enderecoEntrega"
                      value={novoCliente.enderecoEntrega}
                      onChange={handleInputChange}
                      className="w-full border rounded-md p-2"
                    />
                  </div>
                </>
              )}
              
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

export default Clientes;
