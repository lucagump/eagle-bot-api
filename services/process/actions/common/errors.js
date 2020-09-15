module.exports = {
    OK: {'code': 200,'error': `OK - Performed Succesfully`},    
    CREATED: {'code': 201,'error': `CREATED`},
    ACCEPTED: {'code': 202,'error': `ACCEPTED`},
    BADREQUEST: {'code': 400, 'error': `BAD REQUEST`},
    UNAUTHORIZED: {'code': 401,'error': `UNAUTHORIZED`},
    NOTFOUND: {'code': 404,'error': `NOT FOUND`},
    INTERNALSERVER: {'code': 500,'error': `INTERNAL SERVER ERROR`},
    BADGATEWAY: {'code': 502,'error': `BAD GATEWAY - INVALID RESPONSE FORM UPSTREAM SERVER`}
};