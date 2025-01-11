const authenticateAdmin = (req, res, next) => {
    try {
      // Vérifiez que req.user est défini et contient un rôle
      if (!req.user || !req.user.role) {
        return res.status(401).json({ message: 'Unauthorized. User information is missing.' });
      }
  
      // Vérifiez si le rôle est 'admin'
      if (req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Access denied, admin only.' });
      }
  
      // Passer au middleware ou au contrôleur suivant
      next();
    } catch (error) {
      res.status(500).json({ message: 'Error verifying admin access.', error });
    }
  };
  
  module.exports = authenticateAdmin;
  