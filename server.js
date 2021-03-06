var express = require('express')
var bodyParser = require('body-parser')
var request = require('request')
var firebase = require('firebase')
var app = express()
var config = {
  apiKey: 'AIzaSyBasyXEYg3xGN6Y9ndOtt9chPV4m60_6Xw',
  authDomain: 'it-3k-1f766.firebaseapp.com',
  databaseURL: 'https://it-3k-1f766.firebaseio.com',
  storageBucket: 'it-3k-1f766.appspot.com',
  messagingSenderId: '914467199924'
}
setInterval(function () {
  console.log('eieiee')
}, 17000000)
firebase.initializeApp(config)
var It3k = firebase.database().ref('It3k')
var data3k = []
It3k.on('child_added', function (snapshot) {
  data3k.push(snapshot.val())
// console.log(data3k)
})
app.use(bodyParser.json())
app.set('port', (process.env.PORT || 4000))
app.use(bodyParser.urlencoded({
  extended: false
}))
app.use(bodyParser.json())

app.get('/webhook', function (req, res) {
  var key = 'EAAJeCn5oY2wBACArnEtdI8TN998JFLrczb16ZAMMc5Ctr3VM3ytjkQDEteMzXppZClCLT2dvryZBWKl99hKK4Yhp5A8LNUy9emmklQ31eeCn9z7YsZAVxRKZAZBv7ZBvLtIHsW9MB5oUz3tF55vxyzIO1g0yEO6QLkvrszhjyZBLcwZDZD'
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === key) {
    console.log('Validating webhook')
    // res.send(req.query['hub.challenge'])
    It3k.on('value', function (snapshot) {
      data3k.push(snapshot.val())
      res.json(snapshot.val())
    // console.log(data3k)
    })
  } else {
    // console.error('Failed validation. Make sure the validation tokens match.')
    // res.sendStatus(403)
    It3k.on('value', function (snapshot) {
      data3k.push(snapshot.val())
      var it3kquerry = data3k.filter(data => data.type === 'Program')
      res.json(it3kquerry)
    // console.log(data3k)
    })
  }
})

app.post('/webhook', function (req, res) {
  var data = req.body

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id
      var timeOfEvent = pageEntry.time

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent)
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent)
        } else {
          // console.log('Webhook received unknown messagingEvent: ', messagingEvent)
        }
      })
    })

    res.sendStatus(200)
  }
})

app.get('/webhook', function (req, res) {
  var key = 'EAAJeCn5oY2wBACArnEtdI8TN998JFLrczb16ZAMMc5Ctr3VM3ytjkQDEteMzXppZClCLT2dvryZBWKl99hKK4Yhp5A8LNUy9emmklQ31eeCn9z7YsZAVxRKZAZBv7ZBvLtIHsW9MB5oUz3tF55vxyzIO1g0yEO6QLkvrszhjyZBLcwZDZD'
  if (req.query['hub.mode'] === 'subscribe' &&
    req.query['hub.verify_token'] === key) {
    console.log('Validating webhook')
    res.send(req.query['hub.challenge'])
  } else {
    console.error('Failed validation. Make sure the validation tokens match.')
    res.sendStatus(403)
  }
})

app.post('/webhook', function (req, res) {
  var data = req.body

  // Make sure this is a page subscription
  if (data.object == 'page') {
    // Iterate over each entry
    // There may be multiple if batched
    data.entry.forEach(function (pageEntry) {
      var pageID = pageEntry.id
      var timeOfEvent = pageEntry.time

      // Iterate over each messaging event
      pageEntry.messaging.forEach(function (messagingEvent) {
        if (messagingEvent.message) {
          receivedMessage(messagingEvent)
        } else if (messagingEvent.postback) {
          receivedPostback(messagingEvent)
        } else {
          // console.log('Webhook received unknown messagingEvent: ', messagingEvent)
        }
      })
    })

    // Assume all went well.
    //
    // You must send back a 200, within 20 seconds, to let us know you've
    // successfully received the callback. Otherwise, the request will time out.
    res.sendStatus(200)
  }
})

function receivedMessage (event) {
  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfMessage = event.timestamp
  var message = event.message

  // console.log('Received message for user %d and page %d at %d with message:',
  //   senderID, recipientID, timeOfMessage)
  // console.log(JSON.stringify(message))

  var isEcho = message.is_echo
  var messageId = message.mid
  var appId = message.app_id
  var metadata = message.metadata

  // You may get a text or attachment but not both
  var messageText = message.text
  var messageAttachments = message.attachments
  var quickReply = message.quick_reply

  if (messageText) {
    if (messageText === 'HELLO' || messageText === 'hello' || messageText === 'Hello' || messageText === 'สวัสดี') {
      sendTextMessage(senderID, 'สวัสดีครับ')
    } else if (messageText === 'ขอบใจ' || messageText === 'ขอบคุณ') {
      sendTextMessage(senderID, 'ยินดีบริการครับ')
    }
    switch (messageText) {
      case 'HELLO':
        sendGreetMessage(senderID)
        break
      case 'สวัสดี':
        sendGreetMessage(senderID)
        break
      case 'hello':
        sendGreetMessage(senderID)
        break
      case 'Hello':
        sendGreetMessage(senderID)
        break
      case 'ขอบใจ':
        NoThank(senderID)
        break

      default:
        sendTextMessage(senderID, 'เราไม่เข้าใจในสิ่งที่คุณต้องการ')
        sendGreetMessage(senderID)
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, 'ครับ')
  }
}

