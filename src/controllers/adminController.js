export async function login(req, res, next) {
  try {
    console.log('[adminController.login] start');
    const { username, password } = req.body || {};
    console.log('[adminController.login] username=', username, 'passwordPresent=', !!password);

    const DEV_FALLBACK_TOKEN = process.env.ADMIN_TOKEN || 'admintoken_for_quick_demo';
    if (username === 'admin' && password === 'adminpass') {
      return res.status(200).json({ token: DEV_FALLBACK_TOKEN });
    }

    return res.status(401).json({ message: 'Invalid credentials' });
  } catch (err) {
    console.error('[adminController.login] error', err && err.stack ? err.stack : err);
    return next(err);
  }
}
