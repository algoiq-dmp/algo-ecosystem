'use client';
import { useState, useEffect, useMemo } from 'react';
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
import BetaBanner from '@/components/BetaBanner';
import { useBetaModeStore } from '@/stores/beta-mode-store';
import { BETA_HIDDEN_NODES } from '@/config/feature-flags';

export default function Home() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();
  const { isBeta, toggleMode } = useBetaModeStore();
  const { theme } = useTheme();

  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [rightOpen, setRightOpen] = useState(true);
  const [activeTypes, setActiveTypes] = useState<Set<string>>(new Set(['product', 'engine', 'api', 'infrastructure', 'strategy', 'exchange', 'broker']));

  const hiddenNodeIds = useMemo(() => {
    if (!isBeta) return new Set<string>();
    return new Set(BETA_HIDDEN_NODES);
  }, [isBeta]);

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/home');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) return null;

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
        <BetaBanner isBeta={isBeta} />
        <TopologyFilterBar
          activeTypes={activeTypes}
          onToggle={toggleType}
          isBeta={isBeta}
          onToggleBeta={toggleMode}
        />
        <div style={{ flex: 1, position: 'relative', minHeight: 0 }}>
          <TopologyCanvas
            selectedNode={selectedNode}
            onSelectNode={handleSelectNode}
            searchQuery={searchQuery}
            theme={theme}
            activeTypes={activeTypes}
            hiddenNodeIds={hiddenNodeIds}
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
