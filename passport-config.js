const LocalStrategy = require('passport-local').Strategy
const bcrypt = require('bcrypt')

// function initialize(passport, getUserByEmail, getUserById)
// {
//     const authenticateUser = async (email,password, done) =>
//     {
//         const user = getUserByEmail(email)
//         if(user == null)
//         {
//             return done(null, false, {message: 'No user with that email'})
//         }
//         try
//         {
//             if(await bcrypt.compare(password,user.password))
//             {
//                 return done(null, user)
//             }
//             else
//             {return done(null,false,{message:'Password incorect'})}
//         }
//         catch (e)
//         {
//             return done(e)
//         }
//     }

//     passport.use(new LocalStrategy({usernameField: 'email'}, authenticateUser))
//     passport.serializeUser((user, done)=> done(null, user.id))
//     passport.deserializeUser((id, done)=> {
//         return done(null, getUserById(id))
//     })
// }

// module.exports = initialize



const User= require('./Db/User');

function initialize(passport) {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, (email, password, done) => {
      // Match user
      User.findOne({
        email: email
      }).then(users => {
        if (!users) {
          return done(null, false, { messages: 'That email is not registered' });
        }

        // Match password
        bcrypt.compare(password, users.password, (err, isMatch) => {
          if (err) throw err;
          if (isMatch) {
            return done(null, users);
          } else {
            return done(null, false, { messages: 'Password incorrect' });
          }
        });
      });
    })
  );

  passport.serializeUser(function(users, done) {
    done(null, users.id);
  });

  passport.deserializeUser(function(id, done) {
    User.findById(id, function(err, users) {
      done(err, users);
    });
  });
};

module.exports = initialize