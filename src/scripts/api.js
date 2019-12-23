class Api {
    endpoint = 'http://localhost:5000/api';
    token = "";
    call(resource, type, body) {
        let headers = { "Content-Type": "application/json" };
        if (this.token) headers.Authorization = "Token " + this.token;
        return fetch(this.endpoint + '/' + resource, {
            method: type,
            body: JSON.stringify(body),
            headers: headers,
            mode: "cors"
        }).then(res => {
            return res.json();
        }, err => {
            console.error({'API call error': err});
            return null;
        });
    }
}

module.exports = new Api();