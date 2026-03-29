import React from 'react';
import {View, StyleSheet, TouchableOpacity, FlatList} from 'react-native';
import {CustomText} from '../../../../../../common/components';
import {Info, Check} from 'lucide-react-native';

interface NonRefundableModalProps {
  summary: string;
  details: string[];
  colors: any;
  onClose: () => void;
}

const ICON_SIZES = {
  info: 16,
  check: 16,
};

const NonRefundableModal: React.FC<NonRefundableModalProps> = ({
  summary,
  details,
  colors,
  onClose,
}) => {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <CustomText variant="text-lg-semibold" color="neutral900">
          {summary}
        </CustomText>

        <Info size={ICON_SIZES.info} color={colors.red600} />
      </View>

    {details.length > 0 && (
  <View style={styles.listContent}>
    {details.map((item, index) => (
      <View key={index} style={styles.detailRow}>
        <Check size={ICON_SIZES.check} color={colors.green700} />
        <CustomText
          variant="text-sm-normal"
          color="neutral500"
        >
          {item}
        </CustomText>
      </View>
    ))}
  </View>
)}
      <TouchableOpacity
        style={[styles.closeButton, {backgroundColor: colors.darkCharcoal}]}
        onPress={onClose}
        activeOpacity={0.8}>
        <CustomText variant="text-base-semibold" color="white">
          Okay, got it
        </CustomText>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    padding: 20,
  },
  header: {
    alignItems: 'center',
  
    flexDirection: 'row',
    gap: 6,
  },

  title: {
    textAlign: 'center',
  },
  listContent: {
    gap: 6,
   
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 10,
    width:'96%',
    // paddingHorizontal: 20,
    marginTop:20,
  },
 
  closeButton: {
    width: '100%',
    height: 48,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
   marginTop:20,
  },
});

export default NonRefundableModal;
