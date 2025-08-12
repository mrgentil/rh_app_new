import React, { useState, useEffect } from 'react';
import { useAuth } from '../../hooks/useAuth';
import { FaPlay, FaPause, FaStop, FaClock, FaCalendar, FaUser, FaDownload } from 'react-icons/fa';

interface TimeEntry {
  id: number;
  employeeName: string;
  project: string;
  task: string;
  startTime: string;
  endTime: string;
  duration: number; // en minutes
  date: string;
  status: 'active' | 'paused' | 'completed';
}

export default function TimeTrackingPage() {
  const { user } = useAuth();
  const [timeEntries, setTimeEntries] = useState<TimeEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTimer, setActiveTimer] = useState<number | null>(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  // Données de démonstration
  useEffect(() => {
    setTimeout(() => {
      setTimeEntries([
        {
          id: 1,
          employeeName: 'Jean Dupont',
          project: 'Projet Alpha',
          task: 'Développement frontend',
          startTime: '09:00',
          endTime: '12:30',
          duration: 210,
          date: '2024-02-05',
          status: 'completed'
        },
        {
          id: 2,
          employeeName: 'Marie Martin',
          project: 'Projet Beta',
          task: 'Tests unitaires',
          startTime: '14:00',
          endTime: '17:00',
          duration: 180,
          date: '2024-02-05',
          status: 'completed'
        },
        {
          id: 3,
          employeeName: 'Pierre Durand',
          project: 'Projet Gamma',
          task: 'Documentation',
          startTime: '10:30',
          endTime: '',
          duration: 90,
          date: '2024-02-05',
          status: 'active'
        }
      ]);
      setLoading(false);
    }, 1000);
  }, []);

  // Mise à jour de l'heure actuelle
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return `${hours}h ${mins}m`;
  };

  const getTotalHours = () => {
    return timeEntries.reduce((total, entry) => total + entry.duration, 0);
  };

  const getActiveEntries = () => {
    return timeEntries.filter(entry => entry.status === 'active').length;
  };

  const getTodayEntries = () => {
    const today = new Date().toISOString().split('T')[0];
    return timeEntries.filter(entry => entry.date === today).length;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Temps & Planning</h1>
          <p className="text-gray-600">Suivez le temps de travail de votre équipe</p>
        </div>
        <div className="flex space-x-3">
          <button className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 flex items-center space-x-2">
            <FaDownload className="w-4 h-4" />
            <span>Exporter</span>
          </button>
        </div>
      </div>

      {/* Statistiques */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-blue-100 text-blue-600">
              <FaClock className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Heures</p>
              <p className="text-2xl font-bold text-gray-900">{formatDuration(getTotalHours())}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-green-100 text-green-600">
              <FaPlay className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">En cours</p>
              <p className="text-2xl font-bold text-gray-900">{getActiveEntries()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-purple-100 text-purple-600">
              <FaCalendar className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Aujourd'hui</p>
              <p className="text-2xl font-bold text-gray-900">{getTodayEntries()}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <div className="p-3 rounded-full bg-yellow-100 text-yellow-600">
              <FaUser className="w-6 h-6" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Équipe</p>
              <p className="text-2xl font-bold text-gray-900">{timeEntries.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Horloge en temps réel */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Heure Actuelle</h3>
          <div className="text-4xl font-bold text-indigo-600">
            {currentTime.toLocaleTimeString('fr-FR')}
          </div>
          <div className="text-gray-500 mt-2">
            {currentTime.toLocaleDateString('fr-FR', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
        </div>
      </div>

      {/* Tableau des temps */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Suivi du temps - Équipe</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Employé
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Projet
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tâche
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Début
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Fin
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Durée
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Statut
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {timeEntries.map((entry) => (
                <tr key={entry.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-indigo-600">
                          {entry.employeeName.split(' ').map(n => n[0]).join('')}
                        </span>
                      </div>
                      <div className="ml-3">
                        <div className="text-sm font-medium text-gray-900">{entry.employeeName}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.project}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.task}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.startTime}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {entry.endTime || '-'}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDuration(entry.duration)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                      entry.status === 'active' ? 'bg-green-100 text-green-800' :
                      entry.status === 'paused' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {entry.status === 'active' ? 'En cours' :
                       entry.status === 'paused' ? 'En pause' : 'Terminé'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Planning de la semaine */}
      <div className="bg-white shadow-sm rounded-lg overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Planning de la Semaine</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-7 gap-4">
            {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day, index) => (
              <div key={day} className="text-center">
                <div className="text-sm font-medium text-gray-900 mb-2">{day}</div>
                <div className={`h-20 rounded-lg border-2 border-dashed ${
                  index < 5 ? 'border-indigo-300 bg-indigo-50' : 'border-gray-300 bg-gray-50'
                } flex items-center justify-center`}>
                  {index < 5 ? (
                    <span className="text-sm text-indigo-600 font-medium">8h</span>
                  ) : (
                    <span className="text-sm text-gray-400">Repos</span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
