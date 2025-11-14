"use client";
export default function ChatSkeleton(){
    return (
        <>
      {[1, 2, 3, 4, 5].map((item) => (
        <div key={item} className="flex gap-4 items-center hover:bg-gray-50 p-2 px-8 animate-pulse">
          <div className="w-[56px] h-[56px] rounded-full bg-gray-200" />
          <div className="flex-1">
            <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
            <div className="h-3 bg-gray-200 rounded w-32" />
          </div>
        </div>
      ))}
    </>
    )
}