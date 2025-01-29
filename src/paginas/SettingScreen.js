import react from "react";
import { View, Text, StyleSheet} from "react-native";

export function SettingScreen() {  
    return (
        <View style={styles.container}>
            <Text>Setting</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',        
    },
});