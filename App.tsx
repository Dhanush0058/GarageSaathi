// Z9 Automotive Vehicle Inspection Mobile App — Main Application Container
// Production-ready React Native Expo architecture with offline persistence,
// 336-point inspection checklist, camera capture, and PDF report generation.

import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar as RNStatusBar,
} from 'react-native';
import { SafeAreaProvider, SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, Typography } from './src/theme/colors';
import { UserProfile, Vehicle } from './src/types';
import { LocalDB } from './src/services/storage/localDatabase';
import { IntroSplashAnimation, LoadingInspectionAnimation } from './src/components/common';

// Screens
import { AuthScreen } from './src/screens/AuthScreen';
import { HomeScreen } from './src/screens/HomeScreen';
import { CustomersScreen } from './src/screens/CustomersScreen';
import { VehiclesScreen } from './src/screens/VehiclesScreen';
import { CreateInspectionScreen } from './src/screens/CreateInspectionScreen';
import { InspectionChecklistScreen } from './src/screens/InspectionChecklistScreen';
import { InspectionSummaryScreen } from './src/screens/InspectionSummaryScreen';
import { ReportViewScreen } from './src/screens/ReportViewScreen';
import { InspectionHistoryScreen } from './src/screens/InspectionHistoryScreen';

type TabType = 'home' | 'customers' | 'vehicles' | 'history' | 'profile';

export default function App() {
  return (
    <SafeAreaProvider>
      <AppContent />
    </SafeAreaProvider>
  );
}

function AppContent() {
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [activeTab, setActiveTab] = useState<TabType>('home');
  const [loadingApp, setLoadingApp] = useState(true);
  const [showIntro, setShowIntro] = useState(true);
  const [historyFilter, setHistoryFilter] = useState<
    'ALL' | 'draft' | 'in_progress' | 'completed' | 'failed'
  >('ALL');

  // Stack navigation states
  const [activeScreen, setActiveScreen] = useState<
    'main' | 'create_inspection' | 'checklist' | 'summary' | 'report'
  >('main');
  const [activeInspectionId, setActiveInspectionId] = useState<string | null>(null);
  const [preselectedVehicle, setPreselectedVehicle] = useState<Vehicle | undefined>(undefined);

  // Initialize Local Database on startup
  useEffect(() => {
    async function init() {
      await LocalDB.initialize();
      const user = await LocalDB.getCurrentUser();
      setCurrentUser(user);
      setLoadingApp(false);
    }
    init();
  }, []);

  const handleLogout = async () => {
    await LocalDB.setCurrentUser(null);
    setCurrentUser(null);
    setActiveTab('profile');
    setActiveScreen('main');
  };

  const handleStartInspectionForVehicle = (vehicle: Vehicle) => {
    setPreselectedVehicle(vehicle);
    setActiveScreen('create_inspection');
  };

  if (loadingApp) {
    return (
      <LoadingInspectionAnimation
        message="Initializing Z9 Automotive..."
        subMessage="Syncing local SQLite storage & offline queue"
        dark={true}
      />
    );
  }

  if (showIntro) {
    return <IntroSplashAnimation onFinish={() => setShowIntro(false)} />;
  }

  // If user is not authenticated and not on profile tab, show AuthScreen
  if (!currentUser) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <AuthScreen
          currentUser={null}
          onLoginSuccess={(user) => setCurrentUser(user)}
          onLogout={handleLogout}
        />
      </SafeAreaView>
    );
  }

  // STACK SCREENS
  if (activeScreen === 'create_inspection') {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <CreateInspectionScreen
          currentUser={currentUser}
          preselectedVehicle={preselectedVehicle}
          onInspectionCreated={(id) => {
            setActiveInspectionId(id);
            setActiveScreen('checklist');
          }}
          onCancel={() => {
            setPreselectedVehicle(undefined);
            setActiveScreen('main');
          }}
        />
      </SafeAreaView>
    );
  }

  if (activeScreen === 'checklist' && activeInspectionId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <InspectionChecklistScreen
          inspectionId={activeInspectionId}
          onNavigateToSummary={(id) => {
            setActiveInspectionId(id);
            setActiveScreen('summary');
          }}
          onBack={() => setActiveScreen('main')}
        />
      </SafeAreaView>
    );
  }

  if (activeScreen === 'summary' && activeInspectionId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <InspectionSummaryScreen
          inspectionId={activeInspectionId}
          onNavigateToChecklist={(id) => {
            setActiveInspectionId(id);
            setActiveScreen('checklist');
          }}
          onNavigateToReport={(id) => {
            setActiveInspectionId(id);
            setActiveScreen('report');
          }}
          onBack={() => setActiveScreen('main')}
        />
      </SafeAreaView>
    );
  }

  if (activeScreen === 'report' && activeInspectionId) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <StatusBar style="light" />
        <ReportWrapper
          inspectionId={activeInspectionId}
          onBack={() => setActiveScreen('summary')}
        />
      </SafeAreaView>
    );
  }

  // MAIN TAB NAVIGATION
  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />

      {/* Screen Body */}
      <View style={styles.content}>
        {activeTab === 'home' && (
          <HomeScreen
            currentUser={currentUser}
            onNavigateToCreate={() => {
              setPreselectedVehicle(undefined);
              setActiveScreen('create_inspection');
            }}
            onNavigateToChecklist={(id) => {
              setActiveInspectionId(id);
              setActiveScreen('checklist');
            }}
            onNavigateToSummary={(id) => {
              setActiveInspectionId(id);
              setActiveScreen('summary');
            }}
            onNavigateToHistory={(filter) => {
              setHistoryFilter(filter || 'ALL');
              setActiveTab('history');
            }}
          />
        )}

        {activeTab === 'customers' && <CustomersScreen />}

        {activeTab === 'vehicles' && (
          <VehiclesScreen
            onStartInspectionForVehicle={handleStartInspectionForVehicle}
          />
        )}

        {activeTab === 'history' && (
          <InspectionHistoryScreen
            initialFilter={historyFilter}
            onSelectInspection={(id) => {
              setActiveInspectionId(id);
              setActiveScreen('summary');
            }}
            onBack={() => setActiveTab('home')}
          />
        )}

        {activeTab === 'profile' && (
          <AuthScreen
            currentUser={currentUser}
            onLoginSuccess={(user) => setCurrentUser(user)}
            onLogout={handleLogout}
          />
        )}
      </View>

      {/* Bottom Workshop Tab Bar */}
      <View style={styles.tabBar}>
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('home')}
          style={styles.tabButton}
        >
          <Ionicons
            name={activeTab === 'home' ? 'speedometer' : 'speedometer-outline'}
            size={22}
            color={activeTab === 'home' ? Colors.primaryDark : '#000000'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'home' && styles.tabButtonTextActive,
            ]}
          >
            Dashboard
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('vehicles')}
          style={styles.tabButton}
        >
          <Ionicons
            name={activeTab === 'vehicles' ? 'car-sport' : 'car-sport-outline'}
            size={22}
            color={activeTab === 'vehicles' ? Colors.primaryDark : '#000000'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'vehicles' && styles.tabButtonTextActive,
            ]}
          >
            Vehicles
          </Text>
        </TouchableOpacity>

        {/* Floating Quick Action */}
        <TouchableOpacity
          activeOpacity={0.85}
          onPress={() => {
            setPreselectedVehicle(undefined);
            setActiveScreen('create_inspection');
          }}
          style={styles.floatingActionBtn}
        >
          <Ionicons name="add" size={32} color={Colors.primaryText} />
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => {
            setHistoryFilter('ALL');
            setActiveTab('history');
          }}
          style={styles.tabButton}
        >
          <Ionicons
            name={activeTab === 'history' ? 'document-text' : 'document-text-outline'}
            size={22}
            color={activeTab === 'history' ? Colors.primaryDark : '#000000'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'history' && styles.tabButtonTextActive,
            ]}
          >
            Reports
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setActiveTab('profile')}
          style={styles.tabButton}
        >
          <Ionicons
            name={activeTab === 'profile' ? 'person' : 'person-outline'}
            size={22}
            color={activeTab === 'profile' ? Colors.primaryDark : '#000000'}
          />
          <Text
            style={[
              styles.tabButtonText,
              activeTab === 'profile' && styles.tabButtonTextActive,
            ]}
          >
            Staff
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

