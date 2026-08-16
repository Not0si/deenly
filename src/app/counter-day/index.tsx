import { useGetDayCounts } from "@/apis/day-count"
import { Div } from "@/components/ui/div"
import { Message } from "@/components/ui/message"

export default function Counter() {
  const { data } = useGetDayCounts({
    page: 1,
    limit: 10,
  })

  return (
    <Div
      style={{
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: 60,
      }}
    >
      {(data?.data ?? []).map((item) => {
        return (
          <Div key={item.id}>
            <Message type='h1'>{item.name}</Message>
          </Div>
        )
      })}
    </Div>
  )
}
