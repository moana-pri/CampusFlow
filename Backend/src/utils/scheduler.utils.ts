import cron from 'node-cron';
import { Event } from '../models/Event.model';
import { User } from '../models/User.model';
import { Notification } from '../models/Notification.model';
import { Registration } from '../models/Registration.model';
import { emitNotification } from '../config/socket';

let io: any;

export const initializeScheduler = (socketIO: any) => {
  io = socketIO;

  // Run every hour to check for upcoming events
  cron.schedule('0 * * * *', async () => {
    console.log('Running scheduled notification check...');
    await checkUpcomingEvents();
  });

  // Run daily at 9 AM to check events happening today
  cron.schedule('0 9 * * *', async () => {
    console.log('Running daily event reminder check...');
    await sendDailyEventReminders();
  });

  console.log('Notification scheduler initialized');
};

// Check for events starting in 24 hours and 1 hour
const checkUpcomingEvents = async () => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const in1Hour = new Date(now.getTime() + 60 * 60 * 1000);

    // Find events starting in approximately 24 hours (±30 min window)
    const events24h = await Event.find({
      status: 'approved',
      date: {
        $gte: new Date(in24Hours.getTime() - 30 * 60 * 1000),
        $lte: new Date(in24Hours.getTime() + 30 * 60 * 1000),
      },
    });

    // Find events starting in approximately 1 hour (±15 min window)
    const events1h = await Event.find({
      status: 'approved',
      date: {
        $gte: new Date(in1Hour.getTime() - 15 * 60 * 1000),
        $lte: new Date(in1Hour.getTime() + 15 * 60 * 1000),
      },
    });

    // Send 24-hour reminders
    for (const event of events24h) {
      await sendEventReminder(event, '24 hours');
    }

    // Send 1-hour reminders
    for (const event of events1h) {
      await sendEventReminder(event, '1 hour');
    }
  } catch (error) {
    console.error('Error checking upcoming events:', error);
  }
};

// Send reminders for events happening today
const sendDailyEventReminders = async () => {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayEvents = await Event.find({
      status: 'approved',
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    for (const event of todayEvents) {
      // Notify organizer
      const organizerNotification = await Notification.create({
        userId: event.organizerId,
        type: 'event_reminder',
        title: 'Event Today!',
        message: `Your event "${event.title}" is scheduled for today at ${event.time}`,
        link: `/organizer/events/${event._id}`,
        metadata: { eventId: event._id, reminderType: 'same_day' },
      });

      if (io) {
        emitNotification(io, event.organizerId, organizerNotification);
      }

      // Notify all registered students
      const registrations = await Registration.find({
        eventId: event._id,
        status: 'confirmed',
      });

      for (const registration of registrations) {
        const studentNotification = await Notification.create({
          userId: registration.userId,
          type: 'event_reminder',
          title: 'Event Today!',
          message: `"${event.title}" is happening today at ${event.time} in ${event.venue}`,
          link: `/student/events/${event._id}`,
          metadata: { eventId: event._id, reminderType: 'same_day' },
        });

        if (io) {
          emitNotification(io, registration.userId.toString(), studentNotification);
        }
      }
    }

    console.log(`Sent reminders for ${todayEvents.length} events today`);
  } catch (error) {
    console.error('Error sending daily event reminders:', error);
  }
};

// Send reminder to organizer and registered participants
const sendEventReminder = async (event: any, timeframe: string) => {
  try {
    // Notify organizer
    const organizerNotification = await Notification.create({
      userId: event.organizerId,
      type: 'event_reminder',
      title: `Event Starting in ${timeframe}`,
      message: `Your event "${event.title}" starts in ${timeframe}`,
      link: `/organizer/events/${event._id}`,
      metadata: { eventId: event._id, reminderType: timeframe },
    });

    if (io) {
      emitNotification(io, event.organizerId, organizerNotification);
    }

    // Notify all registered students
    const registrations = await Registration.find({
      eventId: event._id,
      status: 'confirmed',
    });

    for (const registration of registrations) {
      const studentNotification = await Notification.create({
        userId: registration.userId,
        type: 'event_reminder',
        title: `Event Starting in ${timeframe}`,
        message: `"${event.title}" starts in ${timeframe} at ${event.venue}`,
        link: `/student/events/${event._id}`,
        metadata: { eventId: event._id, reminderType: timeframe },
      });

      if (io) {
        emitNotification(io, registration.userId.toString(), studentNotification);
      }
    }

    console.log(`Sent ${timeframe} reminder for event: ${event.title}`);
  } catch (error) {
    console.error(`Error sending event reminder for ${event.title}:`, error);
  }
};

// Check for registration deadlines (if events have registration deadline)
export const checkRegistrationDeadlines = async () => {
  try {
    const now = new Date();
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Find events with registration deadline in 24 hours
    const events = await Event.find({
      status: 'approved',
      registrationDeadline: {
        $gte: new Date(in24Hours.getTime() - 30 * 60 * 1000),
        $lte: new Date(in24Hours.getTime() + 30 * 60 * 1000),
      },
    });

    for (const event of events) {
      // Notify all students
      const students = await User.find({ role: 'student' });

      for (const student of students) {
        // Check if already registered
        const registration = await Registration.findOne({
          userId: student._id,
          eventId: event._id,
        });

        if (!registration) {
          const notification = await Notification.create({
            userId: student._id,
            type: 'deadline_reminder',
            title: 'Registration Deadline Soon',
            message: `Registration for "${event.title}" closes in 24 hours!`,
            link: `/student/events/${event._id}`,
            metadata: { eventId: event._id },
          });

          if (io) {
            emitNotification(io, student._id.toString(), notification);
          }
        }
      }
    }
  } catch (error) {
    console.error('Error checking registration deadlines:', error);
  }
};
