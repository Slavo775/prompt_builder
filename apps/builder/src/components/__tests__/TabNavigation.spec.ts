import {describe, it, expect} from "vitest";
import {mount} from "@vue/test-utils";
import TabNavigation from "../TabNavigation.vue";

describe("TabNavigation", () => {
  it("should render correctly", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
      },
    });

    expect(wrapper.find(".tab-navigation").exists()).toBe(true);
    expect(wrapper.findAll(".tab-navigation__tab")).toHaveLength(2);
  });

  it("should show active tab correctly", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "backend",
      },
    });

    const tabs = wrapper.findAll(".tab-navigation__tab");
    expect(tabs[0].classes()).not.toContain("tab-navigation__tab--active");
    expect(tabs[1].classes()).toContain("tab-navigation__tab--active");
  });

  it("should emit view-change on tab click", async () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
      },
    });

    const backendTab = wrapper.findAll(".tab-navigation__tab")[1];
    await backendTab.trigger("click");

    expect(wrapper.emitted("view-change")).toBeTruthy();
    expect(wrapper.emitted("view-change")?.[0]).toEqual(["backend"]);
  });

  it("should not emit when disabled", async () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
        disabled: true,
      },
    });

    const backendTab = wrapper.findAll(".tab-navigation__tab")[1];
    await backendTab.trigger("click");

    expect(wrapper.emitted("view-change")).toBeFalsy();
  });

  it("should handle keyboard navigation", async () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
      },
    });

    const frontendTab = wrapper.findAll(".tab-navigation__tab")[0];
    await frontendTab.trigger("keydown", {key: "ArrowRight"});

    expect(wrapper.emitted("view-change")).toBeTruthy();
    expect(wrapper.emitted("view-change")?.[0]).toEqual(["backend"]);
  });

  it("should have correct ARIA attributes", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
        "aria-label": "Custom navigation label",
      },
    });

    const nav = wrapper.find(".tab-navigation");
    expect(nav.attributes("role")).toBe("tablist");
    expect(nav.attributes("aria-label")).toBe("Custom navigation label");

    const tabs = wrapper.findAll(".tab-navigation__tab");
    expect(tabs[0].attributes("role")).toBe("tab");
    expect(tabs[0].attributes("aria-selected")).toBe("true");
    expect(tabs[0].attributes("aria-controls")).toBe("frontend-panel");
    expect(tabs[0].attributes("tabindex")).toBe("0");

    expect(tabs[1].attributes("aria-selected")).toBe("false");
    expect(tabs[1].attributes("tabindex")).toBe("-1");
  });

  it("should meet accessibility standards", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
      },
    });

    // Check basic accessibility attributes
    const nav = wrapper.find(".tab-navigation");
    expect(nav.attributes("role")).toBe("tablist");

    const tabs = wrapper.findAll(".tab-navigation__tab");
    expect(tabs[0].attributes("role")).toBe("tab");
    expect(tabs[0].attributes("aria-selected")).toBe("true");
  });

  it("should show disabled state correctly", () => {
    const wrapper = mount(TabNavigation, {
      props: {
        currentView: "frontend",
        disabled: true,
      },
    });

    const tabs = wrapper.findAll(".tab-navigation__tab");
    tabs.forEach((tab) => {
      expect(tab.classes()).toContain("tab-navigation__tab--disabled");
      expect(tab.attributes("disabled")).toBe("");
    });
  });
});
