const notificationRepository = require("../repositories/notificationRepository");

const notifyUser = async (userId, caseId, message) => {
  return await notificationRepository.createNotification(userId, caseId, message);
};

const getUserNotifications = async (userId) => {
  return await notificationRepository.getUserNotifications(userId);
};

const markNotificationAsRead = async (notificationId) => {
  return await notificationRepository.markAsRead(notificationId);
};

module.exports = { notifyUser, getUserNotifications, markNotificationAsRead };
