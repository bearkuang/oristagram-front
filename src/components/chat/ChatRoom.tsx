import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { getFullImageUrl } from '../../services/utils';

interface User {
    id: number;
    username: string;
    profile_picture: string;
}

interface Message {
    id: number;
    sender: User;
    receiver: User;
    content: string;
    timestamp: string;
}

interface ChatRoomProps {
    chatroomId: number;
    currentUser: User;
    onClose: () => void;
}

const ChatRoom: React.FC<ChatRoomProps> = ({ chatroomId, currentUser, onClose }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [messageContent, setMessageContent] = useState('');
    const [chatPartner, setChatPartner] = useState<User | null>(null);
    const ws = useRef<WebSocket | null>(null);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/chatrooms/${chatroomId}/messages/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setMessages(response.data);
            } catch (error) {
                console.error('Error fetching messages:', error);
            }
        };

        const fetchChatPartner = async () => {
            try {
                const token = localStorage.getItem('accessToken');
                const response = await axios.get(`http://localhost:8000/api/chatrooms/${chatroomId}/`, {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                const partner = response.data.participants.find((user: User) => user.id !== currentUser.id);
                setChatPartner(partner);
            } catch (error) {
                console.error('Error fetching chat partner:', error);
            }
        };

        fetchMessages();
        fetchChatPartner();

        // WebSocket connection
        const wsUrl = `ws://localhost:8000/ws/chat/${chatroomId}/`;
        ws.current = new WebSocket(wsUrl);

        ws.current.onopen = () => {
            console.log('WebSocket connection established');
        };

        ws.current.onmessage = (event) => {
            const data = JSON.parse(event.data);
            setMessages((prevMessages) => [...prevMessages, data.message]);
        };

        ws.current.onclose = () => {
            console.log('WebSocket connection closed');
        };

        ws.current.onerror = (error) => {
            console.error('WebSocket error:', error);
        };

        // Cleanup on component unmount
        return () => {
            ws.current?.close();
        };
    }, [chatroomId, currentUser.id]);

    const handleSendMessage = async () => {
        try {
            const token = localStorage.getItem('accessToken');
            const response = await axios.post(
                `http://localhost:8000/api/chatrooms/${chatroomId}/send_message/`,
                {
                    content: messageContent,
                    receiver_id: chatPartner?.id
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );
            setMessages([...messages, response.data]);
            setMessageContent('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    return (
        <div className="chatroom-container flex flex-col h-full">
            <div className="chatroom-header flex items-center p-4 border-b border-gray-300">
                {chatPartner && (
                    <>
                        <div
                            className="bg-center bg-no-repeat bg-cover rounded-full h-10 w-10"
                            style={{ backgroundImage: `url(${getFullImageUrl(chatPartner.profile_picture)})` }}
                        ></div>
                        <div className="ml-4">
                            <p className="text-sm font-medium">{chatPartner.username}</p>
                        </div>
                    </>
                )}
                <button onClick={onClose} className="ml-auto text-gray-500 hover:text-gray-700">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <div className="chatroom-messages flex-1 overflow-y-auto p-4">
                {messages.map(message => (
                    <div key={message.id} className={`flex ${message.sender.id === currentUser.id ? 'justify-end' : 'justify-start'}`}>
                        <div className={`p-2 rounded-lg ${message.sender.id === currentUser.id ? 'bg-blue-500 text-white' : 'bg-gray-300'}`}>
                            <p className="text-sm">{message.content}</p>
                            <p className="text-xs text-right">{new Date(message.timestamp).toLocaleTimeString()}</p>
                        </div>
                    </div>
                ))}
            </div>
            <div className="chatroom-input p-4 border-t border-gray-300">
                <div className="flex items-center">
                    <input
                        type="text"
                        value={messageContent}
                        onChange={e => setMessageContent(e.target.value)}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="메시지 입력"
                    />
                    <button onClick={handleSendMessage} className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-md">
                        전송
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ChatRoom;
