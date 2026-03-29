// src/journey/component/journeyDetailsCard/extras/JourneyExtrasCard.tsx
import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Check, Trash2} from 'lucide-react-native';
import CustomText from '../../../../../common/components/CustomText';
import {useTheme} from '../../../../../context/ThemeContext';

interface ExtraItem {
  id: string;
  name: string;
  isIncluded: boolean;
}

interface JourneyExtrasCardProps {
  location?: string;
  extras?: ExtraItem[];
  onAddExtras?: () => void;
  onDeleteExtra?: (id: string) => void;
}

const ICON_SIZE = 16;

const JourneyExtrasCard: React.FC<JourneyExtrasCardProps> = ({
  location,
  extras = [],
  onAddExtras,
  onDeleteExtra,
}) => {
  const {colors} = useTheme();


  if (!extras || extras.length === 0) {
    return null;
  }


  const displayLocation = location || 'Rome';

  return (
    <View style={[styles.container, {
      backgroundColor: colors.white,
      borderWidth: 1,
      borderColor: colors.neutral200
    }]}>
     
      <CustomText variant="text-base-semibold" color="neutral900">
        Extras - {displayLocation}
      </CustomText>

    
      <View style={styles.extrasList}>
        {extras.map((extra) => (
          <View key={extra.id} style={styles.extraItem}>
            <View style={styles.extraLeft}>
              <Check size={ICON_SIZE} color={colors.green600} />
              <CustomText variant="text-xs-normal" color="neutral500">
                {extra.name}
              </CustomText>
            </View>
            
       
            {onDeleteExtra && (
              <TouchableOpacity
                onPress={() => onDeleteExtra(extra.id)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
                style={[styles.deleteButton, {backgroundColor: colors.red50}]}>
                <Trash2 size={ICON_SIZE} color={colors.red500} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

   
      {onAddExtras && (
        <TouchableOpacity
          style={[
            styles.addButton, 
            { 
              backgroundColor: colors.black,
              borderColor: colors.neutral200,
            }
          ]}
          onPress={onAddExtras}>
          <CustomText variant="text-sm-medium" color="white">
            + Add Extras
          </CustomText>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    gap: 12,
    padding: 16,
    borderRadius: 16,
  },
  extrasList: {
    gap: 8,
  },
  extraItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 8,
    paddingHorizontal: 4,
    borderRadius: 8,
  },
  extraLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    width:'87%'
    // flex: 1,
  },
  deleteButton: {
    padding: 6,
    borderRadius: 6,
  },
  addButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
  },
});

export default JourneyExtrasCard;
