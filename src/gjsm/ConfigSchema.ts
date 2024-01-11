export const schema = {
  type: 'object',
  properties: {
    automationStatesPattern: {
      type: 'string',
    },
    createTargetStatesIfNotExist: {
      type: 'boolean',
    },
  },
  required: ['automationStatesPattern', 'createTargetStatesIfNotExist'],
};
