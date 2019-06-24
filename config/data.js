var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);

mongoose.set('useFindAndModify', false);
// make a connection
mongoose.connect('mongodb://localhost:27017/AudioDatabase',{ useNewUrlParser: true });
mongoose.connect('mongodb://localhost:27017/AudioDatabase', { useFindAndModify: false });

console.log("Connection Successful!");

// define Schema
var records = mongoose.Schema({
  RecordId:{type:String,unique:true},
  Date: { type: Date, default: Date.now },
  UId:{type:String},
  UserName:{type:String},
  TextName:{type:String},
  AudioName:{type:String  },
  AcceptCount: Number,
  DenyAccount:Number,
  Status:{type:String,default:"Pending"}

});

var userInfo=mongoose.Schema({
  Username: String,
  Password: String,
})



var users=mongoose.Schema({
  UserName:String,
  UId:{type:String,unique:true,dropDups:true},
  TotalAudio:Number
})

var texts=mongoose.Schema({
  TextId:{type:String,unique:true,dropDups:true},
  AudioName:{type:String,unique:true,dropDups:true},
  TextName:{type:String,unique:true,dropDups:true},
})

var Record = mongoose.model('Record', records);

var Info=mongoose.model('userInfo',userInfo)

var User = mongoose.model('User', users);

var Text=mongoose.model('Text',texts);

// get reference to database
var db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));

db.once('open', function() {

  // compile schema to model

  // a document instance
  var r1 = [
    {RecordId:"r1", Date:new Date('2018-07-22'), UId:"u1",UserName: "Moe Moe San",TextName:'aaa',AudioName: 'aaa',AcceptCount: "2",DenyAccount: "3" },
    {RecordId:"r2", Date:new Date('2018-07-22'),UId:"u2", UserName: "Phwe Phwe",TextName:'bbb',AudioName: 'bbb', AcceptCount: "2",DenyAccount:"1" },
    {RecordId:"r3", Date:new Date('2018-07-22'),UId:"u3", UserName: "Ma Ma",TextName:'ccc',AudioName: 'ccc',AcceptCount: "2",DenyAccount:"3" },
    {RecordId:"r4", Date:new Date('2018-07-22'), UId:"u4",UserName: "Ko Ko",TextName:'ddd' ,AudioName: 'ddd',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r5",Date:new Date('2018-07-22'),UId:"u5", UserName: "Mg Mg", TextName:'eee',AudioName: 'eee',AcceptCount: "2",DenyAccount:"3" },
    {RecordId:"r6", Date:new Date('2018-07-22'),UId:"u6", UserName: "Su Su", TextName:'fff',AudioName: 'fff',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r7",Date:new Date('2018-07-22'),UId:"u7",UserName: "Yin Yin",TextName:'ggg',AudioName: 'ggg', AcceptCount: "2",DenyAccount:"1" },
    { RecordId:"r8",Date:new Date('2018-07-22'),UId:"u8",UserName: "Yamin",TextName:'hhh',AudioName: 'hhh',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r9",Date:new Date('2018-07-22'),UId:"u9",UserName: "Ko Kyi",TextName:'iii' ,AudioName: 'iii',AcceptCount: "2",DenyAccount:"3" },
    {RecordId:"r10", Date:new Date('2018-07-22'), UId:"u11",UserName: "Hla Hla",TextName:'lll',AudioName: 'lll',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r11",Date:new Date('2018-07-22'), UId:"u12",UserName: "Soe Soe",TextName:'mmm' ,AudioName: 'mmm',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r12",Date:new Date('2018-07-22'), UId:"u13",UserName: "Hnin Hnin", TextName:'jjj',AudioName: 'jjj',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r13",Date:new Date('2018-07-22'), UId:"u14",UserName: "Myo Myo", TextName:'kkk',AudioName: 'kkk',AcceptCount: "2",DenyAccount:"3" },
    { RecordId:"r14",Date:new Date('2018-07-22'), UId:"u15",UserName: "Aung Aung", TextName:'uuu',AudioName: 'uuu',AcceptCount: "2",DenyAccount:'3'},
    { RecordId:"r15",Date:new Date('2018-07-22'), UId:"u1",UserName: "Moe Moe San", TextName:'qqq',AudioName: 'qqq',AcceptCount: "2",DenyAccount:'3'}
  ];
 //





  // save model to database
  var u1=[{UserName:'Moe Moe San',UId:"u1",TotalAudio: 0},
          {UserName:'Phwe Phwe',UId:"u2",TotalAudio: 0},
    {UserName:'Ma Ma',UId:"u3",TotalAudio:0},
    {UserName:'Ko Ko',UId:"u4",TotalAudio: 0},
    {UserName:'Mg Mg',UId:"u5",TotalAudio: 0},
    {UserName:'Su Su',UId:"u6",TotalAudio: 0},
    {UserName:'Yin Yin',UId:"u7",TotalAudio: 0},

    {UId:"u8",UserName: "Yamin",TotalAudio: 0},
    {UId:"u9",UserName: "Ko Kyi",TotalAudio:0},
    { UId:"u10",UserName: "Nwe Nwe",TotalAudio:0},
    { UId:"u11",UserName: "Hla Hla",TotalAudio:0},
    { UId:"u12",UserName: "Soe Soe",TotalAudio:0},
    {UserName:'Hnin Hnin',UId:"u13",TotalAudio:0},
    {UserName:'Myo Myo',UId:"u14",TotalAudio:0},
    {UserName:'Thin Thin',UId:"u16",TotalAudio:0},
    {UserName:'Aung Aung',UId:"u15",TotalAudio: 0},
    {UserName:'Kyaw Kyaw',UId:"u17",TotalAudio: 0},
    {UserName:'Kyaw Sann',UId:"u18",TotalAudio: 0},
    {UserName:'Kaung Su',UId:"u19",TotalAudio: 0}
  ]

  var t1=[{TextId:'t1',TextName:"aaa",AudioName:'aaa'},
    {TextId:'t2',TextName:"bbb",AudioName:'bbb'},
    {TextId:'t3',TextName:"ccc",AudioName:'ccc'},
    {TextId:'t4',TextName:"ddd",AudioName:'ddd'},
    {TextId:'t5',TextName:"eee",AudioName:'eee'},
    {TextId:'t6',TextName:"fff",AudioName:'fff'},
    {TextId:'t9',TextName:"ggg",AudioName:'iii'},
    {TextId:'t10',TextName:"hhh",AudioName:'jjj'},
    {TextId:'t11',TextName:"iii",AudioName:'kkk'},
    {TextId:'t12',TextName:"jjj",AudioName:'lll'},

  ]

  var uf=[
    {
      Username:'hkk',Password:'12345'
    }
  ]

  Record.create(r1, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {
      console.log("Multiple documents inserted to Record Table");
    }
  });


  Info.create(uf,function(err,docs){
    if(err){
      return console.error(err);
    }else{
      console.log("Multiple documents inserted to Record Table");
    }
  })


  User.create(u1, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {

      console.log("Multiple documents inserted to Users Table");
    }
  });

  Text.create(t1, function(err, docs) {
    if (err) {
      return console.error(err);
    } else {
      console.log("Multiple documents inserted to Text Table");
    }
  });



});


exports.Info=Info;
exports.Record=Record;
exports.User=User;
exports.Text=Text;
