import express from 'express';
import { checkInAttendee, getEventAttendance, exportAttendanceReport } from '../controllers/attendance.controller';
import { protect } from '../middlewares/auth.middleware';

const router = express.Router();

// Check in attendee with QR code scan
router.post('/check-in', protect, checkInAttendee);

// Get event attendance statistics
router.get('/event/:eventId', protect, getEventAttendance);

// Export attendance report
router.get('/export/:eventId', protect, exportAttendanceReport);

export default router;
