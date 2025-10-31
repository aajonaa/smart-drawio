'use client';

import { Editor } from '@monaco-editor/react';

export default function CodeEditor({ code, onChange, onApply, onOptimize, onClear, jsonError, onClearJsonError }) {
  return (
    <div className="flex relative flex-col h-full bg-gray-50 border-t border-gray-200">
      <div className="flex items-center justify-between px-4 py-3 bg-white border-b border-gray-200">
        <h3 className="text-sm font-semibold text-gray-700">生成的代码</h3>
        <div className="flex space-x-2">
          <button
            onClick={onClear}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded hover:bg-gray-50 transition-colors duration-200"
          >
            清除
          </button>
          <button
            onClick={onOptimize}
            className="px-4 py-2 text-sm font-medium text-white rounded"            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 50%, #f093fb 100%)'
            }}
            title="优化图标布局和箭头连接"
          >
            优化
          </button>
          <button
            onClick={onApply}
            className="px-4 py-2 text-sm font-medium text-white bg-gray-900 rounded hover:bg-gray-800 transition-colors duration-200 flex items-center gap-2"
          >
            应用到画布
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={2}
              stroke="currentColor"
              className="w-4 h-4"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
      </div>

      {/* JSON Error Banner */}
      {jsonError && (
        <div className="absolute bottom-0 z-1 border-b border-red-200 px-4 py-3 flex items-start justify-between bg-white" >
          <div className="flex items-start space-x-2">
            <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
            </svg>
            <div className="flex-1">
              <p className="text-red-700 mt-1 font-mono" style={{ fontSize: '12px' }}>{jsonError}</p>
            </div>
          </div>
          <button
            onClick={onClearJsonError}
            className="text-red-600 hover:text-red-800 transition-colors ml-2"
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>
      )}

      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage="javascript"
          value={code}
          onChange={onChange}
          theme="vs-light"
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            wordWrap: 'on',
          }}
        />
      </div>
    </div>
  );
}

