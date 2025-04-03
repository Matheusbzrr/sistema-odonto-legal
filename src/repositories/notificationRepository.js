const Notification = require("../models/notificationModel");

const createNotification = async (userId, caseId, message) => {
  return await Notification.create({ userId, caseId, message });
};

const getUserNotifications = async (userId) => {
  return await Notification.find({ userId }).sort({ createdAt: -1 });
};

const markAsRead = async (notificationId) => {
  return await Notification.findByIdAndUpdate(notificationId, { status: "lida" });
};

module.exports = { createNotification, getUserNotifications, markAsRead };