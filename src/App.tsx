import { useState } from 'react';

interface LambdaResponse {
  statusCode: number;
  headers: {
    'Access-Control-Allow-Origin': string;
    'Access-Control-Allow-Methods': string;
    'Access-Control-Allow-Headers': string;
  };
  body: string;
}

interface PresignedUrlResponse {
  presigned_url: string;
}

interface ErrorResponse {
  error: string;
}

const App: React.FC = () => {
  const [fileKey, setFileKey] = useState<string>('April_Sample_File.csv');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const downloadFile = async () => {
    setError('');
    setSuccess('');
    if (!fileKey.trim()) {
      setError('Please enter a file key.');
      return;
    }

    setLoading(true);

    try {
      // Replace with your API Gateway endpoint
      const apiUrl = 'https://e3blv3dko6.execute-api.ap-south-1.amazonaws.com/default/presigned_urls';
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          body: JSON.stringify({ file_key: fileKey }),
        }),
      });

      const data: LambdaResponse = await response.json();

      if (response.status !== 200) {
        const errorData: ErrorResponse = JSON.parse(data.body);
        throw new Error(errorData.error || 'Failed to get presigned URL');
      }

      const { presigned_url }: PresignedUrlResponse = JSON.parse(data.body);

      // Create a temporary anchor element to trigger download
      const link = document.createElement('a');
      link.href = presigned_url;
      link.download = fileKey; // Sets the downloaded file name
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setSuccess('File download initiated!');
    } catch (err: any) {
      setError(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-gray-100 flex items-center justify-center min-h-screen">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4 text-center">Download S3 File</h1>
        <div className="mb-4">
          <label htmlFor="file_key" className="block text-sm font-medium text-gray-700">
            File Key (e.g., April_Sample_File.csv)
          </label>
          <input
            type="text"
            id="file_key"
            value={fileKey}
            onChange={(e) => setFileKey(e.target.value)}
            placeholder="Enter file key"
            className="mt-1 block w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            disabled={loading}
          />
        </div>
        <button
          onClick={downloadFile}
          disabled={loading}
          className={`w-full p-2 rounded-md text-white ${loading ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
        >
          {loading ? 'Processing...' : 'Download File'}
        </button>
        {error && <p className="mt-4 text-red-600">{error}</p>}
        {success && <p className="mt-4 text-green-600">{success}</p>}
      </div>
    </div>
  );
};

export default App;
