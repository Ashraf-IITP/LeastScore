// lib/mailer.js — Nodemailer transporter (SMTP)
const nodemailer = require('nodemailer');

let _transporter = null;

function getTransporter() {
  if (_transporter) return _transporter;

  _transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: process.env.SMTP_SECURE === 'true', // true for port 465
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });

  return _transporter;
}

/**
 * Send an email.
 * @param {object} opts - { to, subject, html, text }
 */
async function sendMail({ to, subject, html, text }) {
  const transporter = getTransporter();
  return transporter.sendMail({
    from: `"LeastScore" <${process.env.SMTP_FROM || process.env.SMTP_USER}>`,
    to,
    subject,
    html,
    text,
  });
}

module.exports = { sendMail };
