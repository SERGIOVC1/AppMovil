import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Image, Alert, ScrollView } from "react-native";
import * as ImagePicker from "expo-image-picker";
import { auth } from '../../firebase-config'; // Asegúrate de importar tu módulo de autenticación

const SERVER_URL = "http://192.168.0.20:8081/proyecto01/publicaciones"; // Cambia esto a tu URL del servidor

export function AddScreen({ navigation }) {
  const [photo, setPhoto] = useState(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const cloudName = "db7udlpcn";
  const uploadPreset = "unsigned_uploads";

  const openImagePicker = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la galería.");
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 1, // Eliminar allowsEditing
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const openCamera = async () => {
    const { status } = await ImagePicker.requestCameraPermissionsAsync();
    if (status !== "granted") {
      Alert.alert("Permiso denegado", "Se necesita permiso para acceder a la cámara.");
      return;
    }

    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      aspect: [4, 3],
      quality: 1, // Eliminar allowsEditing
    });

    if (!result.canceled) {
      setPhoto(result.assets[0].uri);
    }
  };

  const uploadToCloudinary = async (imageUri) => {
    const data = new FormData();
    data.append("file", {
      uri: imageUri,
      type: "image/jpeg",
      name: "upload.jpg",
    });
    data.append("upload_preset", uploadPreset);

    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: "POST",
        body: data,
      });

      const result = await response.json();
      if (result.secure_url) {
        return result.secure_url;
      } else {
        console.error("Error en la subida:", result);
        throw new Error("No se pudo subir la imagen");
      }
    } catch (error) {
      console.error("Error al subir la imagen:", error);
      throw error;
    }
  };

  const savePost = async (imageUrl, titulo, comentario) => {
    const userName = auth.currentUser?.displayName || 'Usuario Anónimo'; 

    try {
      const response = await fetch(SERVER_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: auth.currentUser?.uid,
          image_url: imageUrl,
          titulo,
          comentario,
          like: [],
          user: userName,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error del servidor: ${errorText}`);
      }

      Alert.alert("Guardado", "Tu publicación ha sido guardada con éxito.");
    } catch (error) {
      console.error('Error en savePost:', error);
      Alert.alert('Error', 'No se pudo guardar la publicación');
    }
  };

  const handleSave = async () => {
    if (!photo) {
      Alert.alert("Error", "Por favor, toma una foto o selecciona una de la galería primero.");
      return;
    }

    if (!title.trim() || !description.trim()) {
      Alert.alert("Error", "Por favor, ingresa un título y una descripción.");
      return;
    }

    try {
      const imageUrl = await uploadToCloudinary(photo);
      await savePost(imageUrl, title, description);

      // Reiniciar campos
      setPhoto(null);
      setTitle("");
      setDescription("");
    } catch (error) {
      Alert.alert("Error", "No se pudo guardar la imagen. Intenta de nuevo.");
    }
  };

  return (
    <ScrollView 
      contentContainerStyle={styles.scrollContainer} // Usar contentContainerStyle aquí
    >
      <Text style={styles.title}>Publicación</Text>
      <TouchableOpacity
        style={[styles.photoContainer, { borderColor: "#84bd00", borderWidth: 3 }]}
        onPress={() => {
          Alert.alert(
            "Seleccionar opción",
            "¿Quieres tomar una foto o seleccionar una de la galería?",
            [
              { text: "Tomar foto", onPress: openCamera },
              { text: "Seleccionar de la galería", onPress: openImagePicker },
              { text: "Cancelar", style: "cancel" },
            ]
          );
        }}
      >
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} />
        ) : (
          <Image source={require("../img/Contacts.png")} style={styles.logo} />
        )}
      </TouchableOpacity>
      <View style={styles.inputContainer}>
        <Text style={styles.tituloInput}>Título:</Text>
        <TextInput
          style={styles.input}
          placeholder="Máx. 40 caracteres"
          maxLength={40}
          value={title}
          onChangeText={setTitle}
        />
      </View>
      <View style={styles.inputContainer}>
        <Text style={styles.tituloInput}>Descripción:</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Máx. 250 caracteres"
          maxLength={250}
          value={description}
          onChangeText={setDescription}
        />
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>PUBLICAR</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContainer: {
    flexGrow: 1, // Asegúrate de que el contenedor interno crezca
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#121212",
  },
  title: {
    fontSize: 39,
    fontWeight: "bold",
    color: "#9FC63B",
    marginBottom: 15,
    marginTop: 30,
  },
  photoContainer: {
    width: 200,
    height: 200,
    backgroundColor: "#f0f0f0",
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  photo: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  logo: {
    width: 100,
    height: 100,
  },
  inputContainer: {
    width: "100%",
    marginVertical: 10,
  },
  tituloInput: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
    color: "#9FC63B",
  },
  input: {
    width: "100%",
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#868686",
    fontSize: 15,
  },
  descriptionInput: {
    width: "100%",
    height: 180,
    padding: 10,
    borderWidth: 0,
    borderRadius: 10,
    backgroundColor: "#868686",
    textAlignVertical: "top",
    fontSize: 15,
  },
  button: {
    width: "50%",
    padding: 10,
    backgroundColor: "#121212",
    borderRadius: 8,
    alignItems: "center",
    marginTop: 25,
    borderWidth: 3,
    borderColor: "#84bd00",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
  },
});

export default AddScreen;
