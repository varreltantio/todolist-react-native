import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, FlatList, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';


export default function App() {
  const [todo, setTodo] = useState('');
  const [todoList, setTodoList] = useState([]);

  useEffect(() => {
    loadTodos();
  }, []);

  useEffect(() => {
    saveTodos();
  }, [todoList]);

  const saveTodos = async () => {
    try {
      await AsyncStorage.setItem('todos', JSON.stringify(todoList));
    } catch (error) {
      console.error('Gagal menyimpan:', error);
    }
  };

  const loadTodos = async () => {
    try {
      const storedTodos = await AsyncStorage.getItem('todos');
      if (storedTodos) {
        setTodoList(JSON.parse(storedTodos));
      }
    } catch (error) {
      console.error('Gagal memuat data:', error);
    }
  };

  const addTodo = () => {
    if (todo.trim() === '') {
      Alert.alert('Peringatan', 'Tugas tidak boleh kosong');
      return;
    }

    const newTodo = {
      id: Date.now().toString(),
      text: todo,
      completed: false,
      createdAt: new Date().toLocaleString(),
    };

    setTodoList([...todoList, newTodo]);
    setTodo('');
  };

  const toggleComplete = (id) => {
    setTodoList(
      todoList.map((item) =>
        item.id === id ? { ...item, completed: !item.completed } : item
      )
    );
  };

  const deleteTodo = (id) => {
    setTodoList(todoList.filter((item) => item.id !== id));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>📝 To-Do List</Text>

      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Tambah tugas..."
          value={todo}
          onChangeText={setTodo}
          style={styles.input}
        />
        <TouchableOpacity style={styles.button} onPress={addTodo}>
          <Text style={styles.buttonText}>Tambah</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={todoList}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.todoItem}>
            <View style={styles.todoTextContainer}>
              <TouchableOpacity onPress={() => toggleComplete(item.id)} style={styles.checkboxContainer}>
                <View style={[styles.checkbox, item.completed && styles.checkboxChecked]} />
              </TouchableOpacity>
              <View>
                <Text
                  style={[
                    styles.todoText,
                    { textDecorationLine: item.completed ? 'line-through' : 'none' },
                  ]}
                >
                  {item.text}
                </Text>
                <Text style={styles.dateText}>{item.createdAt}</Text>
              </View>
            </View>
            <TouchableOpacity onPress={() => deleteTodo(item.id)}>
              <Text style={styles.deleteText}>Hapus</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    paddingTop: 60,
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#aaa',
    padding: 10,
    borderRadius: 8,
  },
  button: {
    marginLeft: 8,
    backgroundColor: '#007AFF',
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  buttonText: {
    color: '#fff',
  },
  todoItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#f4f4f4',
    padding: 12,
    marginVertical: 4,
    borderRadius: 8,
    alignItems: 'center',
  },
  todoTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  todoText: {
    fontSize: 16,
    marginLeft: 8,
  },
  deleteText: {
    color: 'red',
  },
  dateText: {
    fontSize: 12,
    color: '#555',
    marginLeft: 8,
  },
  checkboxContainer: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#aaa',
    borderRadius: 4,
    marginRight: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  checkbox: {
    width: 16,
    height: 16,
  },
  checkboxChecked: {
    backgroundColor: '#007AFF',
  },  
});
