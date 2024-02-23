import { Request, Response } from 'express';
import {
  getAllUsers,
  getSingleUser,
  createNewUser,
  updateExistingUser,
  deleteExistingUser,
} from '../database/userDb';

// TODO: use middleware to not have to repeat the same catch block

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Get all users
 *     description: Get all users within the users table.
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "firstName": "John",
 *                   "lastName": "Doe",
 *                   "created": "2024-02-23T07:44:54.000Z"
 *                 },
 *                 {
 *                   "id": 2,
 *                   "firstName": "Jane",
 *                   "lastName": "Doe",
 *                   "created": "2024-02-23T07:44:54.000Z"
 *                 }
 *               ]
 */
export const getUsers = async (req: Request, res: Response) => {
  try {
    const users = await getAllUsers();
    if (users === null) {
      res.status(404).json({ message: 'Users not found' });
    } else {
      res.status(200).json(users);
    }
  } catch (error: any) {
    console.error('Error getting users:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @swagger
 * /users:
 *   post:
 *     summary: Create a single user
 *     description: Create a single user from the users table.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "firstName": "John",
 *                   "lastName": "Doe",
 *                   "created": "2024-02-23T07:44:54.000Z"
 *                 },
 *               ]
 */
export const createUser = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName } = req.body;
    // Check for bad request
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
      res.status(400).json({
        message: 'Bad Request - firstName and lastName must be strings',
      });
      return;
    }
    const user = await createNewUser(firstName, lastName);
    res.status(200).json(user);
  } catch (error: any) {
    console.error('Error creating users:', error.message);
    res.status(500).send('Internal Server Error');
  }
};

/**
 * @swagger
 * /users/{id}:
 *   get:
 *     summary: Get a single user
 *     description: Get a single user from the users table.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID number
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               [
 *                 {
 *                   "id": 1,
 *                   "firstName": "John",
 *                   "lastName": "Doe",
 *                   "created": "2024-02-23T07:44:54.000Z"
 *                 },
 *               ]
 */
export const getUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Check for bad id
    if (isNaN(id) || id < 0) {
      res.status(400).json({ message: 'Bad Request - Invalid id' });
      return;
    }
    const user = await getSingleUser(id);
    if (user === null) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(user);
    }
  } catch (error: any) {
    console.error('Error getting user:', error.message);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   patch:
 *     summary: Update single user
 *     description: Update a single user from the users table.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID number
 *         required: true
 *         schema:
 *           type: number
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               {
 *                 "id": 1,
 *                 "firstName": "UpdatedFirstName",
 *                 "lastName": "UpdatedLastName",
 *                 "created": "2024-02-23T07:44:54.000Z"
 *               }
 */
export const updateUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Check for bad id
    if (isNaN(id) || id < 0) {
      res.status(400).json({ message: 'Bad Request - Invalid id' });
      return;
    }

    const { firstName, lastName } = req.body;

    // Check for bad request
    if (typeof firstName !== 'string' || typeof lastName !== 'string') {
      res.status(400).json({
        message: 'Bad Request - firstName and lastName must be strings',
      });
      return;
    }

    // Assuming you have a function like updateExistingUser in your code
    const updatedUser = await updateExistingUser(id, firstName, lastName);

    if (updatedUser === null) {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json(updatedUser);
    }
  } catch (error: any) {
    console.error('Error updating user:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};

/**
 * @swagger
 * /users/{id}:
 *   delete:
 *     summary: Delete a single user
 *     description: Delete a single user from the users table.
 *     parameters:
 *       - in: path
 *         name: id
 *         description: User's ID number
 *         required: true
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: Successful response
 *         content:
 *           application/json:
 *             example:
 *               null
 */
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const id = parseInt(req.params.id, 10);
    // Check for bad id
    if (isNaN(id) || id < 0) {
      res.status(400).json({ message: 'Bad Request - Invalid id' });
      return;
    }

    // Assuming you have a function like updateExistingUser in your code
    const user = await deleteExistingUser(id);

    if (user === 'not-found') {
      res.status(404).json({ message: 'User not found' });
    } else {
      res.status(200).json();
    }
  } catch (error: any) {
    console.error('Error deleting user:', error.message);
    res.status(500).json({
      status: 'error',
      message: 'Internal Server Error',
    });
  }
};
