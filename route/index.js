var express=require('express')
var router=express.Router();
var fileSystem = require('fs')
var ObjectId = require('mongoose').Types.ObjectId;
let crypto = require('crypto');
var passport=require('passport')
const LocalStrategy=require('passport-local').Strategy;
var router=express.Router();
var bodyParser = require('body-parser')
var archiver = require('archiver')
const mongoose = require('mongoose');
    mongoose.connect('mongodb://127.0.0.1:27017/TextToSpeak', { useNewUrlParser: true })
        .catch((err) => { console.error(err) });
let Models = require('./model');
var userCount;
// parse application/x-www-form-urlencoded
router.use(bodyParser.urlencoded({ extended: false }))

//passport
router.use(passport.initialize());
router.use(passport.session());



//zip file 
//////////////////////////
router.get('/success',(req,res) => res.send("Welcome "+req.query.username+"!!"));
router.get('/error',(req,res) => res.send("error logging in"));

passport.serializeUser(function(user,cb) {
  cb(null,user.id);
});

passport.deserializeUser(function(id,cb) {
  User.findById(id, function(err,user){
    cb(err,user);
  })

})
passport.use(new LocalStrategy(
  function(Username,Password,done){
    Models.Admin.findOne({
      userName: Username
    },function(err,user){
      if(err){
        return done(err);
      }
      if(!user){
        return done(null,false);
      }
      if(user.password != Password){
        return done(null,false);
      }
      return done(null,user);
    })
  }
));
router.get('/api',(req,res,next)=>{
    router.use(express.static('./public1'))
    res.render('apidoc')})
router.post('/',
  passport.authenticate('local',{failureRedirect:'/error'}),
function(req,res){
  res.redirect('index');
  userCount=req.body.status;

});

// parse application/json
router.use(bodyParser.json())

router.get('/loginpage',function(req,res){
  userCount=0;
  Models.Admin.find()
    .then((infos) => {
        console.log("admin1",infos)
        res.render('loginpage',{infos: infos})
      
    })
    .catch((err) => {
      res.render('loginpage',{infos:[]})
    })
})

router.get('/',function(req,res){
  if(userCount==1){
    res.redirect('index')
  }
  else{
  Models.Admin.find()
    .then((infos) => {
            console.log("admin",infos)
            res.render('loginpage',{infos: infos})
    })
    .catch((err) => {
      res.render('loginpage',{infos:[]})
    })
  }
})

router.get('/index',function(req,res,next){
  Models.Audiorecord.find({status:"Pending"}).sort('date')
    .then((records)=>{
      Models.Audiorecord.count({status:'Pending'},function(err,count){
        if(err)throw err;
        var noti=count;
        Models.Admin.find()
        .then((admins)=>{
          var admin=admins[0].userName
          res.render('index',{records:records,noti:noti,admin:admin})

        })
      })
        .catch((err)=>{

        })
    })
    .catch((err)=>{
      res.render('index',{records:[]})
    })
})


router.get('/charts',function(req,res,next){
  Models.Audiorecord.count({status:'Pending'},function(err,count){
    if(err)throw err;
    var noti=count;
    Models.Admin.find()
    .then((admins)=>{
      var admin=admins[0].userName
      res.render('charts',{noti:noti,admin:admin})

    })
  })
    .catch((err)=>{
      
    })
  
})

router.get('/userTable',function(req,res,next) {
  Models.User.find().sort('TotalAudio')
    .then((users) => {
      Models.Audiorecord.count({status:'Pending'},function(err,count){
        if(err)throw err;
        var noti=count;
        Models.Admin.find()
        .then((admins)=>{
          var admin=admins[0].userName
          res.render('userTable', { users: users,noti:noti,admin:admin})

        })
      })
        .catch((err)=>{
          
        })
     
    })
    .catch((err) => {
      res.render('userTable', { users: [] })
    })
})

router.get('/textTable',function(req,res,next) {
  Models.Text.find()
    .then((texts) => {
      Models.Audiorecord.count({status:'Pending'},function(err,count){
        if(err)throw err;
        var noti=count;
        Models.Admin.find()
        .then((admins)=>{
          var admin=admins[0].userName
          res.render('textTable', { texts: texts,noti:noti,admin:admin})

        })
      })
        .catch((err)=>{
          
        })
      
    })
    .catch((err) => {
      res.render('textTable', { texts: [] })
    })

})

