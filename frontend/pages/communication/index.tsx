import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlus, FaComments, FaUsers, FaBell, FaSearch, FaPaperPlane, FaPhone, FaVideo } from 'react-icons/fa';

interface Channel {
  id: number;
  name: string;
  description: string;
  type: 'public' | 'private' | 'team';
  memberCount: number;
  lastMessage: string;
  lastActivity: string;
  isActive: boolean;
}

interface Message {
  id: number;
  channelId: number;
  sender: string;
  content: string;
  timestamp: string;
  type: 'text' | 'file' | 'announcement';
}

export default function CommunicationPage() {
  const { user } = useAuth();
  const [channels, setChannels] = useState<Channel[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedChannel, setSelectedChannel] = useState<number | null>(null);
  const [newMessage, setNewMessage] = useState('');
  const [loading, setLoading] = useState(true);
  const [showCreateChannel, setShowCreateChannel] = useState(false);

  // Données de démonstration
  useEffect(() => {
    setTimeout(() => {
      setChannels([
        {
          id: 1,
          name: 'Équipe Développement',
          description: 'Canal pour l\'équipe de développement',
          type: 'team',
          memberCount: 8,
          lastMessage: 'Réunion prévue demain à 14h',
          lastActivity: '2024-02-05 15:30',
          isActive: true
        },
        {
          id: 2,
          name: 'Annonces Générales',
          description: 'Annonces importantes pour toute l\'entreprise',
          type: 'public',
          memberCount: 45,
          lastMessage: 'Nouvelle politique de télétravail',
          lastActivity: '2024-02-05 10:15',
          isActive: true
        },
        {
          id: 3,
          name: 'Support Technique',
          description: 'Canal d\'aide technique',
          type: 'public',
          memberCount: 12,
          lastMessage: 'Problème résolu, merci !',
          lastActivity: '2024-02-05 09:45',
          isActive: true
        }
      ]);

      setMessages([
        {
          id: 1,
          channelId: 1,
          sender: 'Jean Dupont',
          content: 'Bonjour l\'équipe ! Comment avance le projet ?',
          timestamp: '2024-02-05 14:30',
          type: 'text'
        },
        {
          id: 2,
          channelId: 1,
          sender: 'Marie Martin',
          content: 'Ça avance bien, j\'ai terminé la partie frontend',
          timestamp: '2024-02-05 14:35',
          type: 'text'
        },
        {
          id: 3,
          channelId: 1,
          sender: 'Pierre Durand',
          content: 'Parfait ! Réunion prévue demain à 14h pour faire le point',
          timestamp: '2024-02-05 15:30',
          type: 'text'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  const getChannelMessages = (channelId: number) => {
    return messages.filter(m => m.channelId === channelId);
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedChannel) return;

    const message: Message = {
      id: Date.now(),
      channelId: selectedChannel,
      sender: user?.employee?.firstName + ' ' + user?.employee?.lastName || 'Utilisateur',
      content: newMessage,
      timestamp: new Date().toISOString(),
      type: 'text'
    };

    setMessages([...messages, message]);
    setNewMessage('');
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString('fr-FR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <div className="flex justify-between items-center p-6 border-b">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Communication</h1>
          <p className="text-gray-600">Communiquez avec votre équipe en temps réel</p>
        </div>
        <button
          onClick={() => setShowCreateChannel(true)}
          className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Nouveau Canal</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar des canaux */}
        <div className="w-1/3 bg-gray-50 border-r overflow-y-auto">
          <div className="p-4">
            <div className="relative">
              <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                placeholder="Rechercher un canal..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
              />
            </div>
          </div>

          <div className="space-y-1">
            {channels.map((channel) => (
              <div
                key={channel.id}
                onClick={() => setSelectedChannel(channel.id)}
                className={`p-4 cursor-pointer hover:bg-gray-100 border-l-4 ${
                  selectedChannel === channel.id 
                    ? 'border-indigo-500 bg-indigo-50' 
                    : 'border-transparent'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className={`p-2 rounded-full ${
                      channel.type === 'team' ? 'bg-blue-100 text-blue-600' :
                      channel.type === 'private' ? 'bg-red-100 text-red-600' :
                      'bg-green-100 text-green-600'
                    }`}>
                      <FaComments className="w-4 h-4" />
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{channel.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{channel.lastMessage}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="flex items-center space-x-1 text-xs text-gray-500">
                      <FaUsers className="w-3 h-3" />
                      <span>{channel.memberCount}</span>
                    </div>
                    <div className="text-xs text-gray-400 mt-1">
                      {formatTime(channel.lastActivity)}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Zone de chat */}
        <div className="flex-1 flex flex-col">
          {selectedChannel ? (
            <>
              {/* En-tête du canal */}
              <div className="p-4 border-b bg-white">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900">
                      {channels.find(c => c.id === selectedChannel)?.name}
                    </h2>
                    <p className="text-sm text-gray-500">
                      {channels.find(c => c.id === selectedChannel)?.memberCount} membres
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <FaPhone className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <FaVideo className="w-4 h-4" />
                    </button>
                    <button className="p-2 text-gray-400 hover:text-gray-600 rounded-md hover:bg-gray-100">
                      <FaBell className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>

              {/* Messages */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {getChannelMessages(selectedChannel).map((message) => (
                  <div key={message.id} className="flex space-x-3">
                    <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <span className="text-sm font-medium text-indigo-600">
                        {message.sender.split(' ').map(n => n[0]).join('')}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2">
                        <span className="font-medium text-gray-900">{message.sender}</span>
                        <span className="text-xs text-gray-500">{formatTime(message.timestamp)}</span>
                      </div>
                      <p className="text-gray-700 mt-1">{message.content}</p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Zone de saisie */}
              <div className="p-4 border-t bg-white">
                <div className="flex space-x-3">
                  <input
                    type="text"
                    value={newMessage}
                    onChange={(e) => setNewMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Tapez votre message..."
                    className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:ring-indigo-500 focus:border-indigo-500"
                  />
                  <button
                    onClick={sendMessage}
                    className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700 flex items-center space-x-2"
                  >
                    <FaPaperPlane className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <FaComments className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sélectionnez un canal
                </h3>
                <p className="text-gray-500">
                  Choisissez un canal dans la liste pour commencer à communiquer
                </p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Modal de création de canal */}
      {showCreateChannel && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white">
            <div className="mt-3">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Nouveau Canal</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700">Nom du canal</label>
                  <input
                    type="text"
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    placeholder="Nom du canal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Description</label>
                  <textarea
                    className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2"
                    rows={3}
                    placeholder="Description du canal"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">Type</label>
                  <select className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2">
                    <option value="public">Public</option>
                    <option value="team">Équipe</option>
                    <option value="private">Privé</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300"
                >
                  Annuler
                </button>
                <button
                  onClick={() => setShowCreateChannel(false)}
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700"
                >
                  Créer
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
