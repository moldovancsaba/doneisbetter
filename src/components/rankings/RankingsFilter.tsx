interface FilterConfig {
  timeRange: '24h' | '7d' | '30d' | 'all';
}

interface RankingsFilterProps {
  options: FilterConfig;
  onChange: (options: FilterConfig) => void;
}

export const RankingsFilter: React.FC<RankingsFilterProps> = ({ options, onChange }) => {
  return (
    <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow">
      <div className="flex flex-col">
        <label htmlFor="timeRange" className="text-sm font-medium text-gray-700 mb-1">
          Time Period
        </label>
        <select
          id="timeRange"
          value={options.timeRange}
          onChange={(e) => onChange({ timeRange: e.target.value as FilterConfig['timeRange'] })}
          className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="24h">Last 24 Hours</option>
          <option value="7d">Last 7 Days</option>
          <option value="30d">Last 30 Days</option>
          <option value="all">All Time</option>
        </select>
      </div>

      <div className="flex items-end">
        <button
          onClick={() => onChange({ timeRange: 'all' })}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 hover:bg-gray-50 rounded-lg"
          aria-label="Reset filters"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
