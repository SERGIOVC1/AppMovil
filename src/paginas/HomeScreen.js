import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, ActivityIndicator, TouchableOpacity, FlatList } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { auth } from '../../firebase-config';

export function HomeScreen() {
  const [publicaciones, setPublicaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userNicknames, setUserNicknames] = useState({});
  const userId = auth.currentUser.uid;

  const fetchUserNicknames = async (userIds) => {
    try {
      const response = await fetch('http://192.168.0.20:8081/proyecto01/users/name');
      const usersData = await response.json();

      const userNicknameMap = {};
      usersData.forEach(user => {
        if (userIds.includes(user.user_id)) {
          userNicknameMap[user.user_id] = user.nick;
        }
      });

      setUserNicknames(userNicknameMap);
    } catch (error) {
      console.error('Error al obtener los nicknames de los usuarios:', error);
    }
  };

  const fetchPublicaciones = async () => {
    try {
      const url = 'http://192.168.0.20:8081/proyecto01/publicaciones';
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Error al obtener publicaciones');
      }

      const data = await response.json();

      const publicacionesConLikes = data.map(pub => ({
        ...pub,
        likes: pub.like ? pub.like.length : 0,
      }));

      setPublicaciones(publicacionesConLikes);

      const userIds = [...new Set(data.map((pub) => pub.user_id))];
      fetchUserNicknames(userIds);
    } catch (error) {
      console.error('Error al obtener publicaciones:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (id) => {
    try {
      const pubIndex = publicaciones.findIndex(pub => pub.id === id);
      const updatedPublicaciones = [...publicaciones];

      const currentLikes = updatedPublicaciones[pubIndex].like || [];
      if (currentLikes.includes(userId)) {
        updatedPublicaciones[pubIndex].like = currentLikes.filter(user => user !== userId);
      } else {
        updatedPublicaciones[pubIndex].like = [...currentLikes, userId];
      }

      updatedPublicaciones[pubIndex].likes = updatedPublicaciones[pubIndex].like.length;

      setPublicaciones(updatedPublicaciones);

      const url = 'http://192.168.0.20:8081/proyecto01/publicaciones/put/${id}/${userId}';
      const response = await fetch(url, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          like: updatedPublicaciones[pubIndex].like,
        }),
      });

      if (!response.ok) {
        throw new Error('Error al actualizar el like');
      }
    } catch (error) {
      console.error('Error al actualizar el like:', error);
    }
  };

  useEffect(() => {
    fetchPublicaciones();

    const intervalId = setInterval(fetchPublicaciones, 30000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <View style={styles.container}>
      {/* Logo and Name Section */}
      <View style={styles.header}>
        <Image
          source={require('../img/vedrunaLogo.png')}
          style={styles.logo}
        />
        <Text style={styles.logoText}>VEDRUNA</Text>
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#ffffff" />
      ) : (
        <FlatList
          contentContainerStyle={styles.imageContainer}
          data={publicaciones}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => {
            const currentLikes = item.like || [];
            return (
              <View style={styles.card}>
                <View style={styles.imageContainerWithText}>
                  <View style={styles.userContainer}>
                    <View style={styles.userImageContainer}>
                        <Image
                            source={require('../img/avatar.png')}
                            style={{ width: 60, height: 60 }}>
                        </Image>
                    </View>
                    <View style={styles.userNameText}>
                      <Text style={styles.userText}>Publicado por</Text>
                      <Text style={styles.nickname}>{userNicknames[item.user_id] || 'Cargando...'}</Text>
                    </View>
                  </View>
                  {item.image_url && (
                    <Image
                      source={{ uri: item.image_url }}
                      style={styles.image}
                      onError={(e) => console.log('Error al cargar la imagen:', e.nativeEvent.error)}
                    />
                  )}
                </View>
                <View style={styles.likeContainer}>
                  <TouchableOpacity onPress={() => handleLike(item.id)}>
                    <Icon
                      name={currentLikes.includes(userId) ? 'heart' : 'heart-o'}
                      size={25}
                      color={
                        currentLikes.includes(userId)
                          ? item.user_id === userId
                            ? '#b3ff00'
                            : '#ffffff'
                          : '#ffffff'
                      }
                    />
                  </TouchableOpacity>
                  <Text style={styles.likeCount}>{item.likes || 0} Me gusta</Text>
                </View>
                <Text style={styles.title}>{item.titulo}</Text>
                <Text style={styles.description}>{item.comentario}</Text>
              </View>
            );
          }}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#23272A',
    paddingTop: 50,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 71,
    height: 71,
  },
  logoText: {
    fontSize: 55,
    color: '#ffffff',
    fontWeight: 'bold',
    marginLeft: 10,
  },
  text: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  imageContainer: {
    alignItems: 'center',
  },
  imageContainerWithText: {
    position: 'relative',
    width: '100%',
    alignItems: 'center',
  },
  userContainer: {
    flexDirection: 'row',
    position: 'absolute',
    top: 10,
    left: 20,
    zIndex: 1,
  },
  userNameText: {
    padding: 5,
    borderRadius: 5,
  },
  image: {
    width: 400,
    height: 200,
  },
  card: {
    marginBottom: 15,
    alignItems: 'center',
  },
  userText: {
    color: '#ffffff',
    fontSize: 15,
    marginBottom: 2,
    marginLeft: 10,
  },
  nickname: {
    fontWeight: 'bold',
    color: '#ffffff',
    fontSize: 20,
    marginLeft: 10,
  },
  title: {
    color: '#9FC63B',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  description: {
    color: '#cccccc',
    fontSize: 18,
    alignSelf: 'flex-start',
    marginLeft: 20,
  },
  likeContainer: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    alignItems: 'center',
    marginTop: 10,
    marginLeft: 20,
  },
  likeCount: {
    color: '#ffffff',
    marginLeft: 10,
    fontSize: 13,
  },
});