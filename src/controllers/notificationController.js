const notificationService = require("../services/notificationService");

const getUserNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getUserNotifications(req.userId);
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar notificações." });
  }
};

const markAsRead = async (req, res) => {
  try {
    await notificationService.markNotificationAsRead(req.params.id);
    res.json({ message: "Notificação marcada como lida." });
  } catch (error) {
    res.status(500).json({ error: "Erro ao marcar notificação como lida." });
  }
};

module.exports = { getUserNotifications, markAsRead };
