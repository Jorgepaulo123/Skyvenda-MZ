import React from 'react';
import ReactMarkdown from 'react-markdown';

export function MarkdownContent({ content }) {
  return (
    <div className="markdown-content">
      <ReactMarkdown>{content}</ReactMarkdown>
    </div>
  );
}