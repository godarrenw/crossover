// 管理员验证API
export async function onRequestPost(context) {
  try {
    const { ADMIN_PASSWORD } = context.env;
    const { password } = await context.request.json();

    if (!password) {
      return new Response(JSON.stringify({ error: '密码不能为空' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (password === ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true, 
        token: ADMIN_PASSWORD,
        message: '登录成功' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: '密码错误' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('管理员验证失败:', error);
    return new Response(JSON.stringify({ error: '验证失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// 验证管理员token
export async function onRequestGet(context) {
  try {
    const { ADMIN_PASSWORD } = context.env;
    const adminToken = context.request.headers.get('X-Admin-Token');

    if (!adminToken) {
      return new Response(JSON.stringify({ error: '缺少验证令牌' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    if (adminToken === ADMIN_PASSWORD) {
      return new Response(JSON.stringify({ 
        success: true,
        message: '令牌有效' 
      }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } else {
      return new Response(JSON.stringify({ error: '令牌无效' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  } catch (error) {
    console.error('验证令牌失败:', error);
    return new Response(JSON.stringify({ error: '验证失败' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}
