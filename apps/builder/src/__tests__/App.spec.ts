import {describe, it, expect, vi} from "vitest";
import {mount} from "@vue/test-utils";
import App from "../App.vue";

// Mock the Index component
vi.mock("../pages/Index.vue", () => ({
  default: {
    name: "Index",
    template: "<div data-testid='index-page'>Index Page</div>",
  },
}));

describe("App", () => {
  it("should render the Index page", () => {
    const wrapper = mount(App);

    expect(wrapper.find('[data-testid="index-page"]').exists()).toBe(true);
  });
});
