import { RequestHandler, Router } from 'express';
import { db } from './database';
import bcryptjs from 'bcryptjs';

export class User {
   public router = Router();

   public hashPassword = async (password: string) => {
      const salt = await bcryptjs.genSalt(12);
      if (!salt) return null;

      const hash = await bcryptjs.hash(password, salt);
      if (!hash) return null;

      return hash && hash;
   };

   public deleteUser: RequestHandler = (req, res) => {
      try {
         const { id } = req.params;

         //Delete user from the database.
         const sql = `DELETE FROM user WHERE user_id = ${id}`;
         db.nodemysql.query(sql, (err) => {
            err
               ? res.send({ message: 'Failed to delete user. Try again later.', err })
               : res.send({ message: 'Success deleting user.' });
         });

         //Throw error
      } catch (error) {
         res.send({ message: 'Failed to delete user. Try again later.', error });
      }
   };

   public updateUserInfo: RequestHandler = (req, res) => {
      try {
         const { id, username } = req.body;

         //Update user info in the database.
         const sql = `UPDATE user SET username = '${username}' WHERE user_id = '${id}'`;
         db.nodemysql.query(sql, (err, result) => {
            err
               ? res.send({ message: 'Failed to update user. Try again later.', err })
               : res.send({ result });
         });

         //Throw error
      } catch (error) {
         res.send({ message: 'Failed to update user. Try again later.', error });
      }
   };

   public getUserInfo: RequestHandler = (req, res) => {
      try {
         const { id } = req.params;

         //Select user on mysql based on id.
         const sql = `SELECT * FROM user where user_id = ${id}`;
         db.nodemysql.query(sql, (err, result) => {
            err
               ? res.send({ message: 'Failed to get user. Try again later.', err })
               : res.send({ result });
         });

         //Throw error
      } catch (error) {
         res.send({ message: 'Failed to get user. Try again later.', error });
      }
   };

   public createUser: RequestHandler = async (req, res) => {
      try {
         const { username, password } = req.body;

         //Hash user password.
         const secure_pw = await this.hashPassword(password);
         if (!secure_pw) res.send({ message: 'Failed to create account. Try again later.' });

         const user = {
            user_id: Math.random() * 1000,
            username,
            password: secure_pw,
         };

         //Add user to the database.
         const sql = 'INSERT INTO user SET ?';
         db.nodemysql.query(sql, user, (err) => {
            err
               ? res.send({ message: 'Failed to create user. Try again later.', err })
               : res.send({ message: 'Account creation success.' });
         });
      } catch (error) {
         res.send({ message: 'Failed to create user. Try again later.', error });
      }
   };
}
