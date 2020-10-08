exports.handler = function (context, event, callback) {
  // voicemail 
  const client = context.getTwilioClient();
  const voicemailLink = event.RecordingUrl;

  // phone number
  const source_phone = '+16100000000';
  const destination_phone = '+16100000001';

  // Send Voicemail alert
  client.calls(event.CallSid)
    .fetch()
    .then(call => {
      const messageBody = `You have a new voicemail from customer ${call.from}: ${voicemailLink}.mp3`;
      return client.messages.create({
        from: source_phone,
        to: destination_phone,
        body: messageBody
      });
    })
    .then(message => {
      callback(null, {});
    })
    .catch(err => {
      console.log('ERROR', err);
      callback(err);
    });
};