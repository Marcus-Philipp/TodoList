// Imports
import React, { useState } from 'react';
import { MaterialIcons } from '@expo/vector-icons';
import { StyleSheet, Text, View, TextInput, ScrollView, Image, TouchableOpacity } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import LinearGradient from 'react-native-linear-gradient';

// App Hauptkomponente
export default function App() {
  const [task, setTask] = useState('');
  const [taskList, setTaskList] = useState([]);

  // Funktion zum hinzufuegen einer Aufgabe
  const addTask = () => {
    if (task.trim().length === 0) {
      return;
    }
    const newTaskList = [...taskList, { task: task, completed: false }]
    setTaskList(newTaskList);
    setTask('');
    storeData(newTaskList);
  };

  // Funktion zum entfernen einer Aufgabe
  const removeTask = (index) => {
    const newList = [...taskList];
    newList.splice(index, 1);
    setTaskList(newList);
    storeData(newList)
  };

  // Funktion wenn Aufgabe erledigt ist(durchgestrichen)
  const toggleTaskCompleted = (index) => {
    const newList = [...taskList];
    newList[index].completed = !newList[index].completed;
    setTaskList(newList);
    storeData(newList);
  };

  // Funktion zum Speichern der Aufgabenliste im AsyncStorage
  const storeData = async (value) => {
    try {
      const jsonValue = JSON.stringify(value);
      await AsyncStorage.setItem('@saveList', jsonValue);
    } catch (e) {
      console.error(e);
    }
  };

  // Funktion zum Laden der Aufgabenliste im AsyncStorage
  const loadData = async () => {
    try {
      const jsonValue = await AsyncStorage.getItem('@saveList');
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error(e);
      return [];
    }
  };

  // Laden der Daten beim ersten Rendern
  React.useEffect(() => {
    loadData().then(setTaskList);
  }, []);

  // UI der App
  return (
    <View style={styles.container}>
      <Image
        source={require('./Todo.jpg')}
        style={styles.image} />
      <TextInput
        style={styles.input}
        placeholder='Neue Aufgabe hinzufuegen'
        onChangeText={setTask}
        value={task} />
      <TouchableOpacity style={styles.button} onPress={addTask}>
        <Text style={styles.buttonText}>Hinzufuegen</Text>
      </TouchableOpacity>
      <ScrollView>
        {taskList.length === 0 ? (
          <Text style={styles.taskText}>Keine Aufgaben. Fuegen Sie Ihre erste Aufgabe hinzu! </Text>
        ) : (
          taskList.map((taskItem, index) => (
            <View key={index} style={styles.task}>
              <Text
                style={[styles.resultTaskText, taskItem.completed ? styles.completedTask : styles.uncompletedTask]}
                onPress={() => toggleTaskCompleted(index)}>
                {index + 1}. {taskItem.task.toUpperCase()}
              </Text>
              <MaterialIcons name='delete' size={24} color='black' onPress={() => removeTask(index)} />
            </View>
          ))
        )}
      </ScrollView>
    </View>
  );
}

// Styles der Komponenten
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 10,
    marginBottom: 10,
  },
  input: {
    borderColor: '#0F4C5C',
    borderWidth: 2,
    height: 40,
    width: '100%',
    marginBottom: 20,
    paddingLeft: 10,
    fontWeight: 'bold',
    color: '#38040E',
  },
  button: {
    backgroundColor: '#0F4C5C',
    borderWidth: 2,
    padding: 15,
    borderRadius: 3,
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  task: {
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 20,
    padding: 10,
  },
  completedTask: {
    textDecorationLine: 'line-through',
  },
  uncompletedTask: {
    textDecorationLine: 'none',
  },
  taskText: {
    marginTop: 20,
    color: '#38040E',
    fontStyle: 'italic',
  },
  resultTaskText: {
    color: '#101419',
    fontSize: 24,
    marginRight: 10,
    fontWeight: 'bold'
  }
});

