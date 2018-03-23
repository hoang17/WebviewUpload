import React, { Component } from 'react'
import {
  StyleSheet, View, WebView, Linking, TouchableOpacity, Modal,
  Button, ScrollView, TouchableHighlight, CameraRoll, Image, Dimensions,
} from 'react-native'

var options = {
  title: 'Select Photo',
  storageOptions: {
    skipBackup: true,
    path: 'images'
  }
}

const { width } = Dimensions.get('window')

const baseUrl = "https://webview-upload-server.herokuapp.com/"
const uploadUrl = baseUrl + 'upload'

type Props = {}
export default class WebViewWrapper extends Component<Props> {

  state = {
    uri: baseUrl,
    fileName: null,
    modalVisible: false,
    photos: [],
  }

  uploadFile(file){
    this.toggleModal()

    console.log(file)

    var { uri, filename } = file

    // let source = { uri: 'data:image/jpegbase64,' + response.data }
    this.setState({
      fileName: filename,
    })

    this.props.onUploading()

    var fieldName = 'sampleFile'

    const body = new FormData()
    body.append(fieldName, {
      uri: uri,
      type: 'image/jpeg',
      name: filename,
    })
    fetch(uploadUrl, {
      method: 'post',
      body: body
    }).then(res => {
      console.log(res)
      this.props.onUploaded()
      this.refs.webview.postMessage(filename)
    })
  }

  getPhotos = () => {
    CameraRoll.getPhotos({
      first: 20,
      assetType: 'Photos'
    })
    .then(r => this.setState({ photos: r.edges }))
  }

  toggleModal = () => {
    this.setState({ modalVisible: !this.state.modalVisible });
  }


  onMessage = event => {
    // console.log(event.nativeEvent.data)
    if (event.nativeEvent.data == 'upload_file'){
      this.toggleModal()
      this.getPhotos()
    } else {
      Linking.openURL(baseUrl + this.state.fileName)
    }
  }

  render() {
    const { uri, photos, modalVisible } = this.state
    return (
      <View style={styles.container}>
        <TouchableOpacity
          testID="upload_file"
          style={styles.webview}
          onPress={()=> { console.log('touched')}}>
          <WebView
            source={{ uri }}
            style={styles.webview}
            ref="webview"
            onMessage={this.onMessage}
            {...this.props}
          />
        </TouchableOpacity>
        <Modal
          animationType={"slide"}
          transparent={false}
          visible={modalVisible}
          onRequestClose={() => console.log('closed')}
        >
          <View style={styles.modalContainer} testID="photos">
            <Button title='Close' onPress={this.toggleModal}/>
            <ScrollView contentContainerStyle={styles.scrollView}>
              {
                photos.map((p, i) => (
                  <TouchableHighlight
                    key={i}
                    underlayColor='transparent'
                    onPress={() => this.uploadFile(photos[i].node.image)}
                  >
                    <Image
                      style={{
                        width: width/3,
                        height: width/3
                      }}
                      source={{uri: p.node.image.uri}}
                    />
                  </TouchableHighlight>
                ))
              }
            </ScrollView>
          </View>
        </Modal>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  webview: {
    flex: 1
  },
  uploadPhoto: {
    width: 300,
    height: 300,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'stretch',
  },
  modalContainer: {
    paddingTop: 20,
    flex: 1
  },
  scrollView: {
    flexWrap: 'wrap',
    flexDirection: 'row'
  },
})
