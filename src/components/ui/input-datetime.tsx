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

export interface InputDateTimeProps {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  editable?: boolean

  // DateTime configuration
  value?: Date | null
  onChangeValue?: (dateTime: Date) => void
  minDate?: Date
  maxDate?: Date
  is24Hour?: boolean
  formatDateTime?: (date: Date) => string
}

export default function InputDateTime({
  label,
  error,
  helperText,
  placeholder = "Select date and time",
  leftIcon,
  rightIcon,
  editable = true,
  value,
  onChangeValue,
  minDate,
  maxDate,
  is24Hour = false,
  formatDateTime,
}: InputDateTimeProps) {
  const [showPicker, setShowPicker] = useState(false)
  const [currentPickerMode, setCurrentPickerMode] = useState<"date" | "time">(
    "date"
  )
  const [tempDate, setTempDate] = useState<Date>(value || new Date())
  const isRTL = I18nManager.isRTL

  // Default DateTime display formatting
  const formatDisplayValue = (date: Date): string => {
    if (formatDateTime) return formatDateTime(date)

    const dateStr = date.toLocaleDateString()
    const timeStr = date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: !is24Hour,
    })

    return `${dateStr} • ${timeStr}`
  }

  const handlePress = () => {
    if (!editable) return
    setTempDate(value || new Date())
    setCurrentPickerMode("date")
    setShowPicker(true)
  }

  const handleChange = (event: DateTimePickerEvent, selectedDate?: Date) => {
    if (event.type === "dismissed") {
      setShowPicker(false)
      return
    }

    const currentDate = selectedDate || tempDate

    if (Platform.OS === "android") {
      if (currentPickerMode === "date") {
        // Step 1 done (Date chosen) -> Open Step 2 (Time picker)
        setTempDate(currentDate)
        setCurrentPickerMode("time")
      } else {
        // Step 2 done (Time chosen) -> Complete selection
        setShowPicker(false)
        onChangeValue?.(currentDate)
      }
    } else {
      // iOS supports combined native wheels/calendar pickers directly
      setShowPicker(false)
      onChangeValue?.(currentDate)
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

      {/* Interactive Trigger Surface */}
      <Pressable
        onPress={handlePress}
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

        {/* Display Value */}
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

      {/* Native Platform DateTime Picker */}
      {showPicker && (
        <DateTimePicker
          value={tempDate}
          mode={Platform.OS === "ios" ? "datetime" : currentPickerMode}
          display={Platform.OS === "ios" ? "inline" : "default"}
          minimumDate={minDate}
          maximumDate={maxDate}
          is24Hour={is24Hour}
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
