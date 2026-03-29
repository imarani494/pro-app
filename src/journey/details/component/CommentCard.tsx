import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import {Edit, Trash2} from 'lucide-react-native';
import {CustomText} from '../../../common/components';
import {Colors} from '../../../styles';
import {useTheme} from '../../../context/ThemeContext';
import {useAppDispatch} from '../../../store';
import {useJournery} from '../../hooks/useJournery';
import {useUpdateJourney} from '../../hooks/useUpdateJourney';
import {
  openAdvisoryCommentModal,
  getMetaExecuteType,
} from '../../redux/journeySlice';

interface CommentCardProps {
  className?: string;
  blockId?: string;
  id?: string;
  comment?: string;
  author?: string;
  time?: string;
  date?: string;
}

const CommentCard: React.FC<CommentCardProps> = ({
  className,
  blockId,
  id,
  comment,
  author,
  time,
  date,
}) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const {colors} = useTheme();
  const dispatch = useAppDispatch();
  const journeyData: any = useJournery();
  const updateJourney = useUpdateJourney();

  const handleEdit = () => {
    dispatch(
      openAdvisoryCommentModal({
        status: true,
        data: {
          comment: comment,
          commentId: id,
          blockId: blockId,
          date: date,
          time: time,
        },
      }),
    );
  };

  const handleDeleteClick = () => {
    if (!id || isDeleting) return;

    Alert.alert(
      'Delete Comment',
      'Are you sure you want to delete this comment? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete Comment',
          style: 'destructive',
          onPress: confirmDelete,
        },
      ],
    );
  };

  const confirmDelete = async () => {
    setIsDeleting(true);

    try {
      // Build the delete item based on whether it's a block-level or day-level comment
      const deleteItem: any = {
        type: 'ADVISOR_COMMENT_REMOVE',
        commentId: id,
      };

      // For day-level comments, use date; for block-level comments, use blockId
      if (date && !blockId) {
        deleteItem.date = date;
      } else if (blockId) {
        deleteItem.blockId = blockId;
      }

      // Get jdid from journey params or journey data
      const jdid =
        journeyData?.journeyParams?.jdid || journeyData?.journey?.jdid;

      await updateJourney([deleteItem], null, {
        jdid: jdid,
        edit: true,
      });
    } catch (error) {
      console.error('Failed to delete comment:', error);
      Alert.alert('Error', 'Failed to delete comment. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  };

  if (!comment) return null;

  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor: Colors.lightThemeColors.lightPurple100 || '#F5F3FF',
          borderColor: Colors.lightThemeColors.lightPurple900 || '#E9D5FF',
        },
      ]}>
      <View style={styles.contentContainer}>
        {/* Left side - Quote content and author */}
        <View style={styles.leftSection}>
          {/* Quote mark and comment text */}
          <View style={styles.commentRow}>
            <View style={styles.quoteIcon}>
              <QuoteIcon />
            </View>
            <CustomText
              variant="text-sm-medium"
              color="neutral900"
              style={styles.commentText}>
              {comment}
            </CustomText>
          </View>

          {/* Author and time below the quote */}
          <View style={styles.authorRow}>
            <CustomText variant="text-xs-medium" color="neutral600">
              {author}
            </CustomText>
            {time && (
              <>
                <CustomText variant="text-xs-normal" color="neutral500">
                  {' • '}
                </CustomText>
                <CustomText variant="text-xs-normal" color="neutral500">
                  {time}
                </CustomText>
              </>
            )}
          </View>
        </View>

        {/* Right side - Action buttons */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity
            onPress={handleEdit}
            style={[styles.actionButton, styles.editButton]}
            activeOpacity={0.7}>
            <Edit
              size={14}
              color={Colors.lightThemeColors.lightPurple900 || '#9333EA'}
            />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleDeleteClick}
            style={[styles.actionButton, styles.deleteButton]}
            activeOpacity={0.7}
            disabled={isDeleting}>
            {isDeleting ? (
              <ActivityIndicator
                size="small"
                color={Colors.lightThemeColors.red600 || '#DC2626'}
              />
            ) : (
              <Trash2
                size={14}
                color={Colors.lightThemeColors.red600 || '#DC2626'}
              />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// Quote Icon SVG Component
const QuoteIcon = () => (
  <View style={styles.quoteIconContainer}>
    <CustomText style={styles.quoteText}>"</CustomText>
  </View>
);

const styles = StyleSheet.create({
  container: {
    borderRadius: 8,
    borderWidth: 1,
    padding: 16,
    marginVertical: 12,
  },
  contentContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: 16,
  },
  leftSection: {
    flex: 1,
    paddingRight: 16,
    borderRightWidth: 1,
    borderRightColor: Colors.lightThemeColors.lightPurple900 || '#E9D5FF',
  },
  commentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  quoteIcon: {
    marginTop: 2,
  },
  quoteIconContainer: {
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  quoteText: {
    fontSize: 24,
    color: Colors.lightThemeColors.lightPurple900 || '#D1AFEC',
    lineHeight: 20,
  },
  commentText: {
    flex: 1,
    lineHeight: 20,
  },
  authorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 28,
    gap: 4,
  },
  actionsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    minWidth: 60,
    justifyContent: 'center',
  },
  actionButton: {
    width: 28,
    height: 28,
    borderRadius: 4,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editButton: {
    backgroundColor: 'transparent',
  },
  deleteButton: {
    backgroundColor: 'transparent',
  },
});

export default CommentCard;
