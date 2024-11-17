import NetInfo from "@react-native-community/netinfo";

export const checkConnectivity = async () => {
  const networkState = await NetInfo.fetch();
  return networkState.isConnected;
};
