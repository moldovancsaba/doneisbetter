interface SortConfig {
  field: 'rank' | 'weight' | 'timestamp';
  direction: 'asc' | 'desc';
}

interface SortControlsProps {
  currentSort: SortConfig;
  onSortChange: (sort: SortConfig) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => {
  return (
    <div className="flex flex-wrap gap-2 p-4 bg-white rounded-lg shadow">
      <select
        value={currentSort.field}
        onChange={(e) => onSortChange({ ...currentSort, field: e.target.value as SortConfig['field'] })}
        className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <option value="rank">Overall Rank</option>
        <option value="weight">Weight</option>
        <option value="timestamp">Last Updated</option>
      </select>
      
      <button
        onClick={() => onSortChange({
          ...currentSort,
          direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
        })}
        className="px-4 py-2 border rounded-lg hover:bg-gray-50 flex items-center gap-2"
        aria-label={`Sort ${currentSort.direction === 'asc' ? 'Ascending' : 'Descending'}`}
      >
        <span className="sr-only">Sort </span>
        {currentSort.direction === 'asc' ? (
          <>
            <span aria-hidden="true">↑</span> Ascending
          </>
        ) : (
          <>
            <span aria-hidden="true">↓</span> Descending
          </>
        )}
      </button>
    </div>
  );
};
