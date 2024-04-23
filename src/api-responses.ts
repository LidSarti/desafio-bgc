interface ResponseData {
    [key: string]: any;
}

export interface Response {
    headers: {
        [key: string]: string;
    };
    statusCode: number;
    body: string;
}

const Responses = {
    _200(data: ResponseData = {}): Response {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 200,
            body: JSON.stringify(data),
        };
    },

    _500(data: ResponseData = {}): Response {
        return {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Methods': '*',
                'Access-Control-Allow-Origin': '*',
            },
            statusCode: 500,
            body: JSON.stringify(data),
        };
    },
};

export default Responses;
