export const VideoChat = ({ remoteStream }) => {
  if (!remoteStream) {
    return null;
  }
  // remoteStream.getTracks().forEach(track => track.stop());
  return <video ref={(video) => {
    if (video) {
      if (!video.srcObject) {
        video.srcObject = remoteStream;
      }
    }
  }} autoPlay />
}