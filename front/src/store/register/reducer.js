import loadDataUser from './dataLoad';

const defaultDataUser = {
    "username": "",
    "password": "",
    "email": ""
};

function reducer(dataUser = defaultDataUser, action){
    const  dataUserChange = ({attribute, value}) => {
        return { 
            ...dataUser, 
            [attribute]: value
        }; 
    };
    
    if (action.type === 'GET_DATA_NAME') return dataUserChange({attribute:'username', value: action.data});
    else if (action.type === 'GET_DATA_PASS') return dataUserChange({attribute:'password', value: action.data});
    else if (action.type === 'GET_DATA_EMAIL') return dataUserChange({attribute:'email', value: action.data});
    else if(action.type === 'SEND_DATA') loadDataUser(dataUser);

    return dataUser;
}

export default reducer;