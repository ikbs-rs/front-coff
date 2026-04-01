import React, { useEffect, useMemo, useRef, useState, useCallback } from "react";
import { Button } from 'primereact/button';
import { Sidebar } from 'primereact/sidebar';
import { InputTextarea } from 'primereact/inputtextarea';
import { InputSwitch } from 'primereact/inputswitch';
import { Card } from 'primereact/card';
import { Messages } from 'primereact/messages';
import { Message } from 'primereact/message';
import { Tooltip } from 'primereact/tooltip';
import { classNames } from 'primereact/utils';
import { AIService } from '../../services/AIService';
import '../common/ai-chat.css';
import 'primeicons/primeicons.css';

const AIChatSidebar = () => {
    const aiService = useMemo(() => new AIService(), []);
    const [visible, setVisible] = useState(false);
    const [safeMode, setSafeMode] = useState(true);
    const [useLiveAI, setUseLiveAI] = useState(true);
    const [prompt, setPrompt] = useState("");
    const [isSending, setIsSending] = useState(false);
    const [messages, setMessages] = useState(() => {
        const history = aiService.getConversationHistory();
        const firstMessage = history?.[0]?.text || "";
        const hasLegacyAnonymousBanner = firstMessage.toLowerCase().includes("anonymous test mode");

        if (history?.length && !hasLegacyAnonymousBanner) {
            return history;
        }

        return aiService.getInitialMessages(false, { anonymousMode: false, useLiveAI: true });
    });
    const messagesRef = useRef(null);
    const tooltipRef = useRef(null);
    const isLimitReached = false; // Simplified for now

    useEffect(() => {
        if (visible && messagesRef.current) {
            messagesRef.current.scrollTop = messagesRef.current.scrollHeight;
        }
    }, [messages, visible]);

    useEffect(() => {
        const handleOpenPrompt = () => setVisible(true);
        window.addEventListener("open-ai-prompt", handleOpenPrompt);
        return () => {
            window.removeEventListener("open-ai-prompt", handleOpenPrompt);
        };
    }, []);

    useEffect(() => {
        aiService.saveConversation(messages);
    }, [aiService, messages]);

    const handleProcessPrompt = useCallback(async () => {
        if (isSending || isLimitReached || !prompt.trim()) {
            return;
        }

        setIsSending(true);
        try {
            const result = await aiService.sendPrompt({
                prompt,
                safeMode,
                messages,
                anonymousMode: false,
                useLiveAI,
                fallbackToLocal: true
            });

            if (!result) {
                return;
            }

            if (!result.normalizedPrompt) {
                return;
            }

            console.groupCollapsed(`[AI Chat] Obrada prompta ${new Date().toISOString()}`);
            console.log("Prompt:", prompt);
            console.log("Response:", result.responseText);
            console.log("Provider:", result.provider);
            console.groupEnd();

            setMessages((prev) => [...prev, result.userMessage, result.assistantMessage]);
            setPrompt("");
        } catch (error) {
            console.error("[AI Chat] Error:", error);
        } finally {
            setIsSending(false);
        }
    }, [prompt, safeMode, useLiveAI, messages, isSending, isLimitReached, aiService]);

    const handleVoiceInputClick = useCallback(async () => {
        const result = await aiService.transcribeVoiceInput();
        console.log("[AI Chat] Voice input (mock):", result);
        // TODO: Real voice input
    }, [aiService]);

    const handleClearConversation = useCallback(() => {
        const newMessages = aiService.startNewChat({ anonymousMode: false, useLiveAI });
        setMessages(newMessages);
        setPrompt("");
    }, [aiService, useLiveAI]);

    const renderMessage = (message) => {
        const isUser = message.role === "user";
        return (
            <Message 
                key={message.id}
                text={message.text}
                severity={isUser ? "info" : "success"}
                className={classNames("ai-chat-message", {
                    "ai-chat-message-user": isUser,
                    "ai-chat-message-assistant": !isUser
                })}
                header={isUser ? "Ti" : "AI"}
                headerClassName="ai-chat-message-role"
                pt={{
                    text: { className: "m-0" }
                }}
            />
        );
    };

    const modeText = useLiveAI 
        ? "Online mode: koristi GPT preko BAI backenda" 
        : "Local mode: koristi lokalnu obradu bez poziva eksternoj mrezi";

    return (
        <>
            <Tooltip ref={tooltipRef} target=".ai-chat-fab" position="top" content="AI asistent" />
            
            <Button
                icon={visible ? "pi pi-times" : "pi pi-android"}
                className="ai-chat-fab p-button-rounded p-button-text p-button-plain elevation-6"
                onClick={() => setVisible(prev => !prev)}
                aria-label="AI asistent"
                size="large"
            />

            <Sidebar 
                visible={visible} 
                position="right" 
                onHide={() => setVisible(false)}
                className="ai-chat-sidebar"
                header="AI Chat"
                style={{ width: '400px' }}
                modal={false}
                dismissable={false}
            >
                <div className="p-fluid">
                    <div className="ai-chat-header">
                        <i className="pi pi-android" style={{ fontSize: '1.5rem' }} />
                        <div>
                            <div className="font-bold">AI Prompt Assistant</div>
                            <div className="ai-chat-subtitle">{modeText}</div>
                        </div>
                    </div>

                    <div className="ai-chat-switches">
                        <div className="flex align-items-center gap-2">
                            <InputSwitch 
                                checked={safeMode} 
                                onChange={(e) => setSafeMode(e.value)} 
                            />
                            <label>Secure local mode</label>
                        </div>
                        <div className="flex align-items-center gap-2">
                            <InputSwitch 
                                checked={useLiveAI} 
                                onChange={(e) => setUseLiveAI(e.value)} 
                            />
                            <label>{useLiveAI ? "Online" : "Local"} mode</label>
                        </div>
                    </div>

                    <div className="ai-chat-messages" ref={messagesRef}>
                        {messages.map(renderMessage)}
                    </div>

                    <div className="ai-chat-input-section">
                        <InputTextarea 
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    handleProcessPrompt();
                                }
                            }}
                            placeholder="Npr: Napravi plan kako da optimizujem ucitavanje stranice i smanjim bundle."
                            disabled={isSending || isLimitReached}
                            rows={3}
                            autoResize
                            className="ai-chat-textarea"
                        />
                        
                        <div className="ai-chat-actions">
                            <Button 
                                icon="pi pi-comment" 
                                className="p-button-text p-button-sm ai-chat-btn"
                                tooltip="Novi chat"
                                onClick={handleClearConversation}
                                disabled={isSending}
                            />
                            <Button 
                                icon="pi pi-microphone" 
                                className="p-button-text p-button-sm ai-chat-btn"
                                tooltip="Glasovni unos"
                                onClick={handleVoiceInputClick}
                                disabled={isSending}
                            />
                            <Button 
                                label={isSending ? "Obrada..." : "Pošalji"}
                                icon="pi pi-send"
                                className="p-button-sm ai-chat-btn"
                                onClick={handleProcessPrompt}
                                loading={isSending}
                                disabled={isLimitReached || !prompt.trim()}
                            />
                        </div>
                    </div>
                </div>
            </Sidebar>
        </>
    );
};

export default AIChatSidebar;
