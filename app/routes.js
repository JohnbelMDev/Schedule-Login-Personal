const mongoose = require('mongoose');
// this is the whole object
// and it's being assigned
// this is for the server that handles
// Get --> for getting data ---> the responce should be an array with the properties
// post --> for creating data
// Put---> for updating data
// delete----> for deleting data
/* app is an object*/
module.exports = function(app,passport, db) {


 // an example of the above  would be
      /* const Johnbel = {
          name:'Johnbel',
          age:30
          }
          module.exports = Johnbel
          the syntax for the above is there for so we can write less line of code
      */





// normal routes ===============================================================
    // app is an object
    // gets are the functions
    // show the home page (will also have our login links) because it's rendering the homepages
    app.get('/', function(req, res) {
        res.render('index.ejs');
    });

    // PROFILE SECTION =========================
    // each route represent a section
    // it's handling a request
    app.get('/profile', isLoggedIn, function(req, res) {
      var today = new Date ();
      var hourNow = today.getHours();
      var greeting;
      if (hourNow >18) {
        greeting = 'Good evening'
      }
      else  if (hourNow > 12){
        greeting = 'Good afternoon'

      }
      else if (hourNow >0) {
         greeting ='Good morning'
      }
      else {
        greeting = 'Welcome';
      }
        // db.collection('messages').find().toArray((err, result) => {
        //   if (err) return console.log(err)
        //   // res.render('profile.ejs', {
        //   //   user : req.user,
        //   //   messages: result,
        //   //   greeting:greeting
        //   })
        // })
        res.render('profile.ejs', {
          user : req.user,
          // messages: result,
          greeting:greeting
        })
    });

// app.delete('/deleteAction', (request,responce) =>
//  {
//    db.collection('schedule').findOneAndDelete(
//      {
//        _id: request.body.id
//      },
//      (err, result) => {
//      if (err) return console.log(err)
//      console.log("Hello I am ID" + request.body.id);
//      console.log('saved to delete database')
//      responce.json({option:'succesfull'})
//    })
//   console.log(request.body);
// });
  app.post('/result', (request, responce) =>{
    console.log(request.body);
    // gett input values of the body
    // also grab the input values of work hours
    // total hours spent on classes
    // fix hours of sleep
    // 8 hours
    //fix of hours which will 3 hours
    // fix hours of sleep
    // intialize
    let date = new Date();
    const sleep = 8;
    // getting a fixhours of classHours
    const classHours=2;
    // grabbing name values which are the inputs of the amount of hours that the classes are save
    let clasPropeties= parseInt(request.body.class);
    // grabbing name values of the work which are the inputs of the work of hours that the classes are save
    let workPropertie = parseInt(request.body.work);
    // calculating the amount of hours that the user input
    let totalHour = classHours * clasPropeties;
    let freetime = 24 - (totalHour + sleep + workPropertie)
    // the list is being created automatically into the database
    db.collection('schedule').save(
      {
        classhours: clasPropeties,
        workhours: workPropertie,
        freetimeHours: freetime,
        date:date.getDate()
      }
      , (err, result) => {
          if (err) return console.log(err)

        })
    responce.redirect('/profile')


  });


  // app.get()
    // LOGOUT ==============================
    // grabs the logout path
   // get for getting data
    app.get('/logout', function(req, res) {
      // called on the functoin logout
        req.logout();
        // if the user logs out then redirect to the homepage
        res.redirect('/');
    });

// message board routes ===============================================================
    // post for creating data
    app.post('/addclass', (req, res) => {

      // defining name
      db.collection('list').save({name: req.body.id, class: req.body.class}, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        // redirect to the profile page
        res.redirect('/profile')
      })
    })


   // this doesn't do anything right now
    app.delete('/deleteAction', (req, res) => {
      // defining name
      db.collection('schedule').remove({
        _id: new mongoose.mongo.ObjectID(req.body.id),
        }, (err, result) => {
        if (err) return console.log(err)
        console.log('saved to database')
        res.send('deleted')
      })
    })


  // grabbing the path courselist and of course right I have to send something back
  // an example of this would be
  // get is like a question
    app.get('/courselist', (req, res) => {
      db.collection('list').find({name:'johnbel@gmail.com'}).toArray((err,result) =>{
        if (err) return console.log(err)
        console.log(result);
        // rendering the page
        // I'm responding back with rendering the course.ejs
        // and render is the answer
        res.render('course.ejs', {'showclass':result})
      })

    })
    // using put for updating data
    app.put('/messages', (req, res) => {
      db.collection('messages')
      .findOneAndUpdate({name: req.body.name, msg: req.body.msg}, {
        $set: {
          thumbUp:req.body.thumbUp + 1
        }
      }, {
        sort: {_id: -1},
        upsert: true
      }, (err, result) => {
        if (err) return res.send(err)
        // respond to the server with the result
        // because put is asking me for a request I'm going to
        res.send(result)
      })
    })

    app.get('/resultpage', (request, responce) =>{
        // responce.render('resultpage.ejs' {})
        // result is the data from database collection schedule
        db.collection('schedule').find().toArray((err, result) => {
          console.log(result);
          if (err) return console.log(err)
          responce.render('resultpage.ejs', {
            resultpropertie : result
          })
        })
    });

    app.delete('/messages', (req, res) => {
      db.collection('messages').findOneAndDelete({name: req.body.name, msg: req.body.msg}, (err, result) => {
        if (err) return res.send(500, err)
        res.send('Message deleted!')
      })
    })

// =============================================================================
// AUTHENTICATE (FIRST LOGIN) ==================================================
// =============================================================================

    // locally --------------------------------
        // LOGIN ===============================
        // show the login form
        app.get('/login', function(req, res) {
            res.render('login.ejs', { message: req.flash('loginMessage') });
        });

        // process the login form
        app.post('/login', passport.authenticate('local-login', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/login', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

        // SIGNUP =================================
        // show the signup form
        app.get('/signup', function(req, res) {
            res.render('signup.ejs', { message: req.flash('signupMessage') });
        });

        // process the signup form
        app.post('/signup', passport.authenticate('local-signup', {
            successRedirect : '/profile', // redirect to the secure profile section
            failureRedirect : '/signup', // redirect back to the signup page if there is an error
            failureFlash : true // allow flash messages
        }));

// =============================================================================
// UNLINK ACCOUNTS =============================================================
// =============================================================================
// used to unlink accounts. for social accounts, just remove the token
// for local account, remove email and password
// user account will stay active in case they want to reconnect in the future

    // local -----------------------------------
    app.get('/unlink/local', isLoggedIn, function(req, res) {
        var user            = req.user;
        user.local.email    = undefined;
        user.local.password = undefined;
        user.save(function(err) {
            res.redirect('/profile');
        });
    });

};

// route middleware to ensure user is logged in
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated())
        return next();

    res.redirect('/');
}
