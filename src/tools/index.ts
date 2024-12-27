import * as fsTools from './fs.js';
import * as npmTools from './npm.js';

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
