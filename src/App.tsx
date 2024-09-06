import { useState, useEffect } from 'react';
import TaskList from './components/TasksList';
import TaskForm from './components/TasksForm';
import { Task } from './types';

const App = () => {

  const [tasks, setTasks] = useState<Task[]>(() => {
    const savedTasks = localStorage.getItem('tasks');
    return savedTasks ? JSON.parse(savedTasks) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  // const addTask = (task: Task) => {
  //   setTasks((prevTasks) => [...prevTasks, task]);
  // };

  const toggleTaskCompletion = (taskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => task.id === taskId ? { ...task, completed: !task.completed } : task)
    );
  };

  const deleteTask = (taskId: number) => {
    setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
  };

  const updateTask = (taskId: number, title: string, description: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) => task.id === taskId ? { ...task, title, description } : task)
    );
  };

  const addSubtask = (taskId: number, title: string) => {
    const newSubtask = {
      id: Date.now(), // or use a better unique ID generator
      title,
      completed: false,
    };
    setTasks((prevTasks) => 
      prevTasks.map((task) =>
          task.id === taskId ? { ...task, subtasks: [...task.subtasks, newSubtask] } : task)
    );
  };
  
  const deleteSubtask = (taskId: number, subtaskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId
          ? { ...task, subtasks: task.subtasks.filter((subtask) => subtask.id !== subtaskId) } : task 
      )
    )
  };

  const toggleSubtaskCompletion = (taskId: number, subtaskId: number) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? {
          ...task, subtasks: task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, completed: !subtask.completed } : subtask
          ),
        } : task
      )
    )
  };

  const updateSubtask = (taskId: number, subtaskId: number, title: string) => {
    setTasks((prevTasks) =>
      prevTasks.map((task) =>
        task.id === taskId ? {
          ...task, subtasks: task.subtasks.map((subtask) =>
            subtask.id === subtaskId ? { ...subtask, title } : subtask
          ),
        } : task
      )
    );
  };

  return (
    <div className="container mx-auto p-4 mt-10">
      <TaskForm setTasks={setTasks} tasks={tasks} />
      <TaskList
        tasks={tasks}
        addSubtask={addSubtask}
        deleteSubtask={deleteSubtask}
        setTasks={setTasks}
        toggleTaskCompletion={toggleTaskCompletion}
        deleteTask={deleteTask}
        updateTask={updateTask}
        toggleSubtaskCompletion={toggleSubtaskCompletion}
        updateSubtask={updateSubtask}
      />
    </div>
  );
};

export default App;
