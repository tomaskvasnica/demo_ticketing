console.log('MOCK WRAPER 0');
export const natsWrapper = {
    client: {
        publish: jest.fn().mockImplementation(
            (topic:string, data:string, callback:()=> void) => {
                callback();
            }
        ),
    }
};