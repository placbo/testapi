const messageDb = require('./database');

class MessageService {
  async createNewMessage(messageData) {
    try {
      const { text, author } = messageData;

      if (!text || text.trim().length === 0) {
        throw new Error('Message text cannot be empty');
      }

      const result = await messageDb.saveMessage(text.trim(), author);
      return {
        success: true,
        data: result,
        message: 'Message saved successfully',
      };
    } catch (error) {
      console.error('Service error saving message:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to save message',
      };
    }
  }

  async getAllMessages() {
    try {
      const messages = await messageDb.retrieveAllMessages();
      return {
        success: true,
        data: messages,
        count: messages.length,
        message: 'Messages retrieved successfully',
      };
    } catch (error) {
      console.error('Service error retrieving messages:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to retrieve messages',
      };
    }
  }

  async getMessageById(messageId) {
    try {
      if (!messageId || isNaN(messageId)) {
        throw new Error('Valid message ID is required');
      }

      const message = await messageDb.findMessageById(parseInt(messageId));

      if (!message) {
        return {
          success: false,
          message: 'Message not found',
          data: null,
        };
      }

      return {
        success: true,
        data: message,
        message: 'Message found successfully',
      };
    } catch (error) {
      console.error('Service error finding message:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to find message',
      };
    }
  }

  async deleteMessageById(messageId) {
    try {
      if (!messageId || isNaN(messageId)) {
        throw new Error('Valid message ID is required');
      }

      const result = await messageDb.deleteMessage(parseInt(messageId));

      if (!result) {
        return {
          success: false,
          message: 'Message not found',
          data: null,
        };
      }

      return {
        success: true,
        data: result,
        message: 'Message deleted successfully',
      };
    } catch (error) {
      console.error('Service error deleting message:', error);
      return {
        success: false,
        error: error.message,
        message: 'Failed to delete message',
      };
    }
  }
}

module.exports = new MessageService();
