import treeReducer, { TreeState } from './tree-reducer';
import zipkinReducer, { ZipkinState } from './zipkin-reducer';

export interface State {
  routing: any;
  zipkin: ZipkinState;
  tree: TreeState;
}

export {
  treeReducer,
  zipkinReducer,
  TreeState,
  ZipkinState,
};