import { Response } from 'express';
import { Registration } from '../models/Registration.model';
import { Event } from '../models/Event.model';
import { Notification } from '../models/Notification.model';
import { AuthRequest } from '../middlewares/auth.middleware';
import { AppError } from '../middlewares/errorHandler';
import { emitNotification } from '../config/socket';

export const checkInAttendee = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { qrData } = req.body;

    if (!qrData) {
      throw new AppError('Please provide QR code data', 400);
    }

    // Parse QR data
    let parsedData;
    try {
      parsedData = JSON.parse(qrData);
    } catch (error) {
      throw new AppError('Invalid QR code format', 400);
    }

    const { registrationNumber, eventId, userId } = parsedData;

    // Find registration
    const registration = await Registration.findOne({
      registrationNumber,
      eventId,
      userId,
    });

    if (!registration) {
      throw new AppError('Invalid registration', 404);
    }

    // Check if already checked in
    if (registration.attended) {
      res.status(200).json({
        success: true,
        message: 'Already checked in',
        data: {
          registration,
          alreadyCheckedIn: true,
          checkedInAt: registration.attendedAt,
        },
      });
      return;
    }

    // Mark as attended
    registration.attended = true;
    registration.attendedAt = new Date();
    await registration.save();

    // Get event details
    const event = await Event.findById(eventId);

    // Create notification for attendee
    const notification = await Notification.create({
      userId,
      type: 'check_in_confirmed',
      title: 'Check-in Successful',
      message: `You have been checked in to ${event?.title || 'the event'}`,
      link: `/events/${eventId}`,
      metadata: { eventId },
    });

    // Emit real-time notification
    const io = req.app.get('io');
    if (io) {
      emitNotification(io, userId.toString(), notification);
    }

    res.status(200).json({
      success: true,
      message: 'Check-in successful',
      data: {
        registration,
        userName: parsedData.userName,
        eventTitle: parsedData.eventTitle,
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to check in',
    });
  }
};

export const getEventAttendance = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      throw new AppError('Please provide event ID', 400);
    }

    // Check if event exists
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    // Get all registrations for the event
    const registrations = await Registration.find({ eventId }).populate('userId', 'name email');

    const totalRegistered = registrations.length;
    const totalAttended = registrations.filter(r => r.attended).length;
    const attendanceRate = totalRegistered > 0 ? (totalAttended / totalRegistered) * 100 : 0;

    res.status(200).json({
      success: true,
      data: {
        eventId,
        eventTitle: event.title,
        totalRegistered,
        totalAttended,
        attendanceRate: attendanceRate.toFixed(2),
        registrations,
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to get attendance',
    });
  }
};

export const exportAttendanceReport = async (req: AuthRequest, res: Response): Promise<void> => {
  try {
    const { eventId } = req.params;

    if (!eventId) {
      throw new AppError('Please provide event ID', 400);
    }

    // Get event and registrations
    const event = await Event.findById(eventId);
    if (!event) {
      throw new AppError('Event not found', 404);
    }

    const registrations = await Registration.find({ eventId }).populate('userId', 'name email');

    // Format data for CSV
    const csvData = registrations.map(reg => ({
      RegistrationNumber: reg.registrationNumber,
      Name: (reg.userId as any).name,
      Email: (reg.userId as any).email,
      Attended: reg.attended ? 'Yes' : 'No',
      CheckInTime: reg.attendedAt ? reg.attendedAt.toLocaleString() : 'N/A',
    }));

    res.status(200).json({
      success: true,
      message: 'Attendance report generated',
      data: {
        eventTitle: event.title,
        reportData: csvData,
        summary: {
          totalRegistered: registrations.length,
          totalAttended: registrations.filter(r => r.attended).length,
        },
      },
    });
  } catch (error: any) {
    res.status(error.statusCode || 500).json({
      success: false,
      message: error.message || 'Failed to export attendance',
    });
  }
};
