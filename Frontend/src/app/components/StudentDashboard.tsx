import { useState, useEffect } from 'react';
import { 
  Sparkles, Search, Bell, Settings, LogOut, 
  Calendar, Users, MapPin, FileText, Star,
  Clock, User, Filter, Grid, List, Heart,
  QrCode, CheckCircle2, Download, ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { motion, AnimatePresence } from 'motion/react';
import { eventAPI, registrationAPI } from '../../services/api';
import { downloadCertificate } from '../../utils/certificate.utils';
import NotificationCenter from './NotificationCenter';

interface StudentDashboardProps {
  onLogout: () => void;
  onHome?: () => void;
}

interface Event {
  id: string;
  title: string;
  club: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registered: number;
  category: string;
  description: string;
  imageUrl: string;
  hasRulebook: boolean;
  tags: string[];
  isFavorite?: boolean;
  status?: string;
}

interface RegisteredEvent extends Event {
  registrationDate: string;
  qrCode: string;
  registrationNumber: string;
}

export default function StudentDashboard({ onLogout, onHome }: StudentDashboardProps) {
  const [activeTab, setActiveTab] = useState<'discover' | 'registered' | 'clubs'>('discover');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [events, setEvents] = useState<Event[]>([]);
  const [registeredEvents, setRegisteredEvents] = useState<RegisteredEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['all', 'Technical', 'Cultural', 'Sports', 'Workshop', 'Seminar'];

  useEffect(() => {
    loadEvents();
    loadRegisteredEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventAPI.getAll({ status: 'approved' });
      console.log('Events response:', response.data);
      
      // Map backend event data to frontend format
      const backendEvents = response.data.data.events || [];
      const mappedEvents: Event[] = backendEvents.map((event: any) => ({
        id: event._id,
        title: event.title,
        club: event.clubs?.[0]?.clubName || event.organizerName || 'Campus Event',
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: event.time,
        venue: event.venue,
        capacity: event.capacity,
        registered: event.registeredCount || 0,
        category: event.category,
        description: event.description,
        imageUrl: event.imageUrl || 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=1080',
        hasRulebook: !!event.rulebookUrl,
        tags: event.tags || [],
        isFavorite: false,
        status: event.status,
      }));
      
      setEvents(mappedEvents);
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError('Failed to load events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadRegisteredEvents = async () => {
    try {
      const response = await registrationAPI.getMy();
      console.log('Registered events response:', response.data);
      
      // Map backend registration data to frontend format
      const backendRegistrations = response.data.data.registrations || [];
      const mappedRegistrations: RegisteredEvent[] = backendRegistrations.map((reg: any) => ({
        id: reg.event?._id || reg.eventId,
        title: reg.event?.title || 'Event',
        club: reg.event?.clubs?.[0]?.clubName || reg.event?.organizerName || 'Campus Event',
        date: new Date(reg.event?.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        time: reg.event?.time || 'TBD',
        venue: reg.event?.venue || 'TBD',
        capacity: reg.event?.capacity || 0,
        registered: reg.event?.registeredCount || 0,
        category: reg.event?.category || 'Other',
        description: reg.event?.description || '',
        imageUrl: reg.event?.imageUrl || 'https://images.unsplash.com/photo-1582192730841-2a682d7375f9?w=1080',
        hasRulebook: !!reg.event?.rulebookUrl,
        tags: reg.event?.tags || [],
        registrationDate: new Date(reg.registeredAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
        qrCode: reg.qrCode || '',
        registrationNumber: reg._id,
      }));
      
      setRegisteredEvents(mappedRegistrations);
    } catch (err) {
      console.error('Error loading registered events:', err);
    }
  };

  const handleRegister = async (eventId: string) => {
    try {
      await registrationAPI.register(eventId);
      alert('Registration successful! Check the "My Events" tab to view your QR code.');
      loadRegisteredEvents();
      loadEvents(); // Refresh to update registration count
    } catch (err: any) {
      alert(err.response?.data?.message || 'Registration failed. Please try again.');
    }
  };

  const handleUnregister = async (eventId: string) => {
    if (!confirm('Are you sure you want to unregister from this event?')) return;
    
    try {
      await registrationAPI.unregister(eventId);
      alert('Successfully unregistered from the event.');
      loadRegisteredEvents();
      loadEvents();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to unregister. Please try again.');
    }
  };

  const handleDownloadCertificate = async (event: RegisteredEvent) => {
    try {
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      await downloadCertificate(
        {
          studentName: user.name || 'Student',
          eventTitle: event.title,
          eventDate: event.date,
          organizerName: event.club,
          certificateNumber: event.registrationNumber,
        },
        `${event.title.replace(/\s+/g, '_')}_Certificate.pdf`
      );
    } catch (err) {
      alert('Failed to generate certificate. Please try again.');
    }
  };

  const filteredEvents = selectedCategory === 'all' 
    ? events 
    : events.filter(e => e.category === selectedCategory);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl text-slate-900 font-semibold">CampusFlow</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <span className="text-slate-600">Student Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 w-64 focus:outline-none focus:ring-2 focus:ring-indigo-200"
                />
              </div>
              <NotificationCenter userId={localStorage.getItem('user') ? JSON.parse(localStorage.getItem('user')!)._id : ''} />
              <button className="w-10 h-10 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center transition-colors">
                <Settings className="w-5 h-5 text-slate-600" />
              </button>
              <div className="h-6 w-px bg-slate-200"></div>
              {onHome && (
                <button 
                  onClick={onHome}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition-colors"
                >
                  <span className="text-sm font-medium">Home</span>
                </button>
              )}
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-indigo-600" />
                </div>
                <button 
                  onClick={onLogout}
                  className="flex items-center gap-2 px-3 py-2 text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
                >
                  <span className="text-sm font-medium">Logout</span>
                  <LogOut className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="p-6 max-w-[1800px] mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl text-slate-900 mb-2">Welcome back! 👋</h1>
          <p className="text-slate-600">Discover events, join clubs, and enhance your campus experience</p>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-2 mb-6 border-b border-slate-200">
          {[
            { id: 'discover', label: 'Discover Events', icon: Search },
            { id: 'registered', label: 'My Events', icon: CheckCircle2 },
            { id: 'clubs', label: 'My Clubs', icon: Users },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 px-6 py-3 border-b-2 transition-all ${
                activeTab === tab.id
                  ? 'border-indigo-500 text-indigo-600'
                  : 'border-transparent text-slate-600 hover:text-slate-900'
              }`}
            >
              <tab.icon className="w-5 h-5" />
              {tab.label}
              {tab.id === 'registered' && registeredEvents.length > 0 && (
                <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-600 text-xs font-medium">
                  {registeredEvents.length}
                </span>
              )}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            {error}
          </div>
        )}

        {/* Discover Tab */}
        {activeTab === 'discover' && (
          <div>
            {/* Filters */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-2">
                <Filter className="w-5 h-5 text-slate-600" />
                <div className="flex gap-2">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`px-4 py-2 rounded-xl text-sm transition-all ${
                        selectedCategory === cat
                          ? 'bg-indigo-500 text-white'
                          : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600'}`}
                >
                  <Grid className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-100 text-indigo-600' : 'text-slate-600'}`}
                >
                  <List className="w-5 h-5" />
                </button>
              </div>
            </div>

            {loading ? (
              <div className="text-center py-12">
                <div className="inline-block w-8 h-8 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="mt-4 text-slate-600">Loading events...</p>
              </div>
            ) : filteredEvents.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-20 h-20 rounded-full bg-slate-100 flex items-center justify-center mx-auto mb-4">
                  <Calendar className="w-10 h-10 text-slate-400" />
                </div>
                <h3 className="text-xl font-semibold text-slate-900 mb-2">No events found</h3>
                <p className="text-slate-600 max-w-md mx-auto">
                  {selectedCategory !== 'all' 
                    ? `No ${selectedCategory} events available at the moment. Try selecting a different category.`
                    : 'No events are currently available. Check back soon for upcoming campus activities!'}
                </p>
              </div>
            ) : (
              <div className={`grid ${viewMode === 'grid' ? 'grid-cols-1 lg:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'} gap-6`}>
                {filteredEvents.map((event) => (
                  <div key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow group">
                    <div className="relative h-48 overflow-hidden">
                      <ImageWithFallback 
                        src={event.imageUrl}
                        alt={event.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <button className="absolute top-3 right-3 w-10 h-10 rounded-xl bg-white/90 backdrop-blur-sm flex items-center justify-center hover:bg-white transition-colors">
                        <Heart className={`w-5 h-5 ${event.isFavorite ? 'fill-red-500 text-red-500' : 'text-slate-600'}`} />
                      </button>
                    </div>
                    <div className="p-6">
                      <div className="flex items-center gap-2 mb-3">
                        <span className="px-3 py-1 rounded-full text-xs bg-indigo-100 text-indigo-700 font-medium">
                          {event.category}
                        </span>
                        {event.hasRulebook && (
                          <span className="px-3 py-1 rounded-full text-xs bg-emerald-100 text-emerald-700">
                            <FileText className="w-3 h-3 inline mr-1" />
                            Rulebook
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl text-slate-900 mb-2">{event.title}</h3>
                      <div className="flex items-center gap-2 text-sm text-slate-600 mb-4">
                        <User className="w-4 h-4" />
                        {event.club}
                      </div>
                      <div className="space-y-2 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Calendar className="w-4 h-4" />
                          {event.date}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Clock className="w-4 h-4" />
                          {event.time}
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <MapPin className="w-4 h-4" />
                          {event.venue}
                        </div>
                      </div>
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-sm text-slate-600">
                          {event.registered}/{event.capacity} registered
                        </span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div 
                            className={`h-full rounded-full transition-all ${
                              event.registered >= event.capacity ? 'bg-red-500' :
                              (event.registered / event.capacity) > 0.8 ? 'bg-amber-500' :
                              'bg-indigo-500'
                            }`}
                            style={{ width: `${Math.min((event.registered / event.capacity) * 100, 100)}%` }}
                          ></div>
                        </div>
                      </div>
                      <button
                        onClick={() => handleRegister(event.id)}
                        disabled={event.registered >= event.capacity}
                        className="w-full px-4 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                      >
                        <CheckCircle2 className="w-5 h-5" />
                        {event.registered >= event.capacity ? 'Event Full' : 'Register Now'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Registered Events Tab */}
        {activeTab === 'registered' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-indigo-50 to-violet-50 rounded-2xl p-8 border border-indigo-200">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600 flex items-center justify-center">
                  <CheckCircle2 className="w-7 h-7 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl text-slate-900 font-semibold">Your Registered Events</h2>
                  <p className="text-slate-600">You're registered for {registeredEvents.length} event(s)</p>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {registeredEvents.map((event) => (
                <div key={event.id} className="bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative h-48 overflow-hidden group">
                    <ImageWithFallback 
                      src={event.imageUrl}
                      alt={event.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 right-3 px-3 py-1.5 rounded-xl bg-emerald-600 text-white text-xs font-medium flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Registered
                    </div>
                  </div>
                  <div className="p-6">
                    <h3 className="text-xl text-slate-900 font-semibold mb-3">{event.title}</h3>
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="w-4 h-4" />
                        {event.date}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <MapPin className="w-4 h-4" />
                        {event.venue}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <QrCode className="w-4 h-4" />
                        Registration: {event.registrationNumber}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button className="px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm flex items-center gap-2">
                        <Download className="w-4 h-4" />
                        Download QR
                      </button>
                      <button
                        onClick={() => handleUnregister(event.id)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors text-sm"
                      >
                        Unregister
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
            {registeredEvents.length === 0 && (
              <div className="col-span-2 text-center py-12">
                <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
                <h3 className="text-xl text-slate-900 mb-2">No Registered Events</h3>
                <p className="text-slate-600 mb-6">Start exploring and register for exciting campus events!</p>
                <button
                  onClick={() => setActiveTab('discover')}
                  className="px-6 py-3 rounded-xl bg-indigo-500 text-white hover:bg-indigo-600 transition-all"
                >
                  Discover Events
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
