-- 数据库迁移脚本：添加 investment_income 字段
-- 如果字段不存在则添加

-- 检查并添加 investment_income 字段
ALTER TABLE financial_data ADD COLUMN investment_income REAL NOT NULL DEFAULT 0;

-- 更新现有数据的投资收入（基于您提供的真实数据）
UPDATE financial_data SET investment_income = 0.00 WHERE year_month = '2024-08';
UPDATE financial_data SET investment_income = 0.00 WHERE year_month = '2024-09';
UPDATE financial_data SET investment_income = 0.00 WHERE year_month = '2024-10';
UPDATE financial_data SET investment_income = 9278.17 WHERE year_month = '2024-11';
UPDATE financial_data SET investment_income = -11999.75 WHERE year_month = '2024-12';
UPDATE financial_data SET investment_income = 7542.26 WHERE year_month = '2025-01';
UPDATE financial_data SET investment_income = -690.37 WHERE year_month = '2025-02';
UPDATE financial_data SET investment_income = -15569.97 WHERE year_month = '2025-03';
UPDATE financial_data SET investment_income = -15760.14 WHERE year_month = '2025-04';
UPDATE financial_data SET investment_income = 12250.89 WHERE year_month = '2025-05';
UPDATE financial_data SET investment_income = 4159.86 WHERE year_month = '2025-06';
UPDATE financial_data SET investment_income = 16693.96 WHERE year_month = '2025-07';
UPDATE financial_data SET investment_income = -6354.37 WHERE year_month = '2025-08';
