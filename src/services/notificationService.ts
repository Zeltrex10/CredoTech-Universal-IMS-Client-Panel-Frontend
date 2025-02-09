import { toast } from "react-toastify";

export interface Notification {
	id: string;
	type: "info" | "success" | "warning" | "error";
	title: string;
	message: string;
	timestamp: string;
	read: boolean;
}

class NotificationService {
	private ws: WebSocket | null = null;
	private reconnectAttempts = 0;
	private maxReconnectAttempts = 5;
	private reconnectTimeout = 1000; // Start with 1 second
	private notificationHandlers: ((notification: Notification) => void)[] = [];

	constructor() {
		this.connect();
	}

	private connect() {
		const wsUrl = import.meta.env.VITE_WS_URL || "ws://localhost:8000/ws";
		this.ws = new WebSocket(`${wsUrl}/notifications`);

		this.ws.onopen = () => {
			console.log("Connected to notification service");
			this.reconnectAttempts = 0;
			this.reconnectTimeout = 1000;
		};

		this.ws.onmessage = (event) => {
			try {
				const notification: Notification = JSON.parse(event.data);
				this.handleNotification(notification);
			} catch (error) {
				console.error("Error parsing notification:", error);
			}
		};

		this.ws.onclose = () => {
			console.log("Disconnected from notification service");
			this.attemptReconnect();
		};

		this.ws.onerror = (error) => {
			console.error("WebSocket error:", error);
		};
	}

	private attemptReconnect() {
		if (this.reconnectAttempts < this.maxReconnectAttempts) {
			setTimeout(() => {
				console.log(
					`Attempting to reconnect... (${this.reconnectAttempts + 1}/${
						this.maxReconnectAttempts
					})`
				);
				this.connect();
				this.reconnectAttempts++;
				this.reconnectTimeout *= 2; // Exponential backoff
			}, this.reconnectTimeout);
		} else {
			console.error("Max reconnection attempts reached");
			toast.error(
				"Lost connection to notification service. Please refresh the page."
			);
		}
	}

	private handleNotification(notification: Notification) {
		// Show toast notification
		toast[notification.type](notification.message, {
			position: "top-right",
			autoClose: 5000,
			hideProgressBar: false,
			closeOnClick: true,
			pauseOnHover: true,
			draggable: true,
		});

		// Notify all handlers
		this.notificationHandlers.forEach((handler) => handler(notification));
	}

	public subscribe(handler: (notification: Notification) => void) {
		this.notificationHandlers.push(handler);
		return () => {
			this.notificationHandlers = this.notificationHandlers.filter(
				(h) => h !== handler
			);
		};
	}

	public async markAsRead(notificationId: string) {
		try {
			const response = await fetch(
				`/api/notifications/${notificationId}/read`,
				{
					method: "POST",
					credentials: "include",
				}
			);
			if (!response.ok) throw new Error("Failed to mark notification as read");
		} catch (error) {
			console.error("Error marking notification as read:", error);
			throw error;
		}
	}

	public async markAllAsRead() {
		try {
			const response = await fetch("/api/notifications/mark-all-read", {
				method: "POST",
				credentials: "include",
			});
			if (!response.ok)
				throw new Error("Failed to mark all notifications as read");
		} catch (error) {
			console.error("Error marking all notifications as read:", error);
			throw error;
		}
	}

	public disconnect() {
		if (this.ws) {
			this.ws.close();
			this.ws = null;
		}
	}
}

export const notificationService = new NotificationService();
