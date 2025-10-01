import {describe, it, expect} from "vitest";
import {mount} from "@vue/test-utils";
import Phase5SeveritySelect from "../Phase5SeveritySelect.vue";
import type {BugSeverity} from "../../config/types";

describe("Phase5SeveritySelect", () => {
  it("should render severity select component", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    expect(wrapper.find(".phase5-severity-select").exists()).toBe(true);
    expect(wrapper.find("label").text()).toContain("Severity");
    expect(wrapper.find("select").exists()).toBe(true);
  });

  it("should render all severity options", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    const options = wrapper.findAll("option");
    expect(options).toHaveLength(6); // 1 placeholder + 5 severity levels

    const optionTexts = options.map((option) => option.text());
    expect(optionTexts).toContain("Select severity level");
    expect(optionTexts).toContain("Blocker - System unusable");
    expect(optionTexts).toContain("Critical - Major functionality broken");
    expect(optionTexts).toContain("Major - Significant functionality affected");
    expect(optionTexts).toContain("Minor - Small functionality issue");
    expect(optionTexts).toContain("Trivial - Cosmetic issue");
  });

  it("should set the correct value", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "critical",
      },
    });

    expect(wrapper.find("select").element.value).toBe("critical");
  });

  it("should emit update:modelValue when selection changes", async () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    const select = wrapper.find("select");
    await select.setValue("blocker");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual(["blocker"]);
  });

  it("should show required indicator", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    expect(wrapper.find(".phase5-severity-select__required").exists()).toBe(
      true
    );
    expect(wrapper.find(".phase5-severity-select__required").text()).toBe("*");
  });

  it("should display help text", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    expect(wrapper.find(".phase5-severity-select__help").text()).toBe(
      "Impact level of the bug"
    );
  });

  it("should display error message", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        errorMessage: "Severity is required",
      },
    });

    expect(wrapper.find(".phase5-severity-select__error").text()).toBe(
      "Severity is required"
    );
    expect(wrapper.find("select").classes()).toContain(
      "phase5-severity-select__select--error"
    );
  });

  it("should not display help text when there is an error", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        errorMessage: "Severity is required",
      },
    });

    expect(wrapper.find(".phase5-severity-select__help").exists()).toBe(false);
  });

  it("should support disabled state", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        disabled: true,
      },
    });

    expect(wrapper.find("select").attributes("disabled")).toBeDefined();
  });

  it("should set correct ARIA attributes", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        errorMessage: "Severity is required",
      },
    });

    const select = wrapper.find("select");
    expect(select.attributes("aria-invalid")).toBe("true");
    expect(select.attributes("aria-describedby")).toContain(
      "phase5-severity-error"
    );
  });

  it("should set correct ARIA attributes for help text", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    const select = wrapper.find("select");
    expect(select.attributes("aria-describedby")).toContain(
      "phase5-severity-help"
    );
  });

  it("should be accessible", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    // Basic accessibility checks
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("select").attributes("id")).toBe("phase5-severity");
    expect(wrapper.find("select").attributes("aria-invalid")).toBe("false");
  });

  it("should be accessible with error state", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        errorMessage: "Severity is required",
      },
    });

    // Basic accessibility checks
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("select").attributes("id")).toBe("phase5-severity");
    expect(wrapper.find("select").attributes("aria-invalid")).toBe("true");
    expect(wrapper.find(".phase5-severity-select__error").exists()).toBe(true);
  });

  it("should be accessible when disabled", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
        disabled: true,
      },
    });

    // Basic accessibility checks
    expect(wrapper.find("label").exists()).toBe(true);
    expect(wrapper.find("select").attributes("id")).toBe("phase5-severity");
    expect(wrapper.find("select").attributes("disabled")).toBeDefined();
  });

  it("should have correct option values", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "major",
      },
    });

    const options = wrapper.findAll("option");
    const optionValues = options.map((option) => option.attributes("value"));

    expect(optionValues).toEqual([
      "", // placeholder
      "blocker",
      "critical",
      "major",
      "minor",
      "trivial",
    ]);
  });

  it("should handle empty value", () => {
    const wrapper = mount(Phase5SeveritySelect, {
      props: {
        modelValue: "" as BugSeverity,
      },
    });

    expect(wrapper.find("select").element.value).toBe("");
  });
});
