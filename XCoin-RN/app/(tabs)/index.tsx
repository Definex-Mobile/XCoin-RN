import React from 'react';
import { ScrollView } from 'react-native';
import { CryptoCoinList } from '../../src/components/cryptoCoinList/cryptoCoinList';

export default function Home() {
    return (
        <ScrollView
            className="flex-1 bg-background px-4"
            showsVerticalScrollIndicator={false}
        >
            <CryptoCoinList />
        </ScrollView>
    );
}
