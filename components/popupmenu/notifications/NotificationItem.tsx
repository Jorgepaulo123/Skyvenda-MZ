

interface NotificationItemProps {
  title: string;
  description: string;
  image: string;
}

export function NotificationItem({ title, description, image }: NotificationItemProps) {
  return (
    <div className="flex items-start gap-4 p-4 hover:bg-indigo-50 transition-all duration-200 cursor-pointer border-b border-gray-100 last:border-b-0">
      <div className="relative">
        <img 
          src={image} 
          alt=""
          className="w-12 h-12 rounded-full object-cover border-2 border-indigo-100"
        />
        <div className="absolute -top-1 -right-1 w-3 h-3 bg-indigo-500 rounded-full border-2 border-white" />
      </div>
      <div className="flex-1 min-w-0">
        <h2 className="text-sm font-semibold text-gray-900 truncate mb-1">{title}</h2>
        <p className="text-xs text-gray-600 leading-relaxed">{description}</p>
        <span className="text-xs text-indigo-600 font-medium mt-1 block">Agora mesmo</span>
      </div>
    </div>
  );
}