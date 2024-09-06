import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { Task } from '../types';

interface TaskFormProps {
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  tasks: Task[];
}

const TaskForm = ({ setTasks, tasks }: TaskFormProps) => {
  const { handleSubmit, control, reset, formState: { errors } } = useForm({
    defaultValues: {
      title: '',
      description: '',
      subtasks: [{ title: '', completed: false }]
    }
  });

  const { fields, append, remove, update } = useFieldArray({
    control,
    name: 'subtasks'
  });

  const onSubmit = (data: any) => {
    const newTask: Task = {
      id: tasks.length + 1,
      title: data.title,
      description: data.description,
      completed: false,
      subtasks: data.subtasks
    };

    setTasks([...tasks, newTask]);
    reset();
  };

  const handleSubtaskTitleChange = (index: number, title: string) => {
    update(index, { title, completed: fields[index].completed });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block">Task Title</label>
        <Controller
          name="title"
          control={control}
          rules={{ required: 'Title is required' }}
          render={({ field }) => (
            <input
              {...field}
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Task title"
            />
          )}
        />
        {errors.title && <span className="text-red-500">{errors.title.message}</span>}
      </div>

      <div>
        <label className="block">Task Description</label>
        <Controller
          name="description"
          control={control}
          rules={{ minLength: { value: 10, message: 'Description must be at least 10 characters long' } }}
          render={({ field }) => (
            <textarea
              {...field}
              className="border border-gray-300 p-2 rounded-md w-full"
              placeholder="Task description (optional)"
            />
          )}
        />
      </div>

      <div>
        <label className="block">Subtasks</label>
        {fields.map((item, index) => (
          <div key={item.id} className="flex space-x-2 mb-2">
            <Controller
              name={`subtasks[${index}].title`}
              control={control}
              defaultValue={item.title}
              render={({ field }) => (
                <input
                  {...field}
                  className="border border-gray-300 p-2 rounded-md w-full"
                  placeholder="Subtask title"
                  onChange={(e) => handleSubtaskTitleChange(index, e.target.value)}
                />
              )}
            />
            <button
              type="button"
              onClick={() => remove(index)}
              className="bg-red-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-red-600"
            >
              Remove
            </button>
          </div>
        ))}
        <button
          type="button"
          onClick={() => append({ title: '', completed: false })}
          className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600"
        >
          Add Subtask
        </button>
      </div>

      <button type="submit" className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600">
        Add Task
      </button>
    </form>
  );
};

export default TaskForm;
