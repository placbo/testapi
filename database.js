const { Pool } = require('pg');
require('dotenv').config();

class MessageDatabase {
  constructor() {
    this.pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'mydb',
      password: process.env.DB_PASSWORD || 'example',
      port: process.env.DB_PORT ? parseInt(process.env.DB_PORT) : 5432,
    });

    this.initializeConnection();
  }

  async initializeConnection() {
    try {
      const client = await this.pool.connect();
      console.log('Successfully connected to PostgreSQL database');
      client.release();
      await this.setupTables();
    } catch (error) {
      console.error('Database connection failed:', error.message);
    }
  }

  async setupTables() {
    const tableDefinition = `
      CREATE TABLE IF NOT EXISTS user_messages (
        msg_id SERIAL PRIMARY KEY,
        text_content TEXT NOT NULL,
        sender_name VARCHAR(255) DEFAULT 'Anonymous',
        timestamp TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;

    try {
      const client = await this.pool.connect();
      await client.query(tableDefinition);
      console.log('Messages table is ready');
      client.release();
    } catch (error) {
      console.error('Table creation failed:', error.message);
    }
  }

  async saveMessage(messageText, senderName = 'Anonymous') {
    const insertQuery =
      'INSERT INTO user_messages (text_content, sender_name) VALUES ($1, $2) RETURNING *';

    try {
      const client = await this.pool.connect();
      const result = await client.query(insertQuery, [messageText, senderName]);
      client.release();

      const savedMessage = result.rows[0];
      return {
        id: savedMessage.msg_id,
        message: savedMessage.text_content,
        author: savedMessage.sender_name,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async retrieveAllMessages() {
    const selectQuery = `
      SELECT msg_id as id, text_content as message, 
             sender_name as author, timestamp as created
      FROM user_messages 
      ORDER BY timestamp DESC
    `;

    try {
      const client = await this.pool.connect();
      const result = await client.query(selectQuery);
      client.release();
      return result.rows;
    } catch (error) {
      throw error;
    }
  }

  async findMessageById(messageId) {
    const findQuery = `
      SELECT msg_id as id, text_content as message, 
             sender_name as author, timestamp as created
      FROM user_messages 
      WHERE msg_id = $1
    `;

    try {
      const client = await this.pool.connect();
      const result = await client.query(findQuery, [messageId]);
      client.release();
      return result.rows[0] || null;
    } catch (error) {
      throw error;
    }
  }

  async deleteMessage(messageId) {
    const deleteQuery = 'DELETE FROM user_messages WHERE msg_id = $1 RETURNING *';

    try {
      const client = await this.pool.connect();
      const result = await client.query(deleteQuery, [messageId]);
      client.release();

      if (result.rows.length === 0) {
        return null; // Message not found
      }

      const deletedMessage = result.rows[0];
      return {
        id: deletedMessage.msg_id,
        message: deletedMessage.text_content,
        author: deletedMessage.sender_name,
        success: true,
      };
    } catch (error) {
      throw error;
    }
  }

  async closeConnection() {
    try {
      await this.pool.end();
      console.log('Database connection pool closed successfully');
    } catch (error) {
      console.error('Error closing database pool:', error.message);
    }
  }
}

module.exports = new MessageDatabase();
