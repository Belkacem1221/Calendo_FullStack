const express = require('express');
const router = express.Router();
const { createTeam, addMember, removeMember, getTeamDetails, changeMemberRole, leaveTeam, deleteTeam } = require('../controllers/teamController');
const { authenticateToken, rbacMiddleware } = require('../middlewares/authMiddleware');


// Supprimer une team (ADMIN)
router.delete('/delete/:teamId', authenticateToken, (req, res, next) => {
    rbacMiddleware(req.params.teamId, 'admin')(req, res, next);
  }, deleteTeam);

// Créer une équipe (accessible à tous les utilisateurs authentifiés)
router.post('/create', authenticateToken, createTeam);

// Ajouter un membre à une équipe 
router.post('/add-member', authenticateToken, addMember);

// Retirer un membre d'une équipe (seulement l'administrateur et moderateur de l'équipe peut le faire)
router.delete('/remove-member', authenticateToken, (req, res, next) => {
    rbacMiddleware(req.params.teamId, ['admin', 'moderator'])(req, res, next);
  }, removeMember);

// Obtenir les détails d'une équipe
router.get('/:teamId', authenticateToken, getTeamDetails);

// Changez le role d'un member (seulement l'administrateur de l'équipe peut le faire)
router.patch('/change-role', authenticateToken,(req, res, next) => {
    rbacMiddleware(req.params.teamId, 'admin')(req, res, next);
  }, changeMemberRole);

// Quittez la team
router.post('/leave/:teamId', authenticateToken, leaveTeam);

module.exports = router;