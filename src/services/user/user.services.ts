import { RequestHandler, Router } from 'express';
import { db } from '../database';
import bcryptjs from 'bcryptjs';
import { UserRespond } from './user.respond';
import { v4 as uuidv4 } from 'uuid';

export class User {
   private send;

   constructor() {
      this.send = new UserRespond();
   }

   public router = Router();

   public hashPassword = async (password: string) => {
      //Random string. The same password will no longer yield the same hash.
      const salt = await bcryptjs.genSalt(12);

      //Take a plain text password and putting it through a hash algorithm.
      const hash = await bcryptjs.hash(password, salt);

      return !salt || !hash ? null : hash;
   };

   public deleteUser: RequestHandler = (req, res) => {
      try {
         const { id } = req.params;

         //Delete user from the database.
         const query = 'DELETE FROM user WHERE user_id = ?';
         db.nodemysql.query(query, [id], (err, result) => {
            err ? this.send.failedDelete(res, err) : this.send.successDelete(res, result);
         });

         //Throw error
      } catch (err) {
         this.send.failedDelete(res, err);
      }
   };

   public updateUserInfo: RequestHandler = (req, res) => {
      try {
         const { id, username } = req.body;

         //Update user info in the database.
         const sql = `UPDATE user SET username = ? WHERE user_id = ?`;
         db.nodemysql.query(sql, [username, id], (err, result) => {
            err ? this.send.failedUpdate(res, err) : this.send.successUpdate(res, result);
         });

         //Throw error
      } catch (error) {
         res.status(200).json({
            status: 400,
            message: 'Failed to update user. Try again later.',
            error,
         });
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
            user_id: uuidv4(),
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
