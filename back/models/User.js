const bcrypt = require('bcrypt');
const mysql = require('mysql');


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'BD_PFE',
  });


db.connect((err) => {
    if (err) {
      console.error('Error connecting to database:', err);
    } else {
      console.log('Connected to database!' , db.query);
    }
  });




const User = function (user) {
  this.email = user.email;
  this.password = user.password;
  this.type = user.type
};



User.getAll = function (result) {
  db.query('SELECT * FROM users', (err, res) => {
    if (err) {
      console.error('Error retrieving users:', err);
      result(err, null);
      return;
    }
    result(null, res);
  });
};


User.deleteByEmail = function (email, result) {
  db.query('DELETE FROM users WHERE email = ?', email, (err, res) => {
    if (err) {
      console.error('Error deleting user:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // No user was deleted, user not found
      result({ message: 'User not found' }, null);
      return;
    }
    result(null, { message: 'User deleted successfully' });
  });
};






User.create = function (newUser, result) {
  bcrypt.hash(newUser.password, 10, (err, hashedPassword) => {
    if (err) {
      console.error('Error hashing password:', err);
      result(err, null);
      return;
    }
    newUser.password = hashedPassword;
    db.query('INSERT INTO users SET ?', newUser, (err, res) => {
      if (err) {
        console.error('Error creating user:', err);
        result(err, null);
        return;
      }
      console.log('User created:', { id: res.insertId, ...newUser });
      result(null, { id: res.insertId, ...newUser });
    });
  });
};



User.findByUsername = function (email, result) {
    const query = `SELECT * FROM users WHERE email = '${email}'`;
  
    db.query(query, (err, res) => {
      if (err) {
        console.error('Error finding user:', err);
        result(err, null);
        return;
      }
      if (res.length) {
        result(null, res[0]);
        return;
      }
      result({ message: 'User not found' }, null);
    });
  };
  
  

User.comparePasswords = function (password, hashedPassword, result) {
  bcrypt.compare(password, hashedPassword, (err, isMatch) => {
    if (err) {
      console.error('Error comparing passwords:', err);
      result(err, null);
      return;
    }
    result(null, isMatch);
  });
};





User.updateTypeByEmail = function (email, type, result) {
  const query = 'UPDATE users SET type = ? WHERE email = ?';
  db.query(query, [type, email], (err, res) => {
    if (err) {
      console.error('Error updating user type:', err);
      result(err, null);
      return;
    }
    if (res.affectedRows === 0) {
      // If no rows were affected, it means the user was not found
      result({ message: 'User not found' }, null);
      return;
    }
    console.log('User type updated:', { email, type });
    result(null, true);
  });
};



















module.exports = User;
