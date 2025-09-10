import { broadcastToAdmins } from '../services/telegramService.js';

export const handleCallbackRequest = async (req, res) => {
  try {
    const { name = '', phone = '', email = '', message = '', source = 'web' } = req.body || {};

    if (!name || !phone) {
      return res.status(400).json({ success: false, message: 'Name and phone are required' });
    }

    const clean = (s = '') => String(s).trim();
    const now = new Date();

    const lines = [];
    // Title requested by user
    lines.push('customer request to call back');
    lines.push('');
    lines.push(`Name: ${clean(name)}`);
    lines.push(`Phone: ${clean(phone)}`);
    if (email) lines.push(`Email: ${clean(email)}`);
    if (message) {
      lines.push('Message:');
      lines.push(clean(message));
    }
    lines.push('');
    lines.push(`Source: ${clean(source)}`);
    lines.push(`When: ${now.toLocaleString('en-IN')}`);

    // Fire-and-forget: don't block response on failure
    try {
      await broadcastToAdmins(lines.join('\n'));
    } catch (err) {
      console.error('Telegram broadcast failed (callback):', err.message);
    }

    return res.json({ success: true, message: 'Callback request received' });
  } catch (err) {
    console.error('handleCallbackRequest error:', err);
    return res.status(500).json({ success: false, message: 'Internal server error' });
  }
};
