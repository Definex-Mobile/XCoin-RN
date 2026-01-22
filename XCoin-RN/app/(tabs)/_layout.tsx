import { Tabs } from 'expo-router';
import { Platform, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { colors } from '../../src/constants/colors';
import { useTranslation as useI18nTranslation } from '../../src/constants/i18n';
import HomeIcon from '../../assets/icons/home_menu.svg';
import PortfolioIcon from '../../assets/icons/portfolio_menu.svg';
import RewardsIcon from '../../assets/icons/rewards_menu.svg';
import MarketIcon from '../../assets/icons/market_menu.svg';
import ProfileIcon from '../../assets/icons/profile_menu.svg';

export default function TabsLayout() {
    // Call hook once at the top
    const { t } = useI18nTranslation();

    const homeLabel = t('navigation.home');
    const portfolioLabel = t('navigation.portfolio');
    const rewardsLabel = t('navigation.rewards');
    const marketLabel = t('navigation.market');
    const profileLabel = t('navigation.profile');

    return (
        <SafeAreaView className="flex-1" edges={['top']}>
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
                        tabBarLabel: homeLabel,
                        tabBarIcon: ({ color }) => (
                            <HomeIcon width={20} height={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="portfolio"
                    options={{
                        title: 'Portfolio',
                        tabBarLabel: portfolioLabel,
                        tabBarIcon: ({ color }) => (
                            <PortfolioIcon width={20} height={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="rewards"
                    options={{
                        title: 'Rewards',
                        tabBarLabel: rewardsLabel,
                        tabBarIcon: ({ color }) => (
                            <RewardsIcon width={20} height={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="market"
                    options={{
                        title: 'Market',
                        tabBarLabel: marketLabel,
                        tabBarIcon: ({ color }) => (
                            <MarketIcon width={20} height={20} color={color} />
                        ),
                    }}
                />
                <Tabs.Screen
                    name="profile"
                    options={{
                        title: 'Profile',
                        tabBarLabel: profileLabel,
                        tabBarIcon: ({ color }) => (
                            <ProfileIcon width={20} height={20} color={color} />
                        ),
                    }}
                />
            </Tabs>
        </SafeAreaView>
    );
}
