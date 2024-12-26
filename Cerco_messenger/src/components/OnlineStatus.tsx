interface OnlineStatusProps {
  online: boolean;
}

const OnlineStatus = ({ online }: OnlineStatusProps) => {
  return (
    <div
      className={`absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white ${
        online ? "bg-online" : "bg-offline"
      }`}
    />
  );
};

export default OnlineStatus;