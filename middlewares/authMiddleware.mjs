import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET;

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization').split(' ')[1];
  if (!token) {
    console.log("sem token")
    return res.status(401).send({ message: 'Acesso negado. Token não fornecido.' });
  }
  console.log(JWT_SECRET, token)
  jwt.verify(token, JWT_SECRET, function(err, decoded) { 
    if (err) 
        return res.status(500).send({ auth: false, message: 'Token inválido.' }); 
    
    req.user = decoded.id; 
    console.log("User Id: " + decoded.id)
    next(); 
  });

};

export default authenticateToken;


