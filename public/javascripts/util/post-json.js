/**
 * Created by AGromov on 21.07.2016.
 */
define(function () {
    return function(url, data, method) {
        if(!method) {
            method = "post";
        }
        return fetch(url, {

            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            method: method,
            body: JSON.stringify(data)
        }).then((data) => {
            return data.json();
        })
    };
});