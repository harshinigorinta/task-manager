const express = require('express');
const { PrismaClient } = require('@prisma/client');
const authMiddleware = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

router.post('/:projectId/tasks', authMiddleware, async (req, res) => {
  try {
    const { title, description, assigneeId, dueDate, priority } = req.body;
    if (!title) return res.status(400).json({ error: 'Title is required' });
    const task = await prisma.task.create({
      data: {
        title,
        description: description || null,
        assigneeId: assigneeId || null,
        priority: priority || 'MEDIUM',
        dueDate: dueDate ? new Date(dueDate) : null,
        projectId: req.params.projectId,
        creatorId: req.user.id
      },
      include: { assignee: { select: { id: true, name: true, email: true } } }
    });
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.patch('/:taskId', authMiddleware, async (req, res) => {
  try {
    const { title, description, status, assigneeId, dueDate, priority } = req.body;
    const task = await prisma.task.update({
      where: { id: req.params.taskId },
      data: {
        ...(title && { title }),
        ...(description && { description }),
        ...(status && { status }),
        ...(assigneeId && { assigneeId }),
        ...(priority && { priority }),
        ...(dueDate && { dueDate: new Date(dueDate) })
      },
      include: { assignee: { select: { id: true, name: true, email: true } } }
    });
    res.json(task);
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: e.message });
  }
});

router.delete('/:taskId', authMiddleware, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.json({ message: 'Task deleted' });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.delete('/tasks/:taskId', authMiddleware, async (req, res) => {
  try {
    await prisma.task.delete({ where: { id: req.params.taskId } });
    res.json({ message: 'Task deleted' });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

router.get('/dashboard', authMiddleware, async (req, res) => {
  try {
    const [total, inProgress, done, overdue] = await Promise.all([
      prisma.task.count({ where: { assigneeId: req.user.id } }),
      prisma.task.count({ where: { assigneeId: req.user.id, status: 'IN_PROGRESS' } }),
      prisma.task.count({ where: { assigneeId: req.user.id, status: 'DONE' } }),
      prisma.task.findMany({
        where: {
          assigneeId: req.user.id,
          dueDate: { lt: new Date() },
          status: { not: 'DONE' }
        },
        include: { project: true }
      })
    ]);
    res.json({ total, inProgress, done, overdue });
  } catch {
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;