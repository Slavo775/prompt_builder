import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {mount, VueWrapper} from "@vue/test-utils";
import {nextTick} from "vue";
import {axe, toHaveNoViolations} from "jest-axe";
import PhaseSelector from "../PhaseSelector.vue";
import type {Phase, BackendPhase, AnyPhaseId} from "../../types";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

describe("PhaseSelector", () => {
  let wrapper: VueWrapper<InstanceType<typeof PhaseSelector>>;

  const mockPhases: Phase[] = [
    {
      id: "0",
      title: "Create/refresh REPO_CONSTRAINTS.md",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "1",
      title: "Repo exploration COMPREHENSIVE_ANALYSIS.md",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "2",
      title: "Implementation Phase",
      template: "Test template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
  ];

  const mockBackendPhases: BackendPhase[] = [
    {
      id: "backend-0",
      title: "Backend Discovery",
      template: "Backend template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
    {
      id: "backend-1",
      title: "Backend Planning",
      template: "Backend template",
      overridesEnabled: false,
      inputs: {},
      lastOutput: "",
    },
  ];

  const defaultProps = {
    phasesList: mockPhases,
    currentPhaseId: "0" as AnyPhaseId,
    viewType: "frontend" as const,
  };

  beforeEach(() => {
    // Mock DOM methods
    Object.defineProperty(HTMLElement.prototype, "getBoundingClientRect", {
      configurable: true,
      value: vi.fn(() => ({
        top: 100,
        bottom: 140,
        left: 50,
        right: 250,
        width: 200,
        height: 40,
      })),
    });

    Object.defineProperty(window, "innerHeight", {
      configurable: true,
      value: 800,
    });

    // Mock Teleport for dropdown rendering
    global.document.body.innerHTML = "";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  describe("Component Rendering", () => {
    it("should render with correct props", () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      expect(wrapper.find(".phase-selector").exists()).toBe(true);
      expect(wrapper.find(".phase-selector__trigger").exists()).toBe(true);
    });

    it("should display current phase in trigger", () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const badge = wrapper.find(".phase-selector__badge");
      const label = wrapper.find(".phase-selector__label");

      expect(badge.text()).toBe("0");
      expect(label.text()).toContain("Phase 0:");
      expect(label.text()).toContain("Create/refresh REPO_CO...");
    });

    it("should truncate long phase titles in trigger", () => {
      const longTitlePhases = [
        {
          ...mockPhases[0],
          title:
            "This is a very long phase title that should be truncated for display purposes",
        },
      ];

      wrapper = mount(PhaseSelector, {
        props: {
          ...defaultProps,
          phasesList: longTitlePhases,
        },
      });

      const label = wrapper.find(".phase-selector__label");
      expect(label.text()).toContain("...");
      expect(label.text().length).toBeLessThan(50);
    });

    it("should handle disabled state", () => {
      wrapper = mount(PhaseSelector, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      });

      expect(wrapper.find(".phase-selector--disabled").exists()).toBe(true);
      expect(
        wrapper.find(".phase-selector__trigger").attributes("disabled")
      ).toBeDefined();
    });
  });

  describe("Dropdown Interactions", () => {
    it("should open dropdown on trigger click", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      expect(wrapper.emitted("dropdown-open")).toBeTruthy();
    });

    it("should close dropdown on outside click", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Open dropdown first
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      // Click outside
      const backdrop = wrapper.find(".phase-selector__backdrop");
      await backdrop.trigger("click");

      expect(wrapper.emitted("dropdown-close")).toBeTruthy();
    });

    it("should select phase on option click", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Open dropdown
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      // Mock option click (since options are teleported to body)
      const phaseChangeEmit = vi.fn();
      wrapper.vm.$emit = phaseChangeEmit;

      // Simulate option selection
      wrapper.vm.handlers.onOptionClick("1");

      expect(wrapper.emitted("phase-change")).toBeTruthy();
      expect(wrapper.emitted("phase-change")![0]).toEqual(["1"]);
    });
  });

  describe("Keyboard Navigation", () => {
    it("should handle arrow key navigation", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      // Arrow down should open dropdown
      await trigger.trigger("keydown.arrow-down");
      await nextTick();

      expect(wrapper.emitted("dropdown-open")).toBeTruthy();
    });

    it("should select on Enter key", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      // Enter should open dropdown when closed
      await trigger.trigger("keydown.enter");
      await nextTick();

      expect(wrapper.emitted("dropdown-open")).toBeTruthy();
    });

    it("should close on Escape key", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      // Open dropdown first
      await trigger.trigger("click");
      await nextTick();

      // Escape should close dropdown
      await trigger.trigger("keydown.escape");

      expect(wrapper.emitted("dropdown-close")).toBeTruthy();
    });

    it("should handle tab key", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      // Open dropdown first
      await trigger.trigger("click");
      await nextTick();

      // Tab should close dropdown
      await trigger.trigger("keydown.tab");

      expect(wrapper.emitted("dropdown-close")).toBeTruthy();
    });
  });

  describe("Accessibility", () => {
    it("should have proper ARIA attributes", () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      expect(trigger.attributes("role")).toBe("combobox");
      expect(trigger.attributes("aria-expanded")).toBe("false");
      expect(trigger.attributes("aria-haspopup")).toBe("listbox");
      expect(trigger.attributes("aria-label")).toContain("Phase selector");
      expect(trigger.attributes("tabindex")).toBe("0");
    });

    it("should update aria-expanded when dropdown opens", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");

      // Initially closed
      expect(trigger.attributes("aria-expanded")).toBe("false");

      // Open dropdown
      await trigger.trigger("click");
      await nextTick();

      expect(trigger.attributes("aria-expanded")).toBe("true");
    });

    it("should pass axe accessibility tests", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
        attachTo: document.body,
      });

      const results = await axe(wrapper.element, {
        rules: {
          region: {enabled: false}, // Disable region rule for component tests
        },
      });
      expect(results).toHaveNoViolations();
    });

    it("should pass axe accessibility tests with dropdown open", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
        attachTo: document.body,
      });

      // Open dropdown
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      const results = await axe(document.body, {
        rules: {
          region: {enabled: false}, // Disable region rule for component tests
        },
      });
      expect(results).toHaveNoViolations();
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty phases list", () => {
      wrapper = mount(PhaseSelector, {
        props: {
          ...defaultProps,
          phasesList: [],
        },
      });

      expect(wrapper.find(".phase-selector").exists()).toBe(true);
      expect(wrapper.find(".phase-selector__label").text()).toContain(
        "Select Phase"
      );
    });

    it("should handle invalid current phase", () => {
      wrapper = mount(PhaseSelector, {
        props: {
          ...defaultProps,
          currentPhaseId: "invalid" as AnyPhaseId,
        },
      });

      expect(wrapper.find(".phase-selector").exists()).toBe(true);
      expect(wrapper.find(".phase-selector__badge").text()).toBe("?");
    });

    it("should handle backend phases", () => {
      wrapper = mount(PhaseSelector, {
        props: {
          phasesList: mockBackendPhases,
          currentPhaseId: "backend-0" as AnyPhaseId,
          viewType: "backend" as const,
        },
      });

      const badge = wrapper.find(".phase-selector__badge");
      const label = wrapper.find(".phase-selector__label");

      expect(badge.text()).toBe("backend-0");
      expect(label.text()).toContain("Backend Discovery");
    });

    it("should handle view type changes", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Change view type
      await wrapper.setProps({
        phasesList: mockBackendPhases,
        viewType: "backend",
      });

      expect(wrapper.find(".phase-selector").exists()).toBe(true);
    });
  });

  describe("Component Events", () => {
    it("should emit dropdown-open event", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");

      expect(wrapper.emitted("dropdown-open")).toBeTruthy();
      expect(wrapper.emitted("dropdown-open")![0]).toEqual([]);
    });

    it("should emit dropdown-close event", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Open first
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      // Close
      await trigger.trigger("keydown.escape");

      expect(wrapper.emitted("dropdown-close")).toBeTruthy();
      expect(wrapper.emitted("dropdown-close")![0]).toEqual([]);
    });

    it("should emit phase-change event with correct phase ID", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Simulate phase selection
      wrapper.vm.handlers.onOptionClick("2");

      expect(wrapper.emitted("phase-change")).toBeTruthy();
      expect(wrapper.emitted("phase-change")![0]).toEqual(["2"]);
    });
  });

  describe("Responsive Behavior", () => {
    it("should handle window resize", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Open dropdown
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      // Simulate window resize
      window.dispatchEvent(new Event("resize"));

      // Should still be functional
      expect(wrapper.find(".phase-selector").exists()).toBe(true);
    });

    it("should close dropdown on scroll", async () => {
      wrapper = mount(PhaseSelector, {
        props: defaultProps,
      });

      // Open dropdown
      const trigger = wrapper.find(".phase-selector__trigger");
      await trigger.trigger("click");
      await nextTick();

      // Simulate scroll
      window.dispatchEvent(new Event("scroll"));

      expect(wrapper.emitted("dropdown-close")).toBeTruthy();
    });
  });
});
