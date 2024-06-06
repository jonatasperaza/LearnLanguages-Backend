import {MailerSend, EmailParams, Sender, Recipient } from "mailersend";



const mailerSend = new MailerSend({
  apiKey: process.env.API_KEY_MAIL,
});

export const Welcome = async (email, name) => {
  try {
    const sentFrom = new Sender("info@peraza.live", "Learn Languages");
    const recipients = [new Recipient(email, name)];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Seja Bem vindo")
      .setText(
        `Seja muito bem vindo ${name}, ao Learn Languages. Esperamos que você aproveite ao máximo a nossa plataforma`
      );

    await mailerSend.email.send(emailParams);
    return ("Email Enviado Com sucesso")
  } catch (error) {
    console.log({erro: error, api: process.env.API_KEY_MAIL});
    return error
  }
};

export const Forget = async (email, token) => {
  try {
    const sentFrom = new Sender("info@peraza.live", "Learn Languages");
    const recipients = [new Recipient(email, token)];
    const emailParams = new EmailParams()
      .setFrom(sentFrom)
      .setTo(recipients)
      .setReplyTo(sentFrom)
      .setSubject("Recuperação de senha")
      .setText(
        `Seu token de verificação é ${token}, use-o para recuperar sua senha`
      );

    await mailerSend.email.send(emailParams);
    return ("Email Enviado Com sucesso")
  } catch (error) {
    console.log(error)
    return error
  }
};
