import React, { Component } from 'react'
import { StyleSheet, View, Text } from 'react-native'
import WebViewWrapper from './WebViewWrapper'

type Props = {}
export default class App extends Component<Props> {

  state = {
    status: "",
  }

  setStatus = status => this.setState({ status })

  render() {
    const { status } = this.state
    return (
      <View style={styles.container}>
        <Text
          testID="upload_status"
          style={styles.status}>{status}</Text>
        <WebViewWrapper
          testID="webview_wrapper"
          onUploading={()=>this.setStatus("File uploading...")}
          onUploaded={()=>this.setStatus("File uploaded")}
          onLoadEnd={()=>this.setStatus("Upload file")}
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
  status: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
})
