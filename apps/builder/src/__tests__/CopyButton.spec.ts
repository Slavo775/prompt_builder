import {describe, it, expect, vi, beforeEach} from "vitest";
import {mount} from "@vue/test-utils";
import CopyButton from "../components/CopyButton.vue";

// Mock clipboard API
const mockWriteText = vi.fn();
Object.assign(navigator, {
  clipboard: {
    writeText: mockWriteText,
  },
});

describe("CopyButton", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render with default props", () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text",
      },
    });

    expect(wrapper.find(".copy-button").exists()).toBe(true);
    expect(wrapper.find(".copy-button__text").text()).toBe("Copy");
    expect(wrapper.find(".copy-button").attributes("aria-label")).toBe(
      "Copy to clipboard"
    );
  });

  it("should render with custom props", () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text",
        buttonText: "Custom Copy",
        ariaLabel: "Custom aria label",
      },
    });

    expect(wrapper.find(".copy-button__text").text()).toBe("Custom Copy");
    expect(wrapper.find(".copy-button").attributes("aria-label")).toBe(
      "Custom aria label"
    );
  });

  it("should be disabled when disabled prop is true", () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text",
        disabled: true,
      },
    });

    expect(wrapper.find(".copy-button").attributes("disabled")).toBeDefined();
  });

  it("should call clipboard API when clicked", async () => {
    mockWriteText.mockResolvedValue(undefined);

    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text to copy",
      },
    });

    await wrapper.find(".copy-button").trigger("click");

    expect(mockWriteText).toHaveBeenCalledWith("Test text to copy");
  });

  it("should show success state after successful copy", async () => {
    mockWriteText.mockResolvedValue(undefined);

    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text",
      },
    });

    await wrapper.find(".copy-button").trigger("click");
    await wrapper.vm.$nextTick();

    expect(wrapper.find(".copy-button--success").exists()).toBe(true);
    expect(wrapper.find(".copy-button__text").text()).toBe("Copied!");
  });

  it("should not copy when disabled", async () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: "Test text",
        disabled: true,
      },
    });

    await wrapper.find(".copy-button").trigger("click");

    expect(mockWriteText).not.toHaveBeenCalled();
  });

  it("should not copy when text is empty", async () => {
    const wrapper = mount(CopyButton, {
      props: {
        text: "",
      },
    });

    await wrapper.find(".copy-button").trigger("click");

    expect(mockWriteText).not.toHaveBeenCalled();
  });
});
