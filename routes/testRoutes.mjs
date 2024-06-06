import express from 'express';
import { Welcome, Forget } from '../services/emailService.mjs';
import jwt from 'jsonwebtoken';
const router = express.Router();

const JWT_SECRET = process.env.JWT_SECRET;

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString(); // Gera um número de 6 dígitos
};
router.post('/welcome', (req, res) => {
  const { email, name } = req.body;
  try {
    Welcome(email, name);
    res.status(200).json({ message: 'Email de boas-vindas enviado com sucesso', email, name });
  } catch (error) {
    console.error('Erro ao enviar email de boas-vindas:', error);
    res.status(500).json({ message: 'Erro ao enviar email de boas-vindas', error: error.message });
  }
});

router.post('/forget', (req, res) => {
  const { email } = req.body;
  try {
    const verificationCode = generateVerificationCode();
    const token = jwt.sign({ email, verificationCode }, JWT_SECRET, { expiresIn: '10m' });
    Forget(email, token);
    res.status(200).json({ message: 'Email de recuperação enviado com sucesso', email, token });
  } catch (error) {
    console.error('Erro ao enviar email de recuperação:', error);
    res.status(500).json({ message: 'Erro ao enviar email de recuperação', error: error.message });
  }
});

export default router;