function receivedPostback (event) {
  var senderID = event.sender.id
  var recipientID = event.recipient.id
  var timeOfPostback = event.timestamp

  // The 'payload' param is a developer-defined field which is set in a postback
  // button for Structured Messages.
  var payload = event.postback.payload

  console.log("Received postback for user %d and page %d with payload '%s' " +
    'at %d', senderID, recipientID, payload, timeOfPostback)
  if (payload === 'Program') {
    Programs(senderID)
  } else if (payload === 'USER_DEFINED_PAYLOAD') {
    sendTextMessage(senderID, 'สวัสดีครับ พวกเราทีมงาน มจพ ปราจีนบุรี ยินดีต้อนรับเข้าสู่งาน IT 3 พระจอม ครั้งที่ 14 ครับ')
    sendGreetMessage(senderID)
  } else if (payload === 'noThank') {
    sendTextMessage(senderID, 'ขอบคุณที่ใช้บริการกับเรานะครับ' + '\n' + 'หากคุณต้องการเช็คตารางเวลาหรือตารางการเเข่งขันก็กลับมาได้เสมอนะครับ')
    NoThank(senderID)
  } else if (payload === 'compettition') {
    Compettition(senderID)
  } else if (payload === 'detail01') {
    url = "https://it-3k-1f766.firebaseapp.com/"
    sendTextMessage(senderID, url)
    sendGreetMessage(senderID)
  } else if (payload === 'menu') {
    sendGreetMessage(senderID)
  } else {
    var result = ''
  }
}
// --------------------ทักทายตอบกลับ---------------------------
function sendGreetMessage (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'เลือกสิ่งที่คุณต้องการ',
          buttons: [{
            type: 'postback',
            title: '🔎 กำหนดการ',
            payload: 'Program'
          }, {
            type: 'postback',
            title: '🔎 การเเข่งขัน',
            payload: 'compettition'
          }, {
            type: 'postback',
            title: '👋 ไม่เป็นไร ขอบคุณ',
            payload: 'noThank'
          }]
        }
      }
    }
  }

  callSendAPI(messageData)
}
// ------------ผลการเเข่งขัน---------------//
function Compettition (recipientId, messageText) {
  var it3kquerrysport = data3k.filter(data => data.type === 'sport')
  console.log(it3kquerrysport);
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: []
        }
      }
    }
  }
  let pic = 'https://thai.chelseafc.com/content/dam/cfc/logos/honour-competition-logos/capital-one-cup.png'
  it3kquerrysport.forEach((item) => { messageData.message.attachment.payload.elements.push({title: "ผลการเเข่งขัน" + "\n" + item.sport + "\t" + item.competition, image_url: pic, buttons: [{type: 'postback', title: 'เข้าสู่เว็บไซต์', payload: 'detail01'}, {type: 'postback', title: 'กลับหน้าหลัก', payload: 'menu'}]}) })
  console.log('==============================Result==========================')

  callSendAPI(messageData)
}

// ------------------กำหนดการ---------------------------------------------------
function Programs (recipientId) {
  var it3kquerry = data3k.filter(data => data.type === 'Program')
  console.log('::: data ::: ', it3kquerry)
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'generic',
          elements: []
        }
      }
    }
  }

  let pic = 'https://cdn3.iconfinder.com/data/icons/metro-business/512/date_and_time-256.png'
  it3kquerry.forEach((item) => { messageData.message.attachment.payload.elements.push({title: item.message, image_url: pic, buttons: [{type: 'postback', title: 'เข้าสู่เว็บไซต์', payload: 'detail01'}, {type: 'postback', title: 'กลับหน้าหลัก', payload: 'menu'}]}) })
  console.log('==============================Program==========================')

  callSendAPI(messageData)
}
// ----------------ตอบกลับ------------------------------------------------------
function sendTextMessage (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  }

  callSendAPI(messageData)
}
// --------ดึงAPIคนที่คุยด้วย---------------------------------------------------------
function callSendAPI (messageData) {
  console.log('---------------------------------------------------')
  console.log(messageData)
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: 'EAAJeCn5oY2wBACArnEtdI8TN998JFLrczb16ZAMMc5Ctr3VM3ytjkQDEteMzXppZClCLT2dvryZBWKl99hKK4Yhp5A8LNUy9emmklQ31eeCn9z7YsZAVxRKZAZBv7ZBvLtIHsW9MB5oUz3tF55vxyzIO1g0yEO6QLkvrszhjyZBLcwZDZD'
    },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode === 200) {
      var recipientId = body.recipient_id
      var messageId = body.message_id
      console.log('Successfully sent generic message with id %s to recipient %s',
        messageId, recipientId)
    } else {
      console.error('Unable to send message.')
      console.error(response)
      console.error(error)
    }
  })
}
// ------------------------------------------------------------------------------
// ------------ก่อนจาก-----------------------------------------------------------
function backTomenu (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'ถ้าต้องการดูอื่นๆ กรูณากดด้านล่าง',
          buttons: [{
            type: 'postback',
            title: '🔎 กลับเมนู',
            payload: 'menu'
          }]
        }
      }
    }
  }

  callSendAPI(messageData)
}

function NoThank (recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: 'template',
        payload: {
          template_type: 'button',
          text: 'ขอบคุณครับ ',
          buttons: [{
            type: 'postback',
            title: '🔎 ฉันกลับมาเเล้ว',
            payload: 'USER_DEFINED_PAYLOAD'
          }]
        }
      }
    }
  }

  callSendAPI(messageData)
}

app.listen(app.get('port'), function () {
  console.log('run at port', app.get('port'))
})
