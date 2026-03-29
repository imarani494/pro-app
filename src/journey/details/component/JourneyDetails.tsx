import React, {useEffect, useState, useRef, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  Animated,
  NativeScrollEvent,
  NativeSyntheticEvent,
  TouchableOpacity,
  Text,
  Easing,
  ActivityIndicator,
  Alert,
  Modal,
} from 'react-native';
import {NativeStackScreenProps} from '@react-navigation/native-stack';
import {JourneyStackParamList} from '../../../navigators/types';
import {Colors} from '../../../styles';
import {CircleX, Calendar, ChevronRight} from 'lucide-react-native';
import {useDispatch, useSelector} from 'react-redux';
import {
  setJourneyId,
  setJourneyJdid,
  setJourneyParamsStatus,
  fetchJourney,
  clearJourneyError,
} from '../../redux/journeySlice';
import User from '../../../data/User';
import {JourneyDetailsInfo} from './JourneyDetailsInfo';
import {journeyData} from '../data/mockData';
import {JourneyHeader} from './JourneyHeader';
import JourneyDayView from './JourneyDayView';
import JourneyTabs, {TabView} from './JourneyTabs';
import JourneyFooter from './JourneyFooter';
import shadows from '../../../styles/shadows';
import {useJournery} from '../../hooks/useJournery';
import {CustomText} from '../../../common/components';
import {DateUtil} from '../../../utils';
import JourneyItineraryModal from './JourneyItineraryBottomSheet';
import {SafeAreaView} from 'react-native-safe-area-context';
import ValidationSummary, {
  ValidationError,
} from '../../validation/ValidationSummary';
import ValidationErrorsModal from '../../validation/ValidationErrorsModal';
import {useAppSelector} from '../../../store';
import CommentCard from './CommentCard';
import AddIntroButton from './AddIntroButton';
// import JourneyLoader from '../../../common/components/JourneyLoader';

