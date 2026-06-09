import { Router } from 'express';
import { prisma } from '../utils/db';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', async (req, res) => {
  try {
    const settings = await prisma.siteSetting.findMany();
    res.json({ settings });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.put('/:key', authenticate, requireAdmin, async (req, res) => {
  try {
    const { value, valueFr } = req.body;
    const setting = await prisma.siteSetting.upsert({
      where: { key: req.params.key },
      update: { value, valueFr },
      create: { key: req.params.key, value, valueFr }
    });
    res.json({ message: 'Setting updated.', setting });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

router.post('/batch', authenticate, requireAdmin, async (req, res) => {
  try {
    const { settings } = req.body; // [{key, value, valueFr}]
    if (!Array.isArray(settings)) return res.status(400).json({ message: 'settings must be an array.' });
    const results = await Promise.all(
      settings.map((s: any) => prisma.siteSetting.upsert({
        where: { key: s.key },
        update: { value: s.value, valueFr: s.valueFr },
        create: { key: s.key, value: s.value, valueFr: s.valueFr }
      }))
    );
    res.json({ message: 'Settings updated.', settings: results });
  } catch (error) { res.status(500).json({ message: 'Server error.' }); }
});

export default router;
