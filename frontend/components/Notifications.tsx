import { useEffect, useState } from 'react';
import { FaBell, FaCheck, FaTimes, FaInfoCircle, FaExclamationTriangle, FaCheckCircle } from 'react-icons/fa';
import { MdNotifications } from 'react-icons/md';
import axios from 'axios';

interface Notification {
  id: number;
  type: string;
  message: string;
  lu: boolean;
  createdAt: string;
}

export default function Notifications() {
  const [notifs, setNotifs] = useState<Notification[]>([]);
  const [open, setOpen] = useState(false);

  const fetchNotifs = () => {
    axios.get('http://localhost:4000/api/notifications', { withCredentials: true })
      .then(res => setNotifs(res.data))
      .catch(() => setNotifs([]));
  };

  useEffect(() => { fetchNotifs(); }, []);

  const markAsRead = async (id: number) => {
    await axios.patch(`http://localhost:4000/api/notifications/${id}/lu`, {}, { withCredentials: true });
    fetchNotifs();
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'CONGE':
        return <FaCheckCircle className="text-green-500" />;
      case 'PAIE':
        return <FaInfoCircle className="text-blue-500" />;
      case 'URGENT':
        return <FaExclamationTriangle className="text-red-500" />;
      default:
        return <FaInfoCircle className="text-gray-500" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'CONGE':
        return 'border-l-green-500 bg-green-50';
      case 'PAIE':
        return 'border-l-blue-500 bg-blue-50';
      case 'URGENT':
        return 'border-l-red-500 bg-red-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const unreadCount = notifs.filter(n => !n.lu).length;

  return (
    <div className="relative">
      <button 
        onClick={() => setOpen(!open)} 
        className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
      >
        <MdNotifications className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center font-medium">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
      
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white rounded-xl shadow-lg border border-gray-200 z-50 max-h-96 overflow-hidden">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2">
              <MdNotifications className="text-xl text-gray-600" />
              <h3 className="font-semibold text-gray-900">Notifications</h3>
              {unreadCount > 0 && (
                <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full font-medium">
                  {unreadCount} nouveau{unreadCount > 1 ? 'x' : ''}
                </span>
              )}
            </div>
            <button 
              onClick={() => setOpen(false)}
              className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <FaTimes className="text-gray-400" />
            </button>
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-y-auto">
            {notifs.length === 0 ? (
              <div className="p-8 text-center">
                <div className="text-gray-400 mb-3">
                  <FaBell className="text-4xl mx-auto" />
                </div>
                <p className="text-gray-600 font-medium">Aucune notification</p>
                <p className="text-sm text-gray-500 mt-1">Vous êtes à jour !</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifs.map(notif => (
                  <div 
                    key={notif.id} 
                    className={`p-4 hover:bg-gray-50 transition-colors border-l-4 ${getNotificationColor(notif.type)} ${!notif.lu ? 'bg-opacity-100' : 'bg-opacity-50'}`}
                  >
                    <div className="flex items-start space-x-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notif.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between">
                          <p className={`text-sm font-medium ${!notif.lu ? 'text-gray-900' : 'text-gray-600'}`}>
                            {notif.type}
                          </p>
                          {!notif.lu && (
                            <button 
                              onClick={() => markAsRead(notif.id)}
                              className="p-1 hover:bg-gray-200 rounded transition-colors"
                              title="Marquer comme lue"
                            >
                              <FaCheck className="text-xs text-green-600" />
                            </button>
                          )}
                        </div>
                        <p className={`text-sm mt-1 ${!notif.lu ? 'text-gray-800' : 'text-gray-600'}`}>
                          {notif.message}
                        </p>
                        <p className="text-xs text-gray-500 mt-2">
                          {new Date(notif.createdAt).toLocaleString('fr-FR', {
                            day: 'numeric',
                            month: 'short',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifs.length > 0 && (
            <div className="p-3 border-t border-gray-200 bg-gray-50">
              <button 
                className="w-full text-sm text-indigo-600 hover:text-indigo-800 font-medium"
                onClick={() => {
                  notifs.filter(n => !n.lu).forEach(n => markAsRead(n.id));
                }}
              >
                Marquer tout comme lu
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
