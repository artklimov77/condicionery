const nodemailer = require('nodemailer');

const LABELS = {
  name: 'Имя', phone: 'Телефон', email: 'Email', message: 'Сообщение',
  'quiz-name': 'Имя', 'quiz-phone': 'Телефон', service: 'Услуга', area: 'Площадь',
  formType: null,
};

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const body = req.body || {};
  const name = body.name || body['quiz-name'] || 'Клиент';
  const phone = body.phone || body['quiz-phone'] || '';
  const formType = body.formType || 'Форма обратной связи';

  const lines = Object.entries(body)
    .filter(([k]) => LABELS[k] !== null)
    .map(([k, v]) => `${LABELS[k] || k}: ${v}`)
    .join('\n');

  const subject = `Заявка NordicAir — ${name}${phone ? ' ' + phone : ''}`;
  const text = `Новая заявка с сайта NordicAir\nТип: ${formType}\n\n${lines}`;

  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;

  if (user && pass) {
    try {
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: { user, pass },
      });
      await transporter.sendMail({
        from: `NordicAir <${user}>`,
        to: ['kinhaus00@gmail.com', '73d32eemqeizlktj1ieb@task.yougile.com'],
        subject,
        text,
      });
    } catch (err) {
      console.error('Email error:', err.message);
    }
  } else {
    console.warn('GMAIL_USER / GMAIL_APP_PASSWORD not set — email skipped');
  }

  return res.status(200).json({ success: true });
};
