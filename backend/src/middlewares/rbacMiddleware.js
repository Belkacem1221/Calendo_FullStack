/**
 * Middleware for role-based access control.
 * @param {Array} allowedRoles - Roles allowed to access the route.
 */
const rbacMiddleware = (allowedRoles) => (req, res, next) => {
    const userRole = req.user.role; 
  
    if (!allowedRoles.includes(userRole)) {
      return res.status(403).json({ error: 'Access denied' });
    }
  
    next();
  };
  
  module.exports = rbacMiddleware;
  