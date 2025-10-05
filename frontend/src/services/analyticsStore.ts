// Simple analytics data store
interface AnalyticsData {
  statistics: any;
  plots: Record<string, string>;
  summary: any;
}

let currentAnalytics: AnalyticsData | null = null;

export const setAnalyticsData = (data: AnalyticsData | null) => {
  currentAnalytics = data;
  // Dispatch event so components can listen
  window.dispatchEvent(new CustomEvent("analyticsUpdated", { detail: data }));
};

export const getAnalyticsData = (): AnalyticsData | null => {
  return currentAnalytics;
};

export default {
  setAnalyticsData,
  getAnalyticsData,
};
