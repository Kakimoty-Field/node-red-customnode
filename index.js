var RED = require('node-red');
var fs = require('fs');
var http = require('http');
var path = require('path');
var when = require('when');
var hub = require('./hub');

var userDir = './.node-red-lambda';

function delay(msec) {
  return when.promise(function(resolve) {
    setTimeout(function() {
      resolve();
    }, msec);
  });
}

// userDirectoryからJSONファイルを読み込む
function loadConfig(fileName) {
  return when.promise(function(resolve, reject) {
    fs.readFile(path.join(userDir, fileName), 'utf8', function(err, data) {
      if (err) { reject(err); }
      else { resolve(JSON.parse(data)); }
    });
  });
}

// RED.init() に渡すユーザ設定。storageModuleを上書きしている（書き込みには対応してない）
var userSettings = {
  storageModule: { // dummy storage. only implements the least functions for running
    init: function() {},
    getFlows: function() {
      return loadConfig('flows.json');
    },
    getCredentials: function() {
      return loadConfig('flows_cred.json');
    }
  }
};

var init = (function() {
  var httpServer = http.createServer(); // HTTPサーバはダミー（Listenしない）
  RED.init(httpServer, userSettings);
  return RED.start().then(function() {
    console.log('Node-RED server started.');
    return delay(1000);
  });
})();


/**
 * IBM Functionに登録する関数
 */
async function main(params) {
    return new Promise((resolve, reject) => {
        init.then(function () {
            console.log('passing event to aws-lambda-io event emitter');
            console.log('event =', params);
            hub.emit('functionCall', params);

            setTimeout(() => {
                reject("Timeout"); // エラー返し
            }, 30000);

            hub.on("nodeResponse", (ret) => {
                resolve(ret);
            });
        }).catch(function (err) {
            console.error(err.stack);
            //        context.done(err);
            reject(err); // エラー返し
        });
    });
}

exports.main = main;