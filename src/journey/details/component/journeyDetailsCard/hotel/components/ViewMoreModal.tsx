import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {Check} from 'lucide-react-native';
import {CustomText} from '../../../../../../common/components';
import {useTheme} from '../../../../../../context/ThemeContext';

interface ViewMoreModalProps {
  title?: string;
  subtitle?: string;
  items?: any[];
  onButtonPress?: () => void;
}

const ViewMoreModal: React.FC<ViewMoreModalProps> = ({
  title,
  subtitle,
  items = [],
  onButtonPress,
}) => {
  const {colors} = useTheme();

  const handleButtonPress = () => {
    if (onButtonPress) {
      onButtonPress();
    }
  };

  const getItemText = (item: any): string => {
    if (typeof item === 'string') {
      return item;
    }
    if (item?.text || item?.txt) {
      return item.text || item.txt;
    }
    return String(item || '');
  };

  return (
    <View style={styles.container}>
      {subtitle && (
        <View style={styles.subtitleContainer}>
          <CustomText variant="text-sm-normal" color="neutral500">
            {subtitle}
          </CustomText>
        </View>
      )}

      {items.length > 0 ? (
        <View style={styles.itemsList}>
          {items.map((item, index) => {
            const itemText = getItemText(item);
            
            if (!itemText || itemText.trim() === '') {
              return null;
            }

            return (
              <View key={index} style={styles.itemRow}>
                <Check size={16} color={colors.green600} />
                <CustomText
                  variant="text-sm-normal"
                  color="neutral500"
                  style={styles.itemText}>
                  {itemText}
                </CustomText>
              </View>
            );
          })}
        </View>
      ) : (
        <View style={styles.emptyState}>
          <CustomText variant="text-sm-normal" color="neutral500">
            No items available
          </CustomText>
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
  subtitleContainer: {
    marginBottom: 16,
  },
  itemsList: {
    gap: 12,
  },
  itemRow: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'flex-start',
  },
  itemText: {
    flex: 1,
    lineHeight: 20,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
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
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
});

export default ViewMoreModal;
