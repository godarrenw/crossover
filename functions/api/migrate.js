// 数据库迁移API
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

    console.log('开始数据库迁移...');

    // 检查是否已有 investment_income 字段
    let hasInvestmentIncomeField = false;
    try {
      await DB.prepare('SELECT investment_income FROM financial_data LIMIT 1').first();
      hasInvestmentIncomeField = true;
      console.log('investment_income 字段已存在');
    } catch (error) {
      console.log('investment_income 字段不存在，需要添加');
    }

    if (!hasInvestmentIncomeField) {
      // 添加 investment_income 字段
      await DB.prepare(`
        ALTER TABLE financial_data ADD COLUMN investment_income REAL NOT NULL DEFAULT 0
      `).run();
      console.log('成功添加 investment_income 字段');

      // 更新现有数据的投资收入
      const investmentData = [
        ['2024-08', 0.00],
        ['2024-09', 0.00],
        ['2024-10', 0.00],
        ['2024-11', 9278.17],
        ['2024-12', -11999.75],
        ['2025-01', 7542.26],
        ['2025-02', -690.37],
        ['2025-03', -15569.97],
        ['2025-04', -15760.14],
        ['2025-05', 12250.89],
        ['2025-06', 4159.86],
        ['2025-07', 16693.96],
        ['2025-08', -6354.37]
      ];

      for (const [yearMonth, investmentIncome] of investmentData) {
        try {
          await DB.prepare(`
            UPDATE financial_data 
            SET investment_income = ? 
            WHERE year_month = ?
          `).bind(investmentIncome, yearMonth).run();
          console.log(`更新 ${yearMonth} 的投资收入: ${investmentIncome}`);
        } catch (updateError) {
          console.log(`跳过不存在的记录: ${yearMonth}`);
        }
      }
    }

    // 验证迁移结果
    const { results } = await DB.prepare(`
      SELECT year_month, investment_income 
      FROM financial_data 
      ORDER BY year_month ASC
    `).all();

    return new Response(JSON.stringify({ 
      success: true, 
      message: hasInvestmentIncomeField ? 
        '数据库已是最新版本，无需迁移' : 
        '数据库迁移完成，已添加投资收入字段并更新数据',
      migrated_records: results.length,
      sample_data: results.slice(0, 3)
    }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('数据库迁移失败:', error);
    return new Response(JSON.stringify({ 
      error: '数据库迁移失败: ' + error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
