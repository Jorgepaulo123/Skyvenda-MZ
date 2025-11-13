"use client";
import AdaptiveFeed from "../components/feed/AdaptiveFeed";
import MainLayout from "../layout/MainLayout";

export default function HomePage() {
  return (
    <MainLayout>
      <div className="bg-gray-50 min-h-screen">
        <AdaptiveFeed />
      </div>
    </MainLayout>
  );
}
