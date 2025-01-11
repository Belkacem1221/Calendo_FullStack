const express = require('express');
const { createTeam, addMember, removeMember, getTeamDetails, changeMemberRole, leaveTeam } = require('../controllers/teamController');
const authenticateToken = require('../middlewares/authMiddleware.js');

const router = express.Router();

// Créer une équipe (accessible à tous les utilisateurs authentifiés)
router.post('/create', authenticateToken, createTeam);

// Ajouter un membre à une équipe (seulement l'administrateur de l'équipe peut le faire)
router.post('/add-member', authenticateToken, addMember);

// Retirer un membre d'une équipe (seulement l'administrateur de l'équipe peut le faire)
router.delete('/remove-member', authenticateToken, removeMember);

// Obtenir les détails d'une équipe
router.get('/:teamId', authenticateToken, getTeamDetails);

// Changez le role d'un member (seulement l'administrateur de l'équipe peut le faire)
router.patch('/change-role', authenticateToken, changeMemberRole);

// Quittez la team
router.post('/leave/:teamId', authenticateToken, leaveTeam);

module.exports = router;