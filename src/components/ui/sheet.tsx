import React, { ReactNode } from "react"
import {
    DimensionValue,
    I18nManager,
    Modal,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native"

export interface SheetProps {
  children: ReactNode
  visible: boolean
  onClose?: () => void

  // Sizing Options
  height?: DimensionValue
  maxHeight?: DimensionValue

  // Behaviors
  dismissable?: boolean
  showHandle?: boolean

  // Header / Title Options
  title?: string
  headerRight?: ReactNode
}

export default function Sheet({
  children,
  visible,
  onClose,
  height,
  maxHeight = "80%",
  dismissable = true,
  showHandle = true,
  title,
  headerRight,
}: SheetProps) {
  const isRTL = I18nManager.isRTL

  const handleDismiss = () => {
    if (dismissable && onClose) {
      onClose()
    }
  }

  return (
    <Modal
      animationType='slide'
      transparent={true}
      visible={visible}
      onRequestClose={handleDismiss}
    >
      <View style={styles.overlay}>
        {/* Backdrop */}
        <Pressable style={styles.backdrop} onPress={handleDismiss} />

        {/* Bottom Sheet Container */}
        <View
          style={[styles.sheetContainer, height ? { height } : { maxHeight }]}
        >
          {/* Drag Handle */}
          {showHandle && <View style={styles.dragHandle} />}

          {/* Optional Header */}
          {(title || headerRight) && (
            <View
              style={[
                styles.header,
                { flexDirection: isRTL ? "row-reverse" : "row" },
              ]}
            >
              <Text
                style={[styles.title, { textAlign: isRTL ? "right" : "left" }]}
              >
                {title}
              </Text>
              {headerRight}
            </View>
          )}

          {/* Content */}
          <View style={styles.content}>{children}</View>
        </View>
      </View>
    </Modal>
  )
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  sheetContainer: {
    backgroundColor: "#2B2D31",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },
  dragHandle: {
    width: 36,
    height: 4,
    backgroundColor: "#4E5058",
    borderRadius: 2,
    alignSelf: "center",
    marginBottom: 12,
  },
  header: {
    alignItems: "center",
    justifyContent: "space-between",
    paddingBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    flex: 1,
  },
  content: {
    flexShrink: 1,
  },
})
