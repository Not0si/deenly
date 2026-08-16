import { Div } from "@/components/ui/div"
import { Message } from "@/components/ui/message"
import { Link, LinkProps } from "expo-router"

type Item = {
  href: LinkProps["href"]
  label: string
}

export default function HomeScreen() {
  const items: Item[] = [
    { href: "/counter-clicker", label: "Counter Clicker" },
    { href: "/counter-day", label: "Counter Day" },
    {
      href: "/salat",
      label: "Salat",
    },
  ]

  return (
    <Div>
      {items.map((item, index) => {
        return (
          <Link
            key={index}
            href={item.href}
            style={{ color: "blue", marginTop: 10 }}
          >
            <Div>
              <Message type='h1'>{item.label}</Message>
            </Div>
          </Link>
        )
      })}
    </Div>
  )
}
