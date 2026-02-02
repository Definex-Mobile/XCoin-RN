import React, { useMemo } from "react";
import { View, Text, Dimensions } from "react-native";
import { LineChart } from "react-native-chart-kit";
import type { ChartDataPoint } from "../../types/coinDetail";
import type { TimeRange } from "../../types/coinDetail";
import { getCurrencySymbol } from "../../utils/money";
import { useTranslation as useI18nTranslation } from "../../constants/i18n";
import { colors } from "../../constants/colors";

const X_AXIS_LABELS: Record<TimeRange, string[]> = {
  "1H": ["16:00", "16:20", "16:40", "17:00", "17:20"],
  "24H": ["16:00", "20:00", "00:00", "04:00", "08:00"],
  "1W": ["Sun", "Mon", "Tue", "Wed", "Thu"],
  "1M": ["1 Ocak", "8 Ocak", "15 Ocak", "22 Ocak", "29 Ocak"],
  "6M": ["Ağu", "Eyl", "Eki", "Kas", "Ara"],
  "1Y": ["Oca", "Mar", "Haz", "Eyl", "Ara"],
  All: ["2022", "2023", "2024", "2025", "2026"],
};

interface PriceChartProps {
  graphArray: ChartDataPoint[];
  pointArray: number[];
  currency: string;
  timeRange: TimeRange;
}

export function PriceChart({ graphArray, pointArray, currency, timeRange }: PriceChartProps) {
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
    const sourceLabels = X_AXIS_LABELS[timeRange];
    const n = graphArray.length;
    const labels: string[] = new Array(n).fill("");
    if (sourceLabels.length > 0) {
      const step = n > 1 ? (n - 1) / (sourceLabels.length - 1) : 0;
      sourceLabels.forEach((label, i) => {
        const idx = step === 0 ? 0 : Math.floor(i * step);
        if (idx < n) labels[idx] = label;
      });
    }

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
  }, [graphArray, timeRange]);

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
              width={screenWidth - 40}
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
                paddingRight: 24,
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
