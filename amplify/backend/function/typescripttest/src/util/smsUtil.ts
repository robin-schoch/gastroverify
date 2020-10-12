import {forkJoin, Observable} from 'rxjs';
import {PublishResponse} from 'aws-sdk/clients/sns';

const AWS = require('aws-sdk');
AWS.config.update({region: process.env.AWS_REGION || 'eu-central-1'});
const SNS = new AWS.SNS();

const defaultSenderId = 'EntryCheck';

export const sendCoronaSMS = (phoneNumber: string, message: string): Observable<PublishResponse> => {
  const smsParam = {
    PhoneNumber: phoneNumber,
    Message: message,
    MessageAttributes: {
      'AWS.SNS.SMS.SenderID': {
        DataType: 'String',
        StringValue: defaultSenderId
      }
    },
  };
  return new Observable(subscriber => {
    SNS.publish(smsParam, (err, data) => {
      if (err) subscriber.error(err);
      subscriber.next(data);
      subscriber.complete();
    });
  });
};


export const sendMessage = (listOfNumbers: any[]) => {
  const lines = [
    'Hallo!',
    ' Am Dienstag (6.10.) warst Du bei einer Veranstaltung in der Affekt Bar.Eine der Personen, die an diesem Event teilgenommen hat, wurde am Samstag positiv auf Covid-19 getestet.Obwohl viele andere Teilnehmer mittlerweile negativ getestet wurden, bitten wir Dich, auf Dich und Dein Umfeld zu achten und bei eventuellen Symptomen einen Test zu machen und Dich selbst zu isolieren.Bis auf weiteres werden die kommenden Stammtische verschoben, wir müssen jetzt alle an einem Strang ziehen, um weitere Fälle zu verhindernVielen Dank für Dein Verständnis und Deine Hilfe!',
    'Dein Affekt Team'
  ];


  forkJoin(listOfNumbers.map(number => sendCoronaSMS(number, lines.join('\n'))))
      .subscribe(a => console.log(a));

};
export const clearNumbers = (listofNumber: string[]) => {
  const set = new Set(listofNumber);
  console.log(set.size);
  console.log(listofNumber.length);
  return Array.from(set);
};

//console.log(clearNumbers(coronaNumber));
//sendMessage(clearNumbers(coronaNumber));


