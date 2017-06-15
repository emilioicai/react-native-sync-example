import sync from 'fh-sync-js';
import sha1 from 'sha1';
import { AsyncStorage } from 'react-native';

var RNSync = {};

RNSync.init = function(config) {
  const datasetId = config.datasetId;
  const url = config.url;
  const queryParams = {};
  const metaData = {};

  sync.setStorageAdapter(function(datasetId, isSave, cb){
    cb(null, {
      // remove: function(payload, cb){
      // },
      get: function(payload, cb){
        AsyncStorage.getItem('__sync__' + datasetId, cb);
      },
      save: function(payload, cb){
        AsyncStorage.setItem('__sync__' + datasetId, JSON.stringify(payload), cb);
      }
    });
  });

  sync.setHashMethod(sha1);

  sync.setCloudHandler(function (params, success, failure) {
    var body = params.req;
    fetch(url + params.dataset_id, {
      method: 'POST',
      body: JSON.stringify(body),
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
    })
    .then((response) => console.log(response))
    .catch((error) => {
      console.error(error);
    });
  });

  sync.init({
    "sync_frequency": 10,
    "do_console_log": true
  });

  sync.notify(function(notification){
    var code = notification.code
    if('sync_complete' === code){
      //a sync loop completed successfully, list the update data
      sync.doList(datasetId,
        function (res) {
          console.log('Successful result from list:', JSON.stringify(res));
          },
        function (err) {
          console.log('Error result from list:', JSON.stringify(err));
        });
    } else {
      //choose other notifications the app is interested in and provide callbacks
    }
  });

  sync.manage(datasetId, {}, queryParams, metaData, () => {}); 
}

RNSync.doCreate = sync.doCreate;
RNSync.doList = sync.doList;

export default RNSync;

