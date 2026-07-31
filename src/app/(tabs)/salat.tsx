import { Div } from "@/components/ui/div"
import { Message } from "@/components/ui/message"
import { useCalendars } from "expo-localization"

export default function Salat() {
  const calendars = useCalendars()

  return (
    <Div style={{ flex: 1, flexDirection: "column" }}>
      <Message>{JSON.stringify(calendars)}</Message>
    </Div>
  )
}
