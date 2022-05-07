export default {
  type: "object",
  properties: {
    name: { type: "string" },
    cellNumber: { type: "string" },
    address: { type: "string" },
    city: { type: "string" },
    state: { type: "string" },
    zipCode: { type: "string" },
  },
} as const;
