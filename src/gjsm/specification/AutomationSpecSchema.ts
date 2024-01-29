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
              type: 'object',
              oneOf: [
                {
                  required: ['map_value'],
                },
                {
                  required: ['set_value'],
                },
              ],
              properties: {
                name: {
                  type: 'string',
                },
                map_value: {
                  type: 'object',
                  required: ['targetStateName', 'jsonPathVal'],
                  properties: {
                    targetStateName: {
                      type: 'string',
                    },
                    jsonPathVal: {
                      type: 'string',
                    },
                  },
                  additionalProperties: false,
                },
                set_value: {
                  type: 'object',
                  required: ['targetStateName'],
                  properties: {
                    targetStateName: {
                      type: 'string',
                    },
                  },
                  additionalProperties: false,
                },
              },
              additionalProperties: false,
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
