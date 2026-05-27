"use client";

type NotificationType = "success" | "error" | "warning" | "info";

type NotificationBannerProps = {
  type: NotificationType;
  message: string;
  dismissible?: boolean;
  onDismiss?: () => void;
};

const NotificationBanner = ({
  type,
  message,
  dismissible = false,
  onDismiss,
}: NotificationBannerProps) => {
  const icons: Record<NotificationType, string> = {
    success: "✓",
    error: "✗",
    warning: "⚠",
    info: "ℹ",
  };

  const colors: Record<NotificationType, string> = {
    success: "bg-green-100 text-green-800 border-green-300",
    error: "bg-red-100 text-red-800 border-red-300",
    warning: "bg-yellow-100 text-yellow-800 border-yellow-300",
    info: "bg-blue-100 text-blue-800 border-blue-300",
  };

  return (
    <div role="alert" data-type={type} className={`flex items-center gap-3 p-4 rounded border ${colors[type]}`}>
      <span aria-hidden="true" className="text-lg">{icons[type]}</span>
      <p className="flex-1">{message}</p>
      {dismissible && (
        <button onClick={onDismiss} aria-label="Dismiss notification" className="text-xl font-bold hover:opacity-70">
          ×
        </button>
      )}
    </div>
  );
};

export default NotificationBanner;
