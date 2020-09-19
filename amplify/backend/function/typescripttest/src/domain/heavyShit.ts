import {Observable} from 'rxjs';


const AWS = require('aws-sdk');
AWS.config.update({region: process.env.TABLE_REGION || 'eu-central-1'});


export interface HeavyShit {
    heavy: boolean,
    shit: string
}

export interface WeakShit {
    weak: boolean,
    shit: string
}


export type Shit = HeavyShit | WeakShit


export const calc = (): Shit => {
    if (Math.random() > 0.5) {
        return <HeavyShit>{heavy: true, shit: 'big'};
    } else {
        return <WeakShit>{weak: true, shit: 'bum'};
    }
};


