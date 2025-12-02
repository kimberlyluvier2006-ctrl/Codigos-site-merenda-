-- Views úteis para relatórios e consultas do sistema Merenda+

USE merenda_plus;

-- View para itens próximos ao vencimento
CREATE VIEW items_expiring_soon AS
SELECT 
    i.id,
    i.name,
    i.quantity,
    i.expiry_date,
    c.name as category_name,
    DATEDIFF(i.expiry_date, CURDATE()) as days_until_expiry,
    u.name as created_by_name
FROM inventory_items i
JOIN categories c ON i.category_id = c.id
LEFT JOIN users u ON i.created_by = u.id
WHERE i.status = 'available' 
AND i.expiry_date <= DATE_ADD(CURDATE(), INTERVAL 7 DAY)
ORDER BY i.expiry_date ASC;

-- View para resumo de desperdício por mês
CREATE VIEW monthly_waste_summary AS
SELECT 
    YEAR(waste_date) as year,
    MONTH(waste_date) as month,
    MONTHNAME(waste_date) as month_name,
    COUNT(*) as total_records,
    SUM(quantity) as total_quantity_wasted,
    SUM(estimated_cost) as total_estimated_cost,
    AVG(estimated_cost) as avg_cost_per_record
FROM waste_records
GROUP BY YEAR(waste_date), MONTH(waste_date)
ORDER BY year DESC, month DESC;

-- View para desperdício por categoria
CREATE VIEW waste_by_category AS
SELECT 
    c.name as category_name,
    COUNT(w.id) as waste_records,
    SUM(w.quantity) as total_quantity_wasted,
    SUM(w.estimated_cost) as total_estimated_cost,
    AVG(w.estimated_cost) as avg_cost_per_waste
FROM waste_records w
JOIN inventory_items i ON w.inventory_item_id = i.id
JOIN categories c ON i.category_id = c.id
GROUP BY c.id, c.name
ORDER BY total_estimated_cost DESC;

-- View para desperdício por motivo
CREATE VIEW waste_by_reason AS
SELECT 
    wr.reason,
    COUNT(w.id) as waste_records,
    SUM(w.quantity) as total_quantity_wasted,
    SUM(w.estimated_cost) as total_estimated_cost,
    ROUND((COUNT(w.id) * 100.0 / (SELECT COUNT(*) FROM waste_records)), 2) as percentage_of_total
FROM waste_records w
JOIN waste_reasons wr ON w.reason_id = wr.id
GROUP BY wr.id, wr.reason
ORDER BY waste_records DESC;

-- View para estatísticas de usuários
CREATE VIEW user_statistics AS
SELECT 
    u.id,
    u.name,
    u.email,
    u.type,
    u.status,
    u.created_at,
    u.last_login,
    COUNT(i.id) as items_created,
    COUNT(w.id) as waste_records_created,
    COALESCE(SUM(w.estimated_cost), 0) as total_waste_cost_registered
FROM users u
LEFT JOIN inventory_items i ON u.id = i.created_by
LEFT JOIN waste_records w ON u.id = w.registered_by
GROUP BY u.id, u.name, u.email, u.type, u.status, u.created_at, u.last_login
ORDER BY u.name;

-- View para dashboard principal
CREATE VIEW dashboard_summary AS
SELECT 
    (SELECT COUNT(*) FROM inventory_items WHERE status = 'available') as total_active_items,
    (SELECT SUM(quantity) FROM inventory_items WHERE status = 'available') as total_stock_quantity,
    (SELECT COUNT(*) FROM items_expiring_soon) as items_expiring_soon,
    (SELECT COUNT(*) FROM waste_records WHERE waste_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as waste_records_last_30_days,
    (SELECT SUM(quantity) FROM waste_records WHERE waste_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as total_waste_last_30_days,
    (SELECT SUM(estimated_cost) FROM waste_records WHERE waste_date >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)) as total_waste_cost_last_30_days,
    (SELECT COUNT(*) FROM users WHERE status = 'active') as active_users;
