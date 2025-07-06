import { FilterOptions } from '@/hooks/useRankings';

interface RankingsFilterProps {
  options: FilterOptions;
  onChange: (options: FilterOptions) => void;
}

export const RankingsFilter: React.FC<RankingsFilterProps> = ({ options, onChange }) => (
  <div className="flex flex-col md:flex-row gap-4 p-4 bg-white rounded-lg shadow mb-6">
    <select
      value={options.timeRange}
      onChange={(e) => onChange({ ...options, timeRange: e.target.value as FilterOptions['timeRange'] })}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="24h">Last 24 Hours</option>
      <option value="7d">Last 7 Days</option>
      <option value="30d">Last 30 Days</option>
      <option value="all">All Time</option>
    </select>
    
    <select
      value={options.category}
      onChange={(e) => onChange({ ...options, category: e.target.value })}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="all">All Categories</option>
      <option value="productivity">Productivity</option>
      <option value="health">Health</option>
      <option value="learning">Learning</option>
    </select>
    
    <select
      value={options.difficulty}
      onChange={(e) => onChange({ ...options, difficulty: e.target.value })}
      className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
    >
      <option value="all">All Difficulties</option>
      <option value="easy">Easy</option>
      <option value="medium">Medium</option>
      <option value="hard">Hard</option>
    </select>
  </div>
);
