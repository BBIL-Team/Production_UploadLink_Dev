import React, { useState } from 'react';
import './App.css'; // Optional: For Tailwind or custom styles

interface TableItem {
  [key: string]: any;
}

const App: React.FC = () => {
  const [tableName, setTableName] = useState<string>('');
  const [items, setItems] = useState<TableItem[]>([]);
  const [headers, setHeaders] = useState<str, setError] = ing[]>([]);
  const [erroruseState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch table data from Lambda via API Gateway
  const fetchTableData = async () => {
    setError('');
    setItems([]);
    setHeaders([]);
    setLoading(true);

    if (!tableName.trim()) {
      setError('Please enter a table name');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('YOUR_API_GATEWAY_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_name: tableName }),
      });

      const data = await response.json();

      if (response.ok && data.items) {
        if (data.items.length === 0) {
          setError('No items found in the table');
        } else {
          // Set table headers from the first item's keys
          const itemHeaders = Object.keys(data.items[0]);
          setHeaders(itemHeaders);
          setItems(data.items);
        }
      } else {
        setError(data.error || 'Failed to fetch table data');
      }
    } catch (err) {
      setError(`Error: ${(err as Error).message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">DynamoDB Table Viewer</h1>

      {/* Table Name Input */}
      <div className="mb-4">
        <label htmlFor="tableName" className="block text-sm font-medium text-gray-700">
          Enter DynamoDB Table Name:
        </label>
        <input
          type="text"
          id="tableName"
          value={tableName}
          onChange={(e) => setTableName(e.target.value)}
          placeholder="e.g., http-crud-tutorial-items"
          className="mt-1 p-2 border rounded w-full"
          disabled={loading}
        />
        <button
          onClick={fetchTableData}
          className="mt-2 bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Fetch Data'}
        </button>
      </div>

      {/* Error Message */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Data Table */}
      {items.length > 0 && (
        <div className="overflow-x-auto">
          <table className="min-w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                {headers.map((header) => (
                  <th key={header} className="border border-gray-300 p-2 text-left">
                    {header}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {items.map((item, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  {headers.map((header) => (
                    <td key={header} className="border border-gray-300 p-2">
                      {item[header] !== undefined ? item[header].toString() : ''}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default App;
