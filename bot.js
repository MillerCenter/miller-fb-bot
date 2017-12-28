'use strict';
const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const path = require('path');
var messengerButton = "<html><head><title>Alan B Miller Messenger Bot</title></head><body><h1>Alan B Miller Messenger Bot</h1></body></html>";

let app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
  extended: true
}));

// Webhook validation
app.get('/webhook', function(req, res) {
  if (req.query['hub.mode'] === 'subscribe' &&
      req.query['hub.verify_token'] === process.env.VERIFY_TOKEN) {
    console.log("Validating webhook");
    res.status(200).send(req.query['hub.challenge']);
  } else {
    console.error("Failed validation. Make sure the validation tokens match.");
    res.sendStatus(403);          
  }
});

// Display web page
app.get('/', function(req, res) {
  res.writeHead(200, {'Content-Type': 'text/html'});
  res.write(messengerButton);
  res.end();
});

// Message processing
app.post('/webhook', function (req, res) {
  console.log(req.body);
  var data = req.body;

  if (data.object === 'page') {
    
    data.entry.forEach(function(entry) {
      var pageID = entry.id;
      var timeOfEvent = entry.time;

      entry.messaging.forEach(function(event) {
        if (event.message) {
          receivedMessage(event);
        } else if (event.postback) {
          receivedPostback(event);   
        } else {
          console.log("Webhook received unknown event: ", event);
        }
      });
    });
    res.sendStatus(200);
  }
});

// Incoming events handling
function receivedMessage(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfMessage = event.timestamp;
  var message = event.message;

  console.log("Received message for user %d and page %d at %d with message:", 
    senderID, recipientID, timeOfMessage);
  console.log(JSON.stringify(message));

  var messageId = message.mid;

  var messageText = message.text;
  var messageAttachments = message.attachments;

  if (messageText) {
    if (messageText.includes('events')){
      sendEventMessage(senderID);
    }
    else if (messageText.includes('rocket')){
       sendRocketMessage(senderID);
    }
    else if (messageText.includes('co-working')){
       sendCoWorkingMessage(senderID);
    }
    else if (messageText.includes('grant') || messageText.includes('seed')){
       sendGrantMessage(senderID);
    }
    else if (messageText.includes('mentor')){
       sendMentorMessage(senderID);
    }
    else if (messageText.includes('fellow')){
       sendFellowMessage(senderID);
    }
    else if (messageText.includes('membership')){
       sendMembershipMessage(senderID);
    }
    else if (messageText.includes('feedback')){
       sendFeedbackMessage(senderID);
    }
    else if (messageText.includes('contact')){
       sendContactMessage(senderID);
    }
    else if (messageText.includes('help')){
       sendHelpMessage(senderID);
    }
    else if (messageText.includes('blog')){
       sendBlogMessage(senderID);
    }
    else if (messageText.includes('mvp')){
       sendMVPMessage(senderID);
    }
    else if (messageText.includes('angel')){
       sendAngelMessage(senderID);
    }
    else if (messageText.includes('discover')){
       sendProductHuntMessage(senderID);
    }
    else if (messageText.includes('entrepreneurship week')){
       sendEWeekMessage(senderID);
    }
    else if (messageText.includes('how to')){
       sendHowToMessage(senderID);
    }
    else if (messageText.includes('business model')){
       sendBMCMessage(senderID);
    }
    else {
      sendTextMessage(senderID, "I'm not sure the answer to that question. \u000AType 'help' for a list of avaiable prompts");
    }
  } else if (messageAttachments) {
    sendTextMessage(senderID, "Message with attachment received");
  }
}

function receivedPostback(event) {
  var senderID = event.sender.id;
  var recipientID = event.recipient.id;
  var timeOfPostback = event.timestamp;

  var payload = event.postback.payload;

  console.log("Received postback for user %d and page %d with payload '%s' " + 
    "at %d", senderID, recipientID, payload, timeOfPostback);


  sendTextMessage(senderID, "Postback called");
}

// Sending helpers
function sendTextMessage(recipientId, messageText) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      text: messageText
    }
  };

  callSendAPI(messageData);
}


function sendEventMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Event Schedule",
            subtitle: "Miller Center Events",
            item_url: "http://millerec.com/events/",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/events/",
              title: "View Upcoming Events"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendRocketMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Rocket Pitch Fridays",
            subtitle: "1-2pm \u000AAlan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/events/?tribe-bar-search=Rocket+Pitch#events",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/events/?tribe-bar-search=Rocket+Pitch#events",
              title: "View Upcoming Event"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendCoWorkingMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Co-Working Fridays",
            subtitle: "2-5pm \u000AAlan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/events/?tribe-bar-search=co-working+hours#events",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/events/?tribe-bar-search=co-working+hours#events",
              title: "View Upcoming Event"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendMentorMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "The Mentor Network",
            subtitle: "Alan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/team/#mentors",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/team/#mentors",
              title: "Learn More"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendMembershipMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Membership",
            subtitle: "Alan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/membership/",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/membership/",
              title: "Learn More"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendFellowMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Miller Center Fellowship",
            subtitle: "Alan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/miller-fellows",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/miller-fellows",
              title: "Learn More"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}



function sendGrantMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [ {
            title: "Student Seed Funding",
            subtitle: "Alan B. Miller Entrepreneurship Center",
            item_url: "http://millerec.com/seed-funding/",               
            image_url: "http://millerec.com/wp-content/uploads/2017/04/home-main.jpg",
            buttons: [{
              type: "web_url",
              url: "http://millerec.com/seed-funding/",
              title: "Learn More"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendFeedbackMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Have feedback or a suggestion? ",

            buttons: [{
              type: "web_url",
              url: "http://millerec.com/feedback/",
              title: "Give Feedback"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendContactMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Alan B. Miller Entrepreneurship Center",

            buttons: [{
              type: "web_url",
              url: "http://millerec.com/get-connected/",
              title: "Get Connected"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendHelpMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
       text: "Here are some things you can ask: \u000A'events', 'co-working hours','rocket-pitch','mvp','mentors'"
    }
  };  

  callSendAPI(messageData);
};

function sendBlogMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Check out our latest blog posts!",

            buttons: [{
              type: "web_url",
              url: "http://millerec.com/blog/",
              title: "View Blog"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendMVPMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "MVPs can be a great way to quickly validate an idea. Here's one resource you can use to generate a website MVP:",

            buttons: [{
              type: "web_url",
              url: "https://quickmvp.com/",
              title: "View Blog"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendAngelMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Angel List can be a great way to meet other entrepreneurs!",

            buttons: [{
              type: "web_url",
              url: "https://angel.co/",
              title: "Make an account"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendProductHuntMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Product Hunt can be a great way to discover new ideas!",

            buttons: [{
              type: "web_url",
              url: "https://www.producthunt.com/",
              title: "Check it out"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendEWeekMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "Entrepreneurship week is packed with events to validate your entrepreneurial ideas! To learn more and find out about upcoming Events, click the link below",

            buttons: [{
              type: "web_url",
              url: "http://millerec.com/eweek/",
              title: "Check it out"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}


function sendHowToMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "For a helpful video series on topics related to entrepreneurship, check out the below playlist!",

            buttons: [{
              type: "web_url",
              url: "https://youtu.be/xRyXo7mWj3A",
              title: "Check it out"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}

function sendBMCMessage(recipientId) {
  var messageData = {
    recipient: {
      id: recipientId
    },
    message: {
      attachment: {
        type: "template",
        payload: {
          template_type: "generic",
          elements: [{
            title: "The Business Model Canvas is an important component of any startup.  It allows you to describe, design, challenge, invent, and pivot your business model. To learn more, check out the below video:",

            buttons: [{
              type: "web_url",
              url: "https://youtu.be/xRyXo7mWj3A",
              title: "Check it out"
            }]
          }]
        }
      }
    }
  };  
  callSendAPI(messageData);
}



function callSendAPI(messageData) {
  request({
    uri: 'https://graph.facebook.com/v2.6/me/messages',
    qs: { access_token: process.env.PAGE_ACCESS_TOKEN },
    method: 'POST',
    json: messageData

  }, function (error, response, body) {
    if (!error && response.statusCode == 200) {
      var recipientId = body.recipient_id;
      var messageId = body.message_id;

      console.log("Successfully sent generic message with id %s to recipient %s", 
        messageId, recipientId);
    } else {
      console.error("Unable to send message.");
      console.error(response);
      console.error(error);
    }
  });  
}

var server = app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port %s", server.address().port);
});