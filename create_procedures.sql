-- Stored procedures úteis para o sistema Merenda+

USE merenda_plus;

DELIMITER //

-- Procedure para registrar desperdício
CREATE PROCEDURE RegisterWaste(
    IN p_inventory_item_id INT,
    IN p_quantity INT,
    IN p_reason_id INT,
    IN p_custom_reason TEXT,
    IN p_registered_by INT,
    IN p_notes TEXT
)
BEGIN
    DECLARE v_item_name VARCHAR(255);
    DECLARE v_cost_per_unit DECIMAL(10,2);
    DECLARE v_estimated_cost DECIMAL(10,2);
    DECLARE v_current_quantity INT;
    
    -- Buscar informações do item
    SELECT name, cost_per_unit, quantity 
    INTO v_item_name, v_cost_per_unit, v_current_quantity
    FROM inventory_items 
    WHERE id = p_inventory_item_id;
    
    -- Calcular custo estimado
    SET v_estimated_cost = p_quantity * COALESCE(v_cost_per_unit, 0);
    
    -- Verificar se há quantidade suficiente
    IF v_current_quantity >= p_quantity THEN
        -- Inserir registro de desperdício
        INSERT INTO waste_records (
            inventory_item_id, 
            item_name, 
            quantity, 
            reason_id, 
            custom_reason,
            waste_date, 
            registered_by, 
            notes,
            estimated_cost
        ) VALUES (
            p_inventory_item_id,
            v_item_name,
            p_quantity,
            p_reason_id,
            p_custom_reason,
            CURDATE(),
            p_registered_by,
            p_notes,
            v_estimated_cost
        );
        
        -- Atualizar quantidade no estoque
        UPDATE inventory_items 
        SET quantity = quantity - p_quantity,
            updated_at = CURRENT_TIMESTAMP
        WHERE id = p_inventory_item_id;
        
        -- Log da atividade
        INSERT INTO activity_logs (user_id, action, table_name, record_id, new_values)
        VALUES (p_registered_by, 'WASTE_REGISTERED', 'waste_records', LAST_INSERT_ID(), 
                JSON_OBJECT('item_id', p_inventory_item_id, 'quantity', p_quantity, 'cost', v_estimated_cost));
                
    ELSE
        SIGNAL SQLSTATE '45000' SET MESSAGE_TEXT = 'Quantidade insuficiente no estoque';
    END IF;
END //

-- Procedure para adicionar item ao estoque
CREATE PROCEDURE AddInventoryItem(
    IN p_name VARCHAR(255),
    IN p_category_id INT,
    IN p_quantity INT,
    IN p_unit VARCHAR(50),
    IN p_expiry_date DATE,
    IN p_purchase_date DATE,
    IN p_supplier VARCHAR(255),
    IN p_cost_per_unit DECIMAL(10,2),
    IN p_created_by INT
)
BEGIN
    DECLARE v_total_cost DECIMAL(10,2);
    
    SET v_total_cost = p_quantity * COALESCE(p_cost_per_unit, 0);
    
    INSERT INTO inventory_items (
        name, category_id, quantity, unit, expiry_date, 
        purchase_date, supplier, cost_per_unit, total_cost, created_by
    ) VALUES (
        p_name, p_category_id, p_quantity, p_unit, p_expiry_date,
        p_purchase_date, p_supplier, p_cost_per_unit, v_total_cost, p_created_by
    );
    
    -- Log da atividade
    INSERT INTO activity_logs (user_id, action, table_name, record_id, new_values)
    VALUES (p_created_by, 'ITEM_ADDED', 'inventory_items', LAST_INSERT_ID(),
            JSON_OBJECT('name', p_name, 'quantity', p_quantity, 'cost', v_total_cost));
END //

-- Procedure para gerar relatório de desperdício por período
CREATE PROCEDURE GetWasteReport(
    IN p_start_date DATE,
    IN p_end_date DATE,
    IN p_category_id INT
)
BEGIN
    SELECT 
        w.id,
        w.item_name,
        w.quantity,
        wr.reason,
        w.custom_reason,
        w.waste_date,
        u.name as registered_by_name,
        w.estimated_cost,
        c.name as category_name
    FROM waste_records w
    JOIN waste_reasons wr ON w.reason_id = wr.id
    JOIN users u ON w.registered_by = u.id
    JOIN inventory_items i ON w.inventory_item_id = i.id
    JOIN categories c ON i.category_id = c.id
    WHERE w.waste_date BETWEEN p_start_date AND p_end_date
    AND (p_category_id IS NULL OR i.category_id = p_category_id)
    ORDER BY w.waste_date DESC, w.created_at DESC;
END //

DELIMITER ;
