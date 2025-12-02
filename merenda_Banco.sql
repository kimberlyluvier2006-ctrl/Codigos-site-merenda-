-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3307
-- Tempo de geração: 02/12/2025 às 17:31
-- Versão do servidor: 10.4.32-MariaDB
-- Versão do PHP: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Banco de dados: `merenda+`
--

DELIMITER $$
--
-- Procedimentos
--
CREATE DEFINER=`root`@`localhost` PROCEDURE `gerar_relatorio_almoxarifado` ()   BEGIN
    DECLARE tipo_desc VARCHAR(255);
    DECLARE almoxarife_nome VARCHAR(255);
    DECLARE total_reg INT;
    DECLARE total_alm INT;
    DECLARE checks INT;
    DECLARE pend INT;

    SELECT COUNT(*) INTO checks FROM itens_entrada;
    SELECT COUNT(*) INTO pend FROM estoque_programa_iti_nutri;

    IF checks > 0 OR pend > 0 THEN
        DROP TABLE IF EXISTS estoque_programa_iti_nutri;
        CREATE TABLE estoque_programa_iti_nutri LIKE itens_entrada;
        INSERT INTO estoque_programa_iti_nutri SELECT * FROM itens_entrada;
    END IF;

    SELECT COUNT(*) INTO total_reg FROM estoque_programa_iti_nutri;

    IF total_reg > 0 THEN
        SELECT almoxarife_definido INTO almoxarife_nome FROM preferencias_programa_iti_nutri;
        SELECT tipo_estoque INTO tipo_desc FROM preferencias_programa_iti_nutri;

        SELECT * FROM estoque_programa_iti_nutri;

        SELECT COUNT(*) INTO total_alm FROM estoque_programa_iti_nutri;

        SELECT CONCAT('ALMOXARIFE: ', almoxarife_nome) AS info;
        SELECT CONCAT('Tipo de Estoque: ', tipo_desc) AS info;
        SELECT CONCAT('Total de Registros: ', total_alm) AS info;

    ELSE
        SELECT 'Erro: Estoque vazio.' AS error_message;
    END IF;
END$$

DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `categorias`
--

CREATE TABLE `categorias` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `config`
--

