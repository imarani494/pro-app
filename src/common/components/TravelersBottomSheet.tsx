import React, {useState, useEffect} from 'react';
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {BottomSheetScrollView} from '@gorhom/bottom-sheet';
import {useTheme} from '../../context/ThemeContext';
import CustomBottomSheet from './CustomBottomSheet';
import CustomText from './CustomText';
import CustomButton from './CustomButton';
import CounterInput from './CounterInput';
import {Colors} from '../../styles';
import {Minus, Plus, ChevronDown, DoorOpen, X} from 'lucide-react-native';
import {flex} from '../../styles/typography';
import shadows from '../../styles/shadows';

export interface TravelersBottomSheetProps {
  bottomSheetOptions: {
    bottomSheetRef: React.RefObject<any>;
    openBottomSheet: () => void;
    closeBottomSheet: () => void;
  };
  travelerSelection: any;
  onClose: () => void;
  updateRoomAdults: (roomId: string, adults: number) => void;
  updateRoomChildren: (roomId: string, childrenCount: number) => void;
  updateChildAge: (roomId: string, childId: string, age: string) => void;
  removeRoom: (roomId: string) => void;
  addRoom: () => void;
  childAgeOptions: string[];
  onUpdateTravelerSelection?: (updatedSelection: any) => void;
}

const TravelersBottomSheet = ({
  bottomSheetOptions,
  travelerSelection,
  onClose,
  updateRoomAdults,
  updateRoomChildren,
  updateChildAge,
  removeRoom,
  addRoom,
  childAgeOptions,
  onUpdateTravelerSelection,
}: TravelersBottomSheetProps) => {
  const {colors} = useTheme();

  // Local state to manage travelers data before confirming
  const [localTravelerSelection, setLocalTravelerSelection] =
    useState(travelerSelection);

  // State for age selection bottom sheet
  const [ageSelectionVisible, setAgeSelectionVisible] = useState(false);
  const [selectedChildForAge, setSelectedChildForAge] = useState<{
    roomId: string;
    childId: string;
    currentAge: string;
  } | null>(null);

  // Reset local state when travelerSelection changes (bottom sheet opens)
  useEffect(() => {
    setLocalTravelerSelection(travelerSelection);
  }, [travelerSelection]);

  // Local functions that update only the local state
  const localUpdateRoomAdults = (roomId: string, adults: number) => {
    setLocalTravelerSelection((prev: any) => ({
      ...prev,
      rooms: prev.rooms.map((room: any) =>
        room.id === roomId ? {...room, adults} : room,
      ),
    }));
  };

  const localUpdateRoomChildren = (roomId: string, childrenCount: number) => {
    setLocalTravelerSelection((prev: any) => ({
      ...prev,
      rooms: prev.rooms.map((room: any) => {
        if (room.id === roomId) {
          const children = Array.from({length: childrenCount}, (_, i) => ({
            id: `child-${i + 1}`,
            age: room.children[i]?.age || '<2 yrs',
          }));
          return {...room, children};
        }
        return room;
      }),
    }));
  };

  const localUpdateChildAge = (
    roomId: string,
    childId: string,
    age: string,
  ) => {
    setLocalTravelerSelection((prev: any) => ({
      ...prev,
      rooms: prev.rooms.map((room: any) => {
        if (room.id === roomId) {
          return {
            ...room,
            children: room.children.map((child: any) =>
              child.id === childId ? {...child, age} : child,
            ),
          };
        }
        return room;
      }),
    }));
  };

  const localRemoveRoom = (roomId: string) => {
    setLocalTravelerSelection((prev: any) => ({
      ...prev,
      rooms: prev.rooms.filter((room: any) => room.id !== roomId),
    }));
  };

  const localAddRoom = () => {
    const newRoomId = `room-${Date.now()}`;
    setLocalTravelerSelection((prev: any) => ({
      ...prev,
      rooms: [
        ...prev.rooms,
        {
          id: newRoomId,
          adults: 2,
          children: [],
        },
      ],
    }));
  };

  // Function to apply all changes when "Add Travelers" is clicked
  const handleAddTravelers = () => {
    // Calculate the updated totalDisplay for the local selection
    const updateTravelerDisplay = (rooms: any[]): string => {
      const totalRooms = rooms.length;
      const totalAdults = rooms.reduce(
        (sum: number, room: any) => sum + room.adults,
        0,
      );
      const totalChildren = rooms.reduce(
        (sum: number, room: any) => sum + room.children.length,
        0,
      );

      let display = `${totalRooms} room${
        totalRooms > 1 ? 's' : ''
      }, ${totalAdults} adult${totalAdults > 1 ? 's' : ''}`;
      if (totalChildren > 0) {
        display += `, ${totalChildren} child${totalChildren > 1 ? 'ren' : ''}`;
      }
      return display;
    };

    // Create the updated selection with proper totalDisplay
    const updatedSelection = {
      ...localTravelerSelection,
      totalDisplay: updateTravelerDisplay(localTravelerSelection.rooms),
    };

    // If we have the callback prop, use it to update the entire selection at once
    if (onUpdateTravelerSelection) {
      onUpdateTravelerSelection(updatedSelection);
    } else {
      // Fallback to the complex synchronization logic
      // Clear existing rooms except first, then rebuild
      const targetRoomsCount = localTravelerSelection.rooms.length;
      const currentRoomsCount = travelerSelection.rooms.length;

      // Add or remove rooms to match target count
      if (targetRoomsCount > currentRoomsCount) {
        for (let i = currentRoomsCount; i < targetRoomsCount; i++) {
          addRoom();
        }
      } else if (targetRoomsCount < currentRoomsCount) {
        for (let i = currentRoomsCount; i > targetRoomsCount; i--) {
          const lastRoom = travelerSelection.rooms[i - 1];
          if (lastRoom) {
            removeRoom(lastRoom.id);
          }
        }
      }

      // Update all room details
      setTimeout(() => {
        localTravelerSelection.rooms.forEach(
          (localRoom: any, index: number) => {
            const originalRoom = travelerSelection.rooms[index];
            if (originalRoom) {
              updateRoomAdults(originalRoom.id, localRoom.adults);
              updateRoomChildren(originalRoom.id, localRoom.children.length);
              localRoom.children.forEach((child: any, childIndex: number) => {
                const originalChild = originalRoom.children[childIndex];
                if (originalChild) {
                  updateChildAge(originalRoom.id, originalChild.id, child.age);
                }
              });
            }
          },
        );
      }, 50);
    }

    onClose();
  };

  // Function to open age selection bottom sheet
  const openAgeSelection = (
    roomId: string,
    childId: string,
    currentAge: string,
  ) => {
    setSelectedChildForAge({roomId, childId, currentAge});
    setAgeSelectionVisible(true);
  };

  // Function to handle age selection
  const handleAgeSelection = (selectedAge: string) => {
    if (selectedChildForAge) {
      localUpdateChildAge(
        selectedChildForAge.roomId,
        selectedChildForAge.childId,
        selectedAge,
      );
    }
    setAgeSelectionVisible(false);
    setSelectedChildForAge(null);
  };

  // Helper function to group children into rows of 2
  const groupChildrenIntoRows = (children: any[]) => {
    const rows = [];
    for (let i = 0; i < children.length; i += 2) {
      rows.push(children.slice(i, i + 2));
    }
    return rows;
  };

  const renderRoomSection = (room: any, roomIndex: number) => {
    const childrenRows = groupChildrenIntoRows(room.children);

    return (
      <View key={room.id}>
        {/* {roomIndex > 0 && (
        <View
          style={[styles.separator, {backgroundColor: colors.neutral200}]}
        />
      )} */}

        {/* Room Header */}
        <View style={styles.roomHeader}>
          <DoorOpen size={18} color={colors.blue500} style={{marginRight: 8}} />
          <CustomText variant="text-sm-semibold" color="blue500">
            Room {roomIndex + 1}
          </CustomText>
        </View>
        <View style={styles.roomSection}>
          {/* Adults Section */}
          <View style={[styles.counterRow, {marginBottom: 20}]}>
            <CustomText variant="text-base-normal" color="neutral900">
              No. of Adults*
            </CustomText>
            <CounterInput
              value={room.adults}
              onIncrement={() =>
                localUpdateRoomAdults(room.id, room.adults + 1)
              }
              onDecrement={() =>
                localUpdateRoomAdults(room.id, room.adults - 1)
              }
              minValue={1}
              maxValue={10}
            />
          </View>

          {/* Children Section */}
          <View style={styles.counterRow}>
            <CustomText variant="text-base-normal" color="neutral900">
              No. of Children*
            </CustomText>
            <CounterInput
              value={room.children.length}
              onIncrement={() =>
                localUpdateRoomChildren(room.id, room.children.length + 1)
              }
              onDecrement={() =>
                localUpdateRoomChildren(room.id, room.children.length - 1)
              }
              minValue={0}
              maxValue={4}
            />
          </View>

          {/* Children Age Dropdowns */}
          {childrenRows.length > 0 && (
            <View style={styles.childrenAgeSection}>
              {childrenRows.map((row, rowIndex) => (
                <View key={`row-${rowIndex}`} style={styles.childAgeRow}>
                  {row.map((child: any, childIndex: number) => {
                    const globalChildIndex = rowIndex * 2 + childIndex;
                    return (
                      <View key={child.id} style={styles.childAgeItem}>
                        <CustomText
                          variant="text-sm-normal"
                          color="neutral600"
                          style={styles.childLabel}>
                          Child {globalChildIndex + 1}
                        </CustomText>
                        <TouchableOpacity
                          style={[
                            styles.agePickerContainer,
                            {borderColor: colors.neutral200},
                          ]}
                          onPress={() => {
                            openAgeSelection(
                              room.id,
                              child.id,
                              child.age || '<2 yrs',
                            );
                          }}>
                          <CustomText style={styles.agePicker}>
                            {child.age || '<2 yrs'}
                          </CustomText>
                          <ChevronDown size={12} color={colors.neutral600} />
                        </TouchableOpacity>
                      </View>
                    );
                  })}
                  {/* Add empty placeholders if the row has less than 2 items */}
                  {row.length < 2 &&
                    Array.from({length: 2 - row.length}).map(
                      (_, emptyIndex) => (
                        <View
                          key={`empty-${rowIndex}-${emptyIndex}`}
                          style={styles.childAgeItem}
                        />
                      ),
                    )}
                </View>
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <>
      <CustomBottomSheet
        ref={bottomSheetOptions.bottomSheetRef}
        snapPoints={['80%']}
        title="Add Travelers"
        onClose={onClose}
        enablePanDownToClose={true}>
        <BottomSheetScrollView
          style={{backgroundColor: colors.white}}
          showsVerticalScrollIndicator={false}>
          <View style={styles.container}>
            {/* No. of Rooms Section */}
            <View style={styles.roomsSection}>
              <View style={styles.counterRow}>
                <CustomText variant="text-sm-medium" color="neutral500">
                  No. of Rooms*
                </CustomText>
                <CounterInput
                  value={localTravelerSelection.rooms.length}
                  onIncrement={localAddRoom}
                  onDecrement={() => {
                    const lastRoom =
                      localTravelerSelection.rooms[
                        localTravelerSelection.rooms.length - 1
                      ];
                    localRemoveRoom(lastRoom?.id);
                  }}
                  minValue={1}
                  maxValue={10}
                />
              </View>
            </View>

            {/* Rooms Details */}
            <View style={styles.roomsContainer}>
              {localTravelerSelection.rooms.map(
                (room: any, roomIndex: number) =>
                  renderRoomSection(room, roomIndex),
              )}
            </View>
          </View>
        </BottomSheetScrollView>
        {/* Action Buttons */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.cancelButton, {borderColor: colors.neutral200}]}
            onPress={onClose}>
            <CustomText variant="text-base-medium" color="neutral600">
              Cancel
            </CustomText>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.addButton}
            onPress={handleAddTravelers}>
            <CustomText variant="text-base-medium" color="white">
              Add Travelers
            </CustomText>
          </TouchableOpacity>
        </View>
      </CustomBottomSheet>

      {/* Age Selection Modal */}
      <Modal
        visible={ageSelectionVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => {
          setAgeSelectionVisible(false);
          setSelectedChildForAge(null);
        }}>
        <View style={styles.ageSelectionOverlay}>
          <View style={styles.ageSelectionModal}>
            <View style={styles.ageSelectionHeader}>
              <CustomText variant="text-lg-semibold" color="neutral900">
                Select Child Age
              </CustomText>
              <TouchableOpacity
                onPress={() => {
                  setAgeSelectionVisible(false);
                  setSelectedChildForAge(null);
                }}
                style={styles.closeButton}>
                <X size={20} color={colors.neutral600} />
              </TouchableOpacity>
            </View>
            <ScrollView
              style={styles.ageOptionsContainer}
              showsVerticalScrollIndicator={false}>
              {childAgeOptions.map(age => (
                <TouchableOpacity
                  key={age}
                  style={[
                    styles.ageOption,
                    selectedChildForAge?.currentAge === age &&
                      styles.selectedAgeOption,
                  ]}
                  onPress={() => handleAgeSelection(age)}>
                  <CustomText
                    variant={
                      selectedChildForAge?.currentAge === age
                        ? 'text-base-semibold'
                        : 'text-base-normal'
                    }
                    color={
                      selectedChildForAge?.currentAge === age
                        ? 'neutral900'
                        : 'neutral900'
                    }>
                    {age}
                  </CustomText>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  roomsSection: {
    paddingVertical: 16,
  },
  roomsContainer: {
    // ...shadows['shadow-2xs'],
    // borderWidth: 1,
    // borderColor: Colors.lightThemeColors.neutral100,
    // borderRadius: 16,
    // paddingHorizontal: 12,
    // paddingVertical: 16,
  },
  roomSection: {
    ...shadows['shadow-2xs'],
    borderWidth: 1,
    borderColor: Colors.lightThemeColors.neutral100,
    borderRadius: 16,
    marginBottom: 24,
    paddingHorizontal: 12,
    paddingVertical: 16,
  },
  roomHeader: {
    marginBottom: 8,
    flexDirection: 'row',
    alignItems: 'center',
  },
  separator: {
    height: 1,
    marginVertical: 16,
  },
  counterRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  childrenAgeSection: {
    marginTop: 12,
  },
  childAgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  childAgeItem: {
    width: '48%',
  },
  childLabel: {
    marginBottom: 8,
    textAlign: 'left',
  },
  agePickerContainer: {
    borderWidth: 1,
    borderRadius: 8,
    width: '100%',
    height: 36,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 8,
  },
  agePicker: {
    flex: 1,
    fontSize: 12,
  },
  buttonContainer: {
    ...flex.rowJustifyBetweenItemCenter,
    gap: 8,
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: Colors.lightThemeColors.neutral200,
  },
  cancelButton: {
    borderWidth: 2,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '50%',
    backgroundColor: Colors.lightThemeColors.white,
  },
  addButton: {
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    height: 52,
    width: '50%',
    backgroundColor: Colors.lightThemeColors.neutral900,
  },
  ageSelectionOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  ageSelectionModal: {
    backgroundColor: Colors.lightThemeColors.white,
    borderRadius: 16,
    width: '80%',
    maxHeight: '60%',
    ...shadows['shadow-lg'],
  },
  ageSelectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  closeButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ageOptionsContainer: {
    maxHeight: 312,
  },
  ageOption: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.lightThemeColors.neutral200,
  },
  selectedAgeOption: {
    backgroundColor: Colors.lightThemeColors.neutral100,
  },
});

export default TravelersBottomSheet;
