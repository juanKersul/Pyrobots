import axios from "axios";

// token enviado por body o params por lo tanto innecesario enviarlo por headers

const URL = 'http://127.0.0.1:8000/'; // aca seria la url del back

export default axios.create({
        baseURL: URL,
        timeout: 0,
});