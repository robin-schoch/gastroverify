import {Auth} from 'aws-amplify';

const custom_header = async () => {
    return {'X-ID-Token': `${( Auth.currentSession()).getAccessToken().getJwtToken()}`}

};


export default custom_header;
