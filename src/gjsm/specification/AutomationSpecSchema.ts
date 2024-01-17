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
      enum: ['Function'],
    },
    automations: {
      type: 'array',
      items: {
        type: 'object',
        required: ['automationType', 'sourceStateName'],
        properties: {
          automationType: {
            type: 'string',
            enum: ['Mapping'],
          },
          sourceStateName: {
            type: 'string',
          },
        },
        if: {
          properties: {
            automationType: {
              const: 'Mapping',
            },
          },
        },
        then: {
          required: ['mappings'],
          properties: {
            mappings: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  targetStateName: {
                    type: 'string',
                  },
                  jsonPathVal: {
                    type: 'string',
                  },
                },
                required: ['targetStateName', 'jsonPathVal'],
              },
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
