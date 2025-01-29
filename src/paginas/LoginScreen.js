// LoginScreen.js
import React from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app } from '../../firebase-config';

export function LoginScreen({ navigation }) {
  
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const auth = getAuth(app);

  const handleSingIn = () => {
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log('Sesión iniciada');
        navigation.navigate('TabNavegation');
      })
      .catch((error) => {
        console.log('Error al iniciar sesión:', error);
      });
  };

  return (
    <View style={styles.container}>
      {/* Sección del Logo */}
      <View style={styles.logoSection}>
        <Image
          source={require('../img/logoVedruna.png')}
          style={styles.logo}
        />
      </View>

      {/* Sección del Título */}
      <View style={styles.titleSection}>
        <Text style={styles.title}>VEDRUNA</Text>
        <Text style={styles.title}>EDUCACIÓN</Text>
      </View>

      {/* Sección del Formulario */}
      <View style={styles.formSection}>
        <TextInput
          onChangeText={(text) => setEmail(text)}         
          style={styles.input}
          placeholder="Introduzca su correo..."
          placeholderTextColor="#868686"
        />
        <TextInput
          onChangeText={(text) => setPassword(text)}
          style={styles.input}
          placeholder="Introduzca su contraseña..."
          placeholderTextColor="#868686"
          secureTextEntry
        />
        <Text style={styles.forgotPassword}>¿Olvidaste la contraseña?</Text>
      </View>

      {/* Sección de los Botones */}
      <View style={styles.buttonSection}>
        <TouchableOpacity style={styles.loginButton} onPress={handleSingIn}>
          <Text style={styles.loginButtonText}>Log in</Text>
        </TouchableOpacity>
      </View>

      {/* Sección del Footer */}
      <View style={styles.footer}>
        <View style={styles.line}></View>
        <View style={styles.createAccountContainer}>
          <Text style={styles.createAccount}>¿No tienes cuenta? </Text>
          <TouchableOpacity onPress={() => navigation.navigate('Register')}>
            <Text style={styles.createAccountLink}>Crear cuenta</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#23272A',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 10,
    paddingBottom: 20,
  },
  logoSection: {
    marginTop: 0,
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 200,
    resizeMode: 'contain',
  },
  titleSection: {
    marginBottom: 40,
    alignItems: 'center',
  },
  title: {
    color: '#DFDFDF',
    fontSize: 40,
    fontWeight: 'bold',
  },
  formSection: {
    width: '80%',
    marginBottom: 0,
  },
  input: {
    backgroundColor: '#323639',
    color: '#DFDFDF',
    borderRadius: 10,
    padding: 10,
    marginBottom: 15,
    fontSize: 16,
  },
  forgotPassword: {
    color: '#9FC63B',
    fontSize: 14,
    textAlign: 'right',
    marginBottom: 20,
  },
  buttonSection: {
    width: '80%',
    alignItems: 'center',
    marginBottom: 30,
  },
  loginButton: {
    backgroundColor: '#9FC63B',
    borderRadius: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    alignItems: 'center',
    width: '100%',
  },
  loginButtonText: {
    color: '#23272A',
    fontSize: 16,
    fontWeight: 'bold',
  },
  footer: {
    width: '100%',
    alignItems: 'center',
    paddingBottom: 20,
    paddingHorizontal: 20,
  },
  line: {
    width: '100%',
    height: 1,
    backgroundColor: '#323639',
    marginBottom: 5,
  },
  createAccountContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  createAccount: {
    color: '#DFDFDF',
    fontSize: 14,
  },
  createAccountLink: {
    color: '#9FC63B',
    fontSize: 14,
  },
});
