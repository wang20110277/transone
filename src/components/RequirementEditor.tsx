import { useState, useRef, useEffect } from "react";
import { MessageSquare, Eye, Code2, Send, Save, CheckCircle2, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { ResizableHandle, ResizablePanel, ResizablePanelGroup } from "@/components/ui/resizable";
import { getRequirementResponse } from "../services/gemini";
import { ChatMessage } from "../types";

export function RequirementEditor() {
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: '您好！我是您的 AI 设计助手。请描述您想要构建的需求或 UI，我将为您生成原型。', timestamp: new Date().toISOString() }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [prototype, setPrototype] = useState<string>("");
  const [activeView, setActiveView] = useState<"preview" | "code">("preview");
  
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: ChatMessage = {
      role: 'user',
      content: input,
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    const response = await getRequirementResponse(input, messages.map(m => ({ role: m.role, content: m.content })));
    
    const assistantMessage: ChatMessage = {
      role: 'assistant',
      content: response || "生成响应时出错",
      timestamp: new Date().toISOString()
    };

    setMessages(prev => [...prev, assistantMessage]);
    
    // Extract code block if present
    const codeMatch = response?.match(/```tsx?([\s\S]*?)```/);
    if (codeMatch && codeMatch[1]) {
      setPrototype(codeMatch[1].trim());
    }

    setIsLoading(false);
  };

  return (
    <div className="h-[calc(100vh-12rem)] border rounded-xl overflow-hidden bg-card shadow-lg">
      <ResizablePanelGroup direction="horizontal">
        <ResizablePanel defaultSize={35} minSize={25}>
          <div className="flex flex-col h-full bg-muted/30">
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-primary" />
                <span className="font-semibold">AI 设计对话</span>
              </div>
              <Badge variant="secondary">v1.0</Badge>
            </div>
            
            <ScrollArea className="flex-1 p-4" ref={scrollRef}>
              <div className="space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                    <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                      msg.role === 'user' 
                        ? 'bg-primary text-primary-foreground rounded-tr-none' 
                        : 'bg-card border rounded-tl-none'
                    }`}>
                      {msg.content.split('```')[0]}
                    </div>
                  </div>
                ))}
                {isLoading && (
                  <div className="flex justify-start">
                    <div className="bg-card border p-3 rounded-2xl rounded-tl-none flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span className="text-xs text-muted-foreground">思考中...</span>
                    </div>
                  </div>
                )}
              </div>
            </ScrollArea>

            <div className="p-4 border-t bg-card">
              <div className="flex gap-2">
                <Input 
                  placeholder="描述您的 UI 需求..." 
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                  className="bg-muted/50 border-none"
                />
                <Button size="icon" onClick={handleSend} disabled={isLoading}>
                  <Send className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>
        </ResizablePanel>

        <ResizableHandle withHandle />

        <ResizablePanel defaultSize={65}>
          <div className="flex flex-col h-full bg-background">
            <div className="p-4 border-b flex items-center justify-between bg-card">
              <Tabs value={activeView} onValueChange={(v) => setActiveView(v as any)} className="w-auto">
                <TabsList className="grid w-full grid-cols-2 h-8">
                  <TabsTrigger value="preview" className="text-xs gap-1.5">
                    <Eye className="w-3.5 h-3.5" /> 预览
                  </TabsTrigger>
                  <TabsTrigger value="code" className="text-xs gap-1.5">
                    <Code2 className="w-3.5 h-3.5" /> 代码
                  </TabsTrigger>
                </TabsList>
              </Tabs>
              
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" className="h-8 gap-1.5">
                  <Save className="w-3.5 h-3.5" /> 保存制品
                </Button>
                <Button size="sm" className="h-8 gap-1.5 bg-green-600 hover:bg-green-700">
                  <CheckCircle2 className="w-3.5 h-3.5" /> 交付
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-muted/10">
              {activeView === "preview" ? (
                <div className="w-full h-full min-h-[400px] bg-card rounded-lg border shadow-sm flex items-center justify-center relative overflow-hidden">
                  {prototype ? (
                    <div className="w-full h-full p-4">
                       {/* In a real app, we'd use a sandboxed iframe or dynamic component rendering */}
                       <div className="text-center text-muted-foreground">
                         <p className="mb-4">原型预览就绪</p>
                         <div className="p-8 border-2 border-dashed rounded-lg bg-muted/20">
                            <p className="text-xs font-mono mb-4">正在渲染组件...</p>
                            <div className="animate-pulse flex space-y-4 flex-col">
                              <div className="h-4 bg-muted rounded w-3/4"></div>
                              <div className="h-4 bg-muted rounded w-1/2"></div>
                              <div className="h-20 bg-muted rounded"></div>
                            </div>
                         </div>
                         <p className="mt-4 text-xs">注意：在此演示中，我们展示了结构。实际渲染需要运行时沙箱。</p>
                       </div>
                    </div>
                  ) : (
                    <div className="text-center text-muted-foreground">
                      <Eye className="w-12 h-12 mx-auto mb-4 opacity-20" />
                      <p>尚未生成原型。</p>
                      <p className="text-xs">与 AI 对话以开始设计。</p>
                    </div>
                  )}
                </div>
              ) : (
                <div className="w-full h-full bg-zinc-950 rounded-lg border p-4 font-mono text-sm text-zinc-300 overflow-auto">
                  {prototype ? (
                    <pre><code>{prototype}</code></pre>
                  ) : (
                    <div className="h-full flex items-center justify-center text-zinc-500">
                      <Code2 className="w-12 h-12 mb-4 opacity-20" />
                      <span>尚未生成代码。</span>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </ResizablePanel>
      </ResizablePanelGroup>
    </div>
  );
}
