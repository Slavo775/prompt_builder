import {describe, it, expect, beforeEach} from "vitest";
import {mount} from "@vue/test-utils";
import Phase5InputField from "../Phase5InputField.vue";
import type {Phase5InputFieldConfig} from "../../config/types";

describe("Phase5InputField", () => {
  let mockFieldConfig: Phase5InputFieldConfig;

  beforeEach(() => {
    mockFieldConfig = {
      key: "bugTitle",
      label: "Bug Title",
      type: "text",
      required: true,
      placeholder: "Enter bug title",
      helpText: "A concise description of the bug",
    };
  });

  it("should render text input field", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "Test Bug",
        fieldConfig: mockFieldConfig,
      },
    });

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("Bug Title");
    expect(wrapper.find("input").attributes("placeholder")).toBe(
      "Enter bug title"
    );
  });

  it("should render textarea field", () => {
    const textareaConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      key: "reproSteps",
      label: "Reproduction Steps",
      type: "textarea",
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "1) Navigate to page\n2) Click button",
        fieldConfig: textareaConfig,
      },
    });

    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("Reproduction Steps");
  });

  it("should render select field", () => {
    const selectConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      key: "severity",
      label: "Severity",
      type: "select",
      options: ["blocker", "critical", "major", "minor", "trivial"],
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "major",
        fieldConfig: selectConfig,
      },
    });

    expect(wrapper.find("select").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("Severity");

    const options = wrapper.findAll("option");
    expect(options).toHaveLength(6); // 1 placeholder + 5 options
  });

  it("should render URL input field", () => {
    const urlConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      key: "urlRoute",
      label: "URL/Route",
      type: "url",
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "https://example.com/page",
        fieldConfig: urlConfig,
      },
    });

    expect(wrapper.find("input[type='url']").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("URL/Route");
  });

  it("should render commit-sha input field", () => {
    const commitConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      key: "commitSha",
      label: "Commit SHA",
      type: "commit-sha",
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "abc1234",
        fieldConfig: commitConfig,
      },
    });

    expect(wrapper.find("input").exists()).toBe(true);
    expect(wrapper.find("input").classes()).toContain(
      "phase5-input-field__input--commit-sha"
    );
    expect(wrapper.find("label").text()).toContain("Commit SHA");
  });

  it("should show required indicator for required fields", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
      },
    });

    expect(wrapper.find(".phase5-input-field__required").exists()).toBe(true);
    expect(wrapper.find(".phase5-input-field__required").text()).toBe("*");
  });

  it("should not show required indicator for optional fields", () => {
    const optionalConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      required: false,
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: optionalConfig,
      },
    });

    expect(wrapper.find(".phase5-input-field__required").exists()).toBe(false);
  });

  it("should display help text", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
      },
    });

    expect(wrapper.find(".phase5-input-field__help").text()).toBe(
      "A concise description of the bug"
    );
  });

  it("should display error message", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
        errorMessage: "Bug title is required",
      },
    });

    expect(wrapper.find(".phase5-input-field__error").text()).toBe(
      "Bug title is required"
    );
    expect(wrapper.find("input").classes()).toContain(
      "phase5-input-field__input--error"
    );
  });

  it("should not display help text when there is an error", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
        errorMessage: "Bug title is required",
      },
    });

    expect(wrapper.find(".phase5-input-field__help").exists()).toBe(false);
  });

  it("should emit update:modelValue when input changes", async () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
      },
    });

    const input = wrapper.find("input");
    await input.setValue("New Bug Title");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      "New Bug Title",
    ]);
  });

  it("should support disabled state", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "Test Bug",
        fieldConfig: mockFieldConfig,
        disabled: true,
      },
    });

    expect(wrapper.find("input").attributes("disabled")).toBeDefined();
  });

  it("should set correct ARIA attributes", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
        errorMessage: "Bug title is required",
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-invalid")).toBe("true");
    expect(input.attributes("aria-describedby")).toContain(
      "phase5-bugTitle-error"
    );
  });

  it("should set correct ARIA attributes for help text", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
      },
    });

    const input = wrapper.find("input");
    expect(input.attributes("aria-describedby")).toContain(
      "phase5-bugTitle-help"
    );
  });

  it("should be accessible", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "Test Bug",
        fieldConfig: mockFieldConfig,
      },
    });

    // Basic accessibility checks
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("input").attributes("id")).toBe("phase5-bugTitle");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("false");
  });

  it("should be accessible with error state", () => {
    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
        errorMessage: "Bug title is required",
      },
    });

    // Basic accessibility checks
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("input").attributes("id")).toBe("phase5-bugTitle");
    expect(wrapper.find("input").attributes("aria-invalid")).toBe("true");
    expect(wrapper.find(".phase5-input-field__error").exists()).toBe(true);
  });

  it("should set correct textarea rows for different field types", () => {
    const reproStepsConfig: Phase5InputFieldConfig = {
      ...mockFieldConfig,
      key: "reproSteps",
      type: "textarea",
    };

    const wrapper = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: reproStepsConfig,
      },
    });

    expect(wrapper.find("textarea").attributes("rows")).toBe("4");
  });

  it("should generate unique field IDs", () => {
    const wrapper1 = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: mockFieldConfig,
      },
    });

    const wrapper2 = mount(Phase5InputField, {
      props: {
        modelValue: "",
        fieldConfig: {...mockFieldConfig, key: "commitSha"},
      },
    });

    const id1 = wrapper1.find("input").attributes("id");
    const id2 = wrapper2.find("input").attributes("id");

    expect(id1).toBe("phase5-bugTitle");
    expect(id2).toBe("phase5-commitSha");
    expect(id1).not.toBe(id2);
  });
});
