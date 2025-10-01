import "@testing-library/jest-dom";
import {configure} from "@testing-library/vue";

// Configure testing library
configure({
  testIdAttribute: "data-testid",
});

