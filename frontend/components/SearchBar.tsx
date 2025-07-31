import { useState, useEffect, useRef } from 'react';
import { FaSearch, FaTimes, FaUser, FaBuilding, FaCalendarAlt, FaMoneyCheckAlt } from 'react-icons/fa';
import { useRouter } from 'next/router';

interface SearchResult {
  id: number;
  type: 'employee' | 'department' | 'leave' | 'payroll';
  title: string;
  subtitle: string;
  url: string;
  icon: React.ReactNode;
}

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [results, setResults] = useState<SearchResult[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Données de démonstration
  const mockData: SearchResult[] = [
    {
      id: 1,
      type: 'employee',
      title: 'Jean Martin',
      subtitle: 'Développeur Senior - IT',
      url: '/employes/1',
      icon: <FaUser className="w-4 h-4 text-blue-500" />
    },
    {
      id: 2,
      type: 'employee',
      title: 'Marie Dubois',
      subtitle: 'Chef de projet - Marketing',
      url: '/employes/2',
      icon: <FaUser className="w-4 h-4 text-blue-500" />
    },
    {
      id: 3,
      type: 'department',
      title: 'Département IT',
      subtitle: '12 employés',
      url: '/departments/1',
      icon: <FaBuilding className="w-4 h-4 text-green-500" />
    },
    {
      id: 4,
      type: 'leave',
      title: 'Demande de congé - Jean Martin',
      subtitle: 'Du 15 au 20 janvier 2024',
      url: '/conges/1',
      icon: <FaCalendarAlt className="w-4 h-4 text-yellow-500" />
    },
    {
      id: 5,
      type: 'payroll',
      title: 'Paie décembre 2023',
      subtitle: 'Traité le 31/12/2023',
      url: '/paie/1',
      icon: <FaMoneyCheckAlt className="w-4 h-4 text-purple-500" />
    }
  ];

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSelectedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isOpen) return;

      switch (event.key) {
        case 'ArrowDown':
          event.preventDefault();
          setSelectedIndex(prev => 
            prev < results.length - 1 ? prev + 1 : prev
          );
          break;
        case 'ArrowUp':
          event.preventDefault();
          setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
          break;
        case 'Enter':
          event.preventDefault();
          if (selectedIndex >= 0 && results[selectedIndex]) {
            handleResultClick(results[selectedIndex]);
          }
          break;
        case 'Escape':
          setIsOpen(false);
          setSelectedIndex(-1);
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, results, selectedIndex]);

  const performSearch = async (searchQuery: string) => {
    if (!searchQuery.trim()) {
      setResults([]);
      return;
    }

    setIsLoading(true);
    
    // Simuler un délai de recherche
    await new Promise(resolve => setTimeout(resolve, 300));

    // Filtrer les données de démonstration
    const filteredResults = mockData.filter(item =>
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.subtitle.toLowerCase().includes(searchQuery.toLowerCase())
    );

    setResults(filteredResults);
    setIsLoading(false);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setQuery(value);
    setSelectedIndex(-1);
    
    if (value.trim()) {
      setIsOpen(true);
      performSearch(value);
    } else {
      setIsOpen(false);
      setResults([]);
    }
  };

  const handleResultClick = (result: SearchResult) => {
    setIsOpen(false);
    setQuery('');
    setSelectedIndex(-1);
    router.push(result.url);
  };

  const clearSearch = () => {
    setQuery('');
    setIsOpen(false);
    setResults([]);
    setSelectedIndex(-1);
    inputRef.current?.focus();
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case 'employee':
        return 'Employé';
      case 'department':
        return 'Département';
      case 'leave':
        return 'Congé';
      case 'payroll':
        return 'Paie';
      default:
        return 'Autre';
    }
  };

  return (
    <div className="relative" ref={searchRef}>
      <div className="relative">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <FaSearch className="h-4 w-4 text-gray-400" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          placeholder="Rechercher employés, départements, congés..."
          className="block w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-indigo-500 focus:border-indigo-500"
        />
        {query && (
          <button
            onClick={clearSearch}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            <FaTimes className="h-4 w-4 text-gray-400 hover:text-gray-600" />
          </button>
        )}
      </div>

      {/* Résultats de recherche */}
      {isOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-lg shadow-lg border border-gray-200 py-2 z-50 max-h-96 overflow-y-auto">
          {isLoading ? (
            <div className="px-4 py-8 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-sm text-gray-500 mt-2">Recherche en cours...</p>
            </div>
          ) : results.length > 0 ? (
            <div className="py-1">
              {results.map((result, index) => (
                <div
                  key={result.id}
                  className={`px-4 py-3 hover:bg-gray-50 cursor-pointer ${
                    index === selectedIndex ? 'bg-indigo-50 border-l-4 border-indigo-500' : ''
                  }`}
                  onClick={() => handleResultClick(result)}
                >
                  <div className="flex items-center space-x-3">
                    <div className="flex-shrink-0">
                      {result.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {result.title}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {result.subtitle}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {getTypeLabel(result.type)}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() ? (
            <div className="px-4 py-8 text-center">
              <FaSearch className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-500">Aucun résultat trouvé</p>
              <p className="text-xs text-gray-400 mt-1">Essayez avec d'autres mots-clés</p>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
} 