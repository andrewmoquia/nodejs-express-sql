import { Response } from 'express';

export class UserRespond {
   public successDelete(res: Response, result: any) {
      const { affectedRows } = result;

      affectedRows === 1
         ? res.status(200).json({ status: 200, message: 'Success deleting user.' })
         : affectedRows === 0
         ? res.status(200).json({ status: 200, message: 'No user found.' })
         : res
              .status(200)
              .json({ status: 400, message: 'Something went wrong. Please try again.' });
   }

   public failedDelete(res: Response, err: Error) {
      res.status(200).json({
         status: 400,
         message: 'Failed to delete user. Try again later.',
         err,
      });
   }

   public successUpdate(res: Response, result: any) {
      const { affectedRows } = result;

      affectedRows === 1
         ? res.status(200).json({ status: 200, message: 'Success updating user.' })
         : affectedRows === 0
         ? res.status(200).json({ status: 200, message: 'No user found.' })
         : res
              .status(200)
              .json({ status: 400, message: 'Something went wrong. Please try again.' });
   }

   public failedUpdate(res: Response, err: Error) {
      res.status(200).json({
         status: 400,
         message: 'Failed to update user. Try again later.',
         err,
      });
   }
}
