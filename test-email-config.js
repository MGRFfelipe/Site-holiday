import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const envPath = path.join(__dirname, 'backend', '.env');
dotenv.config({ path: envPath });

console.log('=== TESTE DE CONFIGURAeeO DE EMAIL ===\n');

const emailUser = process.env.EMAIL_USER;
const emailPass = process.env.EMAIL_PASS;
const emailHost = process.env.EMAIL_HOST || 'smtp.gmail.com';
const emailPort = process.env.EMAIL_PORT || 465;

console.log('Configuraeees carregadas:');
console.log('EMAIL_USER:', emailUser ? `${emailUser.substring(0, 5)}***` : 'NeO CONFIGURADO');
console.log('EMAIL_PASS:', emailPass ? '***[SENHA OCULTA]***' : 'NeO CONFIGURADO');
console.log('EMAIL_HOST:', emailHost);
console.log('EMAIL_PORT:', emailPort);
console.log('');

if (!emailUser || !emailPass) {
    console.error('? ERRO: EMAIL_USER e EMAIL_PASS neo esteo configurados no .env');
    console.log('\nConfigure as seguintes varieveis no arquivo .env:');
    console.log('EMAIL_USER=seu-email@gmail.com');
    console.log('EMAIL_PASS=sua-senha-ou-app-password');
    process.exit(1);
}

// Criar transporter
const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: true,
    auth: {
        user: emailUser,
        pass: emailPass
    }
});

// Testar conexeo
console.log('Testando conexeo SMTP...\n');

transporter.verify((error, success) => {
    if (error) {
        console.error('? ERRO DE CONEXeO:');
        console.error(error.message);
        console.log('\nDicas de solueeo:');
        console.log('1. Verifique se EMAIL_USER este correto (deve ser um email Gmail)');
        console.log('2. Se usar Gmail, use uma "App Password" ao inves da senha normal');
        console.log('3. Para criar App Password:');
        console.log('   - Acesse: https://myaccount.google.com/apppasswords');
        console.log('   - Selecione "Mail" e "Windows Computer"');
        console.log('   - A senha gerada deve ser usada em EMAIL_PASS');
        process.exit(1);
    } else {
        console.log('? Conexeo SMTP bem-sucedida!');
        console.log('\nTentando enviar email de teste...\n');
        
        transporter.sendMail({
            from: emailUser,
            to: emailUser, // Enviar para o mesmo email
            subject: '[TESTE] Configuraeeo de Email - HOLIDAY Guild',
            html: `
                <h2>Email de Teste</h2>
                <p>Se voce recebeu este email, a configuraeeo de SMTP este funcionando corretamente!</p>
                <p><strong>Timestamp:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            `
        }, (err, info) => {
            if (err) {
                console.error('? ERRO AO ENVIAR EMAIL:');
                console.error(err.message);
                process.exit(1);
            } else {
                console.log('? EMAIL ENVIADO COM SUCESSO!');
                console.log('Response:', info.response);
                console.log('\n?? Sistema de email este funcionando corretamente!');
                process.exit(0);
            }
        });
    }
});
