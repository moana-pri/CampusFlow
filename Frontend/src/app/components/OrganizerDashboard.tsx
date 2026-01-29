import { useState, useEffect } from 'react';
import { 
  Sparkles, Plus, Calendar, Users, Settings, Bell, Search, 
  LogOut, Upload, FileText, ChevronRight, Check, Clock, 
  AlertCircle, CheckCircle2, XCircle, MapPin, User, Send
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import CreateEventForm from './CreateEventForm';
import NotificationCenter from './NotificationCenter';
import QRScanner from './QRScanner';
import { eventAPI, bookingAPI } from '../../services/api';

interface OrganizerDashboardProps {
  onLogout: () => void;
  onHome?: () => void;
}

type EventStatus = 'draft' | 'pending' | 'approved' | 'rejected' | 'changes-requested';

interface Event {
  _id: string;
  title: string;
  description: string;
  category: string;
  date: string;
  time: string;
  venue: string;
  capacity: number;
  registeredCount: number;
  status: EventStatus;
  imageUrl?: string;
  tags: string[];
  budget: { requested: number; approved?: number };
  resources: Array<{ resourceName: string; status: string }>;
  adminReview?: {
    notes?: string;
    status: string;
  };
}

export default function OrganizerDashboard({ onLogout, onHome }: OrganizerDashboardProps) {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showQRScanner, setShowQRScanner] = useState(false);
  const [selectedEventForScan, setSelectedEventForScan] = useState<string | null>(null);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState<'all' | 'draft' | 'pending' | 'approved'>('all');

  const statusConfig: Record<EventStatus, { label: string; color: string; bg: string; icon: any }> = {
    draft: { label: 'Draft', color: 'text-slate-600', bg: 'bg-slate-100', icon: Clock },
    pending: { label: 'Pending Review', color: 'text-amber-700', bg: 'bg-amber-100', icon: Clock },
    approved: { label: 'Approved', color: 'text-emerald-700', bg: 'bg-emerald-100', icon: CheckCircle2 },
    rejected: { label: 'Rejected', color: 'text-red-700', bg: 'bg-red-100', icon: XCircle },
    'changes-requested': { label: 'Changes Requested', color: 'text-orange-700', bg: 'bg-orange-100', icon: AlertCircle },
  };

  useEffect(() => {
    loadMyEvents();
  }, []);

  const loadMyEvents = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await eventAPI.getMy();
      console.log('My events response:', response.data);
      
      const backendEvents = response.data.data.events || [];
      const mappedEvents: Event[] = backendEvents.map((event: any) => ({
        ...event,
        date: new Date(event.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
      }));
      
      setEvents(mappedEvents);
    } catch (err: any) {
      console.error('Error loading events:', err);
      setError('Failed to load your events. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitForApproval = async (eventId: string) => {
    if (!confirm('Submit this event for admin review?')) return;
    
    try {
      await eventAPI.submitForApproval(eventId);
      alert('✅ Event submitted for admin review! You will be notified when the admin reviews your event.');
      loadMyEvents(); // Refresh list
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to submit event. Please try again.');
    }
  };

  const filteredEvents = activeTab === 'all' 
    ? events 
    : events.filter(e => e.status === activeTab);

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      {/* Top Navigation */}
      <nav className="bg-white border-b border-slate-200 sticky top-0 z-40">
        <div className="px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-2xl bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-white" />
                </div>
                <span className="text-xl text-slate-900 font-semibold">CampusFlow</span>
              </div>
              <div className="h-6 w-px bg-slate-200"></div>
              <span className="text-slate-600">Organizer Portal</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="w-5 h-5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search events..."
                  className="pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50 w-64 focus:outline-none focus:ring-2 focus:ring-emerald-200"
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
                <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center">
                  <User className="w-5 h-5 text-emerald-600" />
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
      <div className="p-6 max-w-[1400px] mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl text-slate-900 mb-2">Event Management</h1>
            <p className="text-slate-600">Create and manage your campus events</p>
          </div>
          <button
            onClick={() => setShowCreateForm(true)}
            className="px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/25 flex items-center gap-2"
          >
            <Plus className="w-5 h-5" />
            Create New Event
          </button>
        </div>

        {error && (
          <div className="mb-6 p-4 rounded-xl bg-amber-50 border border-amber-200 text-amber-800">
            {error}
          </div>
        )}

        {/* Stats Dashboard */}
        {!loading && events.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-blue-600" />
                </div>
                <span className="text-sm text-slate-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">{events.length}</div>
              <div className="text-sm text-slate-600">Events</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                  <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                </div>
                <span className="text-sm text-slate-500">Active</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {events.filter(e => e.status === 'approved').length}
              </div>
              <div className="text-sm text-slate-600">Published</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-amber-50 flex items-center justify-center">
                  <Clock className="w-6 h-6 text-amber-600" />
                </div>
                <span className="text-sm text-slate-500">Pending</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {events.filter(e => e.status === 'pending').length}
              </div>
              <div className="text-sm text-slate-600">Review</div>
            </div>
            
            <div className="bg-white rounded-2xl p-6 border border-slate-200 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
              <div className="flex items-center justify-between mb-4">
                <div className="w-12 h-12 rounded-xl bg-violet-50 flex items-center justify-center">
                  <Users className="w-6 h-6 text-violet-600" />
                </div>
                <span className="text-sm text-slate-500">Total</span>
              </div>
              <div className="text-2xl font-bold text-slate-900 mb-1">
                {events.reduce((sum, e) => sum + e.registered, 0).toLocaleString()}
              </div>
              <div className="text-sm text-slate-600">Registrations</div>
            </div>
          </div>
        )}

        {/* Filter Tabs */}
        {!loading && events.length > 0 && (
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl text-slate-900 font-semibold">Your Events</h2>
            <div className="flex items-center gap-2">
              <button 
                onClick={() => setActiveTab('all')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === 'all' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                All Events
              </button>
              <button 
                onClick={() => setActiveTab('draft')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === 'draft' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Draft
              </button>
              <button 
                onClick={() => setActiveTab('pending')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === 'pending' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Pending
              </button>
              <button 
                onClick={() => setActiveTab('approved')}
                className={`px-4 py-2 text-sm font-medium rounded-xl transition-colors ${
                  activeTab === 'approved' 
                    ? 'text-emerald-600 bg-emerald-50' 
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                Published
              </button>
            </div>
          </div>
        )}

        {/* Events Grid */}
        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block w-8 h-8 border-4 border-emerald-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-slate-600">Loading your events...</p>
          </div>
        ) : filteredEvents.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredEvents.map((event) => {
              const status = statusConfig[event.status];
              const StatusIcon = status.icon;
              
              return (
                <div key={event._id} className="bg-white rounded-2xl border border-slate-200 p-6 hover:shadow-lg transition-shadow">
                  {event.imageUrl && (
                    <img 
                      src={event.imageUrl} 
                      alt={event.title}
                      className="w-full h-48 object-cover rounded-xl mb-4"
                    />
                  )}
                  
                  <div className="flex items-center justify-between mb-4">
                    <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm ${status.bg} ${status.color}`}>
                      <StatusIcon className="w-4 h-4" />
                      {status.label}
                    </span>
                  </div>
                  
                  <h3 className="text-xl text-slate-900 mb-2">{event.title}</h3>
                  <p className="text-sm text-slate-600 mb-4 line-clamp-2">{event.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="w-4 h-4" />
                      {event.date} at {event.time}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin className="w-4 h-4" />
                      {event.venue}
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="w-4 h-4" />
                      {event.registeredCount}/{event.capacity} registered
                    </div>
                  </div>

                  {event.tags && event.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-4">
                      {event.tags.slice(0, 3).map((tag, idx) => (
                        <span key={idx} className="px-2 py-1 bg-slate-100 text-slate-600 text-xs rounded-lg">
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2 mb-4">
                    {event.status === 'approved' && (
                      <button 
                        onClick={() => {
                          setSelectedEventForScan(event._id);
                          setShowQRScanner(true);
                        }}
                        className="flex-1 px-4 py-2 rounded-xl bg-blue-500 text-white hover:bg-blue-600 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <rect width="7" height="7" x="3" y="3" rx="1" strokeWidth="2"/>
                          <rect width="7" height="7" x="14" y="3" rx="1" strokeWidth="2"/>
                          <rect width="7" height="7" x="14" y="14" rx="1" strokeWidth="2"/>
                          <rect width="7" height="7" x="3" y="14" rx="1" strokeWidth="2"/>
                        </svg>
                        Scan QR
                      </button>
                    )}
                    <button className="flex-1 px-4 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 transition-colors text-sm">
                      View Details
                    </button>
                    {event.status === 'draft' && (
                      <button 
                        onClick={() => handleSubmitForApproval(event._id)}
                        className="flex-1 px-4 py-2 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors text-sm flex items-center justify-center gap-2"
                      >
                        <Send className="w-4 h-4" />
                        Submit
                      </button>
                    )}
                  </div>

                  {/* Admin Review Comments */}
                  {event.adminReview && event.adminReview.notes && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-xl">
                      <p className="text-xs text-amber-800 font-medium mb-1">Admin Feedback:</p>
                      <p className="text-xs text-amber-700">{event.adminReview.notes}</p>
                    </div>
                  )}

                  {/* Registration Progress Bar */}
                  {event.registeredCount > 0 && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between text-xs text-slate-600 mb-2">
                        <span>{Math.round((event.registeredCount / event.capacity) * 100)}% filled</span>
                        <span>{event.capacity - event.registeredCount} spots left</span>
                      </div>
                      <div className="w-full bg-slate-100 rounded-full h-2">
                        <div 
                          className="bg-emerald-600 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${Math.min((event.registeredCount / event.capacity) * 100, 100)}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-12 bg-white rounded-2xl border border-slate-200">
            <Calendar className="w-16 h-16 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl text-slate-900 mb-2">No {activeTab !== 'all' ? activeTab : ''} Events</h3>
            <p className="text-slate-600 mb-4">
              {activeTab === 'all' 
                ? "Create your first event to get started!" 
                : `You don't have any ${activeTab} events yet.`
              }
            </p>
            <button
              onClick={() => setShowCreateForm(true)}
              className="px-6 py-3 rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Create Event
            </button>
          </div>
        )}
      </div>

      {/* Create Event Form Modal */}
      <AnimatePresence>
        {showCreateForm && (
          <CreateEventForm 
            onClose={() => setShowCreateForm(false)}
            onSuccess={() => {
              setShowCreateForm(false);
              loadMyEvents();
            }}
          />
        )}
      </AnimatePresence>

      {/* QR Scanner Modal */}
      <AnimatePresence>
        {showQRScanner && selectedEventForScan && (
          <QRScanner
            eventId={selectedEventForScan}
            onClose={() => {
              setShowQRScanner(false);
              setSelectedEventForScan(null);
            }}
            onSuccess={() => {
              loadMyEvents(); // Refresh attendance count
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
