var hub = require('./hub');

module.exports = function (RED) {
    function IBMFunctionsIn(config) {
        // --- 必須行
        RED.nodes.createNode(this, config);
        var node = this;

        console.log('## registering listener to emitter ##');
        hub.on('functionCall', function (params) {
            console.log('# accept lambda event #');
            node.send({ 'payload': params });
        });
    }
    // --- 必須行
    RED.nodes.registerType('ibm-functions-in', IBMFunctionsIn);
}