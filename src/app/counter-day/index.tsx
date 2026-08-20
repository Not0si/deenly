import { useGetDayCounts } from "@/apis/day-count"
import { Div } from "@/components/ui/div"
import InputDate from "@/components/ui/input-date"
import InputDateTime from "@/components/ui/input-datetime"
import InputNumber from "@/components/ui/input-number"
import InputText from "@/components/ui/input-text"
import { Message } from "@/components/ui/message"
import Sheet from "@/components/ui/sheet"
import { useState } from "react"
import { Pressable, StyleSheet, Text, View } from "react-native"

export default function Counter() {
  const [sheetVisible, setSheetVisible] = useState(false)

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
      <Pressable
        style={styles.openButton}
        onPress={() => setSheetVisible(true)}
      >
        <Text style={styles.openButtonText}>Open User Options</Text>
      </Pressable>

      <Sheet onClose={() => setSheetVisible(false)} visible={sheetVisible}>
        {/* Profile / Header Info */}
        <View style={styles.header}>
          <View style={styles.avatarPlaceholder}>
            <Text style={styles.avatarText}>W</Text>
          </View>
          <View style={styles.headerInfo}>
            <Text style={styles.username}>Wumpus</Text>
            <Text style={styles.statusText}>Online • Playing Games</Text>
          </View>
        </View>
        <InputDateTime />
        <InputDate />
        <InputNumber />
        <InputText />
        <View style={styles.divider} />

        {/* Action Menu List */}
        <View style={styles.menuContainer}>
          <Pressable
            style={styles.menuItem}
            onPress={() => setSheetVisible(false)}
          >
            <Text style={styles.menuIcon}>💬</Text>
            <Text style={styles.menuText}>Message</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => setSheetVisible(false)}
          >
            <Text style={styles.menuIcon}>📞</Text>
            <Text style={styles.menuText}>Call</Text>
          </Pressable>

          <Pressable
            style={styles.menuItem}
            onPress={() => setSheetVisible(false)}
          >
            <Text style={styles.menuIcon}>✏️</Text>
            <Text style={styles.menuText}>Edit Server Profile</Text>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.menuItem}
            onPress={() => setSheetVisible(false)}
          >
            <Text style={[styles.menuIcon, styles.destructiveText]}>🚫</Text>
            <Text style={[styles.menuText, styles.destructiveText]}>
              Block User
            </Text>
          </Pressable>
        </View>
      </Sheet>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1E1F22", //   darkest bg
    justifyContent: "center",
    alignItems: "center",
  },
  openButton: {
    backgroundColor: "#5865F2", // Blurple
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  openButtonText: {
    color: "#FFFFFF",
    fontWeight: "600",
    fontSize: 15,
  },
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    justifyContent: "flex-end",
  },
  backdrop: {
    flex: 1,
  },
  sheetContainer: {
    backgroundColor: "#2B2D31", //  sheet surface
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingHorizontal: 16,
    paddingBottom: 32,
    paddingTop: 8,
  },

  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  avatarPlaceholder: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: "#5865F2",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 12,
  },
  avatarText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerInfo: {
    justifyContent: "center",
  },
  username: {
    color: "#F2F3F5",
    fontSize: 16,
    fontWeight: "700",
  },
  statusText: {
    color: "#949BA4",
    fontSize: 13,
  },
  divider: {
    height: 1,
    backgroundColor: "#35373C",
    marginVertical: 8,
  },
  menuContainer: {
    marginTop: 4,
  },
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 14,
  },
  menuText: {
    color: "#DBDEE1",
    fontSize: 15,
    fontWeight: "500",
  },
  destructiveText: {
    color: "#DA373C",
  },
})
