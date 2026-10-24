import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { TopHeader } from './components/TopHeader';
import { Sidebar } from './components/Sidebar';
import { BottomNav } from './components/BottomNav';
import { LandingWorkspaceSelector } from './components/LandingWorkspaceSelector';
import { AccessDeniedView } from './components/AccessDeniedView';
import { PortalGateModal } from './components/PortalGateModal';
import { ArrowLeft } from 'lucide-react';
import type { Role } from './types';

// Modals
import { PalmModal } from './components/PalmModal';
import { AiAssistantDrawer } from './components/AiAssistantDrawer';
import { GlobalCommandModal } from './components/GlobalCommandModal';
import { EmergencyModal } from './components/EmergencyModal';
import { ReceiptModal } from './components/ReceiptModal';
import { DocumentShareModal } from './components/DocumentShareModal';
import { TopupModal } from './components/TopupModal';
import { PrivacyCenterModal } from './components/PrivacyCenterModal';
import { PayFeeModal } from './components/PayFeeModal';
import { AuthModal } from './components/AuthModal';

import { DocumentPreviewModal } from './components/DocumentPreviewModal';
import { NotificationsModal } from './components/NotificationsModal';
import { TimetablePage } from './pages/TimetablePage';

// Redesigned Core Student Pages
import { StudentHome } from './pages/StudentHome';
import { StudentCampusPage } from './pages/StudentCampusPage';
import { StudentActivityPage } from './pages/StudentActivityPage';
import { NoirIdPage } from './pages/NoirIdPage';
import { StudentProfilePage } from './pages/StudentProfilePage';

// Complete Sub-modules & Feature Views
import { AttendancePage } from './pages/AttendancePage';
import { PaymentsPage } from './pages/PaymentsPage';
import { EventsPage } from './pages/EventsPage';
import { DocumentVaultPage } from './pages/DocumentVaultPage';
import { CampusMapPage } from './pages/CampusMapPage';
import { CampusMarketplacePage } from './pages/CampusMarketplacePage';
import { LibraryPage } from './pages/LibraryPage';
import { ClubsPage } from './pages/ClubsPage';
import { ComplaintsPage } from './pages/ComplaintsPage';
import { FeesPage } from './pages/FeesPage';
import { GradesPage } from './pages/GradesPage';
import { HostelPage } from './pages/HostelPage';
import { MedicalPage } from './pages/MedicalPage';
import { TransportPage } from './pages/TransportPage';
import { PlacementsPage } from './pages/PlacementsPage';
import { PollsPage } from './pages/PollsPage';
import { LostFoundPage } from './pages/LostFoundPage';
import { PalmTerminalsPage } from './pages/PalmTerminalsPage';

// Role Applications
import { FacultyDashboard } from './pages/FacultyDashboard';
import { ManagementDashboard } from './pages/ManagementDashboard';
import { ShopkeeperDashboard } from './pages/ShopkeeperDashboard';
import { KioskApp } from './pages/KioskApp';

