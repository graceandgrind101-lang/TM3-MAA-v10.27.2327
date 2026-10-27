import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  Member,
  SportService,
  TimetableClass,
  Announcement,
  HikingEvent,
  TelegramMessage,
  UserRole,
  Language,
  MembershipStatus,
  ActivityLogEntry,
  ThemeMode,
  TournamentEvent,
  LeaderboardAthlete
} from '../types';
import {
  INITIAL_MEMBERS,
  INITIAL_SERVICES,
  INITIAL_CLASSES,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_HIKES,
  INITIAL_TELEGRAM_MESSAGES,
  INITIAL_ACTIVITY_LOGS,
  INITIAL_TOURNAMENTS,
  INITIAL_LEADERBOARD
} from '../data/initialData';

interface AppContextType {
  role: UserRole;
  setRole: (role: UserRole) => void;
  language: Language;
  setLanguage: (lang: Language) => void;
  theme: ThemeMode;
  toggleTheme: () => void;
  activeMember: Member | null;
  members: Member[];
  services: SportService[];
  classes: TimetableClass[];
  announcements: Announcement[];
  hikes: HikingEvent[];
  telegramMessages: TelegramMessage[];
  activityLogs: ActivityLogEntry[];
  tournaments: TournamentEvent[];
  leaderboard: LeaderboardAthlete[];
  // Modals & triggers
  isRegistrationOpen: boolean;
  setIsRegistrationOpen: (open: boolean) => void;
  selectedServiceForJoin: string | null;
  setSelectedServiceForJoin: (serviceTitle: string | null) => void;
  isStripeModalOpen: boolean;
  setIsStripeModalOpen: (open: boolean) => void;
  stripeModalData: { memberId: string; amount: number; description: string } | null;
  openStripeCheckout: (memberId: string, amount: number, description: string) => void;
  isTelegramOpen: boolean;
  setIsTelegramOpen: (open: boolean) => void;
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  toast: string | null;
  showToast: (message: string) => void;