// Wrapper to fetch inspection before rendering ReportViewScreen
function ReportWrapper({
  inspectionId,
  onBack,
}: {
  inspectionId: string;
  onBack: () => void;
}) {
  const [inspection, setInspection] = useState<any>(null);

  useEffect(() => {
    LocalDB.getInspectionById(inspectionId).then(setInspection);
  }, [inspectionId]);

  if (!inspection) {
    return (
      <LoadingInspectionAnimation
        message="Compiling Certified Report..."
        subMessage="Formatting 22-page document & evidence"
        dark={true}
      />
    );
  }

  return <ReportViewScreen inspection={inspection} onBack={onBack} />;
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: Colors.slate900,
    width: '100%',
    maxWidth: Platform.OS === 'web' ? 520 : undefined,
    alignSelf: 'center',
  },
  content: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  centerContainer: {
    flex: 1,
    backgroundColor: Colors.slate900,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingBrand: {
    fontSize: 24,
    fontWeight: '900',
    color: Colors.primary,
    letterSpacing: 2,
  },
  loadingSub: {
    fontSize: 12,
    color: Colors.slate400,
    marginTop: 6,
  },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 1.5,
    borderTopColor: '#E2E8F0',
    paddingVertical: 6,
    paddingHorizontal: 8,
    paddingBottom: Platform.OS === 'ios' ? 22 : 6,
    alignItems: 'center',
    justifyContent: 'space-around',
    elevation: 8,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.08,
    shadowRadius: 5,
  },
  tabButton: {
    alignItems: 'center',
    justifyContent: 'center',
    flex: 1,
    paddingVertical: 2,
  },
  tabButtonText: {
    fontSize: 11,
    color: '#000000',
    fontWeight: '700',
    marginTop: 2,
  },
  tabButtonTextActive: {
    color: '#D97706',
    fontWeight: '900',
  },
  floatingActionBtn: {
    width: 54,
    height: 54,
    borderRadius: 27,
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: -24,
    borderWidth: 3.5,
    borderColor: Colors.white,
    elevation: 8,
    shadowColor: Colors.slate900,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 5,
    zIndex: 99,
  },
});
