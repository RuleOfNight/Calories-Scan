// src/app/dashboard/chatbot/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useToast } from '@/hooks/use-toast';
import type { ChatMessage } from '@/types';
import { nutritionChatbot, NutritionChatbotInput } from '@/ai/flows/nutrition-chatbot';
import { Send, Loader2, Bot, User } from 'lucide-react';
import React, { useState, FormEvent, useRef, useEffect } from 'react';
import { cn } from '@/lib/utils';

export default function ChatbotPage() {
  const { toast } = useToast();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (scrollAreaRef.current) {
      const scrollableViewport = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollableViewport) {
        scrollableViewport.scrollTop = scrollableViewport.scrollHeight;
      }
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  
  // AI message
  useEffect(() => {
    setMessages([
      { 
        id: 'initial-ai-message', 
        sender: 'ai', 
        text: "Hello! I'm NutriBot, your AI nutrition assistant. Ask me anything about food and health!", 
        timestamp: new Date() 
      }
    ]);
  }, []);


  const handleSubmit = async (e?: FormEvent) => {
    if (e) e.preventDefault();
    if (!input.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user',
      sender: 'user',
      text: input,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const chatbotInput: NutritionChatbotInput = { question: userMessage.text };
      const response = await nutritionChatbot(chatbotInput);
      
      const aiMessage: ChatMessage = {
        id: Date.now().toString() + '-ai',
        sender: 'ai',
        text: response.answer,
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, aiMessage]);

    } catch (error) {
      console.error("Chatbot error:", error);
      toast({ title: "Chatbot Error", description: "Sorry, I couldn't process your request.", variant: "destructive" });
      const errorMessage: ChatMessage = {
        id: Date.now().toString() + '-error',
        sender: 'ai',
        text: "I encountered an issue. Please try again later.",
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };
  
  const quickQuestions = [
    "What are good sources of protein?",
    "How much water should I drink daily?",
    "Tell me about benefits of Omega-3.",
    "Is intermittent fasting healthy?",
  ];

  const handleQuickQuestion = (question: string) => {
    setInput(question);

    const userMessage: ChatMessage = {
      id: Date.now().toString() + '-user-quick',
      sender: 'user',
      text: question,
      timestamp: new Date(),
    };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    // Call AI
    (async () => {
      try {
        const chatbotInput: NutritionChatbotInput = { question };
        const response = await nutritionChatbot(chatbotInput);
        
        const aiMessage: ChatMessage = {
          id: Date.now().toString() + '-ai-quick',
          sender: 'ai',
          text: response.answer,
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, aiMessage]);
      } catch (error) {
        console.error("Chatbot error (quick question):", error);
        toast({ title: "Chatbot Error", description: "Sorry, I couldn't process your request.", variant: "destructive" });
        const errorMessage: ChatMessage = {
          id: Date.now().toString() + '-error-quick',
          sender: 'ai',
          text: "I encountered an issue. Please try again later.",
          timestamp: new Date(),
        };
        setMessages(prev => [...prev, errorMessage]);
      } finally {
        setIsLoading(false);
      }
    })();
  };


  return (
    <Card className="flex flex-col h-[calc(100vh-10rem)] max-h-[800px] shadow-xl">
      <CardHeader className="border-b">
        <CardTitle className="text-2xl flex items-center"><Bot className="mr-3 h-7 w-7 text-primary" /> NutriBot Assistant</CardTitle>
        <CardDescription>Your AI-powered guide for nutrition and health queries.</CardDescription>
      </CardHeader>
      <CardContent className="flex-grow p-0 overflow-hidden">
        <ScrollArea className="h-full p-4" ref={scrollAreaRef}>
          <div className="space-y-6 pr-2">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={cn(
                  "flex items-end gap-2",
                  msg.sender === 'user' ? "justify-end" : "justify-start"
                )}
              >
                {msg.sender === 'ai' && (
                  <Avatar className="h-8 w-8 self-start">
                    <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                  </Avatar>
                )}
                <div
                  className={cn(
                    "max-w-[70%] rounded-xl px-4 py-3 text-sm shadow",
                    msg.sender === 'user'
                      ? "bg-primary text-primary-foreground rounded-br-none"
                      : "bg-card text-card-foreground rounded-bl-none border"
                  )}
                >
                  <p style={{ whiteSpace: 'pre-wrap' }}>{msg.text}</p>
                  <p className={cn(
                      "text-xs mt-1",
                      msg.sender === 'user' ? "text-primary-foreground/70 text-right" : "text-muted-foreground text-left"
                    )}
                  >
                    {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
                 {msg.sender === 'user' && (
                  <Avatar className="h-8 w-8 self-start">
                     <AvatarFallback className="bg-accent text-accent-foreground"><User size={18}/></AvatarFallback>
                  </Avatar>
                )}
              </div>
            ))}
             {isLoading && (
              <div className="flex items-end gap-2 justify-start">
                <Avatar className="h-8 w-8 self-start">
                  <AvatarFallback className="bg-primary text-primary-foreground"><Bot size={18}/></AvatarFallback>
                </Avatar>
                <div className="max-w-[70%] rounded-xl px-4 py-3 text-sm shadow bg-card text-card-foreground rounded-bl-none border">
                  <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>
        </ScrollArea>
      </CardContent>
      <CardFooter className="p-4 border-t">
        {messages.length <= 2 && !isLoading && ( // Show quick questions if chat is new
            <div className="mb-2 grid grid-cols-2 gap-2 w-full">
                {quickQuestions.map(q => (
                    <Button key={q} variant="outline" size="sm" onClick={() => handleQuickQuestion(q)}>
                        {q}
                    </Button>
                ))}
            </div>
        )}
        <form onSubmit={handleSubmit} className="flex w-full items-center space-x-2">
          <Input
            type="text"
            placeholder="Type your nutrition question..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
            className="flex-grow"
          />
          <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
            {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            <span className="sr-only">Send</span>
          </Button>
        </form>
      </CardFooter>
    </Card>
  );
}
