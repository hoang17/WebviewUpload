import React, { Component } from 'react'
import { WebView, Image, Linking, Button } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import { StyleSheet, Text, View } from 'react-native'

var options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

const baseUrl = "https://webview-upload-server.herokuapp.com/"
const uploadUrl = baseUrl + 'upload'

type Props = {}
export default class App extends Component<Props> {

  state = {
    status: "Upload file",
    uri: baseUrl,
    avatarSource: null,
    fileName: null,
  }

  onMessage = event => {
    // console.log(event.nativeEvent.data)
    if (event.nativeEvent.data == 'upload_file'){
      ImagePicker.launchImageLibrary(options, response => {
        console.log(response)

        var { uri, fileName } = response

        // let source = { uri: 'data:image/jpegbase64,' + response.data }
        this.setState({
          status: "File is uploading...",
          avatarSource: { uri },
          fileName: fileName,
        })

        var fieldName = 'sampleFile'

        const body = new FormData()
        body.append(fieldName, {
          uri: uri,
          type: 'image/jpeg',
          name: fileName,
        })
        fetch(uploadUrl, {
          method: 'post',
          body: body
        }).then(res => {
          this.setState({
            status: "File uploaded",
          })
          console.log(res)
          this.refs.webview.postMessage(fileName)
        })
      })
    } else {
      Linking.openURL(baseUrl + this.state.fileName)
    }
  }

  render() {
    const { status, uri } = this.state
    return (
      <View style={styles.container}>
        <Text style={styles.status}>{status}</Text>
        {/* <Image source={this.state.avatarSource} style={styles.uploadPhoto} /> */}
        <WebView
          source={{ uri }}
          style={styles.webview}
          onMessage={this.onMessage}
          ref="webview"
        />
      </View>
    )
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
    backgroundColor: '#F5FCFF',
    flexDirection: 'column',
    flexWrap: 'wrap',
  },
  webview: {
    flex: 1
  },
  status: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  uploadPhoto: {
    width: 300,
    height: 300,
  }
})
