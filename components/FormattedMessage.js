import React from 'react';
import ReactMarkdown from 'react-markdown';

const FormattedMessage = ({ content }) => {
  const renderers = {
    p: ({ children }) => (
      <p className="text-pink-900 mb-1 leading-relaxed whitespace-pre-wrap break-words text-sm md:text-base mr-3 px-1 md:px-0">
        {children}
      </p>
    ),
    
    code: ({ node, inline, className, children, ...props }) => {
      const match = /language-(\w+)/.exec(className || '');
      return !inline ? (
        <div className="relative my-4 mx-0 md:mx-0">
          <pre className="bg-gray-50 rounded-lg p-5 md:p-4 overflow-x-auto text-xs md:text-sm max-w-full">
            <code className={match ? `language-${match[1]}` : ''} {...props}>
              {children}
            </code>
          </pre>
        </div>
      ) : (
        <code className="bg-gray-100 rounded px-1 md:px-1.5 py-0.5 text-xs md:text-sm font-mono break-words">
          {children}
        </code>
      );
    },

    strong: ({ children }) => (
      <strong className="font-semibold text-gray-900 break-words text-sm md:text-base">
        {children}
      </strong>
    ),
    
    em: ({ children }) => (
      <em className="italic text-gray-800 break-words text-sm md:text-base">
        {children}
      </em>
    ),

    ul: ({ children }) => (
      <ul className="list-disc pl-4 md:pl-6 space-y-1 md:space-y-2 mb-4 overflow-x-auto mx-2 md:mx-0">
        {children}
      </ul>
    ),
    
    ol: ({ children }) => (
      <ol className="list-decimal pl-4 md:pl-6 space-y-1 md:space-y-2 mb-4 overflow-x-auto mx-2 md:mx-0">
        {children}
      </ol>
    ),
    
    li: ({ children }) => (
      <li className="text-pink-900 pl-1 md:pl-2 break-words text-sm md:text-base">
        {children}
      </li>
    ),

    h1: ({ children }) => (
      <h1 className="text-lg md:text-2xl font-bold mb-3 md:mb-4 mt-4 md:mt-6 text-gray-900 break-words px-2 md:px-0">
        {children}
      </h1>
    ),
    
    h2: ({ children }) => (
      <h2 className="text-base md:text-xl font-bold mb-2 md:mb-3 mt-3 md:mt-5 text-gray-900 break-words px-2 md:px-0">
        {children}
      </h2>
    ),
    
    h3: ({ children }) => (
      <h3 className="text-sm md:text-lg font-bold mb-2 mt-3 md:mt-4 text-gray-900 break-words px-2 md:px-0">
        {children}
      </h3>
    ),

    blockquote: ({ children }) => (
      <blockquote className="border-l-4 border-gray-200 pl-3 md:pl-4 my-3 md:my-4 italic text-pink-900 break-words overflow-x-auto text-sm md:text-base mx-2 md:mx-0">
        {children}
      </blockquote>
    ),

    table: ({ children }) => (
      <div className="overflow-x-auto my-4 max-w-full mx-2 md:mx-0">
        <table className="min-w-full divide-y divide-gray-200 text-sm md:text-base">
          {children}
        </table>
      </div>
    ),
    thead: ({ children }) => <thead className="bg-gray-50">{children}</thead>,
    tbody: ({ children }) => <tbody className="divide-y divide-gray-200">{children}</tbody>,
    tr: ({ children }) => <tr>{children}</tr>,
    th: ({ children }) => (
      <th className="px-2 md:px-6 py-2 md:py-3 text-left text-xs md:text-sm font-medium text-gray-500 uppercase tracking-wider break-words">
        {children}
      </th>
    ),
    td: ({ children }) => (
      <td className="px-2 md:px-6 py-2 md:py-4 whitespace-normal text-xs md:text-sm text-pink-900 break-words">
        {children}
      </td>
    )
  };

  const renderMessageContent = () => {
    if (Array.isArray(content)) {
      return content.map((item, index) => (
        <ReactMarkdown 
          key={index}
          components={renderers}
        >
          {item.text}
        </ReactMarkdown>
      ));
    }

    return (
      <ReactMarkdown 
        components={renderers}
      >
        {content}
      </ReactMarkdown>
    );
  };

  return (
    <div className="prose prose-sm md:prose w-full max-w-full overflow-x-hidden prose-headings:mt-0 first:prose-p:mt-0">
      {renderMessageContent()}
    </div>
  );
};

export default FormattedMessage;