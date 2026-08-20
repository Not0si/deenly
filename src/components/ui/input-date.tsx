import DateTimePicker, {
    DateTimePickerEvent,
} from "@react-native-community/datetimepicker"
import React, { useState } from "react"
import {
    I18nManager,
    Platform,
    Pressable,
    StyleSheet,
    Text,
    View,
} from "react-native"

export type DatePickerMode = "date" | "time" | "datetime"

export interface InputDateProps {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  editable?: boolean

  // Date configuration
  value?: Date | null
  onChangeValue?: (date: Date) => void
  mode?: DatePickerMode
  minDate?: Date
  maxDate?: Date
  formatDate?: (date: Date, mode: DatePickerMode) => string
}

export default function InputDate({
  label,
  error,
  helperText,
  placeholder = "Select date",
  leftIcon,
  rightIcon,
  editable = true,
  value,
  onChangeValue,
  mode = "date",
  minDate,
  maxDate,
  formatDate,
}: InputDateProps) {
  const [showPicker, setShowPicker] = useState(false)
  const isRTL = I18nManager.isRTL

  // Default formatter if custom one is not passed
  const formatDisplayValue = (date: Date): string => {
    if (formatDate) return formatDate(date, mode)

    if (mode === "time") {
      return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    }
    if (mode === "datetime") {
      return `${date.toLocaleDateString()} ${date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      })}`
    }
    return date.toLocaleDateString()
  }

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (Platform.OS === "android") {
      setShowPicker(false)
    }
    if (event.type === "set" && selectedDate) {
      onChangeValue?.(selectedDate)
    }
  }

  return (
    <View style={styles.container}>
      {/* Optional Top Label */}
      {label && (
        <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
          {label}
        </Text>
      )}

      {/* Interactive Trigger Button */}
      <Pressable
        onPress={() => editable && setShowPicker(true)}
        disabled={!editable}
        style={({ pressed }) => [
          styles.inputContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
          pressed && editable && styles.pressedInput,
          !!error && styles.errorInput,
          !editable && styles.disabledInput,
        ]}
      >
        {/* Left Accessory Icon */}
        {leftIcon && <View style={styles.iconWrapper}>{leftIcon}</View>}

        {/* Display Text */}
        <Text
          style={[
            styles.inputText,
            { textAlign: isRTL ? "right" : "left" },
            !value && styles.placeholderText,
            !editable && styles.disabledText,
          ]}
          numberOfLines={1}
        >
          {value ? formatDisplayValue(value) : placeholder}
        </Text>

        {/* Right Accessory Icon */}
        {rightIcon && <View style={styles.iconWrapper}>{rightIcon}</View>}
      </Pressable>

      {/* Native Platform Date/Time Picker */}
      {showPicker && (
        <DateTimePicker
          value={value || new Date()}
          mode={mode}
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={minDate}
          maximumDate={maxDate}
          onChange={handleChange}
        />
      )}

      {/* Error or Helper Message below Field */}
      {(error || helperText) && (
        <Text
          style={[
            styles.helperText,
            !!error && styles.errorText,
            { textAlign: isRTL ? "right" : "left" },
          ]}
        >
          {error || helperText}
        </Text>
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    width: "100%",
    marginBottom: 16,
  },
  label: {
    fontSize: 12,
    fontWeight: "700",
    color: "#B5BAC1",
    textTransform: "uppercase",
    marginBottom: 8,
    letterSpacing: 0.25,
  },
  inputContainer: {
    backgroundColor: "#1E1F22",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "transparent",
    paddingHorizontal: 12,
    alignItems: "center",
    height: 48,
  },
  pressedInput: {
    borderColor: "#5865F2",
  },
  errorInput: {
    borderColor: "#FA3A3D",
  },
  disabledInput: {
    backgroundColor: "#2B2D31",
    opacity: 0.6,
  },
  inputText: {
    flex: 1,
    color: "#F2F3F5",
    fontSize: 15,
  },
  placeholderText: {
    color: "#80848E",
  },
  disabledText: {
    color: "#80848E",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  helperText: {
    fontSize: 12,
    color: "#949BA4",
    marginTop: 6,
  },
  errorText: {
    color: "#FA3A3D",
  },
})