CREATE TABLE `config` (
  `id` int(11) NOT NULL,
  `chave` varchar(100) NOT NULL,
  `valor` varchar(200) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `desperdicios`
--

CREATE TABLE `desperdicios` (
  `id` int(11) NOT NULL,
  `lote_id` int(11) NOT NULL,
  `quantidade` int(11) NOT NULL,
  `motivo` varchar(200) NOT NULL,
  `responsavel_id` int(11) NOT NULL,
  `data_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Acionadores `desperdicios`
--
DELIMITER $$
CREATE TRIGGER `trg_desperdicio_after_insert` AFTER INSERT ON `desperdicios` FOR EACH ROW BEGIN
    UPDATE lotes
    SET quantidade_atual = quantidade_atual - NEW.quantidade
    WHERE id = NEW.lote_id;
END
$$
DELIMITER ;
DELIMITER $$
CREATE TRIGGER `trg_desperdicio_before_insert` BEFORE INSERT ON `desperdicios` FOR EACH ROW BEGIN
    DECLARE qtdAtual INT;

    -- buscar quantidade atual do lote
    SELECT quantidade_atual INTO qtdAtual FROM lotes WHERE id = NEW.lote_id;

    -- valida quantidade suficiente
    IF NEW.quantidade > qtdAtual THEN
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantidade de desperdício maior do que o disponível no lote';
    END IF;

END
$$
DELIMITER ;

-- --------------------------------------------------------

--
-- Estrutura para tabela `estoque_programa_iti_nutri`
--

CREATE TABLE `estoque_programa_iti_nutri` (
  `id` int(11) NOT NULL,
  `nome_item` varchar(255) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `data_entrada` date DEFAULT NULL,
  `fornecedor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens`
--

CREATE TABLE `itens` (
  `id` int(11) NOT NULL,
  `nome` varchar(200) NOT NULL,
  `categoria_id` int(11) NOT NULL,
  `unidade` varchar(20) NOT NULL,
  `observacoes` text DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `itens_entrada`
--

CREATE TABLE `itens_entrada` (
  `id` int(11) NOT NULL,
  `nome_item` varchar(255) DEFAULT NULL,
  `quantidade` int(11) DEFAULT NULL,
  `data_entrada` date DEFAULT NULL,
  `fornecedor` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `itens_entrada`
--

INSERT INTO `itens_entrada` (`id`, `nome_item`, `quantidade`, `data_entrada`, `fornecedor`) VALUES
(1, 'Arroz Tipo 1', 50, '2025-01-10', 'Fornecedor A'),
(2, 'Feijão Carioca', 30, '2025-01-11', 'Fornecedor B');

-- --------------------------------------------------------

--
-- Estrutura para tabela `lotes`
--

CREATE TABLE `lotes` (
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `data_validade` date NOT NULL,
  `quantidade_total` int(11) NOT NULL,
  `quantidade_atual` int(11) NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `movimentacoes`
--

CREATE TABLE `movimentacoes` (
  `id` int(11) NOT NULL,
  `lote_id` int(11) NOT NULL,
  `tipo` enum('entrada','saida') NOT NULL,
  `quantidade` int(11) NOT NULL,
  `responsavel_id` int(11) NOT NULL,
  `motivo` varchar(200) DEFAULT NULL,
  `data_registro` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Estrutura para tabela `preferencias_programa_iti_nutri`
--

CREATE TABLE `preferencias_programa_iti_nutri` (
  `id` int(11) NOT NULL,
  `almoxarife_definido` varchar(255) DEFAULT NULL,
  `tipo_estoque` varchar(255) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `preferencias_programa_iti_nutri`
--

INSERT INTO `preferencias_programa_iti_nutri` (`id`, `almoxarife_definido`, `tipo_estoque`) VALUES
(1, 'Almoxarife Padrão', 'Geral');

-- --------------------------------------------------------

--
-- Estrutura para tabela `usuarios`
--

CREATE TABLE `usuarios` (
  `id` int(11) NOT NULL,
  `nome` varchar(150) NOT NULL,
  `email` varchar(150) NOT NULL,
  `senha_hash` varchar(255) NOT NULL,
  `tipo` enum('admin','merendeira','visualizador') NOT NULL,
  `criado_em` datetime DEFAULT current_timestamp()
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Despejando dados para a tabela `usuarios`
--

INSERT INTO `usuarios` (`id`, `nome`, `email`, `senha_hash`, `tipo`, `criado_em`) VALUES
(1, 'Admin Geral', 'admin@merenda.com', 'admin123', 'admin', '2025-11-06 23:20:50');

--
-- Índices para tabelas despejadas
--

--
-- Índices de tabela `categorias`
--
ALTER TABLE `categorias`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `config`
--
ALTER TABLE `config`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `desperdicios`
--
ALTER TABLE `desperdicios`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote_id` (`lote_id`),
  ADD KEY `responsavel_id` (`responsavel_id`);

--
-- Índices de tabela `estoque_programa_iti_nutri`
--
ALTER TABLE `estoque_programa_iti_nutri`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `itens`
--
ALTER TABLE `itens`
  ADD PRIMARY KEY (`id`),
  ADD KEY `idx_nome_item` (`nome`),
  ADD KEY `idx_categoria_item` (`categoria_id`);

--
-- Índices de tabela `itens_entrada`
--
ALTER TABLE `itens_entrada`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `lotes`
--
ALTER TABLE `lotes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `item_id` (`item_id`),
  ADD KEY `idx_validade_lote` (`data_validade`);

--
-- Índices de tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD PRIMARY KEY (`id`),
  ADD KEY `lote_id` (`lote_id`),
  ADD KEY `responsavel_id` (`responsavel_id`);

--
-- Índices de tabela `preferencias_programa_iti_nutri`
--
ALTER TABLE `preferencias_programa_iti_nutri`
  ADD PRIMARY KEY (`id`);

--
-- Índices de tabela `usuarios`
--
ALTER TABLE `usuarios`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `email` (`email`);

--
-- AUTO_INCREMENT para tabelas despejadas
--

--
-- AUTO_INCREMENT de tabela `categorias`
--
ALTER TABLE `categorias`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `config`
--
ALTER TABLE `config`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `desperdicios`
--
ALTER TABLE `desperdicios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `estoque_programa_iti_nutri`
--
ALTER TABLE `estoque_programa_iti_nutri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens`
--
ALTER TABLE `itens`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `itens_entrada`
--
ALTER TABLE `itens_entrada`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT de tabela `lotes`
--
ALTER TABLE `lotes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `movimentacoes`
--
ALTER TABLE `movimentacoes`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT de tabela `preferencias_programa_iti_nutri`
--
ALTER TABLE `preferencias_programa_iti_nutri`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT de tabela `usuarios`
--
ALTER TABLE `usuarios`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- Restrições para tabelas despejadas
--

--
-- Restrições para tabelas `desperdicios`
--
ALTER TABLE `desperdicios`
  ADD CONSTRAINT `desperdicios_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `desperdicios_ibfk_2` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;

--
-- Restrições para tabelas `itens`
--
ALTER TABLE `itens`
  ADD CONSTRAINT `itens_ibfk_1` FOREIGN KEY (`categoria_id`) REFERENCES `categorias` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `lotes`
--
ALTER TABLE `lotes`
  ADD CONSTRAINT `lotes_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `itens` (`id`) ON DELETE CASCADE ON UPDATE CASCADE;

--
-- Restrições para tabelas `movimentacoes`
--
ALTER TABLE `movimentacoes`
  ADD CONSTRAINT `movimentacoes_ibfk_1` FOREIGN KEY (`lote_id`) REFERENCES `lotes` (`id`) ON DELETE CASCADE ON UPDATE CASCADE,
  ADD CONSTRAINT `movimentacoes_ibfk_2` FOREIGN KEY (`responsavel_id`) REFERENCES `usuarios` (`id`) ON UPDATE CASCADE;
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
