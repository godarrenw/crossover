-- 财务自由挂图系统数据库架构
-- 创建时间: 2024

-- 财务数据表
CREATE TABLE IF NOT EXISTS financial_data (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    year_month TEXT NOT NULL UNIQUE,  -- 年月格式: 2024-08
    total_income REAL NOT NULL DEFAULT 0,     -- 总收入
    total_expense REAL NOT NULL DEFAULT 0,    -- 总支出
    total_capital REAL NOT NULL DEFAULT 0,    -- 累计资本（真实资产总额）
    investment_income REAL NOT NULL DEFAULT 0, -- 真实投资收益
    interest_rate REAL NOT NULL DEFAULT 4.0,  -- 长期利率(%)
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_financial_data_year_month ON financial_data(year_month);
CREATE INDEX IF NOT EXISTS idx_financial_data_created_at ON financial_data(created_at);

-- 创建更新时间触发器
CREATE TRIGGER IF NOT EXISTS update_financial_data_updated_at 
AFTER UPDATE ON financial_data
BEGIN
    UPDATE financial_data SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
END;