  // Actions
  registerNewMember: (data: Omit<Member, 'id' | 'status' | 'joinDate' | 'renewalDate' | 'qrCodeId'>) => Member;
  updateMemberProfile: (memberId: string, updates: Partial<Member>) => void;
  approveMember: (id: string) => void;
  rejectMember: (id: string, reason?: string) => void;
  changeMemberStatus: (id: string, status: MembershipStatus) => void;
  deleteMember: (id: string) => void;
  bookClass: (classId: string, memberId: string) => boolean;
  cancelClassBooking: (classId: string, memberId: string) => void;
  joinHike: (hikeId: string, memberId: string) => void;
  registerForTournament: (tournamentId: string, memberId: string) => boolean;
  logSparringMatch: (athleteId: string, result: 'win' | 'loss' | 'draw', pointsGained: number, note?: string) => void;
  createAnnouncement: (announcement: Omit<Announcement, 'id'>) => void;
  deleteAnnouncement: (id: string) => void;
  togglePinAnnouncement: (id: string) => void;
  completeStripePayment: (memberId: string, amount: number) => void;
  sendTelegramBroadcast: (text: string, type?: TelegramMessage['type']) => void;
  addActivityLog: (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => void;
  resetAllData: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<UserRole>('visitor');
  const [language, setLanguage] = useState<Language>('en');
  const [theme, setTheme] = useState<ThemeMode>(() => {
    const saved = localStorage.getItem('tm_theme');
    return (saved as ThemeMode) || 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('tm_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Load from localStorage or defaults
  const [members, setMembers] = useState<Member[]>(() => {
    const saved = localStorage.getItem('tm_members_v2');
    return saved ? JSON.parse(saved) : INITIAL_MEMBERS;
  });

  const [classes, setClasses] = useState<TimetableClass[]>(() => {
    const saved = localStorage.getItem('tm_classes_v3');
    return saved ? JSON.parse(saved) : INITIAL_CLASSES;
  });

  const [announcements, setAnnouncements] = useState<Announcement[]>(() => {
    const saved = localStorage.getItem('tm_announcements_v2');
    return saved ? JSON.parse(saved) : INITIAL_ANNOUNCEMENTS;
  });

  const [hikes, setHikes] = useState<HikingEvent[]>(() => {
    const saved = localStorage.getItem('tm_hikes');
    return saved ? JSON.parse(saved) : INITIAL_HIKES;
  });

  const [telegramMessages, setTelegramMessages] = useState<TelegramMessage[]>(() => {
    const saved = localStorage.getItem('tm_telegram');
    return saved ? JSON.parse(saved) : INITIAL_TELEGRAM_MESSAGES;
  });

  const [activityLogs, setActivityLogs] = useState<ActivityLogEntry[]>(() => {
    const saved = localStorage.getItem('tm_activity_logs');
    return saved ? JSON.parse(saved) : INITIAL_ACTIVITY_LOGS;
  });

  const [tournaments, setTournaments] = useState<TournamentEvent[]>(() => {
    const saved = localStorage.getItem('tm_tournaments');
    return saved ? JSON.parse(saved) : INITIAL_TOURNAMENTS;
  });

  const [leaderboard, setLeaderboard] = useState<LeaderboardAthlete[]>(() => {
    const saved = localStorage.getItem('tm_leaderboard');
    return saved ? JSON.parse(saved) : INITIAL_LEADERBOARD;
  });

  const services = INITIAL_SERVICES;

  // Active member depends on role
  const activeMember: Member | null =
    role === 'member'
      ? members.find((m) => m.id === 'tm-mem-101') || members[0]
      : role === 'pending'
      ? members.find((m) => m.id === 'tm-mem-102') || members.find((m) => m.status === 'pending') || null
      : null;

  // Modals
  const [isRegistrationOpen, setIsRegistrationOpen] = useState(false);
  const [selectedServiceForJoin, setSelectedServiceForJoin] = useState<string | null>(null);
  const [isStripeModalOpen, setIsStripeModalOpen] = useState(false);
  const [stripeModalData, setStripeModalData] = useState<{ memberId: string; amount: number; description: string } | null>(null);
  const [isTelegramOpen, setIsTelegramOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Global Ctrl + K / Cmd + K listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen((prev) => !prev);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Sync to localStorage
  useEffect(() => {
    localStorage.setItem('tm_members_v2', JSON.stringify(members));
  }, [members]);

  useEffect(() => {
    localStorage.setItem('tm_classes_v3', JSON.stringify(classes));
  }, [classes]);

  useEffect(() => {
    localStorage.setItem('tm_announcements_v2', JSON.stringify(announcements));
  }, [announcements]);

  useEffect(() => {
    localStorage.setItem('tm_hikes', JSON.stringify(hikes));
  }, [hikes]);

  useEffect(() => {
    localStorage.setItem('tm_telegram', JSON.stringify(telegramMessages));
  }, [telegramMessages]);

  useEffect(() => {
    localStorage.setItem('tm_activity_logs', JSON.stringify(activityLogs));
  }, [activityLogs]);

  useEffect(() => {
    localStorage.setItem('tm_tournaments', JSON.stringify(tournaments));
  }, [tournaments]);

  useEffect(() => {
    localStorage.setItem('tm_leaderboard', JSON.stringify(leaderboard));
  }, [leaderboard]);

  const addActivityLog = (entry: Omit<ActivityLogEntry, 'id' | 'timestamp'>) => {
    const now = new Date();
    const timestamp = now.toISOString().slice(0, 16).replace('T', ' ');
    const newEntry: ActivityLogEntry = {
      ...entry,
      id: `log-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      timestamp
    };
    setActivityLogs((prev) => [newEntry, ...prev]);
  };

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => {
      setToast((curr) => (curr === message ? null : curr));
    }, 4000);
  };

  const setRole = (newRole: UserRole) => {
    setRoleState(newRole);
    if (newRole === 'visitor') {
      showToast('Switched to Public Visitor view');
    } else if (newRole === 'member') {
      showToast('Switched to Active Member view (Alex Rivers)');
    } else if (newRole === 'pending') {
      showToast('Switched to Pending Applicant view (Sarah Lin)');
    } else if (newRole === 'admin') {
      showToast('Switched to Owner/Admin Console (Coach Marcus)');
    }
  };

  const openStripeCheckout = (memberId: string, amount: number, description: string) => {
    setStripeModalData({ memberId, amount, description });
    setIsStripeModalOpen(true);
  };

  const updateMemberProfile = (memberId: string, updates: Partial<Member>) => {
    const target = members.find((m) => m.id === memberId);
    if (!target) return;

    setMembers((prev) =>
      prev.map((m) => (m.id === memberId ? { ...m, ...updates } : m))
    );

    const changedParts: string[] = [];
    if (updates.emergencyContact) {
      changedParts.push(`Emergency Contact (${updates.emergencyContact.name} - ${updates.emergencyContact.phone})`);
    }
    if (updates.services) {
      changedParts.push(`Primary Athletic Interests (${updates.services.join(', ')})`);
    }
    if (updates.phone) {
      changedParts.push(`Phone (${updates.phone})`);
    }
    if (updates.childProfile) {
      changedParts.push(`Youth Student Profile (${updates.childProfile.childName})`);
    }

    addActivityLog({
      eventType: 'profile_update',
      memberId,
      memberName: target.fullName,
      memberEmail: target.email,
      description: 'Member updated profile details & athletic preferences',
      details: changedParts.join(' · ') || 'Updated profile fields',
      actor: `${target.fullName} (Self)`
    });

    showToast('Member profile and athletic preferences updated!');
  };

  const registerNewMember = (data: Omit<Member, 'id' | 'status' | 'joinDate' | 'renewalDate' | 'qrCodeId'>): Member => {
    const today = new Date().toISOString().split('T')[0];
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    const renewalDate = renewal.toISOString().split('T')[0];

    const newMember: Member = {
      ...data,
      id: `tm-mem-${Date.now().toString().slice(-4)}`,
      status: 'pending',
      joinDate: today,
      renewalDate,
      qrCodeId: `TM-PASS-${Math.floor(1000 + Math.random() * 9000)}-P`,
      paymentMethod: 'in_person'
    };

    setMembers((prev) => [newMember, ...prev]);

    // Send telegram admin notification simulation
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'reminder',
      text: `🆕 [NEW APPLICATION] ${newMember.fullName} applied for: ${newMember.services.join(', ')}. Status: Pending Review.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    // Track activity log
    addActivityLog({
      eventType: 'registration',
      memberId: newMember.id,
      memberName: newMember.fullName,
      memberEmail: newMember.email,
      description: 'Online membership registration submitted',
      details: `Selected: ${newMember.services.join(', ')}`,
      actor: `${newMember.fullName} (Self)`
    });

    showToast(`Application submitted! Welcome ${newMember.fullName}. Review is pending.`);
    return newMember;
  };

  const approveMember = (id: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'active' as MembershipStatus,
              qrCodeId: m.qrCodeId.replace('-P', '-A')
            }
          : m
      )
    );

    // Notify Telegram
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'announcement',
      text: `✅ [MEMBERSHIP ACTIVATED] Welcome ${member.fullName}! Your membership is now active. Access QR code generated.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    // Track activity log
    addActivityLog({
      eventType: 'approval',
      memberId: id,
      memberName: member.fullName,
      memberEmail: member.email,
      description: 'Membership approved & access pass activated',
      details: `Pass ID: ${member.qrCodeId.replace('-P', '-A')}`,
      actor: 'Coach Marcus Vance (Admin)'
    });

    showToast(`Member ${member.fullName} has been approved & activated!`);
  };

  const rejectMember = (id: string, reason?: string) => {
    const member = members.find((m) => m.id === id);
    if (!member) return;

    setMembers((prev) =>
      prev.map((m) =>
        m.id === id
          ? {
              ...m,
              status: 'expired' as MembershipStatus,
              notes: `Application rejected: ${reason || 'Incomplete verification'}`
            }
          : m
      )
    );

    // Track activity log
    addActivityLog({
      eventType: 'rejection',
      memberId: id,
      memberName: member.fullName,
      memberEmail: member.email,
      description: 'Membership application rejected',
      details: `Reason: ${reason || 'Incomplete verification'}`,
      actor: 'Coach Marcus Vance (Admin)'
    });

    showToast(`Application for ${member.fullName} marked as rejected.`);
  };

  const changeMemberStatus = (id: string, status: MembershipStatus) => {
    const member = members.find((m) => m.id === id);
    setMembers((prev) =>
      prev.map((m) => (m.id === id ? { ...m, status } : m))
    );

    if (member) {
      addActivityLog({
        eventType: 'status_change',
        memberId: id,
        memberName: member.fullName,
        memberEmail: member.email,
        description: `Membership status updated to ${status.toUpperCase()}`,
        details: 'Admin manual status change',
        actor: 'Coach Marcus Vance (Admin)'
      });
    }

    showToast(`Membership status updated to ${status}.`);
  };

  const deleteMember = (id: string) => {
    setMembers((prev) => prev.filter((m) => m.id !== id));
    showToast('Member removed from records.');
  };

  const bookClass = (classId: string, memberId: string): boolean => {
    const targetClass = classes.find((c) => c.id === classId);
    if (!targetClass) return false;

    if (targetClass.bookedMemberIds.includes(memberId)) {
      showToast('You are already registered for this session.');
      return false;
    }

    if (targetClass.bookedMemberIds.length >= targetClass.capacity) {
      // Add to waitlist
      if (!targetClass.waitlistMemberIds.includes(memberId)) {
        setClasses((prev) =>
          prev.map((c) =>
            c.id === classId
              ? { ...c, waitlistMemberIds: [...c.waitlistMemberIds, memberId] }
              : c
          )
        );
        showToast('Class is full. You were added to the waitlist!');
      }
      return false;
    }

    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? { ...c, bookedMemberIds: [...c.bookedMemberIds, memberId] }
          : c
      )
    );

    showToast(`Spot reserved for ${targetClass.serviceName}!`);
    return true;
  };

  const cancelClassBooking = (classId: string, memberId: string) => {
    setClasses((prev) =>
      prev.map((c) =>
        c.id === classId
          ? {
              ...c,
              bookedMemberIds: c.bookedMemberIds.filter((id) => id !== memberId),
              waitlistMemberIds: c.waitlistMemberIds.filter((id) => id !== memberId)
            }
          : c
      )
    );
    showToast('Class registration cancelled.');
  };

  const joinHike = (hikeId: string, memberId: string) => {
    const targetHike = hikes.find((h) => h.id === hikeId);
    if (!targetHike) return;

    if (targetHike.registeredMemberIds.includes(memberId)) {
      showToast('You are already signed up for this hike.');
      return;
    }

    setHikes((prev) =>
      prev.map((h) =>
        h.id === hikeId
          ? { ...h, registeredMemberIds: [...h.registeredMemberIds, memberId] }
          : h
      )
    );

    // Telegram alert
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'event',
      text: `🥾 [HIKE REGISTRATION] Spot confirmed for ${targetHike.title}. Detailed packing list sent!`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Confirmed for ${targetHike.title}!`);
  };

  const registerForTournament = (tournamentId: string, memberId: string): boolean => {
    const target = tournaments.find((t) => t.id === tournamentId);
    if (!target) return false;

    if (target.registeredMemberIds.includes(memberId)) {
      showToast('You are already registered for this event.');
      return false;
    }

    if (target.registeredMemberIds.length >= target.maxCompetitors) {
      showToast('Event is currently full.');
      return false;
    }

    setTournaments((prev) =>
      prev.map((t) =>
        t.id === tournamentId
          ? { ...t, registeredMemberIds: [...t.registeredMemberIds, memberId] }
          : t
      )
    );

    // Update member sparring points & event count
    const bonusPoints = target.type === 'tournament' ? 25 : 15;
    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              eventParticipationCount: (m.eventParticipationCount || 0) + 1,
              sparringPoints: (m.sparringPoints || 0) + bonusPoints
            }
          : m
      )
    );

