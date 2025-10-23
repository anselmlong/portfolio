'use client';

import { Fragment, useState } from 'react';
import { useChat } from '@ai-sdk/react';
import { TextStreamChatTransport, type UIMessage } from 'ai';
import { CopyIcon, RefreshCcwIcon } from 'lucide-react';
import {
  Conversation,
  ConversationContent,
  ConversationScrollButton,
} from '~/components/ai-elements/conversation';
import { Message, MessageContent } from '~/components/ai-elements/message';
import { Response } from '~/components/ai-elements/response';
import { Actions, Action } from '~/components/ai-elements/actions';
import { Loader } from '~/components/ai-elements/loader';
import {
  PromptInput,
  PromptInputBody,
  PromptInputTextarea,
  PromptInputFooter,
  PromptInputSubmit,
  type PromptInputMessage,
} from '~/components/ai-elements/prompt-input';
import { EXAMPLE_PROMPTS } from '~/constants/example-prompts';

const examplePrompts = EXAMPLE_PROMPTS;

// Helper to get random prompts
const getRandomPrompts = (prompts: string[], count: number = 3) => {
  const shuffled = [...prompts];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = shuffled[i];
    shuffled[i] = shuffled[j]!;
    shuffled[j] = temp!;
  }
  return shuffled.slice(0, count);
};

const ChatInterface = () => {
  const [input, setInput] = useState('');
  const [expanded, setExpanded] = useState(false);
  const [displayedPrompts, setDisplayedPrompts] = useState(() => 
    getRandomPrompts(examplePrompts, 3)
  );
  const { messages, sendMessage, regenerate, status, error } = useChat({
    transport: new TextStreamChatTransport({
      api: '/api/chat',
    }),
    onError: (err) => {
      console.error('Chat error:', err);
    },
    onFinish: (message) => {
      console.log('Message finished:', message);
    },
  });

  // Debug: log messages and status changes
  console.log('=== CHAT UI STATE ===');
  console.log('Messages count:', messages.length);
  console.log('Messages:', JSON.stringify(messages, null, 2));
  console.log('Status:', status);
  console.log('Error:', error);

  // Handle example prompt clicks
  const handleExampleClick = (prompt: string) => {
    console.log('=== EXAMPLE CLICK ===');
    console.log('Clicked prompt:', prompt);
    console.log('Current displayed prompts:', displayedPrompts);
    
    setInput(prompt);
    setExpanded(true);
    sendMessage({
      text: prompt,
    });
    setInput('');
    
    // Remove clicked prompt and add a new random one
    setDisplayedPrompts(prev => {
      const remaining = prev.filter(p => p !== prompt);
      const unused = examplePrompts.filter(p => !prev.includes(p));
      
      if (unused.length > 0) {
        // Pick a random unused prompt
        const newPrompt = unused[Math.floor(Math.random() * unused.length)];
        return [...remaining, newPrompt!];
      }
      
      // If all prompts have been shown, just keep the remaining ones
      return remaining;
    });
  };

  const handleSubmit = (message: PromptInputMessage) => {
    console.log('=== SUBMITTING MESSAGE ===');
    console.log('Input text:', message.text);
    
    if (!message.text?.trim()) {
      console.log('Empty message, skipping');
      return;
    }
    
    console.log('Calling sendMessage...');
    // Expand chat area when the user sends a message
    setExpanded(true);
    sendMessage({
      text: message.text,
    });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative w-full">
      <div className="flex flex-col">
        {/* History area that expands downward above the input */}
        <div
          className={`transition-all duration-300 ease-out ${
            expanded ? 'h-[60vh] mt-2' : 'h-0'
          }`}
          aria-hidden={!expanded}
        >
            <Conversation className="h-full scrollbar-neutral">
              <ConversationContent>
            {messages.map((message: UIMessage) => (
              <Fragment key={message.id}>
                <Message from={message.role}>
                  <MessageContent>
                    {message.parts.map((part, i) =>
                      part.type === 'text' ? (
                        <Response key={i}>{part.text}</Response>
                      ) : null
                    )}
                  </MessageContent>
                </Message>
                {message.role === 'assistant' && message.id === messages.at(-1)?.id && (
                  <Actions className="mt-2">
                    <Action
                      onClick={() => regenerate()}
                      label="Retry"
                      tooltip="Regenerate response"
                    >
                      <RefreshCcwIcon className="size-3" />
                    </Action>
                    <Action
                      onClick={() => {
                        const text = message.parts
                          .filter(p => p.type === 'text')
                          .map(p => (p.type === 'text' ? p.text : ''))
                          .join('');
                        navigator.clipboard.writeText(text);
                      }}
                      label="Copy"
                      tooltip="Copy to clipboard"
                    >
                      <CopyIcon className="size-3" />
                    </Action>
                  </Actions>
                )}
              </Fragment>
            ))}
            {status === 'submitted' && <Loader />}
              </ConversationContent>
              <ConversationScrollButton />
            </Conversation>
        </div>

        {/* Input stays visible; focusing expands the history above and pushes this down */}
        <PromptInput onSubmit={handleSubmit} className="mt-2">
          <PromptInputBody>
            <PromptInputTextarea
              className="min-h-10 max-h-20 py-3 text-medium"
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="ask me anything..."
              onFocus={() => setExpanded(true)}
            />
          </PromptInputBody>
          <PromptInputFooter>
            <div className="flex-1" />
            <PromptInputSubmit disabled={!input.trim()} status={status} variant="ghost"/>
          </PromptInputFooter>
        </PromptInput>

        {/* Example prompts - always visible, rotate on click */}
        <div className="mt-4 flex flex-wrap gap-2 justify-center">
          {displayedPrompts.map((prompt) => (
            <button
              key={prompt}
              onClick={() => handleExampleClick(prompt)}
              className="px-4 py-2 text-sm bg-gray-800 hover:bg-gray-700 rounded-full border border-gray-700 transition-colors text-gray-300 hover:text-white"
              disabled={status === 'submitted'}
            >
              {prompt}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ChatInterface;