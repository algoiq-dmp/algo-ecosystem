'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import AppShell from '@/components/AppShell';
import RightPanel from '@/components/RightPanel';
import BottomPanel from '@/components/BottomPanel';
import TopologyCanvas from '@/components/TopologyCanvas';
import { useTheme } from '@/hooks/useTheme';
import { useAuth } from '@/hooks/useAuth';
import TopologyFilterBar from '@/components/TopologyFilterBar';
import PrinciplesPanel from '@/components/PrinciplesPanel';
import CriticalEnginesBadge from '@/components/CriticalEnginesBadge';
import EngineReferencePanel from '@/components/EngineReferencePanel';
import AskAI from '@/components/AskAI';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rightOpen, setRightOpen] = useState(true);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['product', 'engine', 'api', 'infrastructure', 'strategy', 'exchange', 'broker']));
  const { theme } = useTheme();

  const handleSelectNode = (id: string | null) => {
    setSelectedNode(id);
    if (id) setRightOpen(true);
  };

  const toggleType = (type: string) => {
    setActiveTypes(prev => {
      const next = new Set(prev);
      if (next.has(type)) next.delete(type);
      else next.add(type);
      return next;
    });
  };

  return (
    <AppShell
      searchValue={searchQuery}
      onSearch={setSearchQuery}
      rightOpen={rightOpen}
      rightWidth={400}
      rightContent={
        <RightPanel
          selectedNode={selectedNode}
          onClose={() => { setSelectedNode(null); setRightOpen(false); }}
          isOpen={rightOpen}
        />
      }
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
        <TopologyFilterBar activeTypes={activeTypes} onToggle={toggleType} />
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <TopologyCanvas
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            searchQuery={searchQuery}
            theme={theme}
            activeTypes={activeTypes}
          />
          <CriticalEnginesBadge />
          <EngineReferencePanel />
          <PrinciplesPanel />
        </div>
        <BottomPanel />
      </div>
    </AppShell>
  );
}
