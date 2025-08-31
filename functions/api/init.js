// 数据库初始化API
export async function onRequestPost(context) {
  try {
    const { DB, ADMIN_PASSWORD } = context.env;
    
    // 验证管理员权限
    const adminToken = context.request.headers.get('X-Admin-Token');
    if (!adminToken || adminToken !== ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ error: '无权限访问' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 创建表结构
    await DB.prepare(`
      CREATE TABLE IF NOT EXISTS financial_data (
          id INTEGER PRIMARY KEY AUTOINCREMENT,
          year_month TEXT NOT NULL UNIQUE,
          total_income REAL NOT NULL DEFAULT 0,
          total_expense REAL NOT NULL DEFAULT 0,
          total_capital REAL NOT NULL DEFAULT 0,
          interest_rate REAL NOT NULL DEFAULT 4.0,
          created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
          updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      )
    `).run();

    // 创建索引
    await DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_financial_data_year_month ON financial_data(year_month)
    `).run();

    await DB.prepare(`
      CREATE INDEX IF NOT EXISTS idx_financial_data_created_at ON financial_data(created_at)
    `).run();

    // 创建触发器
    await DB.prepare(`
      CREATE TRIGGER IF NOT EXISTS update_financial_data_updated_at 
      AFTER UPDATE ON financial_data
      BEGIN
          UPDATE financial_data SET updated_at = CURRENT_TIMESTAMP WHERE id = NEW.id;
      END
    `).run();

    // 检查是否已有数据
    const { results } = await DB.prepare('SELECT COUNT(*) as count FROM financial_data').all();
    const hasData = results[0].count > 0;

    if (!hasData) {
      // 插入初始数据
      const initialData = [
        ['2024-08', 10994.64, 3758.68, 0.00, 4.0],
        ['2024-09', 8636.45, 8178.76, 7235.96, 4.0],
        ['2024-10', 14850.23, 8821.50, 14464.33, 4.0],
        ['2024-11', 26108.82, 6600.00, 28493.06, 4.0],
        ['2024-12', 9141.20, 6488.11, 48001.88, 4.0],
        ['2025-01', 24608.17, 3278.48, 50655.01, 4.0],
        ['2025-02', 8342.17, 14964.45, 71984.70, 4.0],
        ['2025-03', 14374.44, 10565.32, 65362.42, 4.0],
        ['2025-04', 17059.36, 14836.63, 69171.54, 4.0],
        ['2025-05', 35879.91, 14181.04, 71394.27, 4.0],
        ['2025-06', 19575.01, 12053.54, 93093.14, 4.0],
        ['2025-07', 15757.19, 8983.79, 100614.61, 4.0],
        ['2025-08', 8507.45, 9101.34, 107388.01, 4.0]
      ];

      for (const [yearMonth, totalIncome, totalExpense, totalCapital, interestRate] of initialData) {
        await DB.prepare(`
          INSERT INTO financial_data (year_month, total_income, total_expense, total_capital, interest_rate) 
          VALUES (?, ?, ?, ?, ?)
        `).bind(yearMonth, totalIncome, totalExpense, totalCapital, interestRate).run();
      }
    }

    return new Response(JSON.stringify({ 
      success: true, 
      message: hasData ? '数据库已初始化（已有数据，跳过种子数据插入）' : '数据库初始化成功，已插入初始数据'
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('数据库初始化失败:', error);
    return new Response(JSON.stringify({ error: '数据库初始化失败: ' + error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
