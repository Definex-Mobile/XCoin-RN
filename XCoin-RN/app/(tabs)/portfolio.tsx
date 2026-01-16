import React, { useState } from 'react';
import { View, ScrollView } from 'react-native';
import { MultipleSegmentButton } from '../../src/components/multipSegmentButton/multipleSegmentButton';
import PortfolioCard from '../../src/components/portfolioCard/portfolioCard';
import type { PortfolioApiResponse } from '../../src/types/portfolio/portfolio';

export default function Portfolio() {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const buttons = ['Deposit INR', 'Withdraw INR'];

    // API Response 
    const portfolioData: PortfolioApiResponse = {
        holdingValue: '2509.75',
        investedValue: 1618.75,
        availableINR: 1589,
        changeRatio: 9.77,
        currency: 'INR',
    };

    return (
        <ScrollView className="flex-1 mt-3 bg-mainLightBackground">
            <View className="">
                <PortfolioCard className="pt-3 mx-4" data={portfolioData} />
                <MultipleSegmentButton
                    className="mt-3 mx-4 mb-10"
                    buttons={['Deposit INR', 'Withdraw INR']}
                    selectedIndex={selectedIndex}
                    onSelectedIndexChange={setSelectedIndex}
                />
            </View>
        </ScrollView>
    );
}
