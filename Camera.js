import React, { Component } from 'react';
import { StyleSheet, Text, TouchableOpacity } from 'react-native';
import { RNCamera } from 'react-native-camera'

const styles = StyleSheet.create({
    CameraStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20
    },
    button: {
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 40,
        height: 80,
        width: 80
    }
})

export default class Camera extends Component {

    CapturePreview = async () => {
        this.camera.pausePreview()
        const data = await this.camera.takePictureAsync({ base64: true })

        const clarifai = require('clarifai')
        const app = new clarifai.App({ apiKey: 'd2b1a8b9513b4b7090f552cb0321dffc' })
        const results = await app.models.predict(clarifai.GENERAL_MODEL, { base64: data.base64 })
        console.log(results)
        const isHotDog = results.outputs[0].data.concepts[0].RNCamera
    }

    render() {
        return (
            <RNCamera
                style={styles.CameraStyle}
                ref={ref => { this.camera = ref }}
            >
                <TouchableOpacity onPress={() => { this.CapturePreview() }} style={styles.button}>
                    <Text stye={{textAlign: 'center'}}>Scan</Text>                    
                </TouchableOpacity>
            </RNCamera>
        )
    }
}