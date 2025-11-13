export default function LoadingProducts() {
  return (
    <div style={{ position: 'fixed', top: 0, left: 0, right: 0, zIndex: 60 }}>
      <div className="h-1 w-full overflow-hidden">
        <div className="h-full w-1/3 rounded-r-full loading-slide bg-gradient-to-r from-pink-500 via-purple-500 to-yellow-400" />
      </div>
    </div>
  );
}
