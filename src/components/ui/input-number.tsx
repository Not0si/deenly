import React, { useState } from "react"
import {
    I18nManager,
    LayoutAnimation,
    NativeSyntheticEvent,
    Platform,
    Pressable,
    TextInput as RNTextInput,
    StyleSheet,
    Text,
    TextInputContentSizeChangeEventData,
    UIManager,
    View,
} from "react-native"

if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export type NumberType = "float" | "ufloat" | "int" | "uint"

export interface InputNumberProps {
  label?: string
  error?: string
  helperText?: string
  placeholder?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
  isLarge?: boolean
  editable?: boolean

  // Number configuration
  type?: NumberType
  value?: number | string
  onChangeValue?: (value: number | null, rawText: string) => void
  showSteppers?: boolean
  step?: number
  min?: number
  max?: number
  onContentSizeChange?: (
    e: NativeSyntheticEvent<TextInputContentSizeChangeEventData>
  ) => void
}

export default function InputNumber({
  label,
  error,
  helperText,
  placeholder,
  leftIcon,
  rightIcon,
  onRightIconPress,
  value = "",
  onChangeValue,
  editable = true,
  isLarge = false,
  type = "float",
  showSteppers = false,
  step = 1,
  min,
  max,
  onContentSizeChange,
}: InputNumberProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined)
  const isRTL = I18nManager.isRTL

  const baseHeight = isLarge ? 72 : 48

  // Filter raw string input based on type constraint
  const filterInput = (text: string): string => {
    let sanitized = text

    switch (type) {
      case "uint":
        sanitized = text.replace(/[^0-9]/g, "")
        break

      case "int":
        sanitized = text.replace(/(?!^-)[^0-9]/g, "")
        if (sanitized.indexOf("-") > 0) {
          sanitized = "-" + sanitized.replace(/-/g, "")
        }
        break

      case "ufloat":
        sanitized = text.replace(/[^0-9.]/g, "")
        const partsUFloat = sanitized.split(".")
        if (partsUFloat.length > 2) {
          sanitized = partsUFloat[0] + "." + partsUFloat.slice(1).join("")
        }
        break

      case "float":
      default:
        sanitized = text.replace(/(?!^-)[^0-9.]/g, "")
        if (sanitized.indexOf("-") > 0) {
          sanitized = "-" + sanitized.replace(/-/g, "")
        }
        const partsFloat = sanitized.split(".")
        if (partsFloat.length > 2) {
          sanitized = partsFloat[0] + "." + partsFloat.slice(1).join("")
        }
        break
    }

    return sanitized
  }

  const handleChangeText = (text: string) => {
    const sanitized = filterInput(text)

    if (sanitized === "" || sanitized === "-") {
      onChangeValue?.(null, sanitized)
      return
    }

    let parsed = type.includes("int")
      ? parseInt(sanitized, 10)
      : parseFloat(sanitized)

    if (isNaN(parsed)) {
      onChangeValue?.(null, sanitized)
      return
    }

    if (min !== undefined && parsed < min) parsed = min
    if (max !== undefined && parsed > max) parsed = max

    onChangeValue?.(parsed, sanitized)
  }

  const handleStep = (direction: "up" | "down") => {
    if (!editable) return
    const currentNum =
      typeof value === "number" ? value : parseFloat(String(value)) || 0
    const delta = direction === "up" ? step : -step
    let nextValue = currentNum + delta

    if ((type === "uint" || type === "ufloat") && nextValue < 0) {
      nextValue = 0
    }

    if (min !== undefined && nextValue < min) nextValue = min
    if (max !== undefined && nextValue > max) nextValue = max

    if (type === "float" || type === "ufloat") {
      nextValue = Math.round(nextValue * 100000) / 100000
    }

    onChangeValue?.(nextValue, String(nextValue))
  }

  const getKeyboardType = () => {
    if (type === "uint") return "number-pad"
    if (type === "int") return "numbers-and-punctuation"
    if (type === "ufloat") return "decimal-pad"
    return Platform.OS === "ios" ? "numbers-and-punctuation" : "numeric"
  }

  return (
    <View style={styles.container}>
      {/* Optional Top Label */}
      {label && (
        <Text style={[styles.label, { textAlign: isRTL ? "right" : "left" }]}>
          {label}
        </Text>
      )}

      {/* Input Container Field */}
      <View
        style={[
          styles.inputContainer,
          { flexDirection: isRTL ? "row-reverse" : "row" },
          { minHeight: baseHeight },
          inputHeight ? { height: Math.max(baseHeight, inputHeight) } : null,
          isFocused && styles.focusedInput,
          !!error && styles.errorInput,
          !editable && styles.disabledInput,
        ]}
      >
        {/* Left Accessory Icon */}
        {leftIcon && (
          <View style={[styles.iconWrapper, isLarge && styles.topAlignIcon]}>
            {leftIcon}
          </View>
        )}

        {/* Core Text Input */}
        <RNTextInput
          style={[
            styles.input,
            { textAlign: isRTL ? "right" : "left" },
            isLarge && styles.largeInput,
            !editable && styles.disabledText,
          ]}
          value={String(value)}
          onChangeText={handleChangeText}
          placeholder={placeholder}
          placeholderTextColor='#80848E'
          editable={editable}
          keyboardType={getKeyboardType()}
          scrollEnabled={false}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onContentSizeChange={(e) => {
            const contentHeight = e.nativeEvent.contentSize.height
            const targetHeight = Math.round(contentHeight + 20)

            if (inputHeight !== targetHeight) {
              LayoutAnimation.configureNext(
                LayoutAnimation.create(
                  150,
                  LayoutAnimation.Types.easeInEaseOut,
                  LayoutAnimation.Properties.opacity
                )
              )
              setInputHeight(targetHeight)
            }

            onContentSizeChange?.(e)
          }}
        />

        {/* Optional Stepper Buttons (+/-) */}
        {showSteppers && (
          <View
            style={[
              styles.stepperContainer,
              { flexDirection: isRTL ? "row-reverse" : "row" },
            ]}
          >
            <Pressable
              style={styles.stepperButton}
              onPress={() => handleStep("down")}
              disabled={!editable}
            >
              <Text style={styles.stepperText}>-</Text>
            </Pressable>
            <Pressable
              style={styles.stepperButton}
              onPress={() => handleStep("up")}
              disabled={!editable}
            >
              <Text style={styles.stepperText}>+</Text>
            </Pressable>
          </View>
        )}

        {/* Right Accessory Icon / Action Button */}
        {rightIcon && (
          <Pressable
            onPress={onRightIconPress}
            disabled={!onRightIconPress || !editable}
            style={[styles.iconWrapper, isLarge && styles.topAlignIcon]}
          >
            {rightIcon}
          </Pressable>
        )}
      </View>

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
    overflow: "hidden",
  },
  focusedInput: {
    borderColor: "#5865F2",
  },
  errorInput: {
    borderColor: "#FA3A3D",
  },
  disabledInput: {
    backgroundColor: "#2B2D31",
    opacity: 0.6,
  },
  input: {
    flex: 1,
    color: "#F2F3F5",
    fontSize: 15,
    paddingVertical: 10,
  },
  largeInput: {
    textAlignVertical: "top",
  },
  disabledText: {
    color: "#80848E",
  },
  iconWrapper: {
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 4,
  },
  topAlignIcon: {
    alignSelf: "flex-start",
    paddingTop: 12,
  },
  stepperContainer: {
    alignItems: "center",
    marginHorizontal: 4,
  },
  stepperButton: {
    backgroundColor: "#2B2D31",
    borderRadius: 4,
    width: 28,
    height: 28,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 2,
  },
  stepperText: {
    color: "#F2F3F5",
    fontSize: 16,
    fontWeight: "600",
    lineHeight: 18,
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
