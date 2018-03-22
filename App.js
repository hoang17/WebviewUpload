import React, { Component } from 'react'
import { WebView, Image, Button } from 'react-native'
import ImagePicker from 'react-native-image-picker'

import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native'

// // Launch Camera:
// ImagePicker.launchCamera(options, (response)  => {
//   // Same code as in above section!
// })

// Open Image Library:
// ImagePicker.launchImageLibrary(options, (response)  => {
//   // Same code as in above section!
// })

var options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

/**
 * The first arg is the options object for customization (it can also be null or omitted for default options),
 * The second arg is the callback which sends object: response (more info below in README)
 */
// ImagePicker.showImagePicker(options, (response) => {
//   console.log('Response = ', response)
//
//   if (response.didCancel) {
//     console.log('User cancelled image picker')
//   }
//   else if (response.error) {
//     console.log('ImagePicker Error: ', response.error)
//   }
//   else if (response.customButton) {
//     console.log('User tapped custom button: ', response.customButton)
//   }
//   else {
//     let source = { uri: response.uri }
//
//     // You can also display the image using data:
//     // let source = { uri: 'data:image/jpegbase64,' + response.data }
//
//     this.setState({
//       avatarSource: source
//     })
//   }
// })

const baseUrl = "http://192.168.100.11:3000/"
const uploadUrl = baseUrl + 'upload'

type Props = {}
export default class App extends Component<Props> {

  state = {
    avatarSource: null
  }

  onMessage = (data) => {
    // console.log(data)
    ImagePicker.launchImageLibrary(options, response => {
      console.log(response)

      var { uri, fileName } = response

      // let source = { uri: 'data:image/jpegbase64,' + response.data }
      this.setState({
        avatarSource: { uri }
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
        console.log(res)
        this.refs.webview.postMessage(fileName)
      })

    })
  }

  render() {
    return (
      <View style={styles.container}>
        <Image source={this.state.avatarSource} style={styles.uploadAvatar} />
        <WebView
          // source={{uri: 'https://webview-upload-server.herokuapp.com/'}}
          source={{uri: 'http://192.168.100.11:3000/'}}
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
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  uploadAvatar: {
    width: 300,
    height: 300,
  }
})
