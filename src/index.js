import React, { Component } from "react";
import {
  StyleSheet,
  ScrollView,
  View,
  Text,
  Image,
  Button
} from "react-native";
import ImagePicker from "react-native-image-picker";
import RNFetchBlob from "rn-fetch-blob";

class ImageUpload extends Component {
  state = {
    pickedImage: null,
    copied: false,
    destination: null,
    imageData: null
  };

  pickImageHandler = () => {
    const dirs = RNFetchBlob.fs.dirs;
    ImagePicker.showImagePicker(
      { title: "Pick an Image", maxWidth: 800, maxHeight: 600 },
      response => {
        let sourcepath = response.uri;
        let destinationPath = dirs.DocumentDir + "/uploadedImages" + "/";
        this.setState({ pickedImage: { uri: sourcepath } });
        RNFetchBlob.fs.cp(sourcepath, destinationPath).then(() => {
          this.setState({ copied: true, destination: destinationPath });
        });
      }
    );
  };

  uploadHandler = () => {
    RNFetchBlob.fs.exists(this.state.destination).then(exists => {
      if (exists) {
        RNFetchBlob.fs.readFile(this.state.destination, "base64").then(data => {
          this.setState({ imageData: data }, () => {
            RNFetchBlob.fs.unlink(this.state.destination).then(() => {});
          });
        });
      }
    });
  };

  render() {
    return (
      <View style={styles.container}>
        <ScrollView>
          <Text style={styles.textStyle}>Pick Image</Text>
          <View style={styles.placeholder}>
            <Image
              source={this.state.pickedImage}
              style={styles.previewImage}
            />
          </View>

          <View style={styles.button}>
            <Button title="Pick Image" onPress={this.pickImageHandler} />

            <Button title="Upload" onPress={this.uploadHandler} />
          </View>

          {this.state.imageData !== null && (
            <View style={styles.placeholder}>
              <Image
                source={{
                  uri: "data:image/png;base64," + this.state.imageData
                }}
                style={styles.previewImage}
              />
            </View>
          )}
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    alignItems: "center"
  },
  textStyle: {
    fontWeight: "bold",
    fontSize: 30,
    textAlign: "center",
    color: "red",
    marginTop: 10
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    width: "70%",
    height: 280,
    marginTop: 50
  },
  button: {
    width: "80%",
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-around"
  },
  previewImage: {
    width: "100%",
    height: "100%"
  }
});

export default ImageUpload;
