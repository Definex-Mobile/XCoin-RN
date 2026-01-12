import { Tabs } from 'expo-router';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: '#0f3460',
                tabBarInactiveTintColor: '#888',
                tabBarStyle: {
                    backgroundColor: '#fff',
                    borderTopWidth: 1,
                    borderTopColor: '#eee',
                    height: 60,
                    paddingBottom: 8,
                    paddingTop: 8,
                },
                headerStyle: {
                    backgroundColor: '#1a1a2e',
                },
                headerTintColor: '#fff',
                headerTitleStyle: {
                    fontWeight: 'bold',
                },
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Ana Sayfa',
                    tabBarLabel: 'Home',
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: 'Portföy',
                    tabBarLabel: 'Portfolio',
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Ödüller',
                    tabBarLabel: 'Rewards',
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Piyasa',
                    tabBarLabel: 'Market',
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profil',
                    tabBarLabel: 'Profile',
                }}
            />
        </Tabs>
    );
}
