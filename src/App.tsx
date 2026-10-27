/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { RoleSwitcher } from './components/RoleSwitcher';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { ScheduleSection } from './components/ScheduleSection';
import { AnnouncementsSection } from './components/AnnouncementsSection';
import { AboutSection } from './components/AboutSection';
import { ContactSection } from './components/ContactSection';
import { MemberDashboard } from './components/MemberDashboard';
import { AdminPanel } from './components/AdminPanel';
import { RegistrationModal } from './components/RegistrationModal';
import { StripeCheckoutModal } from './components/StripeCheckoutModal';
import { TelegramBotModal } from './components/TelegramBotModal';
import { QuickSearchModal } from './components/QuickSearchModal';
import { Footer } from './components/Footer';
import { CalendarView } from './components/CalendarView';
import { GeminiChatbot } from './components/GeminiChatbot';
import { SportService } from './types';
import { CheckCircle2 } from 'lucide-react';

function MainApp() {
  const { role, toast } = useApp();
  const [currentTab, setCurrentTab] = useState<string>('home');

  useEffect(() => {
    if (role === 'admin') {
      setCurrentTab('admin-panel');
    } else if (role === 'member' || role === 'pending') {
      setCurrentTab('member-portal');
    } else if (role === 'visitor') {
      setCurrentTab('home');
    }
  }, [role]);

  useEffect(() => {
    const sectionTabs = ['services', 'schedule', 'announcements', 'about', 'contact'];
    if (sectionTabs.includes(currentTab)) {
      const timer = setTimeout(() => {
        const el = document.getElementById(currentTab);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 60);
      return () => clearTimeout(timer);
    } else if (currentTab === 'home') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [currentTab]);

  const handleSelectService = (service: SportService) => {
    const sched = document.getElementById('schedule');
    if (sched) {
      sched.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleExploreServices = () => {
    setCurrentTab('home');
    setTimeout(() => {
      const el = document.getElementById('services');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  const handleViewSchedule = () => {
    setCurrentTab('home');
    setTimeout(() => {
      const el = document.getElementById('schedule');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }, 50);
  };

  return (
    <div className="min-h-screen bg-[#f8fafd] text-[#1f1f1f] flex flex-col font-sans selection:bg-[#d3e3fd] selection:text-[#041e49]">
      {/* 1. Google Account Switcher Bar */}
      <RoleSwitcher />

      {/* 2. Google Workspace Style Top App Bar */}
      <Navbar currentTab={currentTab} setCurrentTab={setCurrentTab} />

      {/* 3. Main Views */}
      <main className="flex-1">
        {currentTab === 'member-portal' ? (
          <MemberDashboard onBackToHome={() => setCurrentTab('home')} />
        ) : currentTab === 'admin-panel' ? (
          <AdminPanel onBackToHome={() => setCurrentTab('home')} />
        ) : currentTab === 'calendar' ? (
          <div className="py-10 max-w-7xl mx-auto px-6">
            <CalendarView onBackToHome={() => setCurrentTab('home')} />
          </div>
        ) : (
          <>
            <Hero
              onExploreServices={handleExploreServices}
              onViewSchedule={handleViewSchedule}
            />
            <ServicesSection onSelectService={handleSelectService} />
            <ScheduleSection />
            <AnnouncementsSection />
            <AboutSection />
            <ContactSection />
          </>
        )}
      </main>

      {/* 4. Google Style Footer */}
      <Footer />

      {/* 5. Modals & Overlays */}
      <QuickSearchModal onNavigateToTab={setCurrentTab} />
      <RegistrationModal />
      <StripeCheckoutModal />
      <TelegramBotModal />
      <GeminiChatbot />

      {/* 6. Google M3 Snackbar / Toast */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1f1f1f] text-white text-xs px-5 py-3 rounded-2xl shadow-xl flex items-center gap-3 animate-in fade-in slide-in-from-bottom-2 duration-200">
          <CheckCircle2 className="w-4 h-4 text-[#34a853] shrink-0" />
          <span className="font-medium">{toast}</span>
        </div>
      )}
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainApp />
    </AppProvider>
  );
}
