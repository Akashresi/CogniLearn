import React from 'react';
import { Dimensions, View } from 'react-native';
import { LineChart, BarChart } from 'react-native-chart-kit';

const screenWidth = Dimensions.get('window').width;

const defaultData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun"],
    datasets: [{ data: [20, 45, 28, 80, 99, 43] }]
};

export const CustomLineChart = ({ data = defaultData, title }) => {
    return (
        <View style={{ marginVertical: 8, alignItems: 'center' }}>
            <LineChart
                data={data}
                width={screenWidth - 32}
                height={220}
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(0, 122, 255, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
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
                width={screenWidth - 32}
                height={220}
                yAxisLabel=""
                chartConfig={{
                    backgroundColor: '#ffffff',
                    backgroundGradientFrom: '#ffffff',
                    backgroundGradientTo: '#ffffff',
                    decimalPlaces: 0,
                    color: (opacity = 1) => `rgba(52, 199, 89, ${opacity})`,
                    labelColor: (opacity = 1) => `rgba(0, 0, 0, ${opacity})`,
                }}
                style={{ borderRadius: 16 }}
            />
        </View>
    );
};
