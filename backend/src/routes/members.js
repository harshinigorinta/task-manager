const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');
const roleMiddleware = require('../middleware/role');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/:projectId/members', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    const { email, role } = req.body;
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) return res.status(404).json({ error: 'User not found' });
    const member = await prisma.projectMember.create({
      data: { userId: user.id, projectId: req.params.projectId, role: role || 'MEMBER' },
      include: { user: { select: { id: true, name: true, email: true } } }
    });
    res.json(member);
  } catch {
    res.status(500).json({ error: 'Member already exists or server error' });
  }
});

router.delete('/:projectId/members/:userId', authMiddleware, roleMiddleware('ADMIN'), async (req, res) => {
  try {
    await prisma.projectMember.delete({
      where: {
        userId_projectId: {
          userId: req.params.userId,
          projectId: req.params.projectId
        }
      }
    });
    res.json({ message: 'Member removed' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;