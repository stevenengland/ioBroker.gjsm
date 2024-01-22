export const schema = {
  type: 'object',
  properties: {
    id: {
      type: 'string',
    },
    errors: {
      type: 'array',
      items: {
        type: 'string',
      },
    },
    groupFilter: {
      type: 'string',
    },
    filterType: {
      type: 'string',
      enum: ['function'],
    },
    automations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['instructions', 'sourceStateName'],
        properties: {
          sourceStateName: {
            type: 'string',
          },
          instructions: {
            type: 'array',
            items: {
              anyOf: [
                {
                  // Set value
                  type: 'object',
                  required: ['action', 'targetStateName'],
                  properties: {
                    name: {
                      type: 'string',
                    },
                    action: { const: 'set_value' },
                    targetStateName: {
                      type: 'string',
                    },
                  },
                  additionalProperties: false,
                },
                {
                  // Map value
                  type: 'object',
                  required: ['action', 'targetStateName', 'jsonPathVal'],
                  properties: {
                    name: {
                      type: 'string',
                    },
                    action: { const: 'map_value' },
                    targetStateName: {
                      type: 'string',
                    },
                    jsonPathVal: {
                      type: 'string',
                    },
                  },
                  additionalProperties: false,
                },
              ],
            },
          },
        },
      },
    },
  },
  oneOf: [
    {
      required: ['errors'],
    },
    {
      required: ['automations', 'groupFilter', 'filterType'],
    },
  ],
};
