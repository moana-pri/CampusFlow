import { Router } from 'express';
import { Notification } from '../models/Notification.model';
import { protect } from '../middlewares/auth.middleware';
import { emitNotification } from '../config/socket';

const router = Router();

// Test endpoint to manually send a notification (development only)
router.post('/test-notification', protect, async (req, res) => {
  try {
    const notification = await Notification.create({
      userId: req.user!._id,
      type: 'test',
      title: 'Test Notification',
      message: 'This is a test notification to verify the system is working',
      link: '/dashboard',
      metadata: { test: true },
    });

    const io = req.app.get('io');
    if (io) {
      emitNotification(io, req.user!._id.toString(), notification);
    }

    res.status(200).json({
      success: true,
      message: 'Test notification sent',
      data: { notification },
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message || 'Failed to send test notification',
    });
  }
});

export default router;
