// src/components/CodeHighlighter.jsx
import React, { useEffect, useRef } from 'react';

const CodeHighlighter = ({ code, language = 'javascript' }) => {
  const codeRef = useRef(null);

  useEffect(() => {
    const highlightCode = async () => {
      try {
        // Dynamically import Prism and required components
        const Prism = await import('prismjs');
        
        // Load required components based on language
        if (language === 'php') {
          await import('prismjs/components/prism-markup-templating');
          await import('prismjs/components/prism-php');
        } else if (language === 'javascript') {
          await import('prismjs/components/prism-javascript');
        } else if (language === 'python') {
          await import('prismjs/components/prism-python');
        } else if (language === 'json') {
          await import('prismjs/components/prism-json');
        }

        // Highlight the code
        if (codeRef.current) {
          Prism.highlightElement(codeRef.current);
        }
      } catch (error) {
        console.error('Error loading Prism components:', error);
      }
    };

    highlightCode();
  }, [code, language]);

  return (
    <pre className="bg-gray-900 text-gray-100 p-4 rounded overflow-auto text-sm">
      <code ref={codeRef} className={`language-${language}`}>
        {code}
      </code>
    </pre>
  );
};

export default CodeHighlighter;