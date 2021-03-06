import React, { Component } from 'react';
import { Container, Content, List, ListItem, Text, Fab } from 'native-base';
import RNSync from './RNSync';
import prompt from 'react-native-prompt-android';

export default class syncExample extends Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: []
    }
    this.messagesId = 'messages';
  }
  
  componentWillMount() {
    RNSync.init({
      datasetId: this.messagesId,
      url: 'http://localhost:3000/sync/'
    });

    RNSync.notify(function(notification){
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

    const queryParams = {};
    const metaData = {};
    RNSync.manage(this.messagesId, {}, queryParams, metaData, () => {});
  }
  
  _addNewMessage(text){
    RNSync.doCreate(this.messagesId, text, function(res) {
      console.log('Create item success');
    }, function(code, msg) {
      alert('An error occured while creating data : (' + code + ') ' + msg);
    });
  }
  
  _handleAddMessagePress(){
    prompt(
      'Enter message',
      '',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'OK', onPress: this._addNewMessage.bind(this) }
      ],
      {
        type: 'plain-text'
      }
    );
  }

  render() {
    return (
      <Container style={{marginTop: 20}}>
          <Content>
              <List>
                {
                  this.state.messages.map((m, i)=>{
                    return (
                      <ListItem key={i}>
                        <Text>{m}</Text>
                      </ListItem>
                    )
                  })
                }
              </List>
          </Content>
          <Fab
            style={{ backgroundColor: '#5067FF' }}
            position="bottomRight"
            onPress={this._handleAddMessagePress.bind(this)}
          >
            <Text>+</Text>
          </Fab>
      </Container>
    );
  }
}
