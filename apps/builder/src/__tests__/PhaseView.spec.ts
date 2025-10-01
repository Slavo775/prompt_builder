import {describe, it, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import PhaseView from "../components/PhaseView.vue";
import type {Phase, GlobalInputs} from "../types";

// Mock child components
vi.mock("../components/PhaseTemplateEditor.vue", () => ({
  default: {
    name: "PhaseTemplateEditor",
    template: "<div data-testid='template-editor'>Template Editor</div>",
    props: ["phase"],
    emits: ["update:template"],
  },
}));

vi.mock("../components/PhaseInputs.vue", () => ({
  default: {
    name: "PhaseInputs",
    template: "<div data-testid='phase-inputs'>Phase Inputs</div>",
    props: ["phase"],
    emits: ["update:phase"],
  },
}));

vi.mock("../components/PhasePreview.vue", () => ({
  default: {
    name: "PhasePreview",
    template: "<div data-testid='phase-preview'>Phase Preview</div>",
    props: ["renderedTemplate", "lastOutput"],
    emits: ["save-output"],
  },
}));

describe("PhaseView", () => {
  const mockPhase: Phase = {
    id: "0",
    title: "Discovery",
    template: "Test template with [PROJECT_NAME]",
    overridesEnabled: false,
    inputs: {CUSTOM_TOKEN: "Custom Value"},
    lastOutput: "Saved output",
  };

  const mockGlobalInputs: GlobalInputs = {
    projectName: "Test Project",
    featureName: "Test Feature",
    featureSlug: "test-feature",
    owner: "Test Owner",
    repoUrl: "https://github.com/test/repo",
    stack: "Vue 3, TypeScript",
    dateIso: "2024-01-01",
    requirements: "Test Requirements",
  };

  it("should render all child components", () => {
    const wrapper = mount(PhaseView, {
      props: {
        phase: mockPhase,
        globalInputs: mockGlobalInputs,
      },
    });

    expect(wrapper.find('[data-testid="template-editor"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="phase-inputs"]').exists()).toBe(true);
    expect(wrapper.find('[data-testid="phase-preview"]').exists()).toBe(true);
  });

  it("should pass correct props to child components", () => {
    const wrapper = mount(PhaseView, {
      props: {
        phase: mockPhase,
        globalInputs: mockGlobalInputs,
      },
    });

    const templateEditor = wrapper.findComponent({name: "PhaseTemplateEditor"});
    const phaseInputs = wrapper.findComponent({name: "PhaseInputs"});
    const phasePreview = wrapper.findComponent({name: "PhasePreview"});

    expect(templateEditor.props("phase")).toEqual(mockPhase);
    expect(phaseInputs.props("phase")).toEqual(mockPhase);
    expect(phasePreview.props("renderedTemplate")).toBeDefined();
    expect(phasePreview.props("lastOutput")).toBe(mockPhase.lastOutput);
  });

  it("should emit update:phase when child components emit events", async () => {
    const wrapper = mount(PhaseView, {
      props: {
        phase: mockPhase,
        globalInputs: mockGlobalInputs,
      },
    });

    const templateEditor = wrapper.findComponent({name: "PhaseTemplateEditor"});
    const phaseInputs = wrapper.findComponent({name: "PhaseInputs"});

    // Test template update
    await templateEditor.vm.$emit("update:template", "New template");
    expect(wrapper.emitted("update:phase")).toBeTruthy();

    // Test phase update
    await phaseInputs.vm.$emit("update:phase", {
      ...mockPhase,
      title: "Updated",
    });
    expect(wrapper.emitted("update:phase")).toHaveLength(2);
  });
});
