exports.main = async function(event, context) {
    return {
        statusCode: 400,
        headers: {},
        body: JSON.stringify(event)
    }
}