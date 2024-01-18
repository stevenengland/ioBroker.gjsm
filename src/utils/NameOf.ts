export interface NameofOptions {
  /**
   * Take only the last property of nested properties.
   */
  lastProp?: boolean;
}

function cleanseAssertionOperators(parsedName: string): string {
  return parsedName.replace(/[?!]/g, '');
}

export function nameof<T extends object>(
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  nameFunction: ((obj: T) => any) | (new (...params: any[]) => T),
): string {
  const fnStr = nameFunction.toString();

  // ES6 class name:
  // "class ClassName { ..."
  if (
    fnStr.startsWith('class ') &&
    // Theoretically could, for some ill-advised reason, be "class => class.prop".
    !fnStr.startsWith('class =>')
  ) {
    return cleanseAssertionOperators(fnStr.substring('class '.length, fnStr.indexOf(' {')));
  }

  if (fnStr.startsWith('function ')) {
    return cleanseAssertionOperators(fnStr.substring('function '.length, fnStr.indexOf('(')));
  }

  // ES6 prop selector:
  // "x => x.prop"
  // if (fnStr.includes('=>')) {
  //   return cleanseAssertionOperators(fnStr.substring(fnStr.indexOf('.') + 1));
  // }

  return cleanseAssertionOperators(fnStr.substring(fnStr.indexOf('.') + 1));
}
