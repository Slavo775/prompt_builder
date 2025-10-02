import {describe, it, expect, vi} from "vitest";
import {useTabNavigation} from "../composables/useTabNavigation";

describe("useTabNavigation", () => {
  it("should initialize with correct active tab", () => {
    const {activeTab} = useTabNavigation("backend");
    expect(activeTab.value).toBe("backend");
  });

  it("should provide correct tab configurations", () => {
    const {tabs} = useTabNavigation();

    expect(tabs.value).toHaveLength(2);
    expect(tabs.value[0]).toEqual({
      id: "frontend",
      label: "Frontend",
      icon: "🎨",
      disabled: false,
    });
    expect(tabs.value[1]).toEqual({
      id: "backend",
      label: "Backend",
      icon: "⚙️",
      disabled: false,
    });
  });

  it("should switch tabs correctly", () => {
    const onViewChange = vi.fn();
    const {activeTab, switchTab} = useTabNavigation("frontend", onViewChange);

    switchTab("backend");

    expect(activeTab.value).toBe("backend");
    expect(onViewChange).toHaveBeenCalledWith("backend");
  });

  it("should not switch to same tab", () => {
    const onViewChange = vi.fn();
    const {switchTab} = useTabNavigation("frontend", onViewChange);

    switchTab("frontend");

    expect(onViewChange).not.toHaveBeenCalled();
  });

  it("should handle keyboard navigation - arrow right", () => {
    const onViewChange = vi.fn();
    const {handleKeyboardNavigation} = useTabNavigation(
      "frontend",
      onViewChange
    );

    const event = new KeyboardEvent("keydown", {key: "ArrowRight"});
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    handleKeyboardNavigation(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onViewChange).toHaveBeenCalledWith("backend");
  });

  it("should handle keyboard navigation - arrow left", () => {
    const onViewChange = vi.fn();
    const {handleKeyboardNavigation} = useTabNavigation(
      "backend",
      onViewChange
    );

    const event = new KeyboardEvent("keydown", {key: "ArrowLeft"});
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    handleKeyboardNavigation(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onViewChange).toHaveBeenCalledWith("frontend");
  });

  it("should handle keyboard navigation - home key", () => {
    const onViewChange = vi.fn();
    const {handleKeyboardNavigation} = useTabNavigation(
      "backend",
      onViewChange
    );

    const event = new KeyboardEvent("keydown", {key: "Home"});
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    handleKeyboardNavigation(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onViewChange).toHaveBeenCalledWith("frontend");
  });

  it("should handle keyboard navigation - end key", () => {
    const onViewChange = vi.fn();
    const {handleKeyboardNavigation} = useTabNavigation(
      "frontend",
      onViewChange
    );

    const event = new KeyboardEvent("keydown", {key: "End"});
    const preventDefaultSpy = vi.spyOn(event, "preventDefault");

    handleKeyboardNavigation(event);

    expect(preventDefaultSpy).toHaveBeenCalled();
    expect(onViewChange).toHaveBeenCalledWith("backend");
  });
});
