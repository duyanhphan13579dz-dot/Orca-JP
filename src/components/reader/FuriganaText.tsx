import React from 'react';

interface FuriganaTextProps {
  content: string;
  furiganaMap: { [word: string]: string };
  showFurigana: boolean;
  onWordClick: (word: string) => void;
  className?: string;
}

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  content,
  furiganaMap,
  showFurigana,
  onWordClick,
  className = '',
}) => {
  // Split content by punctuation or whitespace while keeping delimiters
  // We match known words from furiganaMap
  const wordsToMatch = Object.keys(furiganaMap).sort((a, b) => b.length - a.length);

  // Helper to render the interactive paragraphs
  const renderParagraph = (text: string, pIdx: number) => {
    if (!wordsToMatch.length) {
      return <p key={pIdx} className="mb-4">{text}</p>;
    }

    // Build regex pattern matching all known words
    const regexPattern = new RegExp(`(${wordsToMatch.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
    const segments = text.split(regexPattern);

    return (
      <p key={pIdx} className="mb-4 leading-loose tracking-wide font-jp text-base sm:text-lg">
        {segments.map((segment, sIdx) => {
          const furigana = furiganaMap[segment];
          if (furigana) {
            return (
              <span
                key={sIdx}
                onClick={() => onWordClick(segment)}
                className="inline-block cursor-pointer px-0.5 rounded hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-300 transition group select-text underline decoration-cyan-400/40 underline-offset-4"
                title={`Tra nghĩa "${segment}"`}
              >
                {showFurigana ? (
                  <ruby className="ruby-text">
                    {segment}
                    <rt className="text-[10px] text-cyan-600 dark:text-cyan-400 select-none font-normal">
                      {furigana}
                    </rt>
                  </ruby>
                ) : (
                  <span>{segment}</span>
                )}
              </span>
            );
          }
          return <span key={sIdx}>{segment}</span>;
        })}
      </p>
    );
  };

  const paragraphs = content.split('\n').filter(p => p.trim().length > 0);

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {paragraphs.map((p, i) => renderParagraph(p, i))}
    </div>
  );
};
