export const VideoChat = ({ remoteStream }) => {
  if (!remoteStream) {
    return null;
  }
  // remoteStream.getTracks().forEach(track => track.stop());
  return <video ref={(video) => { video.srcObject = remoteStream; }} autoPlay />
}