const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB Atlas!');
    return true;
  } catch (error) {
    console.error('❌ Connection failed:', error.message);
    process.exit(1);
  }
};

const addSampleData = async () => {
  await connectDB();

  const db = mongoose.connection.db;

  // Sample Users
  const hashedPassword = await bcrypt.hash('password123', 10);
  const users = [
    {
      name: 'John Student',
      email: 'student@test.com',
      password: hashedPassword,
      role: 'student',
      supabaseId: 'student-123',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Sarah Organizer',
      email: 'organizer@test.com',
      password: hashedPassword,
      role: 'organizer',
      supabaseId: 'organizer-123',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      name: 'Admin User',
      email: 'admin@test.com',
      password: hashedPassword,
      role: 'admin',
      supabaseId: 'admin-123',
      isVerified: true,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  // Get inserted user IDs
  const insertedUsers = await db.collection('users').insertMany(users);
  const userIds = Object.values(insertedUsers.insertedIds);
  const organizerId = userIds[1].toString(); // Sarah Organizer

  // Sample Events with proper model structure
  const events = [
    {
      title: 'Tech Symposium 2026',
      description: 'Annual technology conference featuring keynote speakers, panel discussions, and hands-on workshops on emerging technologies.',
      category: 'Technical',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'cs-club-1', clubName: 'Computer Science Club' }],
      date: new Date('2026-03-15'),
      time: '9:00 AM - 5:00 PM',
      venue: 'Main Auditorium',
      capacity: 200,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=1080',
      tags: ['AI', 'Machine Learning', 'Web Dev', 'Cloud Computing'],
      status: 'approved',
      budget: { requested: 50000, approved: 45000, expenses: [] },
      resources: [
        { resourceId: 'r1', resourceName: 'Projector', status: 'approved' },
        { resourceId: 'r2', resourceName: 'Sound System', status: 'approved' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Cultural Fest 2026',
      description: 'A vibrant celebration of diversity featuring music performances, dance competitions, food stalls, and cultural exhibitions from various communities.',
      category: 'Cultural',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'cult-club-1', clubName: 'Cultural Committee' }],
      date: new Date('2026-03-20'),
      time: '10:00 AM - 8:00 PM',
      venue: 'Campus Ground',
      capacity: 500,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1080',
      tags: ['Music', 'Dance', 'Food', 'Art'],
      status: 'approved',
      budget: { requested: 100000, approved: 95000, expenses: [] },
      resources: [
        { resourceId: 'r3', resourceName: 'Stage Setup', status: 'approved' },
        { resourceId: 'r4', resourceName: 'Lighting Equipment', status: 'approved' }
      ],
      isJointEvent: true,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Hackathon 2026',
      description: '24-hour coding marathon with exciting problem statements, mentorship sessions, and amazing prizes for winners.',
      category: 'Technical',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'code-club-1', clubName: 'Coding Club' }],
      date: new Date('2026-03-25'),
      time: '9:00 AM - 9:00 AM (Next Day)',
      venue: 'CS Block',
      capacity: 100,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?w=1080',
      tags: ['Coding', 'Competition', 'Innovation', 'Prizes'],
      status: 'approved',
      budget: { requested: 75000, approved: 70000, expenses: [] },
      resources: [
        { resourceId: 'r5', resourceName: 'Computer Lab', status: 'approved' },
        { resourceId: 'r6', resourceName: 'WiFi Infrastructure', status: 'approved' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Annual Sports Day',
      description: 'Inter-college sports competition featuring cricket, football, basketball, athletics, and various indoor games.',
      category: 'Sports',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'sports-club-1', clubName: 'Sports Committee' }],
      date: new Date('2026-03-30'),
      time: '7:00 AM - 6:00 PM',
      venue: 'Sports Complex',
      capacity: 300,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=1080',
      tags: ['Cricket', 'Football', 'Athletics', 'Basketball'],
      status: 'approved',
      budget: { requested: 60000, approved: 55000, expenses: [] },
      resources: [
        { resourceId: 'r7', resourceName: 'Sports Equipment', status: 'approved' },
        { resourceId: 'r8', resourceName: 'Medical Team', status: 'approved' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'AI & Machine Learning Workshop',
      description: 'Comprehensive hands-on workshop covering fundamentals of AI, ML algorithms, neural networks, and practical implementation using Python.',
      category: 'Workshop',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'ai-club-1', clubName: 'AI/ML Club' }],
      date: new Date('2026-04-05'),
      time: '2:00 PM - 5:00 PM',
      venue: 'Lab 301',
      capacity: 50,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?w=1080',
      tags: ['AI', 'ML', 'Workshop', 'Python'],
      status: 'approved',
      budget: { requested: 15000, approved: 15000, expenses: [] },
      resources: [
        { resourceId: 'r9', resourceName: 'Computer Lab', status: 'approved' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    // Pending events for admin review
    {
      title: 'Robotics Competition',
      description: 'Build and compete with autonomous robots solving real-world challenges.',
      category: 'Technical',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'robo-club-1', clubName: 'Robotics Club' }],
      date: new Date('2026-04-15'),
      time: '10:00 AM - 4:00 PM',
      venue: 'Engineering Block',
      capacity: 80,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1546776310-eef45dd6d63c?w=1080',
      tags: ['Robotics', 'Automation', 'Competition'],
      status: 'pending',
      budget: { requested: 40000, expenses: [] },
      resources: [
        { resourceId: 'r10', resourceName: 'Workshop Space', status: 'pending' },
        { resourceId: 'r11', resourceName: 'Safety Equipment', status: 'pending' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    },
    {
      title: 'Startup Pitch Competition',
      description: 'Present your startup ideas to industry experts and investors for funding opportunities.',
      category: 'Seminar',
      organizerId: organizerId,
      organizerName: 'Sarah Organizer',
      clubs: [{ clubId: 'edc-club-1', clubName: 'Entrepreneurship Development Cell' }],
      date: new Date('2026-04-20'),
      time: '11:00 AM - 3:00 PM',
      venue: 'Seminar Hall',
      capacity: 150,
      registeredCount: 0,
      imageUrl: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?w=1080',
      tags: ['Startup', 'Entrepreneurship', 'Pitch', 'Funding'],
      status: 'pending',
      budget: { requested: 30000, expenses: [] },
      resources: [
        { resourceId: 'r12', resourceName: 'Presentation Setup', status: 'pending' }
      ],
      isJointEvent: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }
  ];

  try {
    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('events').deleteMany({});
    await db.collection('registrations').deleteMany({});
    await db.collection('notifications').deleteMany({});
    console.log('🗑️  Cleared existing data');

    // Insert sample users first
    const usersResult = await db.collection('users').insertMany(users);
    console.log(`✅ Added ${usersResult.insertedCount} users`);

    // Get inserted user IDs
    const insertedUsers = usersResult.insertedIds;
    const studentId = insertedUsers[0].toString();
    const organizerId = insertedUsers[1].toString();
    const adminId = insertedUsers[2].toString();

    // Update events with correct organizerId
    const eventsWithIds = events.map(event => ({
      ...event,
      organizerId: organizerId
    }));

    const eventsResult = await db.collection('events').insertMany(eventsWithIds);
    console.log(`✅ Added ${eventsResult.insertedCount} events (5 approved, 2 pending)`);

    console.log('\n📋 Sample Credentials:');
    console.log('Student: student@test.com / password123');
    console.log('Organizer: organizer@test.com / password123');
    console.log('Admin: admin@test.com / password123');
    console.log('\n✨ Data includes:');
    console.log('  - 5 approved events (visible to students)');
    console.log('  - 2 pending events (awaiting admin approval)');
    console.log('  - Proper event structure with budget, resources, tags');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error adding sample data:', error);
    process.exit(1);
  }
};

addSampleData();
