import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'edu.vku.fieldsurvey',
  appName: 'VKU Field Survey',
  webDir: 'dist',
  server: {
    androidScheme: 'https',
    cleartext: true
  },
  plugins: {
    Camera: {
      presentationStyle: 'fullscreen'
    },
    LocalNotifications: {
      smallIcon: 'ic_stat_vku',
      iconColor: '#0055a5',
      sound: 'beep.wav'
    }
  }
};

export default config;
