import { Tabs } from 'expo-router';
import { Platform } from 'react-native';
import { colors } from '../../src/constants/colors';
import { useTranslation } from '../../src/hooks/useTranslation';
import HomeIcon from '../../assets/icons/home_menu.svg';
import PortfolioIcon from '../../assets/icons/portfolio_menu.svg';
import RewardsIcon from '../../assets/icons/rewards_menu.svg';
import MarketIcon from '../../assets/icons/market_menu.svg';
import ProfileIcon from '../../assets/icons/profile_menu.svg';

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: colors.navigation.active,
                tabBarInactiveTintColor: colors.navigation.inactive,
                tabBarStyle: {
                    backgroundColor: colors.navigation.background,
                    borderTopWidth: 0,
                    height: 88,
                    paddingBottom: 20,
                    paddingTop: 20,
                    paddingHorizontal: 16,
                    ...Platform.select({
                        ios: {
                            shadowColor: '#000',
                            shadowOffset: { width: 0, height: -2 },
                            shadowOpacity: 0.1,
                            shadowRadius: 4,
                        },
                        android: {
                            elevation: 8,
                        },
                    }),
                },
                tabBarLabelStyle: {
                    fontFamily: 'Roboto-ThinItalic',
                    fontSize: 10,
                    marginTop: 2,
                },
                tabBarIconStyle: {
                    width: 20,
                    height: 20,
                },
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: 'Home',
                    tabBarLabel: useTranslation('navigation.home'),
                    tabBarIcon: ({ color }) => (
                        <HomeIcon width={20} height={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="portfolio"
                options={{
                    title: 'Portfolio',
                    tabBarLabel: useTranslation('navigation.portfolio'),
                    tabBarIcon: ({ color }) => (
                        <PortfolioIcon width={20} height={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="rewards"
                options={{
                    title: 'Rewards',
                    tabBarLabel: useTranslation('navigation.rewards'),
                    tabBarIcon: ({ color }) => (
                        <RewardsIcon width={20} height={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="market"
                options={{
                    title: 'Market',
                    tabBarLabel: useTranslation('navigation.market'),
                    tabBarIcon: ({ color }) => (
                        <MarketIcon width={20} height={20} color={color} />
                    ),
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: 'Profile',
                    tabBarLabel: useTranslation('navigation.profile'),
                    tabBarIcon: ({ color }) => (
                        <ProfileIcon width={20} height={20} color={color} />
                    ),
                }}
            />
        </Tabs>
    );
}
