import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';
import { Theme } from '../src/theme/Theme';

const screenWidth = Dimensions.get('window').width;

const defaultData = {
    labels: ["Mon", "Tue", "Wed", "Thu", "Fri"],
    datasets: [{ data: [20, 45, 28, 80, 99] }]
};

export const CustomLineChart = ({ data = defaultData }) => {
    return (
        <View style={{ marginVertical: 8, alignItems: 'center' }}>
            <LineChart
                data={data}
                width={screenWidth - 64}
                height={200}
                chartConfig={{
                    backgroundColor: Theme.colors.surface,
                    backgroundGradientFrom: Theme.colors.surface,
                    backgroundGradientTo: Theme.colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(79, 70, 229, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                    style: { borderRadius: 16 },
                    propsForDots: {
                        r: "6",
                        strokeWidth: "2",
                        stroke: Theme.colors.primary
                    }
                }}
                bezier
                style={{ borderRadius: 16 }}
            />
        </View>
    );
};

export const CustomBarChart = ({ data = defaultData }) => {
    return (
        <View style={{ marginVertical: 8, alignItems: 'center' }}>
            <BarChart
                data={data}
                width={screenWidth - 64}
                height={200}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: Theme.colors.surface,
                    backgroundGradientFrom: Theme.colors.surface,
                    backgroundGradientTo: Theme.colors.surface,
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
                }}
                style={{ borderRadius: 16 }}
            />
        </View>
    );
};
