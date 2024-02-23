import { ResultSetHeader, RowDataPacket } from 'mysql2/promise';
import pool from '../server';

// TODO: use middleware to not have to repeat the same catch block

// Get all user
export async function getAllUsers() {
  try {
    const [rows] = await pool.query<RowDataPacket[]>('SELECT * FROM users');
    // No users found
    if (rows.length === 0) {
      return null;
    }
    return rows;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error retrieving users:', error.message);
      console.error('Failed SQL query:', error.sql);
    }
    throw error;
  }
}

// Get single user
export async function getSingleUser(id: number) {
  try {
    const [rows] = await pool.query<RowDataPacket[]>(
      `
          SELECT *
          FROM users
          WHERE id = ?
          `,
      [id],
    );

    // If no user found
    if (rows.length === 0) {
      return null;
    }

    return rows;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error retrieving user:', error.message);
      console.error('Failed SQL query:', error.sql);
    }
    throw error;
  }
}

// Create user
export async function createNewUser(firstName: string, lastName: string) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `
        INSERT INTO users (firstName, lastName)
        VALUES (?, ?)
      `,
      [firstName, lastName],
    );

    const id = result.insertId;
    return getSingleUser(id);
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error creating user:', error.message);
      console.error('Failed SQL query:', error.sql);
    }
    throw error;
  }
}

// Update user information
export async function updateExistingUser(
  userId: number,
  firstName: string,
  lastName: string,
) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `
          UPDATE users
          SET firstName = ?, lastName = ?
          WHERE id = ?
        `,
      [firstName, lastName, userId],
    );

    if (result.affectedRows !== 1) {
      return null;
    }

    // Fetch and return the updated user
    const updatedUser = await getSingleUser(userId);
    return updatedUser;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error updating user:', error.message);
      console.error('Failed SQL query:', error.sql);
    }
    throw error;
  }
}

// delete user
export async function deleteExistingUser(userId: number) {
  try {
    const [result] = await pool.query<ResultSetHeader>(
      `
        DELETE FROM users
        WHERE id = ?
      `,
      [userId],
    );

    if (result.affectedRows !== 1) {
      return 'not-found';
    }

    return null;
  } catch (error: any) {
    if (process.env.NODE_ENV === 'development') {
      console.error('Error deleting user:', error.message);
      console.error('Failed SQL query:', error.sql);
    }
    throw error;
  }
}
