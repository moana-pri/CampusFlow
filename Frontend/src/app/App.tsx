import { useState } from 'react';
import LandingPage from '@/app/components/LandingPage';
import AuthScreen from '@/app/components/AuthScreen';
import StudentDashboard from '@/app/components/StudentDashboard';
import OrganizerDashboard from '@/app/components/OrganizerDashboard';
import AdminDashboard from '@/app/components/AdminDashboard';

type Screen = 'landing' | 'auth' | 'dashboard';
type Role = 'student' | 'organizer' | 'admin' | null;

export default function App() {
  const [currentScreen, setCurrentScreen] = useState<Screen>('landing');
  const [selectedRole, setSelectedRole] = useState<Role>(null);

  const handleNavigateToAuth = (role: 'student' | 'organizer' | 'admin') => {
    setSelectedRole(role);
    setCurrentScreen('auth');
  };

  const handleLogin = (role: 'student' | 'organizer' | 'admin') => {
    setSelectedRole(role);
    setCurrentScreen('dashboard');
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setCurrentScreen('landing');
  };

  const handleBackToLanding = () => {
    setCurrentScreen('landing');
  };

  return (
    <div className="size-full">
      {currentScreen === 'landing' && (
        <LandingPage onNavigate={handleNavigateToAuth} />
      )}

      {currentScreen === 'auth' && selectedRole && (
        <AuthScreen 
          role={selectedRole} 
          onBack={handleBackToLanding}
          onLogin={handleLogin}
        />
      )}

      {currentScreen === 'dashboard' && selectedRole === 'student' && (
        <StudentDashboard onLogout={handleLogout} />
      )}

      {currentScreen === 'dashboard' && selectedRole === 'organizer' && (
        <OrganizerDashboard onLogout={handleLogout} />
      )}

      {currentScreen === 'dashboard' && selectedRole === 'admin' && (
        <AdminDashboard onLogout={handleLogout} />
      )}
    </div>
  );
}
