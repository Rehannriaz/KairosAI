'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search,
  Send,
  BarChart2,
  Globe,
  Video,
  PlaneTakeoff,
  AudioLines,
} from 'lucide-react';
import useDebounce from '@/hooks/use-debounce';
import DescriptionIcon from '@mui/icons-material/Description';
import { DevicesOutlined } from '@mui/icons-material';
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import AccountBoxIcon from '@mui/icons-material/AccountBox';
interface Action {
  id: string;
  label: string;
  icon: React.ReactNode;
  description?: string;
  short?: string;
  end?: string;
  route: string;
}

interface SearchResult {
  actions: Action[];
}

const defaultActions: Action[] = [
  {
    id: '1',
    label: 'Go to Dashboard',
    icon: <HomeOutlinedIcon className="h-4 w-4 text-purple-500" />,
    end: 'Home',
    route: '/dashboard',
  },
  {
    id: '2',
    label: 'Check your Resumes',
    icon: <DescriptionIcon className="h-4 w-4 text-blue-500" />,
    end: 'Resumes',
    route: '/resume',
  },
  {
    id: '3',
    label: 'Mock Interviews',
    icon: <DevicesOutlined className="h-4 w-4 text-orange-500" />,
    end: 'Interviews',
    route: '/mock-interviews',
  },

  {
    id: '4',
    label: 'View Profile',
    icon: <AccountBoxIcon className="h-4 w-4 text-green-500" />,
    end: 'Profile',
    route: '/profile',
  },
  {
    id: '5',
    label: 'Settings',
    icon: <Globe className="h-4 w-4 text-blue-500" />,
    end: 'Settings',
    route: '/settings',
  },
];

function ActionSearchBar({ actions = defaultActions }: { actions?: Action[] }) {
  const router = useRouter();
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [selectedAction, setSelectedAction] = useState<Action | null>(null);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!isFocused) {
      setResult(null);
      return;
    }

    if (!debouncedQuery) {
      setResult({ actions });
      return;
    }

    const normalizedQuery = debouncedQuery.toLowerCase().trim();
    const filteredActions = actions.filter((action) => {
      const searchableText = action.label.toLowerCase();
      return searchableText.includes(normalizedQuery);
    });

    setResult({ actions: filteredActions });
  }, [debouncedQuery, isFocused, actions]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value);
  };

  const handleActionClick = (action: Action) => {
    setSelectedAction(action);
    router.push(action.route);
  };

  const container = {
    hidden: { opacity: 0, height: 0 },
    show: {
      opacity: 1,
      height: 'auto',
      transition: {
        height: {
          duration: 0.4,
        },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: {
          duration: 0.3,
        },
        opacity: {
          duration: 0.2,
        },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    exit: {
      opacity: 0,
      y: -10,
      transition: {
        duration: 0.2,
      },
    },
  };

  const handleFocus = () => {
    setSelectedAction(null);
    setIsFocused(true);
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search commands..."
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          className="pl-8 pr-3 py-1.5 h-9 text-sm rounded-lg focus-visible:ring-offset-0"
        />
        <div className="absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4">
          <AnimatePresence mode="popLayout">
            {query.length > 0 ? (
              <motion.div
                key="send"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Send className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="w-4 h-4 text-gray-400 dark:text-gray-500" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && result && !selectedAction && (
          <motion.div
            className="absolute z-10 w-full mt-1 border rounded-md shadow-lg overflow-hidden dark:border-gray-700 bg-white dark:bg-gray-800"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.ul>
              {result.actions.map((action) => (
                <motion.li
                  key={action.id}
                  className="px-3 py-2 flex items-center justify-between hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                  variants={item}
                  layout
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">{action.icon}</span>
                    <span className="text-sm font-medium text-gray-900 dark:text-gray-100">
                      {action.label}
                    </span>
                    <span className="text-xs text-gray-400">
                      {action.description}
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-gray-400">
                      {action.short}
                    </span>
                    <span className="text-xs text-gray-400 text-right">
                      {action.end}
                    </span>
                  </div>
                </motion.li>
              ))}
            </motion.ul>
            <div className="mt-2 px-3 py-2 border-t border-gray-100 dark:border-gray-700">
              <div className="flex items-center justify-between text-xs text-gray-500">
                {/* <span>Press ⌘K to open commands</span>
                <span>ESC to cancel</span> */}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActionSearchBar;
