import {describe, it, expect} from "vitest";
import {mount} from "@vue/test-utils";
import RequirementsInput from "../RequirementsInput.vue";

describe("RequirementsInput", () => {
  const defaultProps = {
    modelValue: "",
    label: "Project Requirements",
  };

  it("should render with default props", () => {
    const wrapper = mount(RequirementsInput, {
      props: defaultProps,
    });

    expect(wrapper.find("label").text()).toBe("Project Requirements");
    expect(wrapper.find("textarea").exists()).toBe(true);
    expect(wrapper.find("textarea").attributes("rows")).toBe("6");
  });

  it("should render with custom props", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        modelValue: "Test requirements",
        placeholder: "Enter requirements here",
        rows: 8,
        required: true,
        maxLength: 1000,
      },
    });

    expect(wrapper.find("textarea").element.value).toBe("Test requirements");
    expect(wrapper.find("textarea").attributes("placeholder")).toBe(
      "Enter requirements here"
    );
    expect(wrapper.find("textarea").attributes("rows")).toBe("8");
    expect(wrapper.find("textarea").attributes("maxlength")).toBe("1000");
    expect(wrapper.find(".requirements-input__required").exists()).toBe(true);
  });

  it("should emit update:modelValue on input", async () => {
    const wrapper = mount(RequirementsInput, {
      props: defaultProps,
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("New requirements");

    expect(wrapper.emitted("update:modelValue")).toBeTruthy();
    expect(wrapper.emitted("update:modelValue")?.[0]).toEqual([
      "New requirements",
    ]);
  });

  it("should show error state when errorMessage is provided", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        errorMessage: "Requirements are required",
      },
    });

    expect(wrapper.find(".requirements-input__textarea--error").exists()).toBe(
      true
    );
    expect(wrapper.find(".requirements-input__error").text()).toBe(
      "Requirements are required"
    );
    expect(wrapper.find("textarea").attributes("aria-invalid")).toBe("true");
  });

  it("should show help text when provided", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        helpText: "This is help text",
      },
    });

    expect(wrapper.find(".requirements-input__help").text()).toBe(
      "This is help text"
    );
  });

  it("should show character counter when maxLength is provided", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        modelValue: "Test",
        maxLength: 100,
      },
    });

    expect(wrapper.find(".requirements-input__counter").text()).toBe("4/100");
  });

  it("should handle disabled state", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        disabled: true,
      },
    });

    expect(wrapper.find("textarea").attributes("disabled")).toBeDefined();
    expect(
      wrapper.find(".requirements-input__textarea--disabled").exists()
    ).toBe(true);
  });

  it("should emit error on blur when required and empty", async () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        required: true,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.trigger("blur");

    expect(wrapper.emitted("error")).toBeTruthy();
    expect(wrapper.emitted("error")?.[0]).toEqual([
      "Requirements are required",
    ]);
  });

  it("should not emit error on blur when not required", async () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        required: false,
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.trigger("blur");

    expect(wrapper.emitted("error")).toBeFalsy();
  });

  it("should clear error on input when has error", async () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        errorMessage: "Error message",
      },
    });

    const textarea = wrapper.find("textarea");
    await textarea.setValue("Some text");

    expect(wrapper.emitted("error")).toBeTruthy();
    expect(wrapper.emitted("error")?.[0]).toEqual([null]);
  });

  it("should update local value when modelValue changes", async () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        modelValue: "Initial value",
      },
    });

    expect(wrapper.find("textarea").element.value).toBe("Initial value");

    await wrapper.setProps({modelValue: "Updated value"});

    expect(wrapper.find("textarea").element.value).toBe("Updated value");
  });

  it("should have proper accessibility attributes", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        errorMessage: "Error message",
        id: "test-requirements",
      },
    });

    const textarea = wrapper.find("textarea");
    const label = wrapper.find("label");

    expect(label.attributes("for")).toBe("test-requirements");
    expect(textarea.attributes("id")).toBe("test-requirements");
    expect(textarea.attributes("aria-describedby")).toBe(
      "test-requirements-error"
    );
    expect(textarea.attributes("aria-invalid")).toBe("true");
  });

  it("should have proper accessibility attributes", () => {
    const wrapper = mount(RequirementsInput, {
      props: {
        ...defaultProps,
        label: "Project Requirements",
        helpText: "Enter your project requirements here",
        errorMessage: "This field is required",
      },
    });

    const textarea = wrapper.find("textarea");
    const label = wrapper.find("label");
    const error = wrapper.find(".requirements-input__error");

    expect(label.attributes("for")).toBe(textarea.attributes("id"));
    expect(textarea.attributes("aria-invalid")).toBe("true");
    expect(textarea.attributes("aria-describedby")).toContain("error");
    expect(error.attributes("role")).toBe("alert");
  });

  it("should generate unique id when not provided", () => {
    const wrapper1 = mount(RequirementsInput, {
      props: defaultProps,
    });
    const wrapper2 = mount(RequirementsInput, {
      props: defaultProps,
    });

    const id1 = wrapper1.find("textarea").attributes("id");
    const id2 = wrapper2.find("textarea").attributes("id");

    expect(id1).toBeDefined();
    expect(id2).toBeDefined();
    expect(id1).not.toBe(id2);
  });
});
