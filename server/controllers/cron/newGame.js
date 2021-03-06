'use strict'
require('dotenv').config();
const https = require('https');
const cronJob = require('cron').CronJob;
const nodemailer = require('nodemailer');
const kue = require('kue');
const queue = kue.createQueue();

const transporter = nodemailer.createTransport({
    service: 'Gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
});

const newGame = (user, time) => {
    if (user) {
      let createGame = new cronJob('* * * * * *' ,
          function() {
            console.log('scs to start');
            sendEmail(user, time);
            sendSMS({phone:user.phone, msg:`Hi, ${user.name}. Kami ingin memberitahu bahwa pada ${time} akan dimulai game baru. Silakan membuka aplikasi GameRealTime untuk ikutan main. Have fun!!!`});
            this.stop();
          },
          () => {
          },
          true, /*start the job right now*/
          'Asia/Jakarta' /*timeZone*/
        );
      // userRegister.start();
    } else console.log('kirim user yang bener laa');

}


const sendEmail = (user, time) => {
  createJOB('sendEmail',user,'critical');
  queue.process('sendEmail',(job,done)=>{
    let mailOptions = {
        from: '"GameRealTime 👻" <noreply@gamerealtime.com>', // sender address
        to: `${user.email}`,//`${user.email}`, // list of receivers
        subject: 'Incoming Game', // Subject line
        text: `Hi ${user.name}, apa kabar? Kami ingin memberitahu bahwa pada ${time} akan dimulai game baru. Silakan membuka aplikasi GameRealTime untuk ikutan main. Have fun!!!`, // plain text body
        html: `Hi <b>${user.name}</b>,<br/><br/>Kami ingin memberitahu bahwa pada ${time} akan dimulai game baru. Silakan membuka aplikasi GameRealTime untuk ikutan main. Have fun!!!<br/><br/>Cheers,<br/>Team GameRealTime` // html body
    };
    transporter.sendMail(mailOptions, (err, info) => {
      err ? done(err) : done();
    });

  });
}

const createJOB = (jobname,data,priority='low') => {
  let job =
    queue.create(jobname,data)
    .priority(priority)
    .attempts(5)
    .save(err => console.log(err? err : job.id));

  job.on('complete', res => console.log(`complete\n${res}`));
  job.on('failed', err => console.log(err) );
}

const sendSMS = (user) => {
  // let job =
  createJOB('sendSMS',user,'normal')
  queue.process('sendSMS', (job,done)=> {
    let data = JSON.stringify({
      api_key: process.env.NEXMO_KEY,
      api_secret: process.env.NEXMO_SECRET,
      to: job.data.phone,
      from: 'GameRealTime',
      text: job.data.msg
    });
    let options = {
     host: 'rest.nexmo.com',
     path: '/sms/json',
     port: 443,
     method: 'POST',
     headers: {
       'Content-Type': 'application/json',
       'Content-Length': Buffer.byteLength(data)
     }
    };
    let req = https.request(options);
    req.write(data);
    req.end();
    let responseData = '';
    req.on('response', (res) => {
      res.on('data', (chunk) => { responseData += chunk;});
      res.on('end', () => { console.log(JSON.parse(responseData)); });
    });
    done();
  });
}

module.exports = {
  newGame
};
