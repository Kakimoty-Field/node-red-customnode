var hub = require('./hub');

module.exports = function (RED) {
    function IBMFunctionsOut(config) {
        // --- �K�{�s
        RED.nodes.createNode(this, config);
        var node = this;

        // �m�[�h IN �Ƀf�[�^���������̃C�x���g
        this.on('input', function (msg) {
            console.log('#  #');
            hub.emit('nodeResponse', msg.payload);
        });
    }
     // --- �K�{�s
    RED.nodes.registerType('ibm-functions-out', IBMFunctionsOut);
};