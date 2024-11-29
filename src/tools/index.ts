import * as fsTools from './fs';
import * as npmTools from './npm';

export function getBuiltinTools() {
  return {
    ...npmTools,
    ...fsTools,
  };
}

export function getUserTools(tools: string[]) {
  // TODO: implement
  return {};
}
