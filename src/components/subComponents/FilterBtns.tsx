
const FilterBtns = ({ setFilter, filter }) => {
  return (
    <div className="mb-4">
        <button onClick={() => setFilter('all')} className={`mr-2 px-4 py-2 rounded ${filter === 'all' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}> 
            All 
        </button>
        <button onClick={() => setFilter('completed')} className={`mr-2 px-4 py-2 rounded ${filter === 'completed' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Completed
        </button>
        <button onClick={() => setFilter('incomplete')} className={`px-4 py-2 rounded ${filter === 'incomplete' ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
            Incomplete
        </button>
    </div>
  )
}

export default FilterBtns