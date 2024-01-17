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
    mappingItems: {
      type: 'array',
      items: [
        {
          type: 'object',
          properties: {
            sourceStateName: {
              type: 'string',
            },
            targetMappings: {
              type: 'array',
              items: [
                {
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
              ],
            },
          },
          required: ['sourceStateName', 'targetMappings'],
        },
        {
          type: 'object',
          properties: {
            sourceStateName: {
              type: 'string',
            },
            targetMappings: {
              type: 'array',
              items: [
                {
                  type: 'object',
                  properties: {
                    targetStateName: {
                      type: 'string',
                    },
                    jsonPathVal: {
                      type: 'string',
                    },
                    jsonPathTimestamp: {
                      type: 'string',
                    },
                  },
                  required: ['targetStateName', 'jsonPathVal', 'jsonPathTimestamp'],
                },
              ],
            },
          },
          required: ['sourceStateName', 'targetMappings'],
        },
      ],
    },
  },
  required: ['groupFilter', 'filterType', 'mappingItems'],
};
