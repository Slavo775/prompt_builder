import {describe, it, expect, vi, beforeEach, afterEach} from "vitest";
import {mount, VueWrapper} from "@vue/test-utils";
import {axe, toHaveNoViolations} from "jest-axe";
import NativePhaseSelector from "../NativePhaseSelector.vue";
import type {Phase, BackendPhase, AnyPhaseId} from "../../types";

// Extend expect with jest-axe matchers
expect.extend(toHaveNoViolations);

// Type declaration for Vitest
declare module "vitest" {
  //eslint-disable-next-line @typescript-eslint/no-explicit-any
  interface Assertion<T = any> {
    toHaveNoViolations(): T;
  }
}

describe("NativePhaseSelector", () => {
  let wrapper: VueWrapper<InstanceType<typeof NativePhaseSelector>>;

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
      title:
        "Implementation Phase with a very long title that should be truncated for mobile display",
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
    // Clean up DOM
    document.body.innerHTML = "";
  });

  afterEach(() => {
    if (wrapper) {
      wrapper.unmount();
    }
    vi.restoreAllMocks();
  });

  describe("Native Form Rendering", () => {
    it("should render native select element", () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      const label = wrapper.find("label");

      expect(select.exists()).toBe(true);
      expect(label.exists()).toBe(true);
      expect(select.element.tagName).toBe("SELECT");
    });

    it("should generate proper option elements", () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const options = wrapper.findAll("option");
      expect(options).toHaveLength(3);

      expect(options[0].attributes("value")).toBe("0");
      expect(options[0].text()).toBe(
        "Phase 0: Create/refresh REPO_CONSTRAINTS.md"
      );

      expect(options[1].attributes("value")).toBe("1");
      expect(options[1].text()).toBe(
        "Phase 1: Repo exploration COMPREHENSIVE_ANALYS..."
      );

      expect(options[2].attributes("value")).toBe("2");
      expect(options[2].text()).toContain(
        "Phase 2: Implementation Phase with a very long..."
      );
    });

    it("should bind value with v-model", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          currentPhaseId: "1" as AnyPhaseId,
        },
      });

      const select = wrapper.find("select");
      expect(select.element.value).toBe("1");

      const selectedOption = wrapper.find('option[value="1"]');
      expect(selectedOption.attributes("selected")).toBeDefined();
    });

    it("should truncate long phase titles", () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const longTitleOption = wrapper.find('option[value="2"]');
      const optionText = longTitleOption.text();

      expect(optionText).toContain("...");
      expect(optionText.length).toBeLessThan(50);
    });
  });

  describe("Form Integration", () => {
    it("should emit change events on selection", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      await select.setValue("2");

      expect(wrapper.emitted("phase-change")).toBeTruthy();
      expect(wrapper.emitted("phase-change")![0]).toEqual(["2"]);
    });

    it("should support form validation attributes", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          required: true,
        },
      });

      const select = wrapper.find("select");
      expect(select.attributes("required")).toBeDefined();
      expect(select.attributes("aria-invalid")).toBe("false");
    });

    it("should handle disabled state", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      });

      const select = wrapper.find("select");
      expect(select.attributes("disabled")).toBeDefined();
      expect(select.classes()).toContain("native-phase-selector__select");
    });

    it("should show validation error for required field", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          currentPhaseId: "" as AnyPhaseId,
          required: true,
        },
      });

      const errorElement = wrapper.find(".native-phase-selector__error");
      expect(errorElement.exists()).toBe(true);
      expect(errorElement.text()).toContain("Please select a phase");

      const select = wrapper.find("select");
      expect(select.attributes("aria-invalid")).toBe("true");
    });
  });

  describe("Accessibility (Native)", () => {
    it("should have proper label association", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          id: "test-phase-selector",
        },
      });

      const label = wrapper.find("label");
      const select = wrapper.find("select");

      expect(label.attributes("for")).toBe("test-phase-selector");
      expect(select.attributes("id")).toBe("test-phase-selector");
    });

    it("should support native keyboard navigation", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");

      // Focus should work
      await select.trigger("focus");
      expect(wrapper.emitted("focus")).toBeTruthy();

      // Blur should work
      await select.trigger("blur");
      expect(wrapper.emitted("blur")).toBeTruthy();
    });

    it("should have proper ARIA attributes", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          required: true,
        },
      });

      const select = wrapper.find("select");

      expect(select.attributes("aria-invalid")).toBe("false");
      expect(select.attributes("name")).toBe("phase-selector");
    });

    it("should pass axe accessibility tests", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
        attachTo: document.body,
      });

      const results = await axe(wrapper.element);
      expect(results).toHaveNoViolations();
    });

    it("should pass axe accessibility tests with error state", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          currentPhaseId: "" as AnyPhaseId,
          required: true,
        },
        attachTo: document.body,
      });

      const results = await axe(wrapper.element);
      expect(results).toHaveNoViolations();
    });
  });

  describe("Mobile Behavior", () => {
    it("should render as native select for mobile optimization", () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");

      // Native select should not have custom dropdown classes
      expect(select.classes()).not.toContain("custom-dropdown");
      expect(select.element.tagName).toBe("SELECT");
    });

    it("should handle touch interactions properly", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");

      // Touch events should work like click events on native selects
      await select.trigger("focus");
      await select.setValue("1");

      expect(wrapper.emitted("phase-change")).toBeTruthy();
      expect(wrapper.emitted("phase-change")![0]).toEqual(["1"]);
    });
  });

  describe("Edge Cases", () => {
    it("should handle empty options gracefully", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          phasesList: [],
        },
      });

      const select = wrapper.find("select");
      const options = wrapper.findAll("option");

      expect(select.exists()).toBe(true);
      expect(options).toHaveLength(0);
    });

    it("should validate option values", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");

      // Valid phase ID should emit event
      await select.setValue("1");
      expect(wrapper.emitted("phase-change")).toBeTruthy();

      // Invalid phase ID should not emit event (handled by composable)
      const mockEvent = {
        target: {value: "invalid"},
      } as unknown as Event;

      wrapper.vm.handlers.onChange(mockEvent);

      // Should not emit additional phase-change events for invalid values
      expect(wrapper.emitted("phase-change")).toHaveLength(1);
    });

    it("should support disabled state", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          disabled: true,
        },
      });

      const select = wrapper.find("select");
      expect(select.attributes("disabled")).toBeDefined();
    });

    it("should handle backend phases", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          phasesList: mockBackendPhases,
          currentPhaseId: "0" as AnyPhaseId,
          viewType: "backend" as const,
        },
      });

      const options = wrapper.findAll("option");
      expect(options).toHaveLength(2);

      expect(options[0].text()).toBe("Phase backend-0: Backend Discovery");
      expect(options[1].text()).toBe("Phase backend-1: Backend Planning");
    });

    it("should handle custom labels", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          label: "Select Project Phase",
        },
      });

      const label = wrapper.find("label");
      expect(label.text()).toBe("Select Project Phase");
    });
  });

  describe("Styling Consistency", () => {
    it("should have consistent styling with GlobalInputs", () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      const label = wrapper.find("label");

      // Check that classes are applied for styling
      expect(select.classes()).toContain("native-phase-selector__select");
      expect(label.classes()).toContain("native-phase-selector__label");
    });

    it("should apply error styling when validation fails", () => {
      wrapper = mount(NativePhaseSelector, {
        props: {
          ...defaultProps,
          currentPhaseId: "" as AnyPhaseId,
          required: true,
        },
      });

      const select = wrapper.find("select");
      const errorElement = wrapper.find(".native-phase-selector__error");

      expect(select.attributes("aria-invalid")).toBe("true");
      expect(errorElement.exists()).toBe(true);
      expect(errorElement.classes()).toContain("native-phase-selector__error");
    });
  });

  describe("Component Events", () => {
    it("should emit focus event", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      await select.trigger("focus");

      expect(wrapper.emitted("focus")).toBeTruthy();
      expect(wrapper.emitted("focus")![0][0]).toBeInstanceOf(Event);
    });

    it("should emit blur event", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      await select.trigger("blur");

      expect(wrapper.emitted("blur")).toBeTruthy();
      expect(wrapper.emitted("blur")![0][0]).toBeInstanceOf(Event);
    });

    it("should emit phase-change with correct phase ID", async () => {
      wrapper = mount(NativePhaseSelector, {
        props: defaultProps,
      });

      const select = wrapper.find("select");
      await select.setValue("2");

      expect(wrapper.emitted("phase-change")).toBeTruthy();
      expect(wrapper.emitted("phase-change")![0]).toEqual(["2"]);
    });
  });
});
