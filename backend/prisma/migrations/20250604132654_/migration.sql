-- CreateEnum
CREATE TYPE "StatusCacamba" AS ENUM ('DISPONIVEL', 'EM_USO', 'EM_MANUTENCAO');

-- CreateEnum
CREATE TYPE "TipoCliente" AS ENUM ('PF', 'PJ');

-- CreateEnum
CREATE TYPE "StatusLocacao" AS ENUM ('AGENDADA', 'EM_ANDAMENTO', 'FINALIZADA', 'CANCELADA');

-- CreateEnum
CREATE TYPE "TipoResiduo" AS ENUM ('CLASSE_A', 'MADEIRA', 'MISTO', 'OUTROS');

-- CreateEnum
CREATE TYPE "TipoMovimentacao" AS ENUM ('COLOCACAO', 'RETIRADA', 'TROCA', 'MOVIMENTACAO_INTERNA');

-- CreateEnum
CREATE TYPE "TipoUsuario" AS ENUM ('ADMINISTRADOR', 'GERENTE', 'OPERACIONAL');

-- CreateTable
CREATE TABLE "Cacamba" (
    "id" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "status" "StatusCacamba" NOT NULL DEFAULT 'DISPONIVEL',
    "localizacaoAtual" TEXT NOT NULL,
    "dataUltimaMovimentacao" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cacamba_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Cliente" (
    "id" TEXT NOT NULL,
    "tipo" "TipoCliente" NOT NULL,
    "documento" TEXT NOT NULL,
    "nomeCompleto" TEXT,
    "razaoSocial" TEXT,
    "telefone" TEXT NOT NULL,
    "email" TEXT,
    "cep" TEXT NOT NULL,
    "enderecoCompleto" TEXT NOT NULL,
    "referencia" TEXT,
    "metodoPagamento" TEXT NOT NULL,
    "contatoNome" TEXT,
    "contatoTelefone" TEXT,
    "contatoEmail" TEXT,
    "enderecoEntrega" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cliente_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Locacao" (
    "id" TEXT NOT NULL,
    "clienteId" TEXT NOT NULL,
    "cacambaId" TEXT NOT NULL,
    "dataInicio" TIMESTAMP(3) NOT NULL,
    "dataFimPrevista" TIMESTAMP(3) NOT NULL,
    "dataFimReal" TIMESTAMP(3),
    "enderecoEntrega" TEXT NOT NULL,
    "status" "StatusLocacao" NOT NULL DEFAULT 'AGENDADA',
    "valor" DECIMAL(10,2) NOT NULL,
    "tipoResiduo" "TipoResiduo" NOT NULL,
    "taxaAdicional" DECIMAL(10,2),
    "diasExtras" INTEGER,
    "valorDiaExtra" DECIMAL(10,2),
    "contaAzulVendaId" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Locacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Movimentacao" (
    "id" TEXT NOT NULL,
    "cacambaId" TEXT NOT NULL,
    "locacaoId" TEXT,
    "tipo" "TipoMovimentacao" NOT NULL,
    "dataHora" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "origem" TEXT NOT NULL,
    "destino" TEXT NOT NULL,
    "motorista" TEXT NOT NULL,
    "destinadoraId" TEXT,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "registradoPorId" TEXT,

    CONSTRAINT "Movimentacao_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Destinadora" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "tiposResiduosAceitos" "TipoResiduo"[],
    "endereco" TEXT NOT NULL,
    "contato" TEXT NOT NULL,
    "observacoes" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Destinadora_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Certificado" (
    "id" TEXT NOT NULL,
    "destinadoraId" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "arquivo" TEXT NOT NULL,
    "dataEmissao" TIMESTAMP(3) NOT NULL,
    "dataValidade" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Certificado_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Usuario" (
    "id" TEXT NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "senha" TEXT NOT NULL,
    "tipo" "TipoUsuario" NOT NULL DEFAULT 'OPERACIONAL',
    "ativo" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Usuario_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Cacamba_numero_key" ON "Cacamba"("numero");

-- CreateIndex
CREATE UNIQUE INDEX "Cliente_documento_key" ON "Cliente"("documento");

-- CreateIndex
CREATE UNIQUE INDEX "Usuario_email_key" ON "Usuario"("email");

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_clienteId_fkey" FOREIGN KEY ("clienteId") REFERENCES "Cliente"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Locacao" ADD CONSTRAINT "Locacao_cacambaId_fkey" FOREIGN KEY ("cacambaId") REFERENCES "Cacamba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_cacambaId_fkey" FOREIGN KEY ("cacambaId") REFERENCES "Cacamba"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_locacaoId_fkey" FOREIGN KEY ("locacaoId") REFERENCES "Locacao"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_destinadoraId_fkey" FOREIGN KEY ("destinadoraId") REFERENCES "Destinadora"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Movimentacao" ADD CONSTRAINT "Movimentacao_registradoPorId_fkey" FOREIGN KEY ("registradoPorId") REFERENCES "Usuario"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Certificado" ADD CONSTRAINT "Certificado_destinadoraId_fkey" FOREIGN KEY ("destinadoraId") REFERENCES "Destinadora"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
