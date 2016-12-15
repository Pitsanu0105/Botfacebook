
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
        setInterval(function() {
            console.log('eieiee')
        }, 17000000)
        firebase.initializeApp(config)
        var It3k = firebase.database().ref('It3k')
        var data3k = [];
        It3k.on('child_added', function(snapshot) {
            data3k.push(snapshot.val());
            //console.log(data3k);
        });
        app.use(bodyParser.json())
        app.set('port', (process.env.PORT || 4000))
        app.use(bodyParser.urlencoded({
            extended: false
        }))
        app.use(bodyParser.json())

        app.get('/webhook', function(req, res) {
            var key = 'EAAJeCn5oY2wBACArnEtdI8TN998JFLrczb16ZAMMc5Ctr3VM3ytjkQDEteMzXppZClCLT2dvryZBWKl99hKK4Yhp5A8LNUy9emmklQ31eeCn9z7YsZAVxRKZAZBv7ZBvLtIHsW9MB5oUz3tF55vxyzIO1g0yEO6QLkvrszhjyZBLcwZDZD'
            if (req.query['hub.mode'] === 'subscribe' &&
                req.query['hub.verify_token'] === key) {
                console.log("Validating webhook");
                res.send(req.query['hub.challenge'])
            } else {
                console.error("Failed validation. Make sure the validation tokens match.");
                res.sendStatus(403);
            }
        });

        app.post('/webhook', function(req, res) {
            var data = req.body;

            // Make sure this is a page subscription
            if (data.object == 'page') {
                // Iterate over each entry
                // There may be multiple if batched
                data.entry.forEach(function(pageEntry) {
                    var pageID = pageEntry.id;
                    var timeOfEvent = pageEntry.time;

                    // Iterate over each messaging event
                    pageEntry.messaging.forEach(function(messagingEvent) {
                        if (messagingEvent.message) {
                            receivedMessage(messagingEvent);
                        } else if (messagingEvent.postback) {
                            receivedPostback(messagingEvent);
                        } else {
                            console.log("Webhook received unknown messagingEvent: ", messagingEvent);
                        }
                    });
                });

                // Assume all went well.
                //
                // You must send back a 200, within 20 seconds, to let us know you've
                // successfully received the callback. Otherwise, the request will time out.
                res.sendStatus(200);
            }
        });

        function receivedMessage(event) {
            var senderID = event.sender.id;
            var recipientID = event.recipient.id;
            var timeOfMessage = event.timestamp;
            var message = event.message;

            console.log("Received message for user %d and page %d at %d with message:",
                senderID, recipientID, timeOfMessage);
            console.log(JSON.stringify(message));

            var isEcho = message.is_echo;
            var messageId = message.mid;
            var appId = message.app_id;
            var metadata = message.metadata;

            // You may get a text or attachment but not both
            var messageText = message.text;
            var messageAttachments = message.attachments;
            var quickReply = message.quick_reply;


            /* if (isEcho) {
               // Just logging message echoes to console
               console.log("Received echo for message %s and app %d with metadata %s",
                 messageId, appId, metadata);
               return;
             } else if (quickReply) {
               var quickReplyPayload = quickReply.payload;
               console.log("Quick reply for message %s with payload %s",
                 messageId, quickReplyPayload);
               sendTextMessage(senderID, "Quick reply tapped");
               return;
             }*/