const AppContent: React.FC = () => {
  const { role, switchRole, activeModal, pendingRoleTarget, isSessionLocked, cancelRoleSwitch } = useApp();
  const [currentTab, setCurrentTab] = useState('home');
  const [showLanding, setShowLanding] = useState(false);
  const [deniedAuthTarget, setDeniedAuthTarget] = useState<Role | null>(null);

  // Synchronize default tab whenever active workspace role switches
  useEffect(() => {
    if (role === 'FACULTY') {
      setCurrentTab('faculty-home');
    } else if (role === 'MANAGEMENT' || role === 'SUPER_ADMIN') {
      setCurrentTab('mgmt-dashboard');
    } else if (role === 'BUSINESS') {
      setCurrentTab('biz-pos');
    } else if (role === 'STUDENT') {
      setCurrentTab('home');
    }
  }, [role]);

  // Landing Workspace Selector Mode
  if (showLanding) {
    return (
      <LandingWorkspaceSelector
        onSelectWorkspace={(newRole) => {
          switchRole(newRole);
          setShowLanding(false);
        }}
      />
    );
  }

  // Standalone Kiosk Terminal Application
  if (role === 'KIOSK') {
    return (
      <>
        <KioskApp />
        <PalmModal />
        <EmergencyModal />
        <AuthModal />
        <PortalGateModal />
      </>
    );
  }

  const renderSubPageWithBack = (component: React.ReactNode, backTab = 'home') => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
      <button
        onClick={() => setCurrentTab(backTab)}
        className="btn btn-secondary btn-sm"
        style={{ alignSelf: 'flex-start', gap: 6, borderRadius: 20, padding: '7px 16px' }}
      >
        <ArrowLeft size={15} /> Back to Overview
      </button>
      {component}
    </div>
  );

  const renderTabContent = () => {
    // ----------------------------------------------------
    // ROLE ISOLATION: Strict RBAC Guarding
    // ----------------------------------------------------
    if (role === 'STUDENT') {
      if (currentTab.startsWith('mgmt-')) {
        return (
          <AccessDeniedView
            requiredRole="Campus Management"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('MANAGEMENT')}
            onReturnHome={() => setCurrentTab('home')}
          />
        );
      }
      if (currentTab.startsWith('biz-')) {
        return (
          <AccessDeniedView
            requiredRole="Merchant POS Cashier"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('BUSINESS')}
            onReturnHome={() => setCurrentTab('home')}
          />
        );
      }
      if (currentTab.startsWith('faculty-')) {
        return (
          <AccessDeniedView
            requiredRole="Faculty Instructor"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('FACULTY')}
            onReturnHome={() => setCurrentTab('home')}
          />
        );
      }
    }

    if (role === 'BUSINESS') {
      if (currentTab.startsWith('mgmt-')) {
        return (
          <AccessDeniedView
            requiredRole="Campus Management"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('MANAGEMENT')}
            onReturnHome={() => setCurrentTab('biz-pos')}
          />
        );
      }
      if (currentTab.startsWith('faculty-')) {
        return (
          <AccessDeniedView
            requiredRole="Faculty Instructor"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('FACULTY')}
            onReturnHome={() => setCurrentTab('biz-pos')}
          />
        );
      }
      return <ShopkeeperDashboard activeTab={currentTab} onNavigate={(t) => setCurrentTab(t)} />;
    }

    if (role === 'FACULTY') {
      if (currentTab.startsWith('mgmt-')) {
        return (
          <AccessDeniedView
            requiredRole="Campus Management"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('MANAGEMENT')}
            onReturnHome={() => setCurrentTab('faculty-home')}
          />
        );
      }
      if (currentTab.startsWith('biz-')) {
        return (
          <AccessDeniedView
            requiredRole="Merchant POS Cashier"
            currentRole={role}
            onAuthenticate={() => setDeniedAuthTarget('BUSINESS')}
            onReturnHome={() => setCurrentTab('faculty-home')}
          />
        );
      }
      return <FacultyDashboard activeTab={currentTab} onNavigate={(t) => setCurrentTab(t)} />;
    }

    if (role === 'MANAGEMENT' || role === 'SUPER_ADMIN') {
      return <ManagementDashboard activeTab={currentTab} onNavigate={(t) => setCurrentTab(t)} />;
    }

    // ----------------------------------------------------
    // STUDENT OS: Full Navigation Routing for all 20+ features
    // ----------------------------------------------------
    switch (currentTab) {
      // 5 Main Tab Bar
      case 'home':
        return <StudentHome onNavigate={(t) => setCurrentTab(t)} />;
      case 'campus':
        return <StudentCampusPage />;
      case 'activity':
        return <StudentActivityPage />;
      case 'noir-id':
      case 'nexora-id':
        return <NoirIdPage onNavigate={(t) => setCurrentTab(t)} />;
      case 'profile':
      case 'settings':
        return <StudentProfilePage />;

      // Sub-pages with Back Navigation
      case 'attendance':
        return renderSubPageWithBack(<AttendancePage />);
      case 'timetable':
        return renderSubPageWithBack(<TimetablePage />);
      case 'pay':
        return renderSubPageWithBack(<PaymentsPage />);
      case 'events':
        return renderSubPageWithBack(<EventsPage />);
      case 'documents':
        return renderSubPageWithBack(<DocumentVaultPage />);
      case 'map':
        return renderSubPageWithBack(<CampusMapPage />, 'campus');
      case 'clubs':
        return renderSubPageWithBack(<ClubsPage />);
      case 'placements':
        return renderSubPageWithBack(<PlacementsPage />);
      case 'complaints':
        return renderSubPageWithBack(<ComplaintsPage />);
      case 'medical':
        return renderSubPageWithBack(<MedicalPage />, 'campus');
      case 'transport':
        return renderSubPageWithBack(<TransportPage />, 'campus');
      case 'hostel':
        return renderSubPageWithBack(<HostelPage />, 'campus');
      case 'fees':
        return renderSubPageWithBack(<FeesPage />);
      case 'grades':
        return renderSubPageWithBack(<GradesPage />);
      case 'lost-found':
        return renderSubPageWithBack(<LostFoundPage />);
      case 'polls':
        return renderSubPageWithBack(<PollsPage />);
      case 'terminals':
        return renderSubPageWithBack(<PalmTerminalsPage />);
      case 'food':
      case 'shops':
      case 'marketplace':
        return renderSubPageWithBack(<CampusMarketplacePage />, 'campus');
      case 'library':
        return renderSubPageWithBack(<LibraryPage />, 'campus');

      default:
        return <StudentHome onNavigate={(t) => setCurrentTab(t)} />;
    }
  };

  return (
    <div className="noir-layout">
      {/* Sidebar Desktop */}
      <Sidebar currentTab={currentTab} onTabChange={(t) => setCurrentTab(t)} />

      {/* Main Column */}
      <div className="noir-main-content">
        <TopHeader
          onOpenLanding={() => setShowLanding(true)}
          onNavigate={(t) => setCurrentTab(t)}
        />

        <main
          className="noir-page-container"
          style={
            isSessionLocked
              ? {
                  filter: 'blur(16px)',
                  pointerEvents: 'none',
                  userSelect: 'none',
                  transition: 'filter 200ms ease'
                }
              : undefined
          }
        >
          {renderTabContent()}
        </main>
      </div>

      {/* Mobile Bottom Navigation (5 tabs ONLY) */}
      <BottomNav currentTab={currentTab} onTabChange={(t) => setCurrentTab(t)} />

      {/* Global Modals & Drawers */}
      <PalmModal />
      <AiAssistantDrawer />
      <GlobalCommandModal onSelectTab={(t) => setCurrentTab(t)} />
      <EmergencyModal />
      <ReceiptModal />
      <DocumentShareModal />
      <DocumentPreviewModal />
      <NotificationsModal />
      <TopupModal />
      <PrivacyCenterModal />
      <PayFeeModal />
      <AuthModal />
      <PortalGateModal
        isOpen={Boolean(deniedAuthTarget) || activeModal === 'INTERFACE_GATE' || Boolean(pendingRoleTarget)}
        targetRole={deniedAuthTarget || pendingRoleTarget}
        onClose={() => {
          setDeniedAuthTarget(null);
          cancelRoleSwitch();
        }}
        onSuccess={() => {
          setDeniedAuthTarget(null);
        }}
      />
    </div>
  );
};

export function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

export default App;
