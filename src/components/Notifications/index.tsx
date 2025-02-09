import React, { useState, useRef, useEffect } from "react";
import { Bell } from "lucide-react";
import { Button } from "../ui/Button";
import { cn } from "../../lib/utils";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
	id: string;
	title: string;
	message: string;
	read: boolean;
	timestamp: string;
}

export const Notifications: React.FC = () => {
	const [isOpen, setIsOpen] = useState(false);
	const [notifications, setNotifications] = useState<Notification[]>([]);
	const notificationsRef = useRef<HTMLDivElement>(null);

	// Handle click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				notificationsRef.current &&
				!notificationsRef.current.contains(event.target as Node)
			) {
				setIsOpen(false);
			}
		};

		document.addEventListener("mousedown", handleClickOutside);
		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, []);

	const unreadCount = notifications.filter((n) => !n.read).length;

	const markAllAsRead = () => {
		setNotifications(notifications.map((n) => ({ ...n, read: true })));
		setIsOpen(false);
	};

	return (
		<div className="relative" ref={notificationsRef}>
			<Button
				variant="ghost"
				size="icon"
				className="relative"
				onClick={() => setIsOpen(!isOpen)}
			>
				<Bell className="h-5 w-5" />
				{unreadCount > 0 && (
					<motion.span
						initial={{ scale: 0 }}
						animate={{ scale: 1 }}
						className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-error-500 text-[10px] font-medium text-white flex items-center justify-center"
					>
						{unreadCount}
					</motion.span>
				)}
			</Button>

			<AnimatePresence>
				{isOpen && (
					<motion.div
						initial={{ opacity: 0, scale: 0.95, y: -20 }}
						animate={{ opacity: 1, scale: 1, y: 0 }}
						exit={{ opacity: 0, scale: 0.95, y: -20 }}
						transition={{ duration: 0.2, type: "spring", bounce: 0.3 }}
						className="absolute right-0 z-40 mt-2 w-80 rounded-md bg-white dark:bg-neutral-800 shadow-lg ring-1 ring-neutral-200 dark:ring-neutral-700"
					>
						<div className="p-4">
							<div className="flex items-center justify-between mb-4">
								<h3 className="text-sm font-medium text-neutral-900 dark:text-neutral-100">
									Notifications
								</h3>
								{unreadCount > 0 && (
									<button
										onClick={markAllAsRead}
										className="text-xs text-primary-600 hover:text-primary-700 dark:text-primary-400"
									>
										Mark all as read
									</button>
								)}
							</div>

							<div className="space-y-2">
								{notifications.length === 0 ? (
									<p className="text-sm text-neutral-500 dark:text-neutral-400 text-center py-4">
										No notifications
									</p>
								) : (
									<AnimatePresence>
										{notifications.map((notification) => (
											<motion.div
												key={notification.id}
												initial={{ opacity: 0, y: 10 }}
												animate={{ opacity: 1, y: 0 }}
												exit={{ opacity: 0, y: -10 }}
												transition={{ duration: 0.2 }}
												className={cn(
													"p-3 rounded-md",
													notification.read
														? "bg-neutral-50 dark:bg-neutral-800/50"
														: "bg-primary-50 dark:bg-primary-900/20"
												)}
											>
												<div className="flex justify-between items-start">
													<h4
														className={cn(
															"text-sm font-medium",
															notification.read
																? "text-neutral-700 dark:text-neutral-300"
																: "text-primary-900 dark:text-primary-100"
														)}
													>
														{notification.title}
													</h4>
													<span className="text-xs text-neutral-500 dark:text-neutral-400">
														{notification.timestamp}
													</span>
												</div>
												<p
													className={cn(
														"text-sm mt-1",
														notification.read
															? "text-neutral-600 dark:text-neutral-400"
															: "text-primary-800 dark:text-primary-200"
													)}
												>
													{notification.message}
												</p>
											</motion.div>
										))}
									</AnimatePresence>
								)}
							</div>
						</div>
					</motion.div>
				)}
			</AnimatePresence>
		</div>
	);
};
