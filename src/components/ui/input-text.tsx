import React, { useState } from "react"
import {
    I18nManager,
    LayoutAnimation,
    Platform,
    Pressable,
    TextInput as RNTextInput,
    TextInputProps as RNTextInputProps,
    StyleSheet,
    Text,
    UIManager,
    View,
} from "react-native"

// Enable LayoutAnimation for Android
if (
  Platform.OS === "android" &&
  UIManager.setLayoutAnimationEnabledExperimental
) {
  UIManager.setLayoutAnimationEnabledExperimental(true)
}

export interface InputTextProps extends Omit<RNTextInputProps, "style"> {
  label?: string
  error?: string
  helperText?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  onRightIconPress?: () => void
  isLarge?: boolean
}

export default function InputText({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  onRightIconPress,
  value,
  onChangeText,
  placeholder,
  editable = true,
  secureTextEntry,
  isLarge = false,
  multiline,
  onContentSizeChange,
  ...rest
}: InputTextProps) {
  const [isFocused, setIsFocused] = useState(false)
  const [inputHeight, setInputHeight] = useState<number | undefined>(undefined)
  const isRTL = I18nManager.isRTL

  const baseHeight = isLarge ? 72 : 48

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
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor='#80848E'
          editable={editable}
          secureTextEntry={secureTextEntry}
          multiline={multiline ?? true}
          scrollEnabled={false} // Prevents inner scroll fighting with container height
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          onContentSizeChange={(e) => {
            const contentHeight = e.nativeEvent.contentSize.height
            const targetHeight = Math.round(contentHeight + 20)

            // Only trigger layout animation when line count actually changes
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
          {...rest}
        />

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
  helperText: {
    fontSize: 12,
    color: "#949BA4",
    marginTop: 6,
  },
  errorText: {
    color: "#FA3A3D",
  },
})
