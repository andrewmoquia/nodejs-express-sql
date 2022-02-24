import { User } from '../services/user.services';

export class UserController extends User {
   public routes() {
      //Route for creating user.
      this.router.post('/create/user', this.createUser);

      //Route for getting on user info.
      this.router.get('/user/:id', this.getUserInfo);

      //Route for updating one user info.
      this.router.put('/update/user', this.updateUserInfo);

      //Route for deleting one user.
      this.router.delete('/delete/user/:id', this.deleteUser);
      return this.router;
   }
}
