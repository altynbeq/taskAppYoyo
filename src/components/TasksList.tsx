import { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Task } from '../types';
import SubtaskList from './subComponents/Subtasks';
import FilterBtns from './subComponents/FilterBtns';

interface TaskListProps {
  tasks: Task[];
  toggleTaskCompletion: (taskId: number) => void;
  deleteTask: (taskId: number) => void;
  updateTask: (taskId: number, title: string, description: string) => void;
  toggleSubtaskCompletion: (taskId: number, subtaskId: number) => void;
  updateSubtask: (taskId: number, subtaskId: number, title: string) => void;
  deleteSubtask: (taskId: number, subtaskId: number) => void;
  addSubtask: (taskId: number, subtaskId: number, title: string)=> void;
}


const TaskList = ({ tasks, deleteSubtask, addSubtask, toggleTaskCompletion, deleteTask, updateTask, toggleSubtaskCompletion, updateSubtask }: TaskListProps) => {
    const [editingTaskId, setEditingTaskId] = useState<number | null>(null);
    const [editingSubtaskId, setEditingSubtaskId] = useState<number | null>(null);
    const [currentTaskId, setCurrentTaskId] = useState<number | null>(null);
    const [filter, setFilter] = useState<'all' | 'completed' | 'incomplete'>('all');


    const { handleSubmit, control, reset, setValue, formState: { errors } } = useForm();

    const filteredTasks = tasks.filter(task => {
        if (filter === 'completed') return task.completed;
        if (filter === 'incomplete') return !task.completed;
        return true; 
    });

    const startEditing = (task: Task) => {
        setEditingTaskId(task.id);
        setValue('title', task.title);
        setValue('description', task.description || '');
    };

    const saveEdit = (data: any) => {
        if (data.title.trim() === '') {
        alert('Title required!!!');
        return;
        }
        updateTask(editingTaskId!, data.title, data.description);
        setEditingTaskId(null);
        reset();
    };

    const startEditingSubtask = (taskId: number, subtaskId: number, title: string) => {
        setEditingSubtaskId(subtaskId);
        setCurrentTaskId(taskId);
        setValue('subtaskTitle', title);
    };
  

    const saveSubtaskEdit = (data: any) => {
        if (data.subtaskTitle.trim() === '') {
            alert('Subtask title required!!!');
            return;
        }
        updateSubtask(currentTaskId!, editingSubtaskId!, data.subtaskTitle);
        setEditingSubtaskId(null);
        reset();
    };

    const cancelEdit = () => {
        setEditingSubtaskId(null);
        reset();
    };
    const deleteSubtaskNow = (taskId, subtaskId) => {
        deleteSubtask(taskId, subtaskId);
    }

    return (
        <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4">Task List</h2>
        <FilterBtns setFilter={setFilter} filter={filter} />

        {filteredTasks.length === 0 && <p className="text-gray-500">No tasks available. Add some tasks!</p>}
        {filteredTasks.map((task) => (
            <div key={task.id} className="bg-white border border-gray-200 rounded-lg shadow p-4 mb-4">
            {editingTaskId === task.id ? (
                <form onSubmit={handleSubmit(saveEdit)}>
                    <div className="mb-2">
                        <Controller name="title" control={control} rules={{ required: 'Title is required' }}
                            render={({ field }) => (
                                <input {...field} className="border border-gray-300 p-2 rounded-md w-full mb-2" placeholder="Task title" />
                            )}
                        />
                        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                        <Controller name="description" control={control}
                        render={({ field }) => (
                            <textarea {...field} className="border border-gray-300 p-2 rounded-md w-full" placeholder="Task description (optional)" />
                        )}
                        />
                    </div>
                    <div className="mt-2 flex justify-between">
                        <button type="submit" className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition-colors">
                            Save
                        </button>
                        <button type="button" onClick={() => setEditingTaskId(null)} className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-gray-600 transition-colors">
                            Cancel
                        </button>
                    </div>
                </form>
            ) : (
                <div className="mb-2">
                    <div className="flex items-center mb-2">
                        <input type="checkbox" checked={task.completed} onChange={() => toggleTaskCompletion(task.id)} className="mr-2 h-4 w-4" />
                        <strong className={`text-lg ${task.completed ? 'line-through text-gray-500' : ''}`}>
                            {task.title}
                        </strong>
                    </div>
                    {task.description && <p className="text-gray-600">{task.description}</p>}
                </div>
            )}

            <SubtaskList
                subtasks={task.subtasks}
                editingSubtaskId={editingSubtaskId}
                toggleSubtaskCompletion={(subtaskId) => toggleSubtaskCompletion(task.id, subtaskId)}
                startEditingSubtask={(subtaskId, title) => startEditingSubtask(task.id, subtaskId, title)}
                saveSubtaskEdit={saveSubtaskEdit}
                cancelEdit={cancelEdit}
                addSubtask={(title) => addSubtask(task.id, title)}
                deleteSubtask={(subtaskId) => deleteSubtaskNow(task.id, subtaskId)}
            />

            <div className="flex justify-between items-center mt-2">
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 font-medium">
                Delete Task
                </button>
                <button onClick={() => startEditing(task)} className="text-blue-500 hover:text-blue-700 font-medium">
                Edit Task
                </button>
                {task.completed && <span className="text-green-500">Completed</span>}
            </div>
        </div>
        ))}
    </div>
    );
};

export default TaskList;
