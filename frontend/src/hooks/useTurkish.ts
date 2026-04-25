/**
 * Turkish Language Hook for AgentPlaces
 * Provides easy access to Turkish translations
 */

import { useState, useEffect } from 'react';
import trTranslations from '../locales/tr.json';

export interface TurkishTranslations {
  homepage: {
    title: string;
    subtitle: string;
    description: string;
    getStarted: string;
    learnMore: string;
    features: {
      agentManagement: { title: string; description: string };
      analytics: { title: string; description: string };
      automation: { title: string; description: string };
      fileProcessing: { title: string; description: string };
    };
    stats: {
      activeAgents: string;
      filesProcessed: string;
      uptime: string;
      apiCalls: string;
    };
  };
  navigation: {
    home: string;
    agents: string;
    files: string;
    enterprise: string;
  };
  status: {
    checking: string;
    healthy: string;
    error: string;
  };
  buttons: {
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    create: string;
    upload: string;
    download: string;
    refresh: string;
  };
  messages: {
    success: string;
    error: string;
    loading: string;
    noData: string;
    confirmDelete: string;
  };
  agents: {
    title: string;
    create: string;
    edit: string;
    delete: string;
    name: string;
    description: string;
    type: string;
    status: string;
    capabilities: string;
    provider: string;
  };
  files: {
    title: string;
    upload: string;
    process: string;
    analyze: string;
    name: string;
    size: string;
    type: string;
    status: string;
    uploadedAt: string;
  };
}

export const useTurkish = () => {
  const [translations, setTranslations] = useState<TurkishTranslations>(trTranslations);
  
  // Helper function to get nested translation
  const t = (key: string): string => {
    const keys = key.split('.');
    let result: any = translations;
    
    for (const k of keys) {
      if (result && typeof result === 'object' && k in result) {
        result = result[k];
      } else {
        console.warn(`Translation key "${key}" not found`);
        return key; // Return the key itself if translation not found
      }
    }
    
    return typeof result === 'string' ? result : key;
  };

  // Specific helper functions for common translations
  const getStatusText = (isHealthy: boolean | null): string => {
    if (isHealthy === null) return translations.status.checking;
    return isHealthy ? translations.status.healthy : translations.status.error;
  };

  const getButtonText = (buttonType: keyof TurkishTranslations['buttons']): string => {
    return translations.buttons[buttonType];
  };

  const getMessageText = (messageType: keyof TurkishTranslations['messages']): string => {
    return translations.messages[messageType];
  };

  return {
    tr: translations,
    t,
    getStatusText,
    getButtonText,
    getMessageText,
  };
};

// Export individual translation sections for convenience
export const useTurkishHomepage = () => {
  const { tr } = useTurkish();
  return tr.homepage;
};

export const useTurkishNavigation = () => {
  const { tr } = useTurkish();
  return tr.navigation;
};

export const useTurkishAgents = () => {
  const { tr } = useTurkish();
  return tr.agents;
};

export const useTurkishFiles = () => {
  const { tr } = useTurkish();
  return tr.files;
};

export default useTurkish;