    // Update leaderboard athlete if registered
    setLeaderboard((prev) =>
      prev.map((a) =>
        a.memberId === memberId
          ? {
              ...a,
              eventsAttended: a.eventsAttended + 1,
              tournamentsEntered: target.type === 'tournament' ? a.tournamentsEntered + 1 : a.tournamentsEntered,
              sparringPoints: a.sparringPoints + bonusPoints
            }
          : a
      )
    );

    const member = members.find((m) => m.id === memberId);
    if (member) {
      addActivityLog({
        eventType: 'status_change',
        memberId: member.id,
        memberName: member.fullName,
        memberEmail: member.email,
        description: `Registered for ${target.title}`,
        details: `Confirmed spot (${target.division} · +${bonusPoints} sparring points awarded)`,
        actor: `${member.fullName} (Self)`
      });
    }

    // Telegram alert
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'event',
      text: `🥋 [TOURNAMENT ENTRY] Spot reserved for ${target.title}. Good luck in the bracket!`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast(`Registered for ${target.title}! (+${bonusPoints} Sparring Pts)`);
    return true;
  };

  const logSparringMatch = (athleteId: string, result: 'win' | 'loss' | 'draw', pointsGained: number, note?: string) => {
    setLeaderboard((prev) =>
      prev.map((a) => {
        if (a.id === athleteId || a.memberId === athleteId) {
          const newWins = result === 'win' ? a.wins + 1 : a.wins;
          const newLosses = result === 'loss' ? a.losses + 1 : a.losses;
          const newDraws = result === 'draw' ? a.draws + 1 : a.draws;
          const newPoints = Math.max(0, a.sparringPoints + pointsGained);
          const newStreak = result === 'win' ? `🔥 ${newWins}-Match Streak` : 'Reset';
          return {
            ...a,
            wins: newWins,
            losses: newLosses,
            draws: newDraws,
            sparringPoints: newPoints,
            streak: newStreak,
            rankChange: result === 'win' ? 'up' : result === 'loss' ? 'down' : 'same'
          };
        }
        return a;
      })
    );

    // Also update member record
    setMembers((prev) =>
      prev.map((m) =>
        m.id === athleteId || (activeMember && m.id === activeMember.id && athleteId === activeMember.id)
          ? {
              ...m,
              sparringPoints: Math.max(0, (m.sparringPoints || 0) + pointsGained)
            }
          : m
      )
    );

    showToast(`Sparring result logged: ${result.toUpperCase()} (+${pointsGained} pts)`);
  };

  const createAnnouncement = (announcement: Omit<Announcement, 'id'>) => {
    const newAnn: Announcement = {
      ...announcement,
      id: `ann-${Date.now()}`
    };
    setAnnouncements((prev) => [newAnn, ...prev]);

    // Send Telegram broadcast simulation
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Coach Marcus (Admin)',
      type: 'announcement',
      text: `📢 [BROADCAST] ${newAnn.title}: ${newAnn.content.slice(0, 120)}...`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    showToast('Announcement published & broadcasted to members!');
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements((prev) => prev.filter((a) => a.id !== id));
    showToast('Announcement removed.');
  };

  const togglePinAnnouncement = (id: string) => {
    setAnnouncements((prev) =>
      prev.map((a) => (a.id === id ? { ...a, pinned: !a.pinned } : a))
    );
  };

  const completeStripePayment = (memberId: string, amount: number) => {
    const target = members.find((m) => m.id === memberId);
    const memberName = target ? target.fullName : 'Member';

    // Extend renewal by 30 days and activate
    const renewal = new Date();
    renewal.setDate(renewal.getDate() + 30);
    const renewalDate = renewal.toISOString().split('T')[0];

    setMembers((prev) =>
      prev.map((m) =>
        m.id === memberId
          ? {
              ...m,
              status: 'active' as MembershipStatus,
              renewalDate,
              paymentMethod: 'stripe',
              lastPaymentAmount: amount,
              qrCodeId: m.qrCodeId.replace('-P', '-A').replace('-E', '-A')
            }
          : m
      )
    );

    // Push Stripe receipt to Telegram
    const tgAlert: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'TM Sports Bot',
      type: 'payment',
      text: `💳 [STRIPE SUCCESS] Payment of $${amount.toFixed(2)} received from ${memberName}. Subscription extended through ${renewalDate}.`,
      read: false
    };
    setTelegramMessages((prev) => [tgAlert, ...prev]);

    // Log payment activity
    addActivityLog({
      memberId,
      memberName,
      memberEmail: target ? target.email : 'checkout@tmsports.org',
      eventType: 'payment',
      description: `Stripe online payment of $${amount.toFixed(2)} completed. Subscription extended through ${renewalDate}.`,
      details: 'Automatic subscription renewal processed via Stripe Checkout simulation',
      actor: `${memberName} (Stripe)`
    });

    showToast(`Stripe payment of $${amount.toFixed(2)} successful! Account active.`);
  };

  const sendTelegramBroadcast = (text: string, type: TelegramMessage['type'] = 'announcement') => {
    const msg: TelegramMessage = {
      id: `tg-${Date.now()}`,
      timestamp: 'Just now',
      sender: 'Coach Marcus (Admin)',
      type,
      text,
      read: false
    };
    setTelegramMessages((prev) => [msg, ...prev]);
    showToast('Telegram message broadcasted to member channel!');
  };

  const resetAllData = () => {
    setMembers(INITIAL_MEMBERS);
    setClasses(INITIAL_CLASSES);
    setAnnouncements(INITIAL_ANNOUNCEMENTS);
    setHikes(INITIAL_HIKES);
    setTelegramMessages(INITIAL_TELEGRAM_MESSAGES);
    setActivityLogs(INITIAL_ACTIVITY_LOGS);
    setTournaments(INITIAL_TOURNAMENTS);
    setLeaderboard(INITIAL_LEADERBOARD);
    localStorage.removeItem('tm_members');
    localStorage.removeItem('tm_members_v2');
    localStorage.removeItem('tm_classes');
    localStorage.removeItem('tm_classes_v2');
    localStorage.removeItem('tm_classes_v3');
    localStorage.removeItem('tm_announcements');
    localStorage.removeItem('tm_announcements_v2');
    localStorage.removeItem('tm_hikes');
    localStorage.removeItem('tm_telegram');
    localStorage.removeItem('tm_activity_logs');
    localStorage.removeItem('tm_tournaments');
    localStorage.removeItem('tm_leaderboard');
    showToast('All demo data reset to default seed!');
  };

  return (
    <AppContext.Provider
      value={{
        role,
        setRole,
        language,
        setLanguage,
        theme,
        toggleTheme,
        activeMember,
        members,
        services,
        classes,
        announcements,
        hikes,
        telegramMessages,
        activityLogs,
        tournaments,
        leaderboard,
        isRegistrationOpen,
        setIsRegistrationOpen,
        selectedServiceForJoin,
        setSelectedServiceForJoin,
        isStripeModalOpen,
        setIsStripeModalOpen,
        stripeModalData,
        openStripeCheckout,
        isTelegramOpen,
        setIsTelegramOpen,
        isSearchOpen,
        setIsSearchOpen,
        toast,
        showToast,
        registerNewMember,
        updateMemberProfile,
        addActivityLog,
        approveMember,
        rejectMember,
        changeMemberStatus,
        deleteMember,
        bookClass,
        cancelClassBooking,
        joinHike,
        registerForTournament,
        logSparringMatch,
        createAnnouncement,
        deleteAnnouncement,
        togglePinAnnouncement,
        completeStripePayment,
        sendTelegramBroadcast,
        resetAllData
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
};
