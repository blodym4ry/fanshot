import { View, Text } from 'react-native';

export default function Home() {
  return (
    <View className="flex-1 items-center justify-center bg-gray-50 p-8">
      <Text className="mb-4 text-4xl font-bold text-primary-700">FanShot</Text>
      <Text className="mb-8 text-center text-lg text-gray-600">
        FIFA World Cup 2026{'\n'}AI-Powered Fan Photo Experience
      </Text>
      <View className="rounded-2xl border border-gray-200 bg-white p-6">
        <Text className="text-center text-base text-gray-500">
          Upload selfie &rarr; Pick scene &rarr; Get photo
        </Text>
      </View>
    </View>
  );
}
