// Checklist Item Row Component
// Provides fast workshop interaction: PASS, FAIL with remarks/photo modal, PENDING state,
// autosave feedback, and high readability under bright or dim lighting.

import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Modal,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { ChecklistItemDefinition } from '../../data/checklistDefinition';
import { CheckResultStatus, InspectionItemResult } from '../../types';
import { Colors, Spacing, Typography } from '../../theme/colors';
import { Button, StatusBadge } from '../common';

interface ChecklistRowProps {
  item: ChecklistItemDefinition;
  result?: InspectionItemResult;
  onUpdateStatus: (itemId: string, status: CheckResultStatus, remarks?: string) => void;
  onAttachPhoto?: (itemId: string) => void;
  photoCount?: number;
}

export const ChecklistRow: React.FC<ChecklistRowProps> = ({
  item,
  result,
  onUpdateStatus,
  onAttachPhoto,
  photoCount = 0,
}) => {
  const currentStatus: CheckResultStatus = result ? result.status : 'PENDING';
  const currentRemarks = result?.remarks || '';

  const [modalVisible, setModalVisible] = useState(false);
  const [tempRemarks, setTempRemarks] = useState(currentRemarks);
  const [remarkError, setRemarkError] = useState(false);

  const handlePass = () => {
    onUpdateStatus(item.id, 'PASS', currentRemarks);
  };

  const handleFailPress = () => {
    // Fail requires observation / defect remarks before final confirmation
    setTempRemarks(currentRemarks);
    setRemarkError(false);
    setModalVisible(true);
  };

  const handleConfirmFail = () => {
    if (!tempRemarks.trim()) {
      setRemarkError(true);
      return;
    }
    setRemarkError(false);
    setModalVisible(false);
    onUpdateStatus(item.id, 'FAIL', tempRemarks.trim());
  };

  const handleResetPending = () => {
    onUpdateStatus(item.id, 'PENDING', '');
  };

  return (
    <View
      style={[
        styles.rowContainer,
        currentStatus === 'PASS' && styles.rowPass,
        currentStatus === 'FAIL' && styles.rowFail,
      ]}
    >
      {/* Top Details */}
      <View style={styles.topInfo}>
        <View style={styles.textContainer}>
          <Text style={styles.itemName}>{item.name}</Text>
          {item.referenceValue ? (
            <Text style={styles.refValue}>Ref: {item.referenceValue}</Text>
          ) : null}
          {currentRemarks ? (
            <View style={styles.remarksContainer}>
              <Ionicons name="alert-circle-outline" size={14} color={Colors.fail} />
              <Text style={styles.remarksText}>{currentRemarks}</Text>
            </View>
          ) : null}
        </View>

        <StatusBadge status={currentStatus} />
      </View>

      {/* Action Row */}
      <View style={styles.actionRow}>
        <View style={styles.buttonGroup}>
          {/* PASS BUTTON */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handlePass}
            style={[
              styles.actionBtn,
              styles.passBtn,
              currentStatus === 'PASS' && styles.passBtnActive,
            ]}
          >
            <Ionicons
              name="checkmark-circle"
              size={18}
              color={currentStatus === 'PASS' ? Colors.white : Colors.pass}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: currentStatus === 'PASS' ? Colors.white : Colors.passDark },
              ]}
            >
              PASS
            </Text>
          </TouchableOpacity>

          {/* FAIL BUTTON */}
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={handleFailPress}
            style={[
              styles.actionBtn,
              styles.failBtn,
              currentStatus === 'FAIL' && styles.failBtnActive,
            ]}
          >
            <Ionicons
              name="close-circle"
              size={18}
              color={currentStatus === 'FAIL' ? Colors.white : Colors.fail}
            />
            <Text
              style={[
                styles.actionBtnText,
                { color: currentStatus === 'FAIL' ? Colors.white : Colors.failDark },
              ]}
            >
              FAIL
            </Text>
          </TouchableOpacity>
        </View>

        {/* Supporting Actions: Attach photo & reset */}
        <View style={styles.secondaryActions}>
          {onAttachPhoto ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => onAttachPhoto(item.id)}
              style={styles.iconBtn}
            >
              <Ionicons
                name="camera"
                size={18}
                color={photoCount > 0 ? Colors.primary : Colors.slate500}
              />
              {photoCount > 0 ? (
                <View style={styles.photoCountBadge}>
                  <Text style={styles.photoCountText}>{photoCount}</Text>
                </View>
              ) : null}
            </TouchableOpacity>
          ) : null}

          {currentStatus !== 'PENDING' ? (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={handleResetPending}
              style={styles.iconBtn}
            >
              <Ionicons name="refresh" size={16} color={Colors.slate400} />
            </TouchableOpacity>
          ) : null}
        </View>
      </View>

      {/* FAIL OBSERVATION / REMARKS MODAL */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Ionicons name="warning" size={24} color={Colors.fail} />
              <Text style={styles.modalTitle}>Defect Observation Required</Text>
            </View>

            <Text style={styles.modalItemTitle}>{item.name}</Text>
            <Text style={styles.modalSub}>
              Enter specific defect observation, scratch/dent details, or reason for failure.
            </Text>

            <TextInput
              style={[styles.textInput, remarkError && styles.textInputError]}
              placeholder="e.g. Scratched panel, dent on lower edge, excessive play"
              placeholderTextColor={Colors.slate400}
              multiline
              numberOfLines={3}
              value={tempRemarks}
              onChangeText={(text) => {
                setTempRemarks(text);
                if (text.trim()) setRemarkError(false);
              }}
            />

            {remarkError ? (
              <Text style={styles.errorText}>Observation remarks are mandatory for failed checks.</Text>
            ) : null}

            <View style={styles.modalButtons}>
              <Button
                title="Cancel"
                variant="outline"
                onPress={() => setModalVisible(false)}
                style={styles.modalBtn}
              />
              <Button
                title="Record Failure"
                variant="danger"
                onPress={handleConfirmFail}
                style={styles.modalBtn}
              />
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  rowContainer: {
    backgroundColor: Colors.white,
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.slate200,
  },
  rowPass: {
    backgroundColor: '#F8FCF9',
  },
  rowFail: {
    backgroundColor: '#FEF8F8',
    borderLeftWidth: 4,
    borderLeftColor: Colors.fail,
  },
  topInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  textContainer: {
    flex: 1,
    paddingRight: 10,
  },
  itemName: {
    fontSize: Typography.sizes.sm,
    fontWeight: Typography.weights.medium,
    color: Colors.slate900,
    lineHeight: 18,
  },
  refValue: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 2,
  },
  remarksContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 4,
  },
  remarksText: {
    fontSize: Typography.sizes.xs,
    color: Colors.fail,
    fontWeight: Typography.weights.semiBold,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 8,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 6,
    borderWidth: 1.5,
    minHeight: 36,
    gap: 4,
  },
  passBtn: {
    backgroundColor: Colors.white,
    borderColor: Colors.pass,
  },
  passBtnActive: {
    backgroundColor: Colors.pass,
    borderColor: Colors.pass,
  },
  failBtn: {
    backgroundColor: Colors.white,
    borderColor: Colors.fail,
  },
  failBtnActive: {
    backgroundColor: Colors.fail,
    borderColor: Colors.fail,
  },
  actionBtnText: {
    fontSize: Typography.sizes.xs,
    fontWeight: Typography.weights.bold,
  },
  secondaryActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  iconBtn: {
    padding: 6,
    position: 'relative',
  },
  photoCountBadge: {
    position: 'absolute',
    top: 2,
    right: 2,
    backgroundColor: Colors.primary,
    borderRadius: 8,
    width: 14,
    height: 14,
    justifyContent: 'center',
    alignItems: 'center',
  },
  photoCountText: {
    color: Colors.white,
    fontSize: 9,
    fontWeight: '700',
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: Colors.overlay,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: Spacing.xl,
    width: '100%',
    maxWidth: 420,
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  modalTitle: {
    fontSize: Typography.sizes.lg,
    fontWeight: Typography.weights.bold,
    color: Colors.slate900,
  },
  modalItemTitle: {
    fontSize: Typography.sizes.base,
    fontWeight: Typography.weights.semiBold,
    color: Colors.slate800,
    marginTop: 4,
  },
  modalSub: {
    fontSize: Typography.sizes.xs,
    color: Colors.slate500,
    marginTop: 4,
    marginBottom: 12,
  },
  textInput: {
    backgroundColor: Colors.slate50,
    borderWidth: 1.5,
    borderColor: Colors.border,
    borderRadius: 8,
    padding: 10,
    fontSize: Typography.sizes.sm,
    color: Colors.slate900,
    textAlignVertical: 'top',
    minHeight: 70,
  },
  textInputError: {
    borderColor: Colors.fail,
  },
  errorText: {
    color: Colors.fail,
    fontSize: Typography.sizes.xs,
    marginTop: 4,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
    marginTop: 16,
  },
  modalBtn: {
    flex: 1,
  },
});
