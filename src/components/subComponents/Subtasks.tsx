import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { Subtask } from '../types';

interface SubtaskListProps {
    subtasks: Subtask[];
    editingSubtaskId: number | null;
    toggleSubtaskCompletion: (subtaskId: number) => void;
    startEditingSubtask: (subtaskId: number, title: string) => void;
    saveSubtaskEdit: (data: any) => void;
    cancelEdit: () => void;
    addSubtask: (title: string) => void;
    deleteSubtask: (subtaskId: number) => void;
}

const SubtaskList = ({
  subtasks,
  editingSubtaskId,
  toggleSubtaskCompletion,
  startEditingSubtask,
  saveSubtaskEdit,
  cancelEdit,
  addSubtask,
  deleteSubtask
}: SubtaskListProps) => {
    const [newSubtaskTitle, setNewSubtaskTitle] = useState('');

    const { handleSubmit, control } = useForm();

    const handleAddSubtask = (e: React.FormEvent) => {
      e.preventDefault();
      if (newSubtaskTitle.trim() === '') {
        alert('Subtask title required!');
        return;
      }
      addSubtask(newSubtaskTitle);
      setNewSubtaskTitle('');
    };
    
    return (
      <div className="ml-4 border-t border-gray-200 pt-2">
        <h4 className="text-lg font-semibold mb-2">Subtasks:</h4>
        <form onSubmit={handleAddSubtask} className="mb-4">
          <input
            type="text"
            value={newSubtaskTitle}
            onChange={(e) => setNewSubtaskTitle(e.target.value)}
            className="border border-gray-300 p-2 rounded-md w-full"
            placeholder="New subtask title"
          />
          <button type="submit" className="bg-blue-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-blue-600 mt-2">
            Add Subtask
          </button>
        </form>
        {subtasks.map((subtask) => (
          <div key={subtask.id} className="flex items-center mb-1">
            {editingSubtaskId === subtask.id ? (
              <form onSubmit={handleSubmit(saveSubtaskEdit)}>
                <Controller
                  name="subtaskTitle"
                  control={control}
                  defaultValue={subtask.title}
                  render={({ field }) => (
                    <input {...field} className="border border-gray-300 p-2 rounded-md w-full" placeholder="Subtask title"/>
                  )}
                />
                <div className="mt-2 flex justify-between">
                  <button type="submit"  className="bg-green-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-green-600 transition-colors">
                    Save
                  </button>
                  <button type="button" onClick={cancelEdit}className="bg-gray-500 text-white font-semibold py-1 px-3 rounded-md hover:bg-gray-600 transition-colors">
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div className="flex items-center">
                <input type="checkbox"  checked={subtask.completed} onChange={() => toggleSubtaskCompletion(subtask.id)} className="mr-2 h-4 w-4"/>
                {subtask.title}
                <button onClick={() => startEditingSubtask(subtask.id, subtask.title)} className="ml-2 text-blue-500 hover:text-blue-700">
                  Edit
                </button>
                <button onClick={() => deleteSubtask(subtask.id)} className="ml-2 text-red-500 hover:text-red-700">
                  Delete
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
    );
};

export default SubtaskList;
