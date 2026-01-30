import { useState } from 'react';
import { ArrowRight, Calendar, MapPin, BarChart3, Sparkles, CheckCircle2, Shield, Zap, Users, X, GraduationCap, Briefcase, ShieldCheck } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface LandingPageProps {
  onNavigate: (role: 'student' | 'organizer' | 'admin') => void;
}

export default function LandingPage({ onNavigate }: LandingPageProps) {
  const [showRoleModal, setShowRoleModal] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleRoleSelect = (role: 'student' | 'organizer' | 'admin') => {
    setShowRoleModal(false);
    onNavigate(role);
  };

  return (
    <div className="min-h-screen" style={{ background: 'linear-gradient(90deg, #abcef1ff 0%, #ebeff5ff 50%, #a9f9dcff 100%)' }}>
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5 }}
        className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-xl border-b border-slate-200/60"
      >
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <motion.div 
            className="flex items-center gap-2"
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 300 }}
          >
            <div className="w-9 h-9 rounded-2xl flex items-center justify-center" style={{ backgroundColor: '#3e50f4' }}>
              <Sparkles className="w-5 h-5" style={{ color: '#ffffff' }} />
            </div>
            <span className="text-xl font-semibold" style={{ color: '#3e50f4' }}>CampusFlow</span>
          </motion.div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => scrollToSection('about')}
              className="px-4 py-2 transition-colors hover:text-primary"
              style={{ color: '#6b7280' }}
            >
              About Us
            </button>
            <button 
              onClick={() => scrollToSection('features')}
              className="px-4 py-2 transition-colors hover:text-primary"
              style={{ color: '#6b7280' }}
            >
              Features
            </button>
            <motion.button 
              onClick={() => setShowRoleModal(true)}
              className="px-5 py-2.5 rounded-2xl transition-colors font-medium"
              style={{ backgroundColor: '#3e50f4', color: '#ffffff' }}
              whileHover={{ scale: 1.05, backgroundColor: '#2e3fb4' }}
              whileTap={{ scale: 0.95 }}
            >
              Sign In
            </motion.button>
          </div>
        </div>
      </motion.nav>

      {/* Role Selection Modal */}
      <AnimatePresence>
        {showRoleModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60]"
              onClick={() => setShowRoleModal(false)}
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", duration: 0.5 }}
              className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-[70] w-full max-w-lg px-4"
            >
              <div className="bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden">
                {/* Modal Header */}
                <div className="relative p-8 bg-gradient-to-br from-indigo-500 to-purple-600">
                  <button
                    onClick={() => setShowRoleModal(false)}
                    className="absolute top-4 right-4 w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center hover:bg-white/30 transition-colors"
                  >
                    <X className="w-5 h-5 text-white" />
                  </button>
                  <h2 className="text-2xl font-bold text-white mb-2">Choose Your Role</h2>
                  <p className="text-white/80">Select how you'd like to sign in to CampusFlow</p>
                </div>

                {/* Role Options */}
                <div className="p-6 space-y-3">
                  <motion.button
                    onClick={() => handleRoleSelect('student')}
                    className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-indigo-500 hover:shadow-lg transition-all text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-indigo-50 flex items-center justify-center group-hover:bg-indigo-100 transition-colors">
                        <GraduationCap className="w-7 h-7 text-indigo-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Student Portal</h3>
                        <p className="text-sm text-slate-600">Discover events, join clubs, and register for campus activities</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleRoleSelect('organizer')}
                    className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-emerald-500 hover:shadow-lg transition-all text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-emerald-50 flex items-center justify-center group-hover:bg-emerald-100 transition-colors">
                        <Briefcase className="w-7 h-7 text-emerald-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Organizer Dashboard</h3>
                        <p className="text-sm text-slate-600">Create and manage events, book resources, and track registrations</p>
                      </div>
                    </div>
                  </motion.button>

                  <motion.button
                    onClick={() => handleRoleSelect('admin')}
                    className="w-full p-6 rounded-2xl border-2 border-slate-200 hover:border-purple-500 hover:shadow-lg transition-all text-left group"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 rounded-2xl bg-purple-50 flex items-center justify-center group-hover:bg-purple-100 transition-colors">
                        <ShieldCheck className="w-7 h-7 text-purple-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-slate-900">Admin Access</h3>
                        <p className="text-sm text-slate-600">Review approvals, manage users, and oversee campus operations</p>
                      </div>
                    </div>
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Background decorations */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#3e50f4', opacity: 0.1 }} />
        <div className="absolute -bottom-40 -left-40 w-96 h-96 rounded-full blur-3xl" style={{ backgroundColor: '#27b07d', opacity: 0.1 }} />
      </div>

      {/* Hero Section */}
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="pt-32 pb-20 px-6"
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full border text-sm font-medium" 
                style={{ backgroundColor: '#27b07d20', borderColor: '#27b07d40', color: '#27b07d' }}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <motion.span 
                  className="w-2 h-2 rounded-full" 
                  style={{ backgroundColor: '#27b07d' }}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
                <span>Trusted by 50+ Universities</span>
              </motion.div>
              <motion.h1 
                className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mt-6"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                Your Campus,{" "}
                <span style={{ color: '#3e50f4' }}>Unified</span>
                {" "}
                and{" "}
                <span style={{ color: '#27b07d' }}>Simplified</span>
              </motion.h1>
              <motion.p 
                className="text-lg lg:text-xl max-w-xl mx-auto lg:mx-0 mt-4" 
                style={{ color: '#6b7280' }}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.9 }}
              >
                Transform Your Campus Events
              </motion.p>
              <motion.p 
                className="text-xl text-slate-600 mb-8 leading-relaxed"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.0 }}
              >
                CampusFlow streamlines event creation, resource booking, and approvals—empowering students, organizers, and administrators with a modern, intuitive platform.
              </motion.p>
              <motion.div 
                className="flex flex-wrap gap-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.1 }}
              >
                <motion.button 
                  onClick={() => setShowRoleModal(true)}
                  className="px-8 py-4 rounded-2xl transition-colors flex items-center gap-2 font-semibold"
                  style={{ backgroundColor: '#3e50f4', color: '#ffffff' }}
                  whileHover={{ scale: 1.05, backgroundColor: '#2e3fb4' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Join as Student
                  <ArrowRight className="w-5 h-5" />
                </motion.button>
                <motion.button 
                  onClick={() => setShowRoleModal(true)}
                  className="px-8 py-4 rounded-2xl transition-colors font-medium"
                  style={{ backgroundColor: '#27b07d', color: '#ffffff' }}
                  whileHover={{ scale: 1.05, backgroundColor: '#1f8f66' }}
                  whileTap={{ scale: 0.95 }}
                >
                  Organizer Login
                </motion.button>
              </motion.div>
              <motion.div 
                className="flex items-center gap-8 mt-10 pt-10 border-t border-slate-200"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.6, delay: 1.3 }}
              >
                <div>
                  <div className="text-3xl text-slate-900">500+</div>
                  <div className="text-sm text-slate-600">Active Events</div>
                </div>
                <div>
                  <div className="text-3xl text-slate-900">15K+</div>
                  <div className="text-sm text-slate-600">Students</div>
                </div>
                <div>
                  <div className="text-3xl text-slate-900">120+</div>
                  <div className="text-sm text-slate-600">Organizations</div>
                </div>
              </motion.div>
            </motion.div>
            <motion.div 
              className="relative"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <motion.div 
                className="rounded-3xl overflow-hidden shadow-2xl shadow-indigo-600/10"
                whileHover={{ scale: 1.02, rotateY: 2 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <ImageWithFallback 
                  src="https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=1200"
                  alt="Students collaborating on campus"
                  className="w-full h-auto object-cover"
                />
              </motion.div>
              <motion.div 
                className="absolute -bottom-6 -left-6 bg-white rounded-2xl p-6 shadow-xl border border-slate-200"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 1.2 }}
                whileHover={{ scale: 1.05 }}
              >
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 flex items-center justify-center">
                    <CheckCircle2 className="w-6 h-6 text-emerald-600" />
                  </div>
                  <div>
                    <div className="text-sm text-slate-600">Event Approved</div>
                    <div className="text-slate-900">Tech Symposium 2026</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* About Us Section */}
      <section id="about" className="py-20 px-6 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" 
                  style={{ backgroundColor: '#3e50f420', color: '#3e50f4' }}>
              About Us
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Empowering Campus Communities
            </h2>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              CampusFlow was built by students, for students. We understand the challenges of organizing campus events, 
              managing resources, and keeping the entire campus community engaged. Our mission is to provide a seamless, 
              intuitive platform that brings together students, organizers, and administrators in one unified ecosystem.
            </p>
          </motion.div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              { icon: Users, title: "Student-Centric", desc: "Built with student needs at the forefront" },
              { icon: Shield, title: "Secure & Reliable", desc: "Enterprise-grade security for your data" },
              { icon: Zap, title: "Lightning Fast", desc: "Optimized for speed and performance" }
            ].map((item, i) => (
              <motion.div
                key={i}
                className="p-8 rounded-3xl border border-slate-200 hover:shadow-lg transition-all"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                whileHover={{ scale: 1.05, y: -5 }}
              >
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                     style={{ backgroundColor: '#3e50f420' }}>
                  <item.icon className="w-7 h-7" style={{ color: '#3e50f4' }} />
                </div>
                <h3 className="text-xl font-bold mb-2">{item.title}</h3>
                <p style={{ color: '#6b7280' }}>{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 lg:py-32">
        <div className="container mx-auto px-4 lg:px-8">
          {/* Section header */}
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16 lg:mb-24"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-2 rounded-full text-sm font-semibold mb-4" 
                  style={{ backgroundColor: '#27b07d20', color: '#27b07d' }}>
              Features
            </span>
            <h2 className="text-3xl lg:text-5xl font-bold mb-6">
              Everything You Need to{" "}
              <span style={{ color: '#3e50f4' }}>Run Your Campus</span>
            </h2>
            <p className="text-lg" style={{ color: '#6b7280' }}>
              A complete suite of tools designed for modern universities. 
              Streamline operations, boost engagement, and create memorable experiences.
            </p>
          </motion.div>

          {/* Features grid */}
          <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
            {/* Event Management */}
            <motion.div 
              className="group p-6 lg:p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#3e50f420' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Calendar className="w-7 h-7" style={{ color: '#3e50f4' }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Event Management</h3>
                <p className="mb-6 flex-grow" style={{ color: '#6b7280' }}>
                  Create, manage, and promote campus events with ease. From hackathons to cultural fests, handle it all in one place.
                </p>

                {/* Feature image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aW9uJTIwdGVhbSUyMHdvcmslMjBzcGFjZXxlbnwwfHx8fDE3NjkzMDYwMTM&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Event Management"
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Resource Booking */}
            <motion.div 
              className="group p-6 lg:p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#27b07d20' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <MapPin className="w-7 h-7" style={{ color: '#27b07d' }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Resource Booking</h3>
                <p className="mb-6 flex-grow" style={{ color: '#6b7280' }}>
                  Book auditoriums, labs, equipment, and more. Real-time availability and conflict-free scheduling.
                </p>

                {/* Feature image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzY5MzA2MDEz&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Resource Booking"
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Smart Analytics */}
            <motion.div 
              className="group p-6 lg:p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#f6ae3120' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <BarChart3 className="w-7 h-7" style={{ color: '#f6ae31' }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Smart Analytics</h3>
                <p className="mb-6 flex-grow" style={{ color: '#6b7280' }}>
                  Gain insights into attendance, engagement, and resource utilization. Data-driven decisions made simple.
                </p>

                {/* Feature image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxhbmFseXRpY3MlMjBkYXNoYm9hcmR8ZW58MHx8fHwxNzY5MzA2MDEz&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Smart Analytics"
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>

            {/* Collaboration Hub */}
            <motion.div 
              className="group p-6 lg:p-8 bg-white rounded-3xl border border-gray-200 hover:shadow-lg transition-all"
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.02, y: -5 }}
            >
              <div className="flex flex-col h-full">
                {/* Icon */}
                <motion.div
                  className="w-14 h-14 rounded-2xl flex items-center justify-center mb-6"
                  style={{ backgroundColor: '#3e50f420' }}
                  whileHover={{ rotate: 360 }}
                  transition={{ duration: 0.6 }}
                >
                  <Users className="w-7 h-7" style={{ color: '#3e50f4' }} />
                </motion.div>

                {/* Content */}
                <h3 className="text-xl lg:text-2xl font-bold mb-3">Collaboration Hub</h3>
                <p className="mb-6 flex-grow" style={{ color: '#6b7280' }}>
                  Connect clubs, departments, and students. Multi-team events and seamless communication.
                </p>

                {/* Feature image */}
                <div className="relative rounded-xl overflow-hidden bg-gray-100">
                  <img
                    src="https://images.unsplash.com/photo-1521737604893-d14cc237f11d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb2xsYWJvcmF0aW9uJTIwdGVhbSUyMHdvcmslMjBzcGFjZXxlbnwwfHx8fDE3NjkzMDYwMTM&ixlib=rb-4.1.0&q=80&w=1080"
                    alt="Collaboration Hub"
                    className="w-full h-48 object-cover object-center group-hover:scale-105 transition-transform duration-500"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Workflow Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f8fafc' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4" style={{ color: '#1f2937' }}>Streamlined Workflow</h2>
            <p className="text-lg" style={{ color: '#6b7280' }}>From event creation to student registration—all in one platform</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold" 
                   style={{ backgroundColor: '#3e50f4', color: '#ffffff' }}>
                1
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1f2937' }}>Organizers Create</h3>
              <p style={{ color: '#6b7280' }}>
                Event organizers use the intuitive wizard to create events, upload rulebooks, and request resources.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold" 
                   style={{ backgroundColor: '#27b07d', color: '#ffffff' }}>
                2
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1f2937' }}>Admins Review</h3>
              <p style={{ color: '#6b7280' }}>
                Administrators review event details and rulebooks, then approve or request changes with detailed feedback.
              </p>
            </div>
            <div className="bg-white rounded-3xl p-8 border border-gray-200 hover:shadow-lg transition-all">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 text-xl font-bold" 
                   style={{ backgroundColor: '#f6ae31', color: '#181d25' }}>
                3
              </div>
              <h3 className="text-xl font-bold mb-3" style={{ color: '#1f2937' }}>Students Register</h3>
              <p style={{ color: '#6b7280' }}>
                Students discover approved events, view rulebooks, and register instantly—with QR codes for easy check-in.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-3xl p-12 border border-gray-200 shadow-lg">
            <div className="flex items-center gap-4 mb-8">
              <div className="w-16 h-16 rounded-2xl flex items-center justify-center" 
                   style={{ backgroundColor: '#3e50f420' }}>
                <Shield className="w-8 h-8" style={{ color: '#3e50f4' }} />
              </div>
              <div>
                <h2 className="text-3xl font-bold" style={{ color: '#1f2937' }}>Built for Universities</h2>
                <p className="font-medium" style={{ color: '#6b7280' }}>Trusted by campus administrators and students</p>
              </div>
            </div>
            <div className="grid md:grid-cols-3 gap-8">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#27b07d' }} />
                  <h4 className="font-semibold" style={{ color: '#1f2937' }}>Secure & Reliable</h4>
                </div>
                <p className="text-sm" style={{ color: '#6b7280' }}>Enterprise-grade security for your campus data</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#27b07d' }} />
                  <h4 className="font-semibold" style={{ color: '#1f2937' }}>Role-Based Access</h4>
                </div>
                <p className="text-sm" style={{ color: '#6b7280' }}>Granular permissions for every user type</p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-5 h-5" style={{ color: '#27b07d' }} />
                  <h4 className="font-semibold" style={{ color: '#1f2937' }}>24/7 Support</h4>
                </div>
                <p className="text-sm" style={{ color: '#6b7280' }}>Always here to help your campus succeed</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ backgroundColor: '#f8fafc' }}>
        <motion.div 
          className="max-w-4xl mx-auto text-center"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-4xl font-bold mb-6" style={{ color: '#1f2937' }}>Ready to Transform Your Campus?</h2>
          <p className="text-xl mb-8" style={{ color: '#6b7280' }}>
            Join hundreds of universities using CampusFlow to manage events and resources
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <motion.button 
              onClick={() => setShowRoleModal(true)}
              className="px-8 py-4 rounded-2xl transition-colors font-semibold"
              style={{ backgroundColor: '#3e50f4', color: '#ffffff' }}
              whileHover={{ scale: 1.05, backgroundColor: '#2e3fb4' }}
              whileTap={{ scale: 0.95 }}
            >
              Get Started
            </motion.button>
            <motion.button 
              className="px-8 py-4 rounded-2xl transition-colors font-medium"
              style={{ backgroundColor: '#27b07d', color: '#ffffff' }}
              whileHover={{ scale: 1.05, backgroundColor: '#1f8f66' }}
              whileTap={{ scale: 0.95 }}
            >
              Schedule Demo
            </motion.button>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t py-12 px-6 bg-white" style={{ borderColor: '#e5e7eb' }}>
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl flex items-center justify-center" 
                   style={{ backgroundColor: '#3e50f4' }}>
                <Sparkles className="w-4 h-4" style={{ color: '#ffffff' }} />
              </div>
              <span className="text-lg font-semibold" style={{ color: '#3e50f4' }}>CampusFlow</span>
            </div>
            <div className="text-sm font-medium" style={{ color: '#6b7280' }}>
              © 2026 CampusFlow. Built with ❤️ for universities.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}