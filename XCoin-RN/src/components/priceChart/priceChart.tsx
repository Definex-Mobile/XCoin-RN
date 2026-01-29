import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import type { ChartDataPoint } from "../../types/coinDetail";
import { getCurrencySymbol } from "../../utils/money";
import { useTranslation as useI18nTranslation } from "../../constants/i18n";
import { colors } from "../../constants/colors";

interface PriceChartProps {
  graphArray: ChartDataPoint[];
  pointArray: number[];
  currency: string;
}

export function PriceChart({ graphArray, pointArray, currency }: PriceChartProps) {
  const { t } = useI18nTranslation();
  const screenWidth = Dimensions.get("window").width;
  const currencySymbol = getCurrencySymbol(currency);

  const chartData = useMemo(() => {
    if (!graphArray || graphArray.length === 0) {
      return {
        labels: [] as string[],
        datasets: [{ data: [0] }],
      };
    }

    const prices = graphArray.map((point) => point.price);

    const labels = graphArray.map((point, index) => {
      const interval = Math.max(1, Math.floor((graphArray.length - 1) / 4));
      if (index === 0 || index === graphArray.length - 1 || index % interval === 0) {
        const date = new Date(point.timestamp * 1000);
        return `${date.getHours().toString().padStart(2, "0")}:${date.getMinutes().toString().padStart(2, "0")}`;
      }
      return "";
    });

    return {
      labels,
      datasets: [
        {
          data: prices,
          color: () => colors.primaryBlue.DEFAULT,
          strokeWidth: 3,
        },
      ],
    };
  }, [graphArray]);

  const chartConfig = useMemo(
    () => ({
      backgroundColor: "#ffffff",
      backgroundGradientFrom: "#ffffff",
      backgroundGradientTo: "#ffffff",
      decimalPlaces: 0,
      color: () => colors.primaryBlue.DEFAULT,
      labelColor: (opacity = 1) => `rgba(107, 114, 128, ${opacity})`,
      propsForDots: { r: "0" },
      propsForBackgroundLines: {
        strokeDasharray: "",
        stroke: "rgba(0,0,0,0.08)",
        strokeWidth: 1,
      },
      formatYLabel: (value: string) => {
        const num = Number(value);
        if (!Number.isNaN(num)) {
          return `${currencySymbol}${Math.round(num).toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
        }
        return value;
      },
    }),
    [currencySymbol],
  );

  const segments = Math.max(1, pointArray.length - 1);

  return (
    <View style={{ paddingVertical: 8, paddingHorizontal: 0 }}>
      <View
        style={{
          backgroundColor: "white",
          borderRadius: 16,
          overflow: "hidden",
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        }}
      >
        {graphArray && graphArray.length > 0 ? (
          <View style={{ width: screenWidth, overflow: "hidden" }}>
            <LineChart
              data={chartData}
              width={screenWidth}
              height={300}
              chartConfig={chartConfig}
              bezier={false}
              withShadow={false}
              withDots={false}
              withInnerLines={true}
              withOuterLines={false}
              withHorizontalLines={true}
              withHorizontalLabels={false}
              withVerticalLines={false}
              withVerticalLabels={true}
              segments={segments}
              style={{
                paddingRight: 32,
                paddingTop: 16,
              }}
            />
          </View>
        ) : (
          <View style={{ height: 240, alignItems: "center", justifyContent: "center" }}>
            <Text className="text-coin-symbol">{t("coinDetail.noChartData")}</Text>
          </View>
        )}
      </View>
    </View>
  );
}
