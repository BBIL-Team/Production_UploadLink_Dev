import React, { useState } from 'react';
import './App.css'; // Optional: For Tailwind or custom styles

interface TableItem {
  [key: string]: any;
}

const TABLE_NAME = 'http-crud-tutorial-items'; // Constant DynamoDB table name

const App: React.FC = () => {
  const [items, setItems] = useState<TableItem[]>([]);
  const [headers, setHeaders] = useState<string[]>([]);
  const [error, setError] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);

  // Fetch table data from Lambda via API Gateway
  const fetchTableData = async () => {
    setError('');
    setItems([]);
    setHeaders([]);
    setLoading(true);

    try {
      const response = await fetch('YOUR_API_GATEWAY_URL', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ table_name: TABLE_NAME }),
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

      {/* Submit Button */}
      <div className="mb-4">
        <button
          onClick={fetchTableData}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600 disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? 'Loading...' : 'Submit'}
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
