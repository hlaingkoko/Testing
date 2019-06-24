const mongoose = require('mongoose');
var ObjectId = require('mongoose').Types.ObjectId;
let Schema = mongoose.Schema;
let AdminUser = new Schema({
    userName:{type:String,default:""},
    password:{type:String,default:""},
    status :{type:Number,default:0}
},{
    timestamp: true,
});

let Admin = mongoose.model('Adminusers', AdminUser);
exports.Admin = Admin;
//create User schema
let UserSchema = new Schema({
    userName:{type:String,default:""},
    fbId:{type:String,default:""},
    birthDay:{type:String,default:""},
    comTextcount:{type:Number,default: 0},
    totalAudio :{type:Number,default:0}
},{
    timestamp: true,
});

let User = mongoose.model('User', UserSchema);
exports.User = User;


//create User with Token

let TokenSchema = new Schema({
    userId : String,
    accessToken: String,
    createdAt: {type: Date, default: Date.now(), expires:604800}
},{
    timestamp: true,
});
let Token = mongoose.model('Token', TokenSchema);
exports.Token = Token;

//create Text Schema
let textschema = new Schema({
    value : String,
    hashvalue : String
},{timestamp: true});
let Text = mongoose.model('Text',textschema);
exports.Text = Text;


//create Audiorecord


let Audiorecords = new Schema({
  downloadStatus:{type:String,default:"undownload"},
  date:{type:Date,default:Date.now()},
  status:{type:String},
  userId:{type:String},
  userName:{type:String},
  audioName:{type:String},
  text:{type:String},
  acceptCount:{type:Number,default:0},
  denyCount:{type:Number,default:0},
  notSure : {type:Number,default:0},
  votes:[{
      userId:{type:String},
      vote: { type: String, enum: 'up,down,notsure'.split(',') },
      date: { type: Date,default:Date.now },
  }]

},{
  timestamp: true,
});

let Audiorecord = mongoose.model('audiorecords', Audiorecords);
Audiorecord.prototype.addVote = function addVote({
  userId, vote
}) {
  if (!this.votes) {
    this.votes = [];
  }
  this.votes.push({
    userId,
    vote,
  });
}
Audiorecord.prototype.setacceptvote=function setacceptvote(audioId,userId,vote){
  Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{"$push": { "votes":{userId,vote}}},{ "new": true, "upsert": true },function(err,respond){
    if(err){console.log("Error Found in saving vote")}
    else{console.log("vote Success")}
    
})
Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{$inc:{acceptCount:1}},{ "new": true, "upsert": true },function(err,respond){
  if(err){console.log("Error Found in saving vote")}
  else{console.log("accept Success")}
  
})
}
Audiorecord.prototype.setdenyvote=function setdenyvote(audioId,userId,vote){
  Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{"$push": { "votes":{userId,vote}}},{ "new": true, "upsert": true },function(err,respond){
    if(err){console.log("Error Found in saving vote")}
    else{console.log("vote Success")}
    
})
Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{$inc:{denyCount:1}},{ "new": true, "upsert": true },function(err,respond){
  if(err){console.log("Error Found in saving vote")}
  else{console.log("deny Success")}
  
})
}
Audiorecord.prototype.setnotsurevote=function setnotsurevote(audioId,userId,vote){
  Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{"$push": { "votes":{userId,vote}}},{ "new": true, "upsert": true },function(err,respond){
    if(err){console.log("Error Found in saving vote")}
    else{console.log("vote Success")}
    
})
Audiorecord.findOneAndUpdate({_id:ObjectId(audioId)},{$inc:{notsure:1}},{ "new": true, "upsert": true },function(err,respond){
  if(err){console.log("Error Found in saving vote")}
  else{console.log("notsure Success")}
  
})
}


exports.Audiorecord = Audiorecord;
