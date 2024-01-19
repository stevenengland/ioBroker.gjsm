export const schema = {
  type: 'object',
  properties: {
    automationStatesPattern: {
      type: 'string',
    },
    functionsNamespace: {
      type: 'string',
    },
    createTargetStatesIfNotExist: {
      type: 'boolean',
    },
  },
  required: ['automationStatesPattern', 'createTargetStatesIfNotExist'],
};