router.get('/confirmRecords', function(req, res, next) {
  Models.Audiorecord.find({status:"Accept"})
    .then((records) => {
      Models.Audiorecord.count({status:'Pending'},function(err,count){
        if(err)throw err;
        var noti=count;
        Models.Admin.find()
        .then((admins)=>{
          var admin=admins[0].userName
          res.render('index', { records: records,noti:noti,admin:admin})

        })
      })
        .catch((err)=>{
          
        })
     
    })
    .catch((err) => {
      res.render('index', { records: [] })
    })

})
router.get('/register',function(req,res,next){
  res.render('register')
})

router.get('/:username',function (req,res) {
  var username=req.params.username
  console.log(username)
  Models.User.find({userName:username},function(err,doc) {
    if (err) throw err
    // var uid=doc[0].UId;
    if(doc.length>0) {
      console.log("Doc", doc[0]);
      console.log(doc[0]._id);
      var uid = doc[0]._id;


      // console.log(doc[0].UId);
      Models.Audiorecord.find({ status: 'Accept' ,  userId: uid })
        .then((records) => {
            console.log("Record",records)
            Models.Audiorecord.count({status:'Pending'},function(err,count){
              if(err)throw err;
              var noti=count;
              Models.Admin.find()
              .then((admins)=>{
                var admin=admins[0].userName
                res.render('userdetail', { records: records,noti:noti,admin:admin,username:username})
      
              })
            })
              .catch((err)=>{
                
              })
        

        })
        .catch((err) => {
          res.render('userdetail', { records: [] })
        })
    }
  })

})
router.post('/index',function(req,res,next) {
  var status=req.body.status;
    console.log(status)
  var resid=req.body.id;
    console.log(resid);

  Models.Audiorecord.updateMany({_id:ObjectId(resid)},{$set:{status:status}},function(err,doc) {
    if(err) throw err
    else console.log("Update successfully A?D",doc)

  })
  Models.Audiorecord.find({status:'Pending'})
    .then((records) => {

      Models.Audiorecord.count({status:'Pending'},function(err,count){
        if(err)throw err;
        var noti=count;
        Models.Admin.find()
        .then((admins)=>{
          var admin=admins[0].userName
          res.render('index', { records: records,noti:noti,admin:admin})

        })
      })
        .catch((err)=>{
          
        })

    })
    .catch((err) => {
      res.render('index', { records: [] })
    })


  Models.Audiorecord.find({_id:ObjectId(resid) }, function(err, res) {
    if (err) throw err;
    var userid=res[0].userId;
    Models.User.updateMany({_id:ObjectId(userid)},{ $inc: { totalAudio: 1 }},function(err, res) {
      if(err) throw err;
      else{console.log("ok")}
    })

  })

})
router.post('/login',function(req,res,next){
  var username=req.body.email;
  var ps=req.body.psw;
  Models.Admin.create({userName:username,password:ps,status:0},function(err,docs){
    if(err){
      return console.error(err);
    }else{
      console.log("new admin");
     
    }
  })
  res.redirect('/loginpage')
})
router.post('/download',function(req,res,next){

  var downloadId=req.body.downloadBtn;
  // console.log(downloadId)
  recordId=downloadId.split(',');
  console.log("Record Id",recordId)
  if(recordId.length==1){
    console.log("Not selected")
  }

else {
  
  //real
  Models.Audiorecord.find()
  .then((records)=>{
    recordmany = [];
    console.log("RecordId",recordId);
    recordId.forEach(function(data){
      if(data===""){
        console.log("finish")

      }else{
        Models.Audiorecord.updateMany({_id:ObjectId(data)},{$set:{downloadStatus:"Downloaded"}},function(err,doc) {
          if(err) throw err
          else console.log("Update successfully A?D",doc)
      
        })
      }
    })
    records.forEach(function(data){
      recordId.forEach(function(recdata){
        if(recdata.toString() === data._id.toString()){
          recordmany.push(data)
        }
      })
    })
    var file_system = require('fs');
  var archiver = require('archiver');
  
  var output = file_system.createWriteStream(`target${Date.now()}.zip`);
  var archive = archiver('zip');
  output.on('close', function () {
      console.log(archive.pointer() + ' total bytes');
      console.log('archiver has been finalized and the output file descriptor has closed.');
  });
  
  archive.on('error', function(err){
      throw err;
  });
    archive.pipe(output);
    recordmany.forEach(record=>{
      console.log("audioname",record.audioName);
      archive.file(`./public/uploads/${record.audioName}`,{name:`${record.audioName}`})
    })
    archive.finalize()
    
  })
 }
  
 res.redirect('index')
  })









