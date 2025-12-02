-- Inserção de dados iniciais para o sistema Merenda+

USE merenda_plus;

-- Inserir categorias padrão
INSERT INTO categories (name, description) VALUES
('Grãos', 'Arroz, feijão, lentilha, quinoa, etc.'),
('Laticínios', 'Leite, queijo, iogurte, manteiga, etc.'),
('Panificados', 'Pão, biscoitos, bolos, torradas, etc.'),
('Frutas', 'Frutas frescas e processadas'),
('Verduras', 'Folhas verdes e vegetais'),
('Carnes', 'Carnes vermelhas, aves, peixes, etc.'),
('Bebidas', 'Sucos, água, leite, etc.'),
('Condimentos', 'Sal, açúcar, temperos, óleos, etc.'),
('Outros', 'Itens que não se encaixam nas outras categorias');

-- Inserir motivos de desperdício padrão
INSERT INTO waste_reasons (reason, description) VALUES
('Vencimento', 'Item passou da data de validade'),
('Deterioração', 'Item deteriorou antes do vencimento'),
('Contaminação', 'Item foi contaminado por pragas ou outros fatores'),
('Embalagem danificada', 'Embalagem foi danificada comprometendo o produto'),
('Sobra não consumida', 'Sobrou comida que não foi consumida'),
('Erro de preparo', 'Erro durante o preparo da refeição'),
('Outros', 'Outros motivos não listados');

-- Inserir usuário administrador padrão
-- Senha: admin123 (hash MD5 para exemplo - em produção usar bcrypt)
INSERT INTO users (name, email, password_hash, type, status) VALUES
('Administrador do Sistema', 'admin@escola.com', MD5('admin123'), 'admin', 'active');

-- Inserir usuários merendeiras de exemplo
INSERT INTO users (name, email, password_hash, type, status) VALUES
('Maria Silva', 'maria@escola.com', MD5('maria123'), 'merendeira', 'active'),
('João Santos', 'joao@escola.com', MD5('joao123'), 'merendeira', 'active'),
('Ana Costa', 'ana@escola.com', MD5('ana123'), 'merendeira', 'inactive');

-- Inserir itens de estoque de exemplo
INSERT INTO inventory_items (name, category_id, quantity, unit, expiry_date, purchase_date, cost_per_unit, total_cost, created_by) VALUES
('Arroz Branco', 1, 50, 'kg', '2024-12-30', '2024-12-01', 3.50, 175.00, 1),
('Feijão Preto', 1, 30, 'kg', '2024-12-15', '2024-12-01', 4.20, 126.00, 1),
('Leite Integral', 2, 20, 'litros', '2024-12-10', '2024-12-05', 2.80, 56.00, 1),
('Pão Francês', 3, 15, 'unidades', '2024-12-08', '2024-12-07', 0.50, 7.50, 2),
('Banana Prata', 4, 25, 'kg', '2024-12-12', '2024-12-06', 2.30, 57.50, 2),
('Maçã Fuji', 4, 18, 'kg', '2024-12-14', '2024-12-06', 3.80, 68.40, 2);

-- Inserir registros de desperdício de exemplo
INSERT INTO waste_records (inventory_item_id, item_name, quantity, reason_id, waste_date, registered_by, estimated_cost) VALUES
(4, 'Pão Francês', 5, 1, '2024-12-05', 2, 2.50),
(3, 'Leite Integral', 3, 4, '2024-12-04', 2, 8.40),
(5, 'Banana Prata', 8, 2, '2024-12-03', 2, 18.40),
(1, 'Arroz Branco', 2, 3, '2024-12-02', 2, 7.00),
(6, 'Maçã Fuji', 4, 1, '2024-12-01', 2, 15.20);

-- Inserir configurações do sistema
INSERT INTO system_settings (setting_key, setting_value, description) VALUES
('school_name', 'Escola Municipal Exemplo', 'Nome da escola'),
('notification_days_before_expiry', '7', 'Dias antes do vencimento para notificar'),
('max_waste_percentage', '10', 'Percentual máximo de desperdício aceitável'),
('report_email', 'relatorios@escola.com', 'Email para envio de relatórios'),
('system_version', '1.0.0', 'Versão atual do sistema');
