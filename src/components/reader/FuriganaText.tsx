import React from 'react';

export type FuriganaDisplayMode = 'all' | 'unmastered' | 'off';

interface FuriganaTextProps {
  content: string;
  furiganaMap: { [word: string]: string };
  furiganaMode?: FuriganaDisplayMode;
  showFurigana?: boolean;
  glossaryWords?: string[];
  focusedSentenceIndex?: number | null;
  onSentenceClick?: (sentenceIndex: number) => void;
  onWordClick: (word: string) => void;
  className?: string;
}

// Split a paragraph into Japanese sentences preserving ending punctuations
const splitIntoSentences = (paragraph: string): string[] => {
  const parts: string[] = [];
  let current = '';
  for (let i = 0; i < paragraph.length; i++) {
    const char = paragraph[i];
    current += char;
    if (char === '。' || char === '！' || char === '？') {
      parts.push(current);
      current = '';
    }
  }
  if (current.trim().length > 0) {
    parts.push(current);
  }
  return parts.length > 0 ? parts : [paragraph];
};

export const FuriganaText: React.FC<FuriganaTextProps> = ({
  content,
  furiganaMap,
  furiganaMode = 'all',
  showFurigana,
  glossaryWords = [],
  focusedSentenceIndex = null,
  onSentenceClick,
  onWordClick,
  className = '',
}) => {
  // Backwards compatibility for boolean showFurigana
  const effectiveMode: FuriganaDisplayMode = showFurigana !== undefined
    ? (showFurigana ? 'all' : 'off')
    : furiganaMode;

  const glossarySet = React.useMemo(() => new Set(glossaryWords), [glossaryWords]);

  const wordsToMatch = React.useMemo(
    () => Object.keys(furiganaMap).sort((a, b) => b.length - a.length),
    [furiganaMap]
  );

  const regexPattern = React.useMemo(() => {
    if (!wordsToMatch.length) return null;
    return new RegExp(`(${wordsToMatch.map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|')})`, 'g');
  }, [wordsToMatch]);

  const paragraphs = React.useMemo(() => {
    return content.split('\n').filter(p => p.trim().length > 0);
  }, [content]);

  // Keep track of sentence global index
  let globalSentenceCounter = 0;

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {paragraphs.map((p, pIdx) => {
        const sentences = splitIntoSentences(p);

        return (
          <p key={pIdx} className="mb-4 leading-loose tracking-wide font-jp text-base sm:text-lg">
            {sentences.map((sentence) => {
              const sentenceIdx = globalSentenceCounter++;
              const isFocused = focusedSentenceIndex === sentenceIdx;
              const isAnyFocused = focusedSentenceIndex !== null;

              const sentenceClass = isFocused
                ? 'bg-cyan-500/15 dark:bg-cyan-500/25 ring-2 ring-cyan-500 dark:ring-cyan-400 rounded-xl px-2 py-1 shadow-md transition-all duration-300 inline'
                : isAnyFocused
                ? 'opacity-30 blur-[0.6px] transition-all duration-300 hover:opacity-80 cursor-pointer inline'
                : 'transition-all duration-300 inline';

              if (!regexPattern) {
                return (
                  <span
                    key={sentenceIdx}
                    onClick={() => onSentenceClick && onSentenceClick(sentenceIdx)}
                    className={sentenceClass}
                  >
                    {sentence}
                  </span>
                );
              }

              const segments = sentence.split(regexPattern);

              return (
                <span
                  key={sentenceIdx}
                  onClick={() => onSentenceClick && onSentenceClick(sentenceIdx)}
                  className={sentenceClass}
                >
                  {segments.map((segment, sIdx) => {
                    const furigana = furiganaMap[segment];
                    if (furigana) {
                      const shouldShowFurigana =
                        effectiveMode === 'all' ||
                        (effectiveMode === 'unmastered' && glossarySet.has(segment));

                      return (
                        <span
                          key={sIdx}
                          onClick={(e) => {
                            e.stopPropagation();
                            onWordClick(segment);
                          }}
                          className="inline-block cursor-pointer px-0.5 rounded hover:bg-cyan-500/20 hover:text-cyan-600 dark:hover:text-cyan-300 transition group select-text underline decoration-cyan-400/40 underline-offset-4"
                          title={`Tra nghĩa "${segment}"`}
                        >
                          {shouldShowFurigana ? (
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
                </span>
              );
            })}
          </p>
        );
      })}
    </div>
  );
};
