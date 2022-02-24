import mysql from 'mysql';

class Database {
   public nodemysql = mysql.createConnection({
      host: 'localhost',
      user: 'root',
      password: '',
      database: 'nodejs-sql',
   });

   public connect() {
      this.nodemysql.connect((err) => {
         err
            ? console.log('MySQL connection failed.', { ...err })
            : console.log('MySQL connection success.');
      });
   }
}

export const db = new Database();
