const Team = require('../models/Team');
const TeamCalendar = require('../models/teamCalendar');
const User = require('../models/User');

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
  const { teamName, userEmail } = req.body;

  try {
    // Case-insensitive search for the team
    const team = await Team.findOne({ name: { $regex: new RegExp(`^${teamName}$`, 'i') } });

    console.log('Team found:', team); // Log the result of the team search

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const existingMember = team.members.some(member => member.user.toString() === user._id.toString());
    if (existingMember) {
      return res.status(400).json({ message: 'User is already a member of the team' });
    }

    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the admin can add members' });
    }

    team.members.push({ user: user._id, role: 'member' });
    await team.save();

    res.status(200).json({ message: 'Member added successfully', team });
  } catch (error) {
    console.error('Error adding member:', error); // Log error
    res.status(500).json({ message: 'Error adding member', error });
  }
};


// Retirer un membre d'une équipe
exports.removeMember = async (req, res) => {
  const { teamName, userEmail } = req.body;

  try {
    // Log incoming team name for debugging
    console.log('Searching for team with name:', teamName);
    
    // Find the team by name
    const team = await Team.findOne({ name: teamName.trim() });
    console.log('Team found:', team);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure the user sending the request is the admin
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the team admin can remove members' });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    console.log('User found:', user);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is a member of the team
    const memberIndex = team.members.findIndex(member => member.user.toString() === user._id.toString());
    console.log('Member index:', memberIndex);

    if (memberIndex === -1) {
      return res.status(400).json({ message: 'User is not a member of this team' });
    }

    // Remove the member
    team.members.splice(memberIndex, 1);
    await team.save();

    res.status(200).json({ message: 'Member removed successfully', team });
  } catch (error) {
    console.error('Error removing member:', error);
    res.status(500).json({ message: 'Error removing member', error });
  }
};


// Team details
exports.getTeamDetails = async (req, res) => {
  const { teamName } = req.params;

  try {
    // Search for the team by name
    const team = await Team.findOne({ name: teamName }).populate('members.user', 'name email');
    
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    res.status(200).json({ team });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching team details', error });
  }
};


exports.changeMemberRole = async (req, res) => {
  const { teamName, userEmail, newRole } = req.body;

  try {
    // Find the team by name
    const team = await Team.findOne({ name: teamName });
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Ensure the user sending the request is the admin
    if (team.admin.toString() !== req.user.id) {
      return res.status(403).json({ message: 'Only the admin can change member roles' });
    }

    // Find the user by email
    const user = await User.findOne({ email: userEmail });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find the member in the team
    const member = team.members.find(member => member.user.toString() === user._id.toString());
    if (!member) {
      return res.status(400).json({ message: 'User is not a member of the team' });
    }

    // Update the member's role
    member.role = newRole;
    await team.save();

    res.status(200).json({ message: 'Member role updated successfully', team });
  } catch (error) {
    res.status(500).json({ message: 'Error changing member role', error });
  }
};


exports.leaveTeam = async (req, res) => {
  const { teamName } = req.params;

  try {
    // Find the team by name
    const team = await Team.findOne({ name: teamName });
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
        await Team.findOneAndDelete({ name: teamName });
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


exports.deleteTeam = async (req, res) => {
  const { teamName } = req.params;

  try {
    console.log("Request received to delete team:", teamName);

    // Find the team by name
    const team = await Team.findOne({ name: teamName });
    console.log("Team found:", team);

    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if the requester is the admin of the team
    if (team.admin.toString() !== req.user.id) {
      console.log("Unauthorized: Only the admin can delete the team.");
      return res.status(403).json({ message: 'Only the admin can delete the team' });
    }

    // Delete the team and associated calendar
    const deletedTeam = await Team.findOneAndDelete({ name: teamName });
    const deletedCalendar = await TeamCalendar.findOneAndDelete({ team: team._id });

    console.log("Deleted Team:", deletedTeam);
    console.log("Deleted Team Calendar:", deletedCalendar);

    res.status(200).json({ message: 'Team deleted successfully' });
  } catch (error) {
    console.error("Error during team deletion:", error);
    res.status(500).json({ message: 'Error deleting team', error });
  }
};