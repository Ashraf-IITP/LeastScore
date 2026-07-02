import { CapacitorConfig } from '@capacitor/cli';
const config: CapacitorConfig = {
  appId: 'cc.altius.leastscore',
  appName: 'LeastScore',
  webDir: 'out',
  server: {
    androidScheme: 'https',
    url: process.env.CAPACITOR_SERVER_URL || undefined,
    cleartext: true
  },
  plugins: {
    SplashScreen: { launchAutoHide: false }
  }
};
export default config;
