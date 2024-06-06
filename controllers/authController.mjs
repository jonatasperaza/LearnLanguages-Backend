import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import sql from '../config/database.mjs';
import { Welcome, Forget } from '../services/emailService.mjs';

const JWT_SECRET = process.env.JWT_SECRET;

export const register = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const existingEmail = await sql`SELECT * FROM cadastros WHERE email = ${email}`;
    if (existingEmail.length > 0) {
      return res.status(409).json({ message: 'Email já em uso' });
    }
    const saltRounds = 10;
    const hashpassword = await bcrypt.hash(password, saltRounds);
    await sql`INSERT INTO cadastros (name, email, password) VALUES (${name}, ${email}, ${hashpassword})`;
    Welcome(email, name);
    res.status(200).json({ message: 'Dados inseridos com sucesso' });
  } catch (error) {
    console.error('Error inserting data:', error);
    res.status(500).json({ message: 'Erro ao inserir dados', error: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await sql`SELECT * FROM cadastros WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    const user = result[0];
    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ message: 'Senha inválida' });
    }
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, { expiresIn: '1h' });
    res.status(200).json({ message: 'Usuário logado com sucesso', token });
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ message: 'Erro ao logar' });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const result = await sql`SELECT * FROM cadastros WHERE email = ${email}`;
    if (result.length === 0) {
      return res.status(400).json({ message: 'Usuário não encontrado' });
    }
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '10m' });
    await sql`UPDATE cadastros SET token = ${token}, data_token = ${new Date()} WHERE email = ${email}`;
    Forget(email, token);
    res.status(200).json({ message: 'Token gerado com sucesso', token });
  } catch (error) {
    console.error('Error generating token:', error);
    res.status(500).json({ message: 'Erro ao gerar token' });
  }
};

export const resetPassword = async (req, res) => {
  const { email, token, password } = req.body;
  try {
    jwt.verify(token, JWT_SECRET, async (err, decoded) => {
      if (err) {
        return res.status(400).json({ message: 'Token inválido ou expirado' });
      }
      const result = await sql`SELECT * FROM cadastros WHERE email = ${email}`;
      if (result.length === 0) {
        return res.status(400).json({ message: 'Usuário não encontrado' });
      }
      const user = result[0];
      if (user.token !== token) {
        return res.status(400).json({ message: 'Token inválido' });
      }
      const saltRounds = 10;
      const hashpassword = await bcrypt.hash(password, saltRounds);
      await sql`UPDATE cadastros SET password = ${hashpassword}, token = null, data_token = null WHERE email = ${email}`;
      res.status(200).json({ message: 'Senha alterada com sucesso' });
    });
  } catch (error) {
    console.error('Error resetting password:', error);
    res.status(500).json({ message: 'Erro ao alterar senha' });
  }
};
