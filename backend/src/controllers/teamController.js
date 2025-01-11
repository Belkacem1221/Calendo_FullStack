const Team = require('../models/Team');
const TeamCalendar = require('../models/teamCalendar');


exports.createTeam = async (req, res) => {
  const { name } = req.body;

  try {
    const existingTeam = await Team.findOne({ name });
    if (existingTeam) {
      return res.status(400).json({ message: 'Team already exists' });
    }

    // Create the team
    const newTeam = new Team({
      name,
      admin: req.user.id,
      members: [
        {
          user: req.user.id,
          role: 'admin'
        }
      ]
    });

    await newTeam.save();

    // Create a team calendar for the new team
    const newTeamCalendar = new TeamCalendar({
      team: newTeam._id,
      createdBy: req.user.id
    });

    await newTeamCalendar.save();

    res.status(201).json({ message: 'Team and calendar created successfully', team: newTeam, teamCalendar: newTeamCalendar });
  } catch (error) {
    res.status(500).json({ message: 'Error creating team and calendar', error });
  }
};



// Ajouter un membre à une équipe
exports.addMember = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Vérifiez si l'utilisateur est déjà membre de l'équipe
    if (team.members.some(member => member.user.toString() === userId)) {
      return res.status(400).json({ message: 'User is already a member of the team' });
    }

    // Vérifiez si l'utilisateur qui envoie la requête est l'administrateur de l'équipe
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team admin can add members' });
    }

    // Ajoutez le membre (en ajoutant un objet avec la structure attendue: { user, role })
    team.members.push({ user: userId, role: 'member' });
    await team.save();

    res.status(200).json({ message: 'Member added successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error adding member', error });
  }
};

// Retirer un membre d'une équipe
exports.removeMember = async (req, res) => {
  const { teamId, userId } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Vérifiez si l'utilisateur qui envoie la requête est l'administrateur de l'équipe
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team admin can remove members' });
    }

    // Vérifiez si l'utilisateur est membre de l'équipe
    if (!team.members.includes(userId)) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }

    // Supprimez le membre
    team.members = team.members.filter(member => member.toString() !== userId);
    await team.save();

    res.status(200).json({ message: 'Member removed successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error removing member', error });
  }
};

// Obtenir les détails d'une équipe
exports.getTeamDetails = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId).populate('members', 'name email');
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team details', error });
  }
};

exports.changeMemberRole = async (req, res) => {
  const { teamId, userId, newRole } = req.body;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the admin can change member roles' });
    }

    const member = team.members.find(member => member.user.toString() === userId);
    if (!member) {
      return res.status(400).json({ message: 'User is not a member of the team' });
    }

    member.role = newRole;
    await team.save();

    res.status(200).json({ message: 'Member role updated successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error changing member role', error });
  }
};

exports.leaveTeam = async (req, res) => {
  const { teamId } = req.params;

  try {
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the user is a member of the team
    const memberIndex = team.members.findIndex(member => member.user.toString() === req.user.id);
    if (memberIndex === -1) {
      return res.status(400).json({ message: 'You are not a member of this team' });
    }

    // Check if the user is the admin
    const isAdmin = team.admin.toString() === req.user.id;

    // If the admin leaves, transfer admin rights to the first member (excluding the leaving admin)
    if (isAdmin) {
      if (team.members.length === 1) {
        // If the admin is the only member, delete the team
        await Team.findByIdAndDelete(teamId);
        return res.status(200).json({ message: 'Team deleted as the only admin left' });
      } else {
        // Transfer admin rights to the first member
        const newAdmin = team.members.find((member, index) => index !== memberIndex);
        team.admin = newAdmin.user;
      }
    }

    // Remove the user from the members list
    team.members = team.members.filter(member => member.user.toString() !== req.user.id);
    await team.save();

    res.status(200).json({ message: 'Successfully left the team', team });
  } catch (error) {
    res.status(500).json({ message: 'Error leaving team', error });
  }
};
