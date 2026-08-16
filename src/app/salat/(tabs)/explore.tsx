import { Div } from "@/components/ui/div"
import { Message } from "@/components/ui/message"
import { Radio } from "@/components/ui/radio"
import { Switch } from "@/components/ui/switch"
import { locales } from "@/constants/l10n"
import { useTranslate } from "@/hooks/use-translate"
import { ILocale } from "@/l10n"
import { useLocale } from "@/stores/locale"
import { useState } from "react"

export default function TabTwoScreen() {
  const [value, setValue] = useState<string>("opt1")
  const [checked, setChecked] = useState(false)
  const locale = useLocale((s) => s.locale)
  const setLocale = useLocale((s) => s.setLocale)
  const translate = useTranslate()

  return (
    <Div
      style={{
        flex: 1,
        paddingBottom: 16,
        paddingTop: 118,
        paddingHorizontal: 16,
        gap: 20,
      }}
    >
      <Switch checked={checked} onChange={setChecked} label='Lorem Data' />

      <Radio value={value} onChange={setValue}>
        {Array(3)
          .fill(0)
          .map((_, index) => {
            return (
              <Radio.Item key={index} value={`opt${index}`}>
                <Message>{`Option ${index}`}</Message>
              </Radio.Item>
            )
          })}
      </Radio>

      <Radio value={locale} onChange={(val) => setLocale(val as ILocale)}>
        {Object.values(locales).map((locale, index) => {
          return (
            <Radio.Item key={index} value={locale.localeCode}>
              <Message>{locale.nativeName}</Message>
              <Message>{translate(locale.trCode)}</Message>
            </Radio.Item>
          )
        })}
      </Radio>
    </Div>
  )
}
