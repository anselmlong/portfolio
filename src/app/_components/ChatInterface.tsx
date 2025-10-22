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

const ChatInterface = () => {
  const [input, setInput] = useState('');
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

  const handleSubmit = (message: PromptInputMessage) => {
    console.log('=== SUBMITTING MESSAGE ===');
    console.log('Input text:', message.text);
    
    if (!message.text?.trim()) {
      console.log('Empty message, skipping');
      return;
    }
    
    console.log('Calling sendMessage...');
    sendMessage({
      text: message.text,
    });
    setInput('');
  };

  return (
    <div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
      <div className="flex flex-col h-full">
        <Conversation className="h-full">
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

        <PromptInput onSubmit={handleSubmit} className="mt-4">
          <PromptInputBody>
            <PromptInputTextarea
              onChange={(e) => setInput(e.target.value)}
              value={input}
              placeholder="Ask about Anselm's background..."
            />
          </PromptInputBody>
          <PromptInputFooter>
            <div className="flex-1" />
            <PromptInputSubmit disabled={!input.trim()} status={status} />
          </PromptInputFooter>
        </PromptInput>
      </div>
    </div>
  );
};

export default ChatInterface;