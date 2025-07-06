import { SortOption } from '@/hooks/useRankings';

interface SortControlsProps {
  currentSort: SortOption;
  onSortChange: (sort: SortOption) => void;
}

export const SortControls: React.FC<SortControlsProps> = ({ currentSort, onSortChange }) => (
  <div className="flex gap-2 p-4 bg-white rounded-lg shadow mb-6">
    <select
      value={currentSort.field}
      onChange={(e) => onSortChange({ ...currentSort, field: e.target.value as SortOption['field'] })}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="rank">Rank</option>
      <option value="timestamp">Date</option>
      <option value="weight">Weight</option>
    </select>
    
    <button
      onClick={() => onSortChange({
        ...currentSort,
        direction: currentSort.direction === 'asc' ? 'desc' : 'asc'
      })}
      className="px-4 py-2 border rounded-lg hover:bg-gray-50"
    >
      {currentSort.direction === 'asc' ? '↑ Ascending' : '↓ Descending'}
    </button>
  </div>
);
