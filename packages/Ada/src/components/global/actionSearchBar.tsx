'use client';

import { Input } from '@/components/ui/input';
import useDebounce from '@/hooks/use-debounce';
import {
  DevicesOutlined,
  AccountBox,
  Description,
  HomeOutlined,
} from '@mui/icons-material';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Send, Globe } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

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
    icon: <HomeOutlined className="h-4 w-4 text-primary" />,
    end: 'Home',
    route: '/dashboard',
  },
  {
    id: '2',
    label: 'Check your Resumes',
    icon: <Description className="h-4 w-4 text-chart-2" />,
    end: 'Resumes',
    route: '/resume',
  },
  {
    id: '3',
    label: 'Mock Interviews',
    icon: <DevicesOutlined className="h-4 w-4 text-chart-5" />,
    end: 'Interviews',
    route: '/mock-interviews',
  },
  {
    id: '4',
    label: 'View Profile',
    icon: <AccountBox className="h-4 w-4 text-chart-3" />,
    end: 'Profile',
    route: '/profile',
  },
  {
    id: '5',
    label: 'Settings',
    icon: <Globe className="h-4 w-4 text-chart-1" />,
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
    if (!isFocused) return setResult(null);
    if (!debouncedQuery) return setResult({ actions });

    const normalized = debouncedQuery.toLowerCase().trim();
    const filtered = actions.filter((a) =>
      a.label.toLowerCase().includes(normalized)
    );
    setResult({ actions: filtered });
  }, [debouncedQuery, isFocused, actions]);

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
        height: { duration: 0.4 },
        staggerChildren: 0.1,
      },
    },
    exit: {
      opacity: 0,
      height: 0,
      transition: {
        height: { duration: 0.3 },
        opacity: { duration: 0.2 },
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
    exit: { opacity: 0, y: -10, transition: { duration: 0.2 } },
  };

  return (
    <div className="relative w-full">
      <div className="relative">
        <Input
          type="text"
          placeholder="Search commands..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => {
            setSelectedAction(null);
            setIsFocused(true);
          }}
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
                <Send className="w-4 h-4 text-accent" />
              </motion.div>
            ) : (
              <motion.div
                key="search"
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                exit={{ y: 20, opacity: 0 }}
                transition={{ duration: 0.2 }}
              >
                <Search className="w-4 h-4 text-muted-foreground" />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {isFocused && result && !selectedAction && (
          <motion.div
            className="absolute z-10 w-full mt-1 rounded-md border bg-popover text-foreground border-border shadow-md"
            variants={container}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            <motion.ul>
              {result.actions.map((action) => (
                <motion.li
                  key={action.id}
                  className="px-3 py-2 flex items-center justify-between hover:bg-accent/20 cursor-pointer transition-colors"
                  variants={item}
                  layout
                  onClick={() => handleActionClick(action)}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-muted-foreground">{action.icon}</span>
                    <span className="text-sm font-medium text-foreground">
                      {action.label}
                    </span>
                    {action.description && (
                      <span className="text-xs text-muted-foreground">
                        {action.description}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    {action.short && <span>{action.short}</span>}
                    {action.end && (
                      <span className="text-right">{action.end}</span>
                    )}
                  </div>
                </motion.li>
              ))}
            </motion.ul>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ActionSearchBar;
