const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'no.reply.sushifukusuke@gmail.com',
    pass: 'fukusuke2025'
  }
});

function enviarCorreoConfirmacion(email, token) {
  const url = `http://localhost:3000/confirmar/${token}`;
  const mensaje = {
    from: 'no.reply.sushifukusuke@gmail.com',
    to: email,
    subject: 'Confirma tu cuenta',
    html: `<h2>Bienvenido</h2><p>Haz clic en el siguiente enlace para confirmar tu cuenta:</p><a href="${url}">${url}</a>`
  };

  transporter.sendMail(mensaje, (err, info) => {
    if (err) console.error('Error al enviar correo:', err);
    else console.log('Correo de confirmación enviado:', info.response);
  });
}

module.exports = enviarCorreoConfirmacion;