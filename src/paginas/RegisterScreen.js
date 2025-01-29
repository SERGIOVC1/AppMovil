import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image, ScrollView, Alert } from 'react-native';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase-config';

export function RegisterScreen({ navigation }) {
  const [form, setForm] = React.useState({
    nick: '',
    name: '',
    lastName1: '',
    lastName2: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const auth = getAuth(app);

  const handleInputChange = (field, value) => {
    setForm({ ...form, [field]: value });
  };

  const handleCreateAccount = async () => {
    const { email, password, confirmPassword, nick, name, lastName1, lastName2 } = form;

    if (!email || !password || !nick || !name || !lastName1 || !lastName2 || !confirmPassword) {
      Alert.alert('Error', 'Todos los campos son obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden.');
      return;
    }

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const userId = userCredential.user.uid;

      const usuarioData = {
        nick,
        user_id: userId,
        nombre: name,
        apellidos: `${lastName1} ${lastName2}`,
      };

      const response = await fetch('http://192.168.0.20:8080/proyecto01/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(usuarioData),
      });

      if (response.ok) {
        Alert.alert('Registro exitoso', 'Usuario creado correctamente');
        navigation.navigate('Login');
      } else {
        const errorData = await response.json();
        Alert.alert('Error', errorData.message || 'Error al registrar el usuario');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', error.message || 'Error al registrar el usuario');
    }
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        <View style={styles.imagePlaceholder}>
          <Image
            source={require('../img/formulario 1.png')}
            style={styles.image}
          />
        </View>

        <Text style={styles.title}>Completar los siguientes campos:</Text>

        <TextInput
          onChangeText={(value) => handleInputChange('email', value)}
          style={styles.input}
          placeholder="Introduzca su correo"
          placeholderTextColor="#ccc"
          keyboardType="email-address"
          autoCapitalize="none"
          value={form.email}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('password', value)}
          style={styles.input}
          placeholder="Introduzca su contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={form.password}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('confirmPassword', value)}
          style={styles.input}
          placeholder="Repita su contraseña"
          placeholderTextColor="#ccc"
          secureTextEntry={true}
          value={form.confirmPassword}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('nick', value)}
          style={styles.input}
          placeholder="Introduzca su nick"
          placeholderTextColor="#ccc"
          value={form.nick}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('name', value)}
          style={styles.input}
          placeholder="Introduzca su nombre"
          placeholderTextColor="#ccc"
          value={form.name}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('lastName1', value)}
          style={styles.input}
          placeholder="Introduzca su primer apellido"
          placeholderTextColor="#ccc"
          value={form.lastName1}
        />
        <TextInput
          onChangeText={(value) => handleInputChange('lastName2', value)}
          style={styles.input}
          placeholder="Introduzca su segundo apellido"
          placeholderTextColor="#ccc"
          value={form.lastName2}
        />

        <TouchableOpacity
          style={styles.button}
          onPress={handleCreateAccount}
        >
          <Text style={styles.buttonText}>FINALIZAR</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'flex-start',
    padding: 20,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'flex-start',
  },
  imagePlaceholder: {
    height: 400,
    width: '100%',
    marginBottom: 20,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  image: {
    width: 350,
    height: 350,
    resizeMode: 'contain',
  },
  title: {
    color: '#a1e45a',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'left',
    width: '100%',
  },
  input: {
    color: '#fff',
    width: '100%',
    padding: 15,
    marginBottom: 20,
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#555',
  },
  button: {
    backgroundColor: 'transparent',
    paddingVertical: 8,
    paddingHorizontal: 30,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#a1e45a',
    marginTop: 20,
    alignSelf: 'center',
  },
  buttonText: {
    color: '#DFDFDF',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
