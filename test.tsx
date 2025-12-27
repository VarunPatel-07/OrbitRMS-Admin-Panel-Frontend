import React, { useState } from 'react';

const LogInterface = () => {
  const [logType, setLogType] = useState('all');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [selectedFile, setSelectedFile] = useState('app.log');

  // Sample log files
  const logFiles = [
    {
      name: 'app.log',
      size: '2.4 MB',
      type: 'log',
      lastModified: '2 mins ago',
    },
    {
      name: 'error.log',
      size: '156 KB',
      type: 'log',
      lastModified: '5 mins ago',
    },
    {
      name: 'access.log',
      size: '5.8 MB',
      type: 'log',
      lastModified: '1 min ago',
    },
    {
      name: 'app-2024-12-22.log.gz',
      size: '890 KB',
      type: 'gz',
      lastModified: '1 day ago',
    },
    {
      name: 'error-2024-12-22.log.gz',
      size: '45 KB',
      type: 'gz',
      lastModified: '1 day ago',
    },
    {
      name: 'app-2024-12-21.log.gz',
      size: '1.2 MB',
      type: 'gz',
      lastModified: '2 days ago',
    },
  ];

  // Sample log data with realistic format
  const logs = [
    {
      type: 'info',
      raw: "2025-12-23 21:39:03,450 | INFO | {'url': '/', 'method': 'GET'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'info',
      raw: "2025-12-23 21:39:05,909 | INFO | {'url': '/', 'method': 'GET'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'info',
      raw: "2025-12-23 21:41:25,336 | INFO | {'url': '/app/v1/auth/maintenance/check-maintenance-mode', 'method': 'OPTIONS'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'info',
      raw: "2025-12-23 21:41:25,338 | INFO | {'url': '/app/v1/auth/maintenance/check-maintenance-mode', 'method': 'GET'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'error',
      raw: '2025-12-23 21:42:10,123 | ERROR | Database connection failed: timeout after 30s |(DatabaseHandler)',
    },
    {
      type: 'info',
      raw: "2025-12-23 21:43:10,896 | INFO | {'url': '/app/v1/auth/maintenance/check-maintenance-mode', 'method': 'OPTIONS'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'error',
      raw: '2025-12-23 21:43:15,234 | ERROR | Failed to process request: Invalid token |(AuthMiddleware)',
    },
    {
      type: 'info',
      raw: "2025-12-23 21:44:20,567 | INFO | {'url': '/api/v1/users', 'method': 'POST'} |(CustomCorsMiddleWare)",
    },
    {
      type: 'error',
      raw: '2025-12-23 21:45:30,890 | ERROR | Unhandled exception in route handler |(ErrorHandler)',
    },
    {
      type: 'info',
      raw: "2025-12-23 21:46:05,123 | INFO | {'url': '/health', 'method': 'GET'} |(CustomCorsMiddleWare)",
    },
  ];

  const filteredLogs =
    logType === 'all' ? logs : logs.filter((log) => log.type === logType);

  const logOptions = [
    { value: 'all', label: 'All Logs', icon: Terminal },
    { value: 'info', label: 'Default Logs', icon: Info },
    { value: 'error', label: 'Error Logs', icon: AlertCircle },
  ];

  const handleDownload = (fileName) => {
    // Simulate download
    alert(`Downloading ${fileName}...`);
  };

  const bgColor = isDarkMode ? 'bg-black' : 'bg-gray-50';
  const textColor = isDarkMode ? 'text-gray-100' : 'text-gray-900';
  const mutedColor = isDarkMode ? 'text-gray-400' : 'text-gray-600';
  const borderColor = isDarkMode ? 'border-gray-800' : 'border-gray-200';
  const consoleBg = isDarkMode ? 'bg-gray-950' : 'bg-white';
  const sidebarBg = isDarkMode ? 'bg-gray-900' : 'bg-white';
  const hoverBg = isDarkMode ? 'hover:bg-gray-800' : 'hover:bg-gray-100';
  const selectedBg = isDarkMode ? 'bg-gray-800' : 'bg-gray-100';
  const dropdownBg = isDarkMode ? 'bg-gray-900' : 'bg-white';

  return (
    <div
      className={`min-h-screen ${bgColor} ${textColor} transition-colors duration-200`}
    >
      <div className='flex h-screen'>
        {/* Sidebar - Log Files */}
        <div
          className={`w-80 ${sidebarBg} border-r ${borderColor} flex flex-col`}
        >
          <div className='p-4 border-b ${borderColor}'>
            <h2 className='text-lg font-semibold mb-1'>Log Files</h2>
            <p className={`text-xs ${mutedColor}`}>
              {logFiles.length} files available
            </p>
          </div>

          <div className='flex-1 overflow-y-auto'>
            {logFiles.map((file, index) => (
              <div
                key={index}
                className={`p-3 border-b ${borderColor} ${
                  selectedFile === file.name ? selectedBg : ''
                } ${hoverBg} cursor-pointer transition-colors`}
                onClick={() => setSelectedFile(file.name)}
              >
                <div className='flex items-start justify-between gap-2'>
                  <div className='flex items-start gap-2 flex-1 min-w-0'>
                    {file.type === 'gz' ? (
                      <Archive
                        size={16}
                        className={`mt-0.5 shrink-0 ${mutedColor}`}
                      />
                    ) : (
                      <FileText
                        size={16}
                        className={`mt-0.5 shrink-0 ${mutedColor}`}
                      />
                    )}
                    <div className='flex-1 min-w-0'>
                      <div className='font-mono text-sm truncate'>
                        {file.name}
                      </div>
                      <div
                        className={`text-xs ${mutedColor} flex items-center gap-2 mt-1`}
                      >
                        <span>{file.size}</span>
                        <span>•</span>
                        <span>{file.lastModified}</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDownload(file.name);
                    }}
                    className={`p-1.5 rounded ${hoverBg} ${mutedColor} hover:text-blue-500 transition-colors`}
                    title='Download'
                  >
                    <Download size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className='flex-1 flex flex-col'>
          {/* Header */}
          <div className={`p-6 border-b ${borderColor}`}>
            <div className='flex items-center justify-between mb-4'>
              <div>
                <h1 className='text-2xl font-semibold mb-1'>Deployment Logs</h1>
                <p className={`text-sm ${mutedColor}`}>
                  production-abc123 • Deployed 5 minutes ago
                </p>
              </div>
              <button
                onClick={() => setIsDarkMode(!isDarkMode)}
                className={`p-2 rounded-lg ${hoverBg} transition-colors`}
                title={
                  isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'
                }
              >
                {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
              </button>
            </div>

            {/* Controls */}
            <div className='flex items-center gap-4'>
              <div className='relative'>
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className={`flex items-center gap-2 ${sidebarBg} border ${borderColor} rounded-lg px-4 py-2 ${hoverBg} transition-colors`}
                >
                  {React.createElement(
                    logOptions.find((opt) => opt.value === logType)?.icon ||
                      Terminal,
                    { size: 16 }
                  )}
                  <span className='text-sm'>
                    {logOptions.find((opt) => opt.value === logType)?.label}
                  </span>
                  <ChevronDown
                    size={16}
                    className={`transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
                  />
                </button>

                {isDropdownOpen && (
                  <div
                    className={`absolute top-full mt-2 w-48 ${dropdownBg} border ${borderColor} rounded-lg shadow-lg overflow-hidden z-10`}
                  >
                    {logOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() => {
                          setLogType(option.value);
                          setIsDropdownOpen(false);
                        }}
                        className={`w-full flex items-center gap-3 px-4 py-2.5 ${hoverBg} transition-colors text-left ${
                          logType === option.value ? selectedBg : ''
                        }`}
                      >
                        {React.createElement(option.icon, { size: 16 })}
                        <span className='text-sm'>{option.label}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className={`text-sm ${mutedColor}`}>
                Showing {filteredLogs.length} of {logs.length} logs
              </div>

              <div className={`text-sm ${mutedColor}`}>
                • Viewing: <span className='font-mono'>{selectedFile}</span>
              </div>
            </div>
          </div>

          {/* Log Console */}
          <div className='flex-1 p-6 overflow-hidden'>
            <div
              className={`${consoleBg} border ${borderColor} rounded-lg h-full flex flex-col overflow-hidden`}
            >
              <div
                className={`${sidebarBg} border-b ${borderColor} px-4 py-2 flex items-center gap-2`}
              >
                <Terminal size={16} className={mutedColor} />
                <span className={`text-sm font-mono ${mutedColor}`}>
                  Console Output
                </span>
              </div>

              <div className='p-4 font-mono text-sm flex-1 overflow-y-auto'>
                {filteredLogs.map((log, index) => (
                  <div
                    key={index}
                    className={`py-1 ${
                      log.type === 'error'
                        ? 'text-red-500'
                        : isDarkMode
                          ? 'text-gray-300'
                          : 'text-gray-700'
                    }`}
                  >
                    {log.raw}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Footer Info */}
          <div
            className={`px-6 py-3 border-t ${borderColor} text-xs ${mutedColor} flex items-center gap-4`}
          >
            <span>Last updated: just now</span>
            <span>•</span>
            <span>Auto-refresh enabled</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LogInterface;
