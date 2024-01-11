export const schema = {
  type: 'object',
  properties: {
    instructionSetStatesPattern: {
      type: 'string',
    },
    createTargetStatesIfNotExist: {
      type: 'boolean',
    },
  },
  required: ['instructionSetStatesPattern', 'createTargetStatesIfNotExist'],
};