//////api for android##############################################################################################
const multer = require('multer')
//record saving in file named "uploads"
var storage = multer.diskStorage({
  destination: function (req, file, cb) {
      cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
      cb(null, file.fieldname + '_' +Date.now());
  }
  });
  var upload = multer({ storage: storage });

router.post('/api/login',(req,res,next)=> {
  var fbtoken = req.body.fbtoken;
  const request = require('request');
  request({
      uri: `https://graph.facebook.com/me?fields=id,name,birthday&access_token=${fbtoken}`,
      method: 'get'
  }, function (err, respond, body) {
      if(err)console.log(res.json(JSON.parse(body)));
      else
      {
          var userName = JSON.parse(body).name;
          var fbId = JSON.parse(body).id;
          var birthDay = JSON.parse(body).birthday;

          if(typeof userName==='undefined' && typeof fbId==='undefined'){res.json({Message:"User is not Found"})}
          else {
              Models.User.findOne({
                  fbId: fbId,
              })
                  .then((user) => {
                      console.log('user', user);

                      if (!user) {
                          console.log("User is new User");
                          let User = new Models.User;
                          User.userName = userName;
                          User.fbId = fbId;
                          User.birthDay = birthDay;
                          User.save(function (err, User) {
                              if (err) res.send("Error Found in Saving data to mongo db");
                              else {
                                  let token = crypto.randomBytes(128).toString('base64');
                                  let Token = new Models.Token;
                                  Token.userId = User._id;
                                  Token.accessToken = token;
                                  Token.save(function (err, Token) {
                                      if (err) res.send("Token Many Request");
                                      else res.json({
                                          "userName": userName,
                                          "fbId": fbId,
                                          "birthday": birthDay,
                                          "token": Token.accessToken,
                                          "Status": "User Account Create Successfully"
                                      })
                                  })

                              }
                          });
                      } else {
                          console.log("User is token expire user");
                          Models.Token.findOne({userId: user._id})
                              .then((token) => {
                                  if (!token) {
                                      let token = crypto.randomBytes(128).toString('base64');
                                      let Token = new Models.Token;
                                      Token.userId = user._id;
                                      Token.accessToken = token;
                                      Token.save(function (err, Token) {
                                          if (err) res.send("Token Many Request");
                                          else res.json({
                                              "userName": user.userName,
                                              "fbId": user.fbId,
                                              "birthday": user.birthDay,
                                              "token": Token.accessToken,
                                              "Status": "User's token lifetime is increased successfully"
                                          })
                                      })
                                  } else {
                                      console.log("User is although token have but log out user");
                                      res.json({
                                          "userName": user.userName,
                                          "fbId": user.fbId,
                                          "birthday": user.birthDay,
                                          "token": token.accessToken,

                                          "Status": "Token Out put Successfully",
                                      })
                                  }
                              })
                              .catch((err) => {
                                  console.error(err);
                                  res.json({Message: 'SORRY In Token'})
                              });
                      }
                  })
                  .catch((err) => {
                      console.error(err);
                      res.json({Message: 'SORRY'})
                  });


          }


      }
  });


});
router.post('/api/posts',(req,res)=>{
  var header = req.headers['authorization'];
  if(typeof header=== 'undefined'){
      res.send(403);
  }
  else {
      var confirmkey = header.split(' ');

      var token = confirmkey[1];

      if(confirmkey[0]==='sakura' && confirmkey.length===2){
          Models.Token.findOne({accessToken:token})
              .then((token)=>{
                  if(!token){
                      res.json({Message:"Session expired"})
                  }
                  else {
                      var userId = token.userId;

                      Models.User.findOne({_id:new ObjectId(userId)})
                          .then((user) => {
                              if(!user){
                                  res.sendStatus(404,"Page Not Found");
                              }
                              else {
                                  var diff = Date.now()-token.createdAt;
                                  diff = diff/1000;
                                  diff = diff/60;
                                  let lefttime = 10080-Math.abs(Math.round(diff))
                                  if(lefttime>1439){
                                    let day = parseInt(lefttime/1440);
                                    let hour = parseInt((lefttime-(day*1440))/60)
                                    let minute = lefttime -(day*1440)-(hour*60)
                                    lefttime = `${day}Days,${hour}Hours,${minute}Minute`
                                  }
                                  else if(lefttime>59){
                                      let hour= parseInt(lefttime/60)
                                      let minute = lefttime-(hour*60)
                                      lefttime = `${hour}Hours,${minute}Minutes`
                                  }
                                  else {lefttime = `${lefttime}minute`}

                                  res.json({
                                      "userName":user.userName,
                                      "completedTextCount":user.comTextcount,
                                      "userToken":token.accessToken,
                                      "leftExpireTime":`${lefttime}minute`
                                  })
                              }
                          })
                          .catch((err) => {
                              console.error(err);
                              res.json({Message:'SORRY'})
                          })
                  }
              })
              .catch((err) => {
                  console.error(err);
                  res.json({Message:'SORRY'})
              });


      }
      else res.send(404,"Page Not Found");
  }});
  router.post('/api/posts/gettexts',(req,res)=>{
    //response the text from the mongo database
    var header = req.headers['authorization'];
    if(typeof header=== 'undefined'){
        res.send(403);
    }
    else {
        var confirmkey = header.split(' ');

        var token = confirmkey[1];

        if(confirmkey[0]==='sakura' && confirmkey.length===2){
            Models.Token.findOne({accessToken:token})
                .then((token)=>{
                    if(!token){
                        res.json({Message:"Session expired"})
                    }
                    else {
                        var userId = token.userId;

                        Models.User.findOne({_id:new ObjectId(userId)})
                            .then((user) => {
                                if(!user){
                                    res.sendStatus(404,"Page Not Found");
                                }
                                 else {
                                        var skiptextnumber = user.comTextcount;
                                        Models.User.findOneAndUpdate({_id:new ObjectId(userId)},{$inc:{comTextcount:10}},{new:true},
                                            function (err,response) {
                                              if(err)res.send(err);
                                              else{console.log("Update successfully");
                                                }
                                                })
                                  
                                     
                                    Models.Text.find({},null,{limit:10,skip:skiptextnumber})
                                        .then((texts) => {
                                            console.log("texts", texts);
                                            if (!texts) {
                                                console.log("Wrong Text")
                                            }
                                            else {
                                              var text ={
                                                userName :user.userName,
                                                completedText : user.comTextcount,
                                                accessToken:token.accessToken,
                                                data:[]
                                                }
                                                texts.forEach(function (data) {
                                                    text.data.push(
                                                        {
                                                            id: data.id,
                                                            value: data.value,
                                                            hashvalue: data.hashvalue,
                                                        })
                                                });
                                                res.json(text);
                                                console.log(userId);
                                                
                                            }
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            res.json({Message:"Sorry"})
                                        });
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                                res.json({Message:'SORRY'})
                            })
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.json({Message:'SORRY'})
                });


        }
        else res.send(404,"Page Not Found");
    }

});
router.post('/api/posts/sendaudio', upload.array('myFiles', 12,),(req,res)=>{
  //response the text from the mongo database
  var header = req.headers['authorization'];
  if(typeof header=== 'undefined'){
      res.send(403);
  }
  else {
      var confirmkey = header.split(' ');

      var token = confirmkey[1];

      if(confirmkey[0]==='sakura' && confirmkey.length===2){
          Models.Token.findOne({accessToken:token})
              .then((token)=>{
                  if(!token){
                      res.json({Message:"Session expired"})
                  }
                  else {
                      var userId = token.userId;

                      Models.User.findOne({_id:new ObjectId(userId)})
                          .then((user) => {
                              if(!user){
                                  res.sendStatus(404,"Page Not Found");
                              }
                               else {
                                  var files = req.files;
                                  if (!files) {
                                      const error = new Error('Please choose files')
                                      error.httpStatusCode = 400;
                                      return next(error)
                                  }
                                  else {
                                      if(files.length === 0){
                                          console.log("0 files");
                                          res.send("File is not Found")
                                      }
                                      else if (files.length ===1){
                                          if(!req.body.Text){ res.send("File and Text Are does not Match")}
                                          else if(typeof req.body.Text === "string"){
                                              let records = new Models.Audiorecord;
                                              records.status = "Pending"
                                              records.userId = user._id;
                                              records.userName = user.userName;
                                              records.text = req.body.Text;
                                              records.audioName = files[0].filename;
                                              records.save(function (err,record) {
                                                  if(err)console.log("Error found in saving record");
                                                  else {
                                                      console.log("1",files[0].filename,"Records insert successfully");
                                                      console.log("RECORD1",record)
                                              }
                                              });
                                              res.send(files)
                                          }
                                          else {
                                              res.send("Error Found in sending audio and Text from user to server\n" +
                                                  "File and Text are not match \n " +
                                                  "The number of Texts are greate than The number of File\n " +
                                                  "You should to be one File one Text" +
                                                  "\nThe number of Text and the number of File are must be equal")
                                          }
          
                                      }
                                      else{
                                          if(typeof req.body.Text === "string"){
                                              console.log("The number of Files are greater than Text\n" +
                                                  "Files and Text are not match");
                                              res.send("The number of Files are greater than Text\n" +
                                                  "Files and Text are not match")
                                          }
                                          else if(req.body.Text.length === files.length){
                                              var arr = req.body.Text;
                                              var output = "";
                                              var arr = req.body.Text;
                                              for(let i =0;i<files.length;i++){
                                                  let records = new Models.Audiorecord;
                                                  records.status = "Pending"
                                                  records.userId = user._id;
                                                  records.userName = user.userName;
                                                  records.text = arr[i];
                                                  records.audioName = files[i].filename;
                                                  
                                                  records.save(function (err,record) {
                                                      if(err)console.log("Error found in saving record");
                                                      else {
                                                          console.log(i,files[i].filename,"Records insert successfully");
                                                          console.log("Record",record)
                                                      }
                                                  });
                                              }
                                              res.send(files);
          
                                          }
                                          else {
                                              res.send("The number of Text and Files are not Match");
                                          }
                                      }
                                  }
          }
                          })
                          .catch((err) => {
                              console.error(err);
                              res.json({Message:'SORRY'})
                          })
                  }
              })
              .catch((err) => {
                  console.error(err);
                  res.json({Message:'SORRY'})
              });


      }
      else res.send(404,"Page Not Found");
  }});
router.post('/api/posts/getrecord',(req,res)=>{
  
    //response the text and audio for comfirm or deny from the mongo database
    var header = req.headers['authorization'];
    if(typeof header=== 'undefined'){
        res.send(403);
    }
    else {
        var confirmkey = header.split(' ');

        var token = confirmkey[1];

        if(confirmkey[0]==='sakura' && confirmkey.length===2){
            Models.Token.findOne({accessToken:token})
                .then((token)=>{
                    if(!token){
                        res.json({Message:"Session expired"})
                    }
                    else {
                        var userId = token.userId;

                        Models.User.findOne({_id:new ObjectId(userId)})
                            .then((user) => {
                                if(!user){
                                    res.sendStatus(404,"Page Not Found");
                                }
                                 else {
                                     
                                    Models.Audiorecord.find()
                                        .then((audios) => {
                                            console.log("Audios", audios);
                                            if (!audios) {
                                                res.json({Message:"Sorry Out of Bound of Audio"})
                                                console.log("Wrong audio")
                                            }
                                            else {
                                                var audiorec=audios[Math.floor(Math.random()*audios.length)]
                                                res.json({
                                                  audioId:audiorec._id,
                                                  text:audiorec.text,
                                                  audioName:audiorec.audioName,
                                                })
                                            }
                                        })
                                        .catch((err) => {
                                            console.error(err);
                                            res.json({Message:"Sorry"})
                                        });
                                }
                            })
                            .catch((err) => {
                                console.error(err);
                                res.json({Message:'SORRY'})
                            })
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.json({Message:'SORRY'})
                });


        }
        else res.sendStatus(404,"Page Not Found");
      }
})
router.post('/api/posts/getaudio',(req,res)=>{
  
  
    //response the text and audio for comfirm or deny from the mongo database
    var header = req.headers['authorization'];
    if(typeof header=== 'undefined'){
        res.send(403);
    }
    else {
        var confirmkey = header.split(' ');

        var token = confirmkey[1];

        if(confirmkey[0]==='sakura' && confirmkey.length===2){
            Models.Token.findOne({accessToken:token})
                .then((token)=>{
                    if(!token){
                        res.json({Message:"Session expired"})
                    }
                    else {
                        var userId = token.userId;

                        Models.User.findOne({_id:new ObjectId(userId)})
                            .then((user) => {
                                if(!user){
                                    res.sendStatus(404,"Page Not Found");
                                }
                                 else {
                                   let audioName = req.body.audioName;
                                   var stat = fileSystem.statSync(`./public/uploads/${audioName}`);

                                    res.writeHead(200, {
                                      'Content-Type': 'audio/wav',
                                      'Content-Length': stat.size
                                      });

                                   var readStream = fileSystem.createReadStream(`./public/uploads/${audioName}`);
                                    // We replaced all the event handlers with a simple call to readStream.pipe()
                                   readStream.pipe(res);
                                      }
                            })
                            .catch((err) => {
                                console.error(err);
                                res.json({Message:'SORRY'})
                            })
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.json({Message:'SORRY'})
                });


        }
        else res.sendStatus(404,"Page Not Found");
      }
})
router.post('/api/posts/sendaudioconfirm',(req,res)=>{
    //response the text and audio for comfirm or deny from the mongo database
    var header = req.headers['authorization'];
    if(typeof header=== 'undefined'){
        res.send(403);
    }
    else {
        var confirmkey = header.split(' ');

        var token = confirmkey[1];

        if(confirmkey[0]==='sakura' && confirmkey.length===2){
            Models.Token.findOne({accessToken:token})
                .then((token)=>{
                    if(!token){
                        res.json({Message:"Session expired"})
                    }
                    else {
                        var userId = token.userId;

                        Models.User.findOne({_id:new ObjectId(userId)})
                            .then((user) => {
                                if(!user){
                                    res.sendStatus(404,"Page Not Found");
                                }
                                 else 
                                 {
                                  let audioId = req.body.audioId;
                                  let status =req.body.status.toLowerCase();
                                  
                                  let audiorec = new Models.Audiorecord();
                                  if(typeof audioId === "string"){
                                    if(status === "up"){
                                      audiorec.setacceptvote(audioId,user._id,status.toLowerCase())
                                      res.send("Updated")
                                    }
                                    else if(status === "down"){
                                      audiorec.setdenyvote(audioId,user._id,status.toLowerCase())
                                      res.send("Updated")
                                    }
                                    else if(status === "notsure"){
                                      audiorec.setnotsurevote(audioId,user._id,status.toLowerCase())
                                      res.send("Updated")
                                    }
                                    else{res.sendStatus(404)}
                                  }
                                  else{res.sendStatus(404)}
                                 
                                  
                                 }
                            })
                            .catch((err) => {
                                console.error(err);
                                res.json({Message:'SORRY'})
                            })
                    }
                })
                .catch((err) => {
                    console.error(err);
                    res.json({Message:'SORRY'})
                });


        }
        else res.sendStatus(404,"Page Not Found");
      }
})
router.post('/download',function(req,res,next){
  var download=req.body.downloadBtn;
  console.log(download)
  res.redirect('index')
})
module.exports=router;
