// 财务数据API接口
export async function onRequestGet(context) {
  try {
    const { DB } = context.env;
    
    // 获取所有财务数据，按年月排序
    const { results } = await DB.prepare(`
      SELECT year_month, total_income, total_expense, total_capital, interest_rate, 
             created_at, updated_at
      FROM financial_data 
      ORDER BY year_month ASC
    `).all();

    return new Response(JSON.stringify(results), {
      headers: { 'Content-Type': 'application/json' }
    });
  } catch (error) {
    console.error('获取财务数据失败:', error);
    return new Response(JSON.stringify({ error: '获取数据失败' }), {
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
    const { yearMonth, totalIncome, totalExpense, totalCapital, interestRate = 4.0 } = data;

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
      (year_month, total_income, total_expense, total_capital, interest_rate) 
      VALUES (?, ?, ?, ?, ?)
    `).bind(yearMonth, totalIncome, totalExpense, totalCapital, interestRate).run();

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
    const { yearMonth, totalIncome, totalExpense, totalCapital, interestRate = 4.0 } = data;

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
      SET total_income = ?, total_expense = ?, total_capital = ?, interest_rate = ?, updated_at = CURRENT_TIMESTAMP
      WHERE year_month = ?
    `).bind(totalIncome, totalExpense, totalCapital, interestRate, yearMonth).run();

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
