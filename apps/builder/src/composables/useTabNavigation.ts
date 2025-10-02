import {ref, computed} from "vue";
import type {ViewType, TabConfig} from "../types";

export interface UseTabNavigationReturn {
  activeTab: import("vue").Ref<ViewType>;
  tabs: import("vue").ComputedRef<TabConfig[]>;
  // eslint-disable-next-line no-unused-vars
  switchTab: (tabId: ViewType) => void;
  // eslint-disable-next-line no-unused-vars
  handleKeyboardNavigation: (event: KeyboardEvent) => void;
}

export function useTabNavigation(
  initialView: ViewType = "frontend",
  // eslint-disable-next-line no-unused-vars
  onViewChange?: (viewType: ViewType) => void
): UseTabNavigationReturn {
  const activeTab = ref<ViewType>(initialView);

  const tabs = computed((): TabConfig[] => [
    {
      id: "frontend",
      label: "Frontend",
      icon: "🎨",
      disabled: false,
    },
    {
      id: "backend",
      label: "Backend",
      icon: "⚙️",
      disabled: false,
    },
  ]);

  const switchTab = (tabId: ViewType) => {
    if (activeTab.value !== tabId) {
      activeTab.value = tabId;
      onViewChange?.(tabId);
    }
  };

  const handleKeyboardNavigation = (event: KeyboardEvent) => {
    const currentIndex = tabs.value.findIndex(
      (tab) => tab.id === activeTab.value
    );

    switch (event.key) {
      case "ArrowLeft":
      case "ArrowUp": {
        event.preventDefault();
        const prevIndex =
          currentIndex > 0 ? currentIndex - 1 : tabs.value.length - 1;
        const prevTab = tabs.value[prevIndex];
        if (prevTab) switchTab(prevTab.id);
        break;
      }

      case "ArrowRight":
      case "ArrowDown": {
        event.preventDefault();
        const nextIndex =
          currentIndex < tabs.value.length - 1 ? currentIndex + 1 : 0;
        const nextTab = tabs.value[nextIndex];
        if (nextTab) switchTab(nextTab.id);
        break;
      }

      case "Home": {
        event.preventDefault();
        const firstTab = tabs.value[0];
        if (firstTab) switchTab(firstTab.id);
        break;
      }

      case "End": {
        event.preventDefault();
        const lastTab = tabs.value[tabs.value.length - 1];
        if (lastTab) switchTab(lastTab.id);
        break;
      }
    }
  };

  return {
    activeTab,
    tabs,
    switchTab,
    handleKeyboardNavigation,
  };
}