type Props = NativeStackScreenProps<JourneyStackParamList, 'JourneyDetails'>;
const cardFrameStyle = {
  borderColor: Colors.lightThemeColors.neutral200,
  backgroundColor: Colors.lightThemeColors.white,
  borderWidth: 1,
};
const JourneyDetails: React.FC<Props> = ({navigation, route}) => {
  const dispatch = useDispatch();
  const journeyDatas = useJournery();
  const journeyState = useAppSelector((state: any) => state.journey);
  const [activeView, setActiveView] = useState<TabView>('day');
  const [showTabs, setShowTabs] = useState(true);
  const [showFloatingTabs, setShowFloatingTabs] = useState(false);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [journeyDetailsHeight, setJourneyDetailsHeight] = useState(0);
  const [currentStickyDay, setCurrentStickyDay] = useState<any>(null);
  const [showStickyDayHeader, setShowStickyDayHeader] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showErrorMessage, setShowErrorMessage] = useState(false);
  const [showDaySelectorModal, setShowDaySelectorModal] = useState(false);
  const [showItineraryModal, setShowItineraryModal] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(0);
  const scrollY = useRef(0);
  const scrollViewRef = useRef<ScrollView>(null);
  const errorHideTimer = useRef<number | null>(null);
  const dayPositions = useRef<{
    [key: number]: {y: number; height: number; day: any};
  }>({});
  const tabsOpacity = useRef(new Animated.Value(1)).current;
  const tabsTranslateY = useRef(new Animated.Value(0)).current;
  const backToTopOpacity = useRef(new Animated.Value(0)).current;
  const stickyDayOpacity = useRef(new Animated.Value(0)).current;

  // Get journeyId and jdid from Redux state
  const journeyId = useSelector((state: any) => state.journey.id);
  const journeyJdid = useSelector((state: any) => state.journey.jdid);
  const isLoading = useSelector((state: any) => state.journey.loading);
  const success = useSelector((state: any) => state.journey.success);
  const errorMessage = useSelector((state: any) => state.journey.errorMessage);
  const hasAttemptedFetch = useSelector(
    (state: any) => state.journey.hasAttemptedFetch || false,
  );
  const [showValidationDialog, setShowValidationDialog] = useState(false);

  const [dialogFilter, setDialogFilter] = useState<
    'error' | 'warning' | 'info' | 'all'
  >('all');

  // Get inEditMode from journey data
  const apiEditMode = useSelector(
    (state: any) => state.journey.journey?.inEditMode,
  );

  // Get journeyId from route params if not in Redux
  const routeJourneyId = route.params?.journeyId;
  const routeJdid = route.params?.jdid;

  // Clear error state when component mounts to prevent showing stale errors
  useEffect(() => {
    dispatch(clearJourneyError());
    setShowErrorMessage(false); // Also reset local error state

    // Cleanup function to clear error state when component unmounts
    return () => {
      dispatch(clearJourneyError());
      setShowErrorMessage(false);
    };
  }, []); // Empty dependency array - runs only on mount/unmount

  useEffect(() => {
    const loadJourneyDetails = async () => {
      // Use route params journeyId if Redux journeyId is not available
      const currentJourneyId = journeyId || routeJourneyId;

      console.log('Loading journey details for ID:', currentJourneyId);

      if (currentJourneyId && currentJourneyId !== '-1') {
        // Skip if already loading to prevent duplicate calls
        if (isLoading) {
          console.log('Already loading, skipping...');
          return;
        }
        // Set journeyId in Redux if it's not already set
        if (!journeyId && routeJourneyId) {
          dispatch(setJourneyId(routeJourneyId));
        }
        // Set jdid in Redux if it's not already set
        if (!journeyJdid && routeJdid) {
          dispatch(setJourneyJdid(routeJdid));
        }

        try {
          // Get auth token
          const authToken = await User.getAuthToken();
          const userId = User.getUserId();

          if (authToken && userId) {
            // Set journey params (you can customize these as needed)
            dispatch(
              setJourneyParamsStatus({
                params: {
                  save: 'true', // or get from route params
                },
              }),
            );

            // Fetch journey details
            const fetchParams: any = {
              id: currentJourneyId,
              jdid: routeJdid,
              _auth: authToken,
              userId: userId,
            };
            // Initial load is always without edit parameter

            dispatch(fetchJourney(fetchParams) as any).then((r: any) => {
            if (r.payload && r.payload.success) {
              } else {
                console.log(
                  'Failed to enter edit mode:',
                  r.payload?.error_msg || 'Failed to enter edit mode',
                );
              }
            }).catch((error: any) => {
              console.error('Error in fetchJourney:', error);
            });
          } else {
            console.log('Auth token or userId not available');
          }
        } catch (error) {
          console.error('Error loading journey details:', error);
        }
      } else {
        console.log('No valid journeyId found');
      }
    };

    loadJourneyDetails();
  }, [journeyId, routeJourneyId, dispatch]);

  // Auto-hide error message after 5 seconds
  useEffect(() => {
    if (!isLoading && success === false && errorMessage && hasAttemptedFetch) {
      setShowErrorMessage(true);

      // Clear existing timer if any
      if (errorHideTimer.current) {
        clearTimeout(errorHideTimer.current);
      }

      // Set timer to hide error after 5 seconds
      errorHideTimer.current = setTimeout(() => {
        setShowErrorMessage(false);
        dispatch(clearJourneyError()); // Clear Redux error state too
      }, 5000);
    } else {
      setShowErrorMessage(false);
      if (errorHideTimer.current) {
        clearTimeout(errorHideTimer.current);
        errorHideTimer.current = null;
      }
    }

    // Cleanup timeout on unmount
    return () => {
      if (errorHideTimer.current) {
        clearTimeout(errorHideTimer.current);
      }
    };
  }, [isLoading, success, errorMessage, hasAttemptedFetch]);

  // Example usage of setJourneyId
  const handleSetJourneyId = (journeyId: string) => {
    dispatch(setJourneyId(journeyId));
  };

  const handleScroll = (event: NativeSyntheticEvent<NativeScrollEvent>) => {
    const currentScrollY = event.nativeEvent.contentOffset.y;
    const contentHeight = event.nativeEvent.contentSize.height;
    const layoutHeight = event.nativeEvent.layoutMeasurement.height;
    const scrollDirection = currentScrollY > scrollY.current ? 'down' : 'up';
    const scrollDelta = Math.abs(currentScrollY - scrollY.current);

    // Calculate scroll percentage (70% of scrollable content)
    const maxScrollY = contentHeight - layoutHeight;
    const scrollProgress = currentScrollY / maxScrollY;
    const shouldShowBackToTop = scrollProgress >= 0.7 && maxScrollY > 0;

    // Only trigger animation if scroll delta is significant (avoid micro scrolls)
    if (scrollDelta > 5) {
      // Use JourneyDetailsInfo height as threshold, fallback to 300px if not measured yet
      const detailsThreshold =
        journeyDetailsHeight > 0 ? journeyDetailsHeight : 300;

      if (
        scrollDirection === 'down' &&
        showFloatingTabs &&
        currentScrollY > detailsThreshold + 50
      ) {
        // Hide floating tabs when scrolling down past the details info
        Animated.parallel([
          Animated.timing(tabsOpacity, {
            toValue: 0,
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
          Animated.timing(tabsTranslateY, {
            toValue: -60,
            duration: 400,
            easing: Easing.bezier(0.25, 0.1, 0.25, 1),
            useNativeDriver: true,
          }),
        ]).start(() => {
          setShowFloatingTabs(false);
        });
      } else if (
        scrollDirection === 'up' &&
        !showFloatingTabs &&
        currentScrollY > detailsThreshold
      ) {
        // Show floating tabs when scrolling up (if we're past the details info)
        setShowFloatingTabs(true);
        // Start from a hidden position and animate in
        tabsOpacity.setValue(0);
        tabsTranslateY.setValue(-60);

        Animated.parallel([
          Animated.timing(tabsOpacity, {
            toValue: 1,
            duration: 500,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
          Animated.timing(tabsTranslateY, {
            toValue: 0,
            duration: 500,
            easing: Easing.bezier(0.25, 0.46, 0.45, 0.94),
            useNativeDriver: true,
          }),
        ]).start();
      } else if (currentScrollY < detailsThreshold) {
        // Hide floating tabs when we're back above the details info (show normal tabs)
        if (showFloatingTabs) {
          Animated.parallel([
            Animated.timing(tabsOpacity, {
              toValue: 0,
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
            Animated.timing(tabsTranslateY, {
              toValue: -40,
              duration: 300,
              easing: Easing.bezier(0.25, 0.1, 0.25, 1),
              useNativeDriver: true,
            }),
          ]).start(() => {
            setShowFloatingTabs(false);
          });
        }
      }

      // Handle sticky day header
      if (currentScrollY > detailsThreshold + 100) {
        // Find the current visible day based on actual scroll position
        const dayPositionsArray = Object.values(dayPositions.current);
        if (dayPositionsArray.length > 0) {
          // Find which day is currently at the top of the viewport
          let newCurrentDay = null;

          for (let i = 0; i < dayPositionsArray.length; i++) {
            const dayPos = dayPositionsArray[i];
            const dayTop = dayPos.y;
            const dayBottom = dayPos.y + dayPos.height;

            // Check if this day is currently visible at the top of the viewport
            // Add some offset to account for the sticky header position
            if (
              currentScrollY >= dayTop - 50 &&
              currentScrollY < dayBottom - 50
            ) {
              newCurrentDay = dayPos.day;
              break;
            }
          }

          // If we're past all days, show the last day
          if (!newCurrentDay && dayPositionsArray.length > 0) {
            const lastDay = dayPositionsArray[dayPositionsArray.length - 1];
            if (currentScrollY >= lastDay.y) {
              newCurrentDay = lastDay.day;
            }
          }

          if (
            newCurrentDay &&
            (!currentStickyDay ||
              newCurrentDay.dayNum !== currentStickyDay.dayNum)
          ) {
            setCurrentStickyDay(newCurrentDay);
          }

          if (!showStickyDayHeader) {
            setShowStickyDayHeader(true);
            Animated.timing(stickyDayOpacity, {
              toValue: 1,
              duration: 300,
              useNativeDriver: true,
            }).start();
          }
        }
      } else {
        if (showStickyDayHeader) {
          setShowStickyDayHeader(false);
          Animated.timing(stickyDayOpacity, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }).start(() => {
            setCurrentStickyDay(null);
          });
        }
      }

      // Handle back to top button visibility (show at 70% scroll)
      if (shouldShowBackToTop && !showBackToTop) {
        setShowBackToTop(true);
        Animated.timing(backToTopOpacity, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }).start();
      } else if (!shouldShowBackToTop && showBackToTop) {
        setShowBackToTop(false);
        Animated.timing(backToTopOpacity, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }).start();
      }
    }

    scrollY.current = currentScrollY;
  };

  const handleBackToTop = () => {
    scrollViewRef.current?.scrollTo({x: 0, y: 0, animated: true});
  };

  const handleScrollToDay = (dayNum: number) => {
    console.log('Scrolling to day:', dayNum);

    if (!scrollViewRef.current) {
      console.log('Scroll view ref not available');
      setShowDaySelectorModal(false);
      return;
    }

    // First, try to use stored positions if available and reliable
    const dayPosition = dayPositions.current[dayNum];
    if (dayPosition && Object.keys(dayPositions.current).length > 0) {
      // Calculate cumulative position using stored measurements
      let cumulativeY = 0;
      const sortedDayNums = Object.keys(dayPositions.current)
        .map(num => parseInt(num))
        .sort((a, b) => a - b);

      for (const num of sortedDayNums) {
        if (num < dayNum) {
          cumulativeY += dayPositions.current[num].height + 16; // Add day height + margin
        } else if (num === dayNum) {
          break;
        }
      }

      const headerOffset = (journeyDetailsHeight || 300) + 60; // Reduced offset for better positioning
      const targetY = headerOffset + cumulativeY;

      console.log('Using stored positions - Target Y:', targetY);
      console.log('Cumulative Y:', cumulativeY, 'Header offset:', headerOffset);

      // Smooth scroll with better positioning
      scrollViewRef.current.scrollTo({
        x: 0,
        y: Math.max(0, targetY),
        animated: true,
      });
    } else {
      // Fallback: Use estimated positioning with improved accuracy
      const dayIndex = journeyDatas?.journey?.dyA?.findIndex(
        (day: any) => day.dayNum === dayNum,
      );

      if (dayIndex === -1) {
        console.log('Day not found in journey data');
        setShowDaySelectorModal(false);
        return;
      }

      // More conservative and accurate estimation
      const avgDayHeight = 280; // Reduced estimated height
      const dayMargin = 16;
      const headerOffset = (journeyDetailsHeight || 300) + 60; // Reduced offset
      const estimatedY = headerOffset + dayIndex * (avgDayHeight + dayMargin);

      console.log('Using estimation - Target Y:', estimatedY);
      console.log(
        'Day index:',
        dayIndex,
        'Estimated height per day:',
        avgDayHeight + dayMargin,
      );

      scrollViewRef.current.scrollTo({
        x: 0,
        y: Math.max(0, estimatedY),
        animated: true,
      });
    }

    setShowDaySelectorModal(false);
  };
  const handleFABPress = () => {
    setShowItineraryModal(true);
  };

  const handleOpenItinerary = () => {
    setShowItineraryModal(true);
  };

  const handleDaySelect = (dayNumber: number) => {
    handleScrollToDay(dayNumber);
    setShowItineraryModal(false);
  };

  const handleCloseItinerary = () => {
    setShowItineraryModal(false);
  };

  const handleEditClick = async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('Already loading, skipping edit click...');
      return;
    }

    // Use route params journeyId if Redux journeyId is not available
    const currentJourneyId = journeyId || routeJourneyId;
    if (currentJourneyId && currentJourneyId !== '-1') {
      // Set journeyId in Redux if it's not already set
      if (!journeyId && routeJourneyId) {
        dispatch(setJourneyId(routeJourneyId));
      }
      // Set jdid in Redux if it's not already set
      if (!journeyJdid && routeJdid) {
        dispatch(setJourneyJdid(routeJdid));
      }
      try {
        // Get auth token
        const authToken = await User.getAuthToken();
        const userId = User.getUserId();

        if (authToken && userId) {
          // Set journey params (you can customize these as needed)
          dispatch(
            setJourneyParamsStatus({
              params: {
                save: 'true', // or get from route params
              },
            }),
          );

          // Set edit mode to true and fetch journey details
          dispatch(
            fetchJourney({
              id: currentJourneyId,
              jdid: routeJdid,
              _auth: authToken,
              userId: userId,
              edit: '&edit=true',
            }) as any,
          ).then((r: any) => {
            console.log('FetchJourney resolved', r);
            if (r.payload && r.payload.success) {
              setIsEditMode(true); // Only set edit mode on success
            } else {
              console.log(
                'Failed to enter edit mode:',
                r.payload?.error_msg || 'Failed to enter edit mode',
              );
            }
          });
        } else {
          console.log('Auth token or userId not available');
        }
      } catch (error) {
        console.error('Error loading journey details:', error);
      }
    } else {
      console.log('No valid journeyId found');
    }
  };

  const existingComments = useMemo(() => {
    return journeyState?.journey?.advCmtA || [];
  }, [journeyState?.journey?.advCmtA]);

  const {
    validationErrors,
    validationWarnings,
    validationInfos,
    validationsByDay,
  } = useMemo(() => {
    const errors: ValidationError[] = [];
    const warnings: ValidationError[] = [];
    const infos: ValidationError[] = [];
    const byDay: Record<
      number,
      {
        errors: ValidationError[];
        warnings: ValidationError[];
        infos: ValidationError[];
      }
    > = {};

    if (journeyState.vldArr && journeyState.vldArr.length > 0) {
      journeyState.vldArr.forEach((vld: any, index: number) => {
        const resolutions =
          vld.resA?.map((res: any, resIndex: number) => ({
            id: res.id || `res-${index}-${resIndex}`,
            text: res.msg || '',
            actionLabel:
              Array.isArray(res.actA) && res.actA.length > 0
                ? res.actA.map((a: {name: string}) => a.name).join(', ')
                : 'Undefined',
            actions: res.actA || [],
          })) || [];

        const validation: ValidationError = {
          date: vld.date,
          id: vld.id || `vld-${index}`,
          type:
            vld.sev === 'ERROR'
              ? 'error'
              : vld.sev === 'INFO'
              ? 'info'
              : 'warning',
          message: vld.msg || vld.message || '',
          blockId: vld.bid || vld.blockId,
          blockType: vld.btyp,
          blockTypeData: vld.btypD,
          isAcceptAllowed: vld?.isAccAllw || false,
          isAcceptRequest: vld?.isAccRq || false,
          accO: vld?.accO || null,
          dayNum: vld.dayNum,
          title: vld.ttl || vld.title || vld.msg || vld.message,
          description: vld.desc || vld.description,
          resolutions: resolutions.length > 0 ? resolutions : [],
        };

        // Group by day
        const dayNum = validation.dayNum || 0;
        if (!byDay[dayNum]) {
          byDay[dayNum] = {errors: [], warnings: [], infos: []};
        }

        switch (validation.type) {
          case 'error':
            errors.push(validation);
            byDay[dayNum].errors.push(validation);
            break;
          case 'warning':
            warnings.push(validation);
            byDay[dayNum].warnings.push(validation);
            break;
          case 'info':
            infos.push(validation);
            byDay[dayNum].infos.push(validation);
            break;
        }
      });
    }

    return {
      validationErrors: errors,
      validationWarnings: warnings,
      validationInfos: infos,
      validationsByDay: byDay,
    };
  }, [journeyState.vldArr]);

  const handleViewAllValidations = (type?: 'error' | 'warning' | 'info') => {
    if (type) {
      setDialogFilter(type);
      setShowValidationDialog(true);
    }
  };

  const getValidationItems = () => {
    switch (dialogFilter) {
      case 'error':
        return validationErrors;
      case 'warning':
        return validationWarnings;
      case 'info':
        return validationInfos;
      default:
        return [];
    }
  };

  const handleCloseValidationModal = () => {
    setShowValidationDialog(false);
  };

  const handleViewItem = (item: ValidationError) => {
    // Handle navigation to the specific item
    console.log('View item:', item);
    // You can implement navigation logic here
  };

  const handleResolutionAction = (
    item: ValidationError,
    resolution: {
      id: string;
      text: string;
      actionLabel?: string;
      actions?: any[];
    },
  ) => {
    // Handle resolution action
    console.log('Resolution action:', item, resolution);
    // You can implement action logic here
  };

  const handleDoneChanges = async () => {
    // Prevent multiple simultaneous calls
    if (isLoading) {
      console.log('Already loading, skipping done changes...');
      return;
    }

    // Call normal API without edit parameter
    const currentJourneyId = journeyId || routeJourneyId;
    if (currentJourneyId && currentJourneyId !== '-1') {
      try {
        const authToken = await User.getAuthToken();
        const userId = User.getUserId();

        if (authToken && userId) {
          const fetchParams: any = {
            id: currentJourneyId,
            jdid: routeJdid,
            _auth: authToken,
            userId: userId,
          };
          // No edit parameter for done changes

          dispatch(fetchJourney(fetchParams) as any).then((r: any) => {
            console.log('Done changes - Journey refetched', r);
            if (r.payload && r.payload.success) {
              setIsEditMode(false); // Exit edit mode
              console.log('Changes saved successfully');
            } else {
              console.log(
                'Failed to save changes:',
                r.payload?.error_msg || 'Failed to save changes',
              );
            }
          });
        } else {
          console.log('Authentication required');
        }
      } catch (error) {
        console.error('Error in done changes:', error);
      }
    }
  };

  const handleBookNow = () => {
    Alert.alert('Book Now', 'Booking functionality will be implemented here.');
  };

  const renderLoadingScreen = () => {
    return (
      <View style={styles.loadingContainer}>
        <View style={styles.loadingCard}>
          <View style={styles.loadingIconContainer}>
            <ActivityIndicator
              size="small"
              color={Colors.lightThemeColors.neutral900}
            />
          </View>
          <CustomText
            variant="text-base-semibold"
            color="neutral900"
            style={styles.loadingTitle}>
            Loading package...
          </CustomText>
          <CustomText
            variant="text-sm-normal"
            color="neutral600"
            style={styles.loadingSubtitle}>
            This will only take a moment
          </CustomText>
        </View>
      </View>
    );
  };

  const registerDayPosition = (
    dayNum: number,
    y: number,
    height: number,
    day: any,
  ) => {
    console.log('Registering day position:', {
      dayNum,
      y,
      height,
      title: day.ttl,
    });
    dayPositions.current[dayNum] = {y, height, day};
  };

  const renderTabContent = () => {
    switch (activeView) {
      case 'day':
        return (
          <JourneyDayView
            journeyData={journeyDatas.journey}
            isDetailedView={activeView === 'day' ? true : false}
            registerDayPosition={registerDayPosition}
          />
        );
      case 'summary':
        return (
          <View style={styles.placeholderView}>
            {/* Add JourneySummaryView component here */}
          </View>
        );
      case 'detailed':
        return (
          <View style={styles.placeholderView}>
            {/* Add JourneyDetailedView component here */}
          </View>
        );
      case 'map':
        return (
          <View style={styles.placeholderView}>
            {/* Add JourneyMapView component here */}
          </View>
        );
      default:
        return (
          <JourneyDayView
            journeyData={journeyDatas.journey}
            isDetailedView={activeView === 'day' ? true : false}
            registerDayPosition={registerDayPosition}
          />
        );
    }
  };

  // Show loading screen while data is being fetched
  if (isLoading) {
    return renderLoadingScreen();
    // <JourneyLoader />;
  }

  // Show loading screen if journey data is not available yet
  if (!journeyDatas?.journey) {
    return renderLoadingScreen();
    // <JourneyLoader />;
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.container}>
        <View
          style={styles.headerSection}
          onLayout={event => {
            const {height} = event.nativeEvent.layout;
            if (height !== headerHeight) {
              setHeaderHeight(height);
            }
          }}>
          <JourneyHeader
            onEditPress={apiEditMode ? undefined : handleEditClick}
            showEditButton={!apiEditMode}
          />
        </View>
        <View style={styles.contentSection}>
          <ScrollView
            ref={scrollViewRef}
            onScroll={handleScroll}
            scrollEventThrottle={16}
            contentContainerStyle={{
              flexGrow: 1,
              flexDirection: 'column',
              paddingBottom: 20,
            }}>
            <View style={styles.headerSection}>
              <View
                onLayout={event => {
                  const height = event.nativeEvent.layout.height;
                  setJourneyDetailsHeight(height);
                }}>
                <JourneyDetailsInfo data={journeyDatas.journey} />
              </View>

              {!showFloatingTabs && (
                <JourneyTabs
                  activeView={activeView}
                  onTabChange={setActiveView}
                  showMapTab={false}
                />
              )}
            </View>
            {/* Validation Summary */}
            <ValidationSummary
              errors={validationErrors}
              warnings={validationWarnings}
              infos={validationInfos}
              onViewAllErrors={() => handleViewAllValidations('error')}
              onViewAllWarnings={() => handleViewAllValidations('warning')}
              onViewAllInfos={() => handleViewAllValidations('info')}
            />
            {existingComments.length > 0 ? (
              <View style={styles.commentsContainer}>
                {existingComments.map(
                  (
                    comment: {
                      comment: string;
                      commentId: string;
                      userName: string;
                      time: string;
                    },
                    index: number,
                  ) => (
                    <CommentCard
                      key={comment.commentId || `comment-${index}`}
                      id={comment.commentId || `comment-${index}`}
                      comment={comment.comment || ''}
                      author={comment.userName || ''}
                      time={
                        comment.time
                          ? new Date(comment.time).toLocaleTimeString([], {
                              hour: '2-digit',
                              minute: '2-digit',
                            })
                          : ''
                      }
                    />
                  ),
                )}
              </View>
            ) : (
              <AddIntroButton />
            )}
            <View style={styles.contentSection}>{renderTabContent()}</View>
          </ScrollView>
        </View>
        {showErrorMessage ? (
          <View style={styles.errorContainer}>
            <View style={styles.errorContent}>
              <CircleX size={20} color={Colors.lightThemeColors.red700} />
              <View style={styles.errorTextContainer}>
                <CustomText variant="text-sm-normal" color="red700">
                  {errorMessage}
                </CustomText>
              </View>
            </View>
          </View>
        ) : null}
        <JourneyFooter
          isEditMode={apiEditMode}
          onDoneChanges={handleDoneChanges}
          onBookNow={handleBookNow}
          onFABPress={handleFABPress}
          journeyData={journeyDatas?.journey}
        />

        {/* Journey Itinerary Modal */}
        <JourneyItineraryModal
          visible={showItineraryModal}
          journey={journeyDatas?.journey}
          onDaySelect={handleDaySelect}
          onClose={handleCloseItinerary}
        />

        {/* Validation Errors Modal */}
        <ValidationErrorsModal
          visible={showValidationDialog}
          errors={
            dialogFilter === 'error' || dialogFilter === 'all'
              ? validationErrors
              : []
          }
          warnings={
            dialogFilter === 'warning' || dialogFilter === 'all'
              ? validationWarnings
              : []
          }
          infos={
            dialogFilter === 'info' || dialogFilter === 'all'
              ? validationInfos
              : []
          }
          onClose={handleCloseValidationModal}
          onViewItem={handleViewItem}
          onResolutionAction={handleResolutionAction}
        />

        {/* Floating Tabs */}
        {showFloatingTabs && (
          <Animated.View
            style={[
              styles.floatingTabs,
              {
                top: headerHeight || styles.floatingTabs.top,
                opacity: tabsOpacity,
                transform: [{translateY: tabsTranslateY}],
              },
            ]}
            pointerEvents={'auto'}>
            <JourneyTabs
              activeView={activeView}
              onTabChange={setActiveView}
              showMapTab={false}
            />
          </Animated.View>
        )}

        {/* Sticky Day Header */}
        {/* {showStickyDayHeader && currentStickyDay && (
        <Animated.View
          style={[
            styles.stickyDayHeader,
            {
              opacity: stickyDayOpacity,
            },
          ]}
          pointerEvents="none">
          <View style={styles.stickyDayContent}>
            <CustomText variant="text-sm-semibold" color="white">
              Day {currentStickyDay.dayNumD || currentStickyDay.dayNum}:{' '}
              {DateUtil.getDisplayDate(currentStickyDay?.date)}
            </CustomText>
            {currentStickyDay.ttl && (
              <CustomText variant="text-xs-normal" color="neutral200">
                {currentStickyDay.ttl}
              </CustomText>
            )}
          </View>
        </Animated.View>
      )} */}

        {/* Back to Top Button */}
        <Animated.View
          style={[
            styles.backToTopButton,
            {
              opacity: backToTopOpacity,
            },
          ]}
          pointerEvents={showBackToTop ? 'auto' : 'none'}>
          <TouchableOpacity
            style={styles.backToTopTouchable}
            onPress={handleBackToTop}
            activeOpacity={0.7}>
            <Text style={styles.backToTopText}>↑ Back to Top</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Day Selector Modal */}
        <Modal
          visible={showDaySelectorModal}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setShowDaySelectorModal(false)}>
          <TouchableOpacity
            style={styles.modalOverlay}
            activeOpacity={1}
            onPress={() => setShowDaySelectorModal(false)}>
            <TouchableOpacity
              style={styles.modalContent}
              activeOpacity={1}
              onPress={e => e.stopPropagation()}>
              {/* Modal Handle */}
              <View style={styles.modalHandle} />
              <View style={styles.modalHeader}>
                <CustomText variant="text-lg-semibold" color="neutral900">
                  Select Day
                </CustomText>
                <TouchableOpacity
                  onPress={() => setShowDaySelectorModal(false)}
                  style={styles.modalCloseButton}>
                  <CircleX
                    size={24}
                    color={Colors.lightThemeColors.neutral600}
                  />
                </TouchableOpacity>
              </View>

              <ScrollView style={styles.modalScrollView}>
                {journeyDatas?.journey?.dyA?.map((day: any, index: number) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.dayItem}
                    onPress={() => handleScrollToDay(day.dayNum)}
                    activeOpacity={0.7}>
                    <View style={styles.dayItemContent}>
                      <View style={styles.dayInfo}>
                        <CustomText
                          variant="text-base-semibold"
                          color="neutral900">
                          Day {day.dayNumD || day.dayNum}:{' '}
                          {day.ctyA?.[0]?.nm || 'Unknown Location'}
                        </CustomText>
                        <CustomText
                          variant="text-sm-normal"
                          color="neutral600"
                          style={styles.dayDate}>
                          {DateUtil.getDisplayDate(day.date)}
                        </CustomText>
                        {day.ttl && (
                          <CustomText
                            variant="text-sm-normal"
                            color="neutral700"
                            style={styles.dayTitle}>
                            {day.ttl}
                          </CustomText>
                        )}
                      </View>
                      <ChevronRight
                        size={20}
                        color={Colors.lightThemeColors.neutral400}
                      />
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  headerSection: {
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  contentSection: {
    backgroundColor: Colors.lightThemeColors.white,
    flex: 1,
  },
  placeholderView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  floatingTabs: {
    position: 'absolute',
    top: 115, // Position below the header (adjust based on header height)
    left: 0,
    right: 0,
    backgroundColor: Colors.lightThemeColors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
    zIndex: 1000,
  },
  stickyDayHeader: {
    position: 'absolute',
    top: 115, // Same level as floating tabs
    left: 0,
    right: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.85)',
    zIndex: 999, // Below floating tabs but above content
  },
  stickyDayContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    alignItems: 'center',
  },
  backToTopButton: {
    position: 'absolute',
    bottom: 120, // Position above the footer
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 1001,
  },
  backToTopTouchable: {
    backgroundColor: Colors.lightThemeColors.transparent,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 25,
    ...shadows['shadow-md'],
  },
  backToTopText: {
    color: Colors.lightThemeColors.white,
    fontSize: 14,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingCard: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    ...shadows['shadow-lg'],
  },
  loadingIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: Colors.lightThemeColors.neutral100,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  loadingTitle: {
    marginBottom: 6,
    textAlign: 'center',
  },
  loadingSubtitle: {
    textAlign: 'center',
  },
  errorContainer: {
    marginHorizontal: 16,
    position: 'absolute',
    bottom: 120,
    padding: 16,
    width: '90%',
    backgroundColor: Colors.lightThemeColors.red50,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.red200,
    zIndex: 1002,
  },
  errorContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  errorTextContainer: {
    flex: 1,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: Colors.lightThemeColors.white,
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    maxHeight: '65%',
    paddingTop: 8,
    elevation: 10,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHandle: {
    width: 40,
    height: 4,
    backgroundColor: Colors.lightThemeColors.neutral300,
    borderRadius: 2,
    alignSelf: 'center',
    marginBottom: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  modalCloseButton: {
    padding: 4,
  },
  modalScrollView: {
    paddingHorizontal: 20,
  },
  dayItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral100,
  },
  dayItemContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayInfo: {
    flex: 1,
  },
  dayDate: {
    marginTop: 4,
  },
  dayTitle: {
    marginTop: 2,
  },
  commentsContainer: {
    marginHorizontal: 16,
  },
});

export default JourneyDetails;
