import React, { Component } from 'react';
import {
     Alert, StyleSheet, Text, TouchableOpacity, ActivityIndicator, Dimensions
    } from 'react-native';
import { RNCamera } from 'react-native-camera'

export default class Camera extends Component {

    state = {
        showWaiting: true
    }

    componentDidMount() {
        this.setState({showWaiting: false})
    }

   

    CapturePreview = async () => {
        this.setState({ showWaiting: true})
        const camara = this.camera
        camara.pausePreview()                
        const data = await this.camera.takePictureAsync({ base64: true })
        var resultado = "Nada"
        const clarifai = require('clarifai')
        const app = new clarifai.App({ apiKey: 'd2b1a8b9513b4b7090f552cb0321dffc' })
        // const results = await app.models.predict(clarifai.GENERAL_MODEL, { base64: data.base64 })
        const hotDogResults = await app.models.predict('hotdog', { base64: data.base64 })
        this.setState({ showWaiting: false})
        // console.log(results) 
        console.log(hotDogResults)       
        // const isHotDog = results.outputs[0].data.concepts
        const isHotDog1 = hotDogResults.outputs[0].data.concepts[0].value
        // console.log('processed resutls: ', isHotDog)
        console.log('processed hotDogResutls: ', isHotDog1)
        if (isHotDog1 >= 0.8) {
            resultado = "Es un HotDog"
        } else {
            resultado = "No es un resultado"
        }
        Alert.alert('Resultado', resultado, [{
            text: 'Ok', onPress: () => {
                console.log('OK Pressed') 
                camara.resumePreview()
            }
        }])
    }

    render() {
        console.log('inside render and showWaiting is:', this.state.showWaiting)
        return (
            <RNCamera
                style={styles.CameraStyle}
                captureAudio={false}
                ref={ref => { this.camera = ref }}
            >
                <ActivityIndicator style={styles.ActivityIndicatorStyle} size='large' animating={this.state.showWaiting} color="#0000ff" />
                <TouchableOpacity onPress={() => { this.CapturePreview() }} style={styles.button}>
                    <Text style={styles.text}>Scan</Text>                    
                </TouchableOpacity>
            </RNCamera>
        )
    }
}
const h = Dimensions.get('window').height;
const w = Dimensions.get('window').width;
const styles = StyleSheet.create({
    ActivityIndicatorStyle:{
        marginBottom: (h / 2) - (w/3)
    },
    CameraStyle: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        padding: 20
    },
    button: {
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: 12,
        borderRadius: 40,
        height: 80,
        width: 80
    },
    text: {
       fontWeight: 'bold',
       fontSize: 21
    }
})