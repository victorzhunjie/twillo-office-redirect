/**
 *  This Function will forward a call to another phone number during allowed office hour. If the call isn't answered or the line is busy, 
 *  voice mail will be recorded, with sms notification.
 */

const source_phone = '+16100000000';
const destination_phone = '+16100000001'
const greeting_message = 'Hello, you have called <company>, Please wait while you are connected.';
const no_answer_message = 'We are currently busy, please leave your name, phone number, brief description, and He’ll get back to you as soon as possible.  Have a nice day!';
const office_closed_message = 'Thanks for calling us, our company is close at the moment. Please leave a message and we\'ll get back to you as soon as possible';
const call_timeout = 15;

const days_of_operation = [0, 1, 2, 3, 4, 5, 6, 7];
const hours_of_operation = [8,9,10,11,13,14,15,16];

exports.handler = function (context, event, callback) {
  // set-up the variables that this Function will use to forward a phone call using TwiML
  // generate the TwiML to tell Twilio how to forward this call
  let twiml = new Twilio.twiml.VoiceResponse();
  let dialParams = {};
  // OPTIONAL
  let callerId = source_phone;
  if (callerId) {
    dialParams.callerId = callerId;
  }
  dialParams.timeout = call_timeout;
  dialParams.record = true;
  dialParams.transcribe = true;

  // allowedThrough
  const hour_of_operation = () => {
    let now = new Date();
    const day_of_week = now.getDay();
    const timeZoneoffSet = 11;
    now.setHours(now.getHours() + timeZoneoffSet);
    const hour_of_day = now.getHours();
    const min_of_now = now.getMinutes();

    return hour_of_day >= 5 && hour_of_day < 24;
  }

  let allowedThrough = (days_of_operation.indexOf(day_of_week) > -1) && hour_of_operation();

  if (allowedThrough) {
    twiml.pause({ length: 2 });
    twiml.say({ voice: 'alice', language: 'en-US' }, greeting_message);
    twiml.dial(dialParams, destination_phone);
    twiml.pause({ length: 2 });
    twiml.say({ voice: 'alice', language: 'en-US' }, no_answer_message);
    twiml.record({ timeout: 30, transcribe: true, playBeep: true, recordingStatusCallback: '/twillo-voicemail', recordingStatusCallbackEvent: 'completed' });
  }
  else {
    twiml.pause({ length: 2 });
    twiml.say({ voice: 'alice', language: 'en-US' }, office_closed_message);
    twiml.record({ timeout: 30, transcribe: true, playBeep: true, recordingStatusCallback: '/twillo-voicemail', recordingStatusCallbackEvent: 'completed' });
  }

  // return the TwiML
  callback(null, twiml);
};
