import {
  Dimensions,
  TouchableOpacity,
  View,
  StyleSheet,
  Platform,
  Clipboard,
  KeyboardAvoidingView,
  ScrollView,
} from 'react-native';
import {CustomBottomSheet, CustomText} from '../../../common/components';
import {
  Calendar,
  Check,
  Copy,
  DoorOpen,
  Flag,
  MapPin,
  PencilLine,
} from 'lucide-react-native';
import {Colors} from '../../../styles';

import {useBottomSheet} from '../../../common/hooks/useBottomSheet';
import {useToast} from '../../../common/components/ToastContext';
import {TextInput} from 'react-native-paper';
import {useState} from 'react';
import {CommonButtons} from '../../../common/components/CommonButtons';
import {useDispatch, useSelector} from 'react-redux';
import {User} from '../../../data';
import {getMetaExecuteType, updateJourney} from '../../redux/journeySlice';

const {width} = Dimensions.get('window');

interface PropsData {
  jid: string;
  paxD: string;
  travelersDetails: string;
  exCtyNm: string;
  ntnNm: string;
  nts: string;
  dys: string;
  tvlDt: string;
  [key: string]: any;
}

export function JourneyDetailsInfo({data}: {data: PropsData}) {
  const [title, setTitle] = useState<string>(data.jnm);
  const [error, setError] = useState<string>('');
  const journeyDate = () => {
    const nights = data.nts;
    const days = data.dys;
    const date = new Date(data.tvlDt);
    const weekday = date.toLocaleDateString('en-US', {weekday: 'short'});
    const fullDate = new Date(data.tvlDt).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
    return `${weekday}, ${fullDate} - ${nights} Nights / ${days} Days`;
  };
  const journeyState = useSelector((state: any) => state.journey);
  const {showToast} = useToast();
  const dispatch = useDispatch();
  const {bottomSheetRef, openBottomSheet, closeBottomSheet} = useBottomSheet();

  const onCopy = async (text: string) => {
    await Clipboard.setString(text);
    showToast('Proposal number has been copied', 'success', 'bottom');
  };

  const handleUpdateTitle = async () => {
    if (!title.trim()) {
      setError('Journey name cannot be empty');
      return;
    }

    if (!data.id) {
      setError('Journey ID is missing. Cannot update.');
      return;
    }

    if (!User.authToken) {
      setError('Authentication is required. Please log in again.');
      return;
    }

    try {
      setError('');
      const payload = {
        jid: data.id,
        _auth: User.authToken,
        userId: User.getUserId(),
        request: JSON.stringify({
          type: getMetaExecuteType(journeyState),
          items: [
            {
              type: 'JOURNEY_NAME_UPDATE',
              name: title.trim(),
            },
          ],
        }),
        save: journeyState?.save ?? true,
      };
      await dispatch(updateJourney(payload) as any);
    } catch (err: any) {
      console.error('Error updating journey name:', err);
      setError(
        err.message || 'An unexpected error occurred. Please try again.',
      );
    }
  };

  return (
    <View
      style={[
        styles.main,
        {backgroundColor: Colors.lightThemeColors.neutral900},
      ]}>
      {/* Info */}
      <View style={styles.infoContainer}>
        {/* Proposal */}
        <TouchableOpacity onPress={() => onCopy(`#J${data.jid}`)}>
          <View
            style={[
              styles.proposalBox,
              {borderColor: Colors.lightThemeColors.neutral500},
            ]}>
            <CustomText variant="text-xs-medium" color="neutral200">
              Proposal:{' '}
              <CustomText variant="text-sm-semibold" color="neutral100">
                #J{data.jid}
              </CustomText>
            </CustomText>

            <Copy color={Colors.lightThemeColors.neutral100} size={16} />
          </View>
        </TouchableOpacity>

        {/* Title + Pencil */}
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <CustomText
            variant="text-2xl-semibold"
            color="neutral100"
            style={{textAlign: 'center'}}>
            {data?.jnm}
          </CustomText>
          <TouchableOpacity
            onPress={() => {
              openBottomSheet();
              setTitle(data.jnm);
            }}
            style={{marginLeft: 8}}>
            <PencilLine
              style={{paddingBottom: 2}}
              color={Colors.lightThemeColors.neutral100}
              size={18}
            />
          </TouchableOpacity>
        </View>

        {/* Details */}
        <View style={styles.detailsContainer}>
          <View style={styles.detailRow}>
            <MapPin
              color={Colors.lightThemeColors.neutral200}
              size={16}
              style={{marginTop: 3}}
            />
            <CustomText
              variant="text-sm-medium"
              color="neutral200"
              numberOfLines={2}>
              {data?.ctyA
                ?.slice(0, 3)
                .map((city: any) => city.nm)
                .join(', ')}
              {'  '}
              {data.ctyA.length > 3 && (
                <CustomText style={styles.underline}>
                  +{data.ctyA.length - 3} more
                </CustomText>
              )}
            </CustomText>
          </View>

          <View style={styles.otherRows}>
            <Calendar color={Colors.lightThemeColors.neutral200} size={16} />
            <CustomText variant="text-sm-medium" color="neutral200">
              {journeyDate()}
            </CustomText>
          </View>

          <View style={styles.otherRows}>
            <DoorOpen color={Colors.lightThemeColors.neutral200} size={16} />
            <CustomText variant="text-sm-medium" color="neutral200">
              {data.paxD}
            </CustomText>
          </View>

          <View style={styles.otherRows}>
            <MapPin color={Colors.lightThemeColors.neutral200} size={16} />
            <CustomText variant="text-sm-medium" color="neutral200">
              {data.exCtyNm}
            </CustomText>
          </View>

          <View style={styles.otherRows}>
            <Flag color={Colors.lightThemeColors.neutral200} size={16} />
            <CustomText variant="text-sm-medium" color="neutral200">
              {data.ntnNm}
            </CustomText>
          </View>
        </View>
      </View>
      <CustomBottomSheet
        snapPoints={['30%']}
        ref={bottomSheetRef}
        onClose={closeBottomSheet}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{flex: 1}}>
          <ScrollView
            contentContainerStyle={{padding: 16}}
            keyboardShouldPersistTaps="handled">
            <View>
              {/* Top Row */}
              <View style={[styles.bottomSheetHeader]}>
                <View style={styles.bottomSheetHeaderRow}>
                  {/* Close Icon */}
                  <TouchableOpacity onPress={closeBottomSheet}>
                    <CustomText style={{fontSize: 20}}>✕</CustomText>
                  </TouchableOpacity>

                  <CustomText style={{fontSize: 18, fontWeight: '600'}}>
                    Edit Title
                  </CustomText>
                </View>

                {/* Done Button */}
                <CommonButtons
                  onPressAction={handleUpdateTitle}
                  textColor="neutral100"
                  title="Done"
                  style={{backgroundColor: 'black'}}
                  leftIcon={<Check size={16} color={'white'} />}
                />
              </View>

              {/* Text Input Box */}
              <View
                style={{
                  borderWidth: 1,
                  borderColor: Colors.lightThemeColors.neutral700,
                  borderRadius: 10,
                }}>
                <TextInput
                  autoFocus
                  mode="outlined"
                  value={title}
                  onChangeText={setTitle}
                  multiline
                  maxLength={50}
                  placeholder="Enter title…"
                  outlineColor="transparent"
                  activeOutlineColor="transparent"
                  cursorColor="black"
                  style={{
                    backgroundColor: 'white',
                    minHeight: 100,
                    padding: 0,
                    textAlignVertical: 'top',
                  }}
                  theme={{
                    roundness: 8,
                    colors: {
                      background: 'white',
                    },
                  }}
                  // This removes internal paddings
                  contentStyle={{
                    padding: 0,
                  }}
                />

                {/* Character Count */}
                <CustomText style={{margin: 6, color: '#999'}}>
                  {title.length ? title.length : 0}/50
                </CustomText>
              </View>
            </View>
            {/* your current content */}
          </ScrollView>
        </KeyboardAvoidingView>
      </CustomBottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  main: {
    flex: 1,
  },

  headerContainer: {
    width: width * 0.9,
    marginHorizontal: 'auto',
    height: Platform.OS === 'ios' ? 100 : 55,
    justifyContent: 'flex-end',
  },

  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  headerIcons: {
    flexDirection: 'row',
    gap: 10,
  },

  infoContainer: {
    width: width * 0.9,
    marginHorizontal: 'auto',
    rowGap: 16,
  },

  proposalBox: {
    borderWidth: 1,
    flexShrink: 1,
    alignSelf: 'flex-start',
    flexDirection: 'row',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
    columnGap: 5,
    marginTop: 20,
  },

  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    maxWidth: width * 0.85,
  },

  titleText: {
    flexShrink: 1,
  },

  detailsContainer: {
    rowGap: 10,
    paddingBottom: 8,
    maxWidth: width * 0.85,
  },

  detailRow: {
    flexDirection: 'row',
    gap: 8,
  },
  otherRows: {
    flexDirection: 'row',
    gap: 8,
    justifyContent: 'flex-start',
    marginTop: 2,
    alignItems: 'center',
  },

  underline: {
    textDecorationLine: 'underline',
  },
  bottomSheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  bottomSheetHeaderRow: {
    flexDirection: 'row',
    columnGap: 8,
    alignItems: 'center',
  },
});
