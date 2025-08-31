// 财务数据API接口
export async function onRequestGet(context) {
  try {
    const { DB, ADMIN_PASSWORD } = context.env;
    
    // 检查是否有管理员权限
    const adminToken = context.request.headers.get('X-Admin-Token');
    const isAdmin = adminToken && adminToken === ADMIN_PASSWORD;
    
    // 首先尝试检查表结构并获取数据
    let results;
    try {
      if (isAdmin) {
        // 管理员可以看到所有数据包括真实资产
        const queryResult = await DB.prepare(`
          SELECT year_month, total_income, total_expense, total_capital, 
                 COALESCE(investment_income, 0) as investment_income, 
                 interest_rate, created_at, updated_at
          FROM financial_data 
          ORDER BY year_month ASC
        `).all();
        results = queryResult.results;
      } else {
        // 普通用户不能看到真实资产数据，但需要看到基于真实资产计算的无风险收入
        const queryResult = await DB.prepare(`
          SELECT year_month, total_income, total_expense, total_capital,
                 COALESCE(investment_income, 0) as investment_income, 
                 interest_rate, created_at, updated_at
          FROM financial_data 
          ORDER BY year_month ASC
        `).all();
        results = queryResult.results.map(row => {
          // 计算无风险收入但隐藏真实资产
          const riskFreeIncome = (row.total_capital * (row.interest_rate / 100)) / 12;
          return {
            ...row,
            total_capital: riskFreeIncome, // 用无风险收入替代真实资产
            risk_free_income: riskFreeIncome // 添加专门的无风险收入字段
          };
        });
      }
    } catch (columnError) {
      console.log('investment_income 字段不存在，使用兼容模式');
      // 如果字段不存在，则使用默认值
      const queryResult = await DB.prepare(`
        SELECT year_month, total_income, total_expense, total_capital, 
               0 as investment_income, 
               interest_rate, created_at, updated_at
        FROM financial_data 
        ORDER BY year_month ASC
      `).all();
      results = queryResult.results;
      
      if (!isAdmin) {
        results = results.map(row => {
          // 计算无风险收入但隐藏真实资产
          const riskFreeIncome = (row.total_capital * (row.interest_rate / 100)) / 12;
          return {
            ...row,
            total_capital: riskFreeIncome, // 用无风险收入替代真实资产
            risk_free_income: riskFreeIncome // 添加专门的无风险收入字段
          };
        });
      }
    }

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('获取财务数据失败:', error);
    return new Response(JSON.stringify({ 
      error: '获取数据失败: ' + error.message,
      details: error.toString()
    }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

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

    const data = await context.request.json();
    const { yearMonth, totalIncome, totalExpense, totalCapital, investmentIncome = 0, interestRate = 4.0 } = data;

    // 验证必填字段
    if (!yearMonth || totalIncome === undefined || totalExpense === undefined || totalCapital === undefined) {
      return new Response(JSON.stringify({ error: '缺少必填字段' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 插入或更新数据
    await DB.prepare(`
      INSERT OR REPLACE INTO financial_data 
      (year_month, total_income, total_expense, total_capital, investment_income, interest_rate) 
      VALUES (?, ?, ?, ?, ?, ?)
    `).bind(yearMonth, totalIncome, totalExpense, totalCapital, investmentIncome, interestRate).run();

    return new Response(JSON.stringify({ success: true, message: '数据保存成功' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('保存财务数据失败:', error);
    return new Response(JSON.stringify({ error: '保存数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestPut(context) {
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

    const data = await context.request.json();
    const { yearMonth, totalIncome, totalExpense, totalCapital, investmentIncome = 0, interestRate = 4.0 } = data;

    // 验证必填字段
    if (!yearMonth) {
      return new Response(JSON.stringify({ error: '缺少年月字段' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 更新数据
    const result = await DB.prepare(`
      UPDATE financial_data 
      SET total_income = ?, total_expense = ?, total_capital = ?, investment_income = ?, interest_rate = ?, updated_at = CURRENT_TIMESTAMP
      WHERE year_month = ?
    `).bind(totalIncome, totalExpense, totalCapital, investmentIncome, interestRate, yearMonth).run();

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: '数据不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: '数据更新成功' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('更新财务数据失败:', error);
    return new Response(JSON.stringify({ error: '更新数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export async function onRequestDelete(context) {
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

    const url = new URL(context.request.url);
    const yearMonth = url.searchParams.get('yearMonth');

    if (!yearMonth) {
      return new Response(JSON.stringify({ error: '缺少年月参数' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // 删除数据
    const result = await DB.prepare(`
      DELETE FROM financial_data WHERE year_month = ?
    `).bind(yearMonth).run();

    if (result.changes === 0) {
      return new Response(JSON.stringify({ error: '数据不存在' }), {
        status: 404,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    return new Response(JSON.stringify({ success: true, message: '数据删除成功' }), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('删除财务数据失败:', error);
    return new Response(JSON.stringify({ error: '删除数据失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
