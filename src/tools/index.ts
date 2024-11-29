import * as npmTools from './npm';
import * as fsTools from './fs';

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
