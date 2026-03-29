import React from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  useWindowDimensions,
} from 'react-native';
import {Info, Check} from 'lucide-react-native';
import {CustomText} from '../../../../../../common/components';

import {useTheme} from '../../../../../../context/ThemeContext';
import RenderHtml from 'react-native-render-html';
interface PointsToNoteModalProps {
  hotelName?: string;
  apiData?: any;
  onButtonPress?: () => void;
}

const PointsToNoteModal: React.FC<PointsToNoteModalProps> = ({
  hotelName,
  apiData,
  onButtonPress,
}) => {
  const {colors} = useTheme();
  const {width} = useWindowDimensions();

  const getPointsFromApi = () => {
    const points: Array<{
      id: string | number;
      text: string;
      type?: string;
    }> = [];

    // 1. City tax from API
    if (apiData?.ctyTax || apiData?.cityTax) {
      points.push({
        id: 'city-tax',
        text: `A tax is imposed by the city: ${
          apiData.ctyTax || apiData.cityTax
        } per accommodation per night`,
        type: 'info',
      });
    }

    if (apiData?.xpSmry && apiData.xpSmry.trim() !== '') {
      points.push({
        id: 'cancellation',
        text: apiData.xpSmry,
        type: 'warning',
      });
    }

    if (apiData?.cinT || apiData?.coutT) {
      const checkInText = apiData?.cinT ? `Check-in: ${apiData.cinT}` : '';
      const checkOutText = apiData?.coutT ? `Check-out: ${apiData.coutT}` : '';
      const fullText = [checkInText, checkOutText].filter(Boolean).join(', ');

      if (fullText) {
        points.push({
          id: 'checkin-time',
          text: fullText,
          type: 'info',
        });
      }
    }

    if (apiData?.pyPol || apiData?.paymentPolicy) {
      points.push({
        id: 'payment',
        text: apiData.pyPol || apiData.paymentPolicy,
        type: 'info',
      });
    }

    if (apiData?.rmA?.[0]?.polA && Array.isArray(apiData.rmA[0].polA)) {
      apiData.rmA[0].polA.forEach((policy: any, index: number) => {
        const policyText = policy?.txt || policy?.text || policy;
        if (policyText && policyText.trim() !== '') {
          points.push({
            id: `room-policy-${index}`,
            text: policyText,
            type: 'info',
          });
        }
      });
    }

    // 6. Hotel policies from API (hlPol)
    if (apiData?.hlPol && Array.isArray(apiData.hlPol)) {
      apiData.hlPol.forEach((policy: any, index: number) => {
        const policyText = policy?.txt || policy?.text || policy;
        if (policyText && policyText.trim() !== '') {
          points.push({
            id: `hotel-policy-${index}`,
            text: policyText,
            type: 'info',
          });
        }
      });
    }

    if (apiData?.ntA && Array.isArray(apiData.ntA)) {
      apiData.ntA.forEach((note: any, index: number) => {
        const noteText = note?.txt || note?.text || note;
        if (noteText && noteText.trim() !== '') {
          points.push({
            id: `note-${index}`,
            text: noteText,
            type: 'info',
          });
        }
      });
    } else if (apiData?.addNotes && Array.isArray(apiData.addNotes)) {
      apiData.addNotes.forEach((note: any, index: number) => {
        const noteText = note?.txt || note?.text || note;
        if (noteText && noteText.trim() !== '') {
          points.push({
            id: `add-note-${index}`,
            text: noteText,
            type: 'info',
          });
        }
      });
    }

    if (apiData?.impNtcA && Array.isArray(apiData.impNtcA)) {
      apiData.impNtcA.forEach((notice: any, index: number) => {
        const noticeText = notice?.txt || notice?.text || notice;
        if (noticeText && noticeText.trim() !== '') {
          points.push({
            id: `notice-${index}`,
            text: noticeText,
            type: 'important',
          });
        }
      });
    }

    if (apiData?.polA && Array.isArray(apiData.polA)) {
      apiData.polA.forEach((policy: any, index: number) => {
        const policyText = policy?.txt || policy?.text || policy;
        if (policyText && policyText.trim() !== '') {
          points.push({
            id: `policy-${index}`,
            text: policyText,
            type: 'info',
          });
        }
      });
    }

    if (apiData?.tncA && Array.isArray(apiData.tncA)) {
      apiData.tncA.forEach((tnc: any, index: number) => {
        const tncText = tnc?.txt || tnc?.text || tnc;
        if (tncText && tncText.trim() !== '') {
          points.push({
            id: `tnc-${index}`,
            text: tncText,
            type: 'info',
          });
        }
      });
    }

    if (apiData?.splIns || apiData?.specialInstructions) {
      const insText = apiData.splIns || apiData.specialInstructions;
      if (insText && insText.trim() !== '') {
        points.push({
          id: 'special-instructions',
          text: insText,
          type: 'warning',
        });
      }
    }

    if (apiData?.depPol || apiData?.depositPolicy) {
      points.push({
        id: 'deposit',
        text: apiData.depPol || apiData.depositPolicy,
        type: 'info',
      });
    }

    if (apiData?.ageRes || apiData?.ageRestriction) {
      points.push({
        id: 'age-restriction',
        text: apiData.ageRes || apiData.ageRestriction,
        type: 'warning',
      });
    }

    if (apiData?.petPol || apiData?.petPolicy) {
      points.push({
        id: 'pet-policy',
        text: apiData.petPol || apiData.petPolicy,
        type: 'info',
      });
    }

    if (apiData?.smkPol || apiData?.smokingPolicy) {
      points.push({
        id: 'smoking-policy',
        text: apiData.smkPol || apiData.smokingPolicy,
        type: 'info',
      });
    }

    return points;
  };

  const displayPoints = getPointsFromApi();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
  };

  const getCancellationPolicy = () => {
    return (
      apiData?.canPolcy ||
      apiData?.cancellationPolicy ||
      apiData?.cnclPol ||
      null
    );
  };

  const getImportantNotes = () => {
    return (
      apiData?.impNotes || apiData?.importantNotes || apiData?.impNts || null
    );
  };

  const cancellationPolicy = getCancellationPolicy();
  const importantNotes = getImportantNotes();

  let points = [];
  if (apiData?.mFeTxt) {
    const liMatches = apiData.mFeTxt.match(/<li>([\s\S]*?)<\/li>/gi);
    if (liMatches && liMatches.length > 0) {
      points = liMatches.map(item =>
        item
          .replace(/<li>|<\/li>/gi, '')
          .replace(/<[^>]+>/g, '')
          .trim(),
      );
    } else {
      points = [apiData.mFeTxt.replace(/<[^>]+>/g, '').trim()];
    }
  } else {
    points = getPointsFromApi().map(p => p.text);
  }

  return (
    <View style={styles.container}>
      {apiData?.mFeTxt ? (
        <View style={styles.pointsList}>
          {/* Show <p> tag if present */}
          {(apiData.mFeTxt.match(/<p>([\s\S]*?)<\/p>/gi) || []).map((item, idx) => (
            <CustomText
              key={`p-${idx}`}
              variant="text-sm-normal"
              color="neutral500"
              style={{marginBottom: 8}}
            >
              {item.replace(/<p>|<\/p>/gi, '').trim()}
            </CustomText>
          ))}
          {/* Show <li> items as points */}
          {(apiData.mFeTxt.match(/<li>([\s\S]*?)<\/li>/gi) || [apiData.mFeTxt]).length > 0
            ? (apiData.mFeTxt.match(/<li>([\s\S]*?)<\/li>/gi) || []).map((item, idx) => (
                <View key={`li-${idx}`} style={styles.pointItem}>
                  <Check size={16} color={colors.neutral500} />
                  <CustomText
                    variant="text-sm-normal"
                    color="neutral500"
                  >
                    {item.replace(/<li>|<\/li>/gi, '').replace(/<[^>]+>/g, '').trim()}
                  </CustomText>
                </View>
              ))
            : (
                <View style={styles.pointItem}>
                  <Check size={16} color={colors.neutral500} />
                  <CustomText
                    variant="text-sm-normal"
                    color="neutral500"
                  >
                    {apiData.mFeTxt.replace(/<[^>]+>/g, '').trim()}
                  </CustomText>
                </View>
              )}
        </View>
      ) : (
        <View style={styles.pointsList}>
          {points.map((text, idx) => (
            <View key={idx} style={styles.pointItem}>
              <Check size={16} color={colors.neutral500} />
              <CustomText
                variant="text-sm-normal"
                color="neutral500"
              >
                {text}
              </CustomText>
            </View>
          ))}
        </View>
      )}

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, {backgroundColor: colors.neutral900}]}
          onPress={handleButtonPress}
          activeOpacity={0.8}>
          <CustomText variant="text-base-medium" color="neutral50">
            Okay, got it
          </CustomText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
   
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  hotelNameContainer: {
    marginBottom: 16,
  },
  pointsList: {
    gap: 8,
  },
  pointItem: {
    flexDirection: 'row',
    gap: 8,
  
   width:'92%',
    alignItems: 'center',
  },
 
  buttonContainer: {
    paddingTop: 20,
  },
  button: {
    width: '100%',
    height: 52,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
    gap: 12,
  },
  
  policySection: {
    marginTop: 20,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  importantSection: {
    marginTop: 12,
    padding: 14,
    borderRadius: 8,
    borderWidth: 1,
    gap: 8,
  },
  importantHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
 
});

export default PointsToNoteModal;
