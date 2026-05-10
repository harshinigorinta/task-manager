const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

module.exports = (requiredRole) => async (req, res, next) => {
  try {
    const member = await prisma.projectMember.findUnique({
      where: {
        userId_projectId: {
          userId: req.user.id,
          projectId: req.params.projectId
        }
      }
    });
    if (!member) return res.status(403).json({ error: 'Not a member of this project' });
    if (requiredRole === 'ADMIN' && member.role !== 'ADMIN')
      return res.status(403).json({ error: 'Admin access required' });
    req.member = member;
    next();
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
};