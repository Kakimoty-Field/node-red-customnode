var hub = require('./hub');

module.exports = function (RED) {
    function IBMFunctionsOut(config) {
        // --- 必須行
        RED.nodes.createNode(this, config);
        var node = this;

        // ノード IN にデータが来た時のイベント
        this.on('input', function (msg) {
            console.log('#  #');
            hub.emit('nodeResponse', msg.payload);
        });
    }
     // --- 必須行
    RED.nodes.registerType('ibm-functions-out', IBMFunctionsOut);
};