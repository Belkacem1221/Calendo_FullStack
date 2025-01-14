const express = require('express');
const router = express.Router();
const { createTeam, addMember, removeMember, getTeamDetails, changeMemberRole, leaveTeam, deleteTeam } = require('../controllers/teamController');
const { authenticateToken, rbacMiddleware } = require('../middlewares/authMiddleware');

// Supprimer une team (ADMIN)
router.delete('/delete/:teamName', authenticateToken, (req, res, next) => {
  rbacMiddleware(req.params.teamName, 'admin')(req, res, next);
}, deleteTeam);

// Créer une équipe (accessible à tous les utilisateurs authentifiés)
router.post('/create', authenticateToken, createTeam);

// Ajouter un membre à une équipe 
router.post('/add-member', authenticateToken, addMember);

// Retirer un membre d'une équipe (seulement l'administrateur et moderateur de l'équipe peut le faire)
router.delete('/remove-member', authenticateToken, (req, res, next) => {
  rbacMiddleware(req.body.teamName, ['admin', 'moderator'])(req, res, next);
}, removeMember);

// Obtenir les détails d'une équipe
router.get('/:teamName', authenticateToken, getTeamDetails);

// Changez le role d'un membre (seulement l'administrateur de l'équipe peut le faire)
router.patch('/change-role', authenticateToken, (req, res, next) => {
  rbacMiddleware(req.body.teamName, 'admin')(req, res, next);
}, changeMemberRole);

// Quittez la team
router.post('/leave/:teamName', authenticateToken, leaveTeam);

module.exports = router;