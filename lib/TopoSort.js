"use strict";

require("source-map-support/register");

const {
  _
} = require('rk-utils');

class TopoSort {
  constructor() {
    this.mapOfDependents = {};
    this.mapOfDependencies = {};
  }

  add(dependency, newDependents) {
    newDependents = Array.isArray(newDependents) ? newDependents : [newDependents];
    let dependents = this.mapOfDependents[dependency];
    newDependents.forEach(dependent => {
      let dependencies = this.mapOfDependencies[dependent];

      if (!dependencies) {
        this.mapOfDependencies[dependent] = new Set([dependency]);
      } else {
        dependencies.add(dependency);
      }

      if (dependents) {
        dependents.add(dependent);
      }
    });

    if (!dependents) {
      this.mapOfDependents[dependency] = new Set(newDependents);
    }
  }

  hasDependency(node) {
    return this.mapOfDependencies[node] && this.mapOfDependencies[node].size > 0 || false;
  }

  hasDependent(node) {
    return this.mapOfDependents[node] && this.mapOfDependents[node].size > 0 || false;
  }

  sort() {
    let l = [];
    let nodesWithDependents = Object.keys(this.mapOfDependents);
    let nodesWithDependencies = Object.keys(this.mapOfDependencies);
    let initialNodes = new Set(nodesWithDependents);
    nodesWithDependencies.forEach(nodeHasDependency => initialNodes.delete(nodeHasDependency));
    let s = [...initialNodes];
    let allNodes = new Set(nodesWithDependents.concat(nodesWithDependencies));
    let unsorted = allNodes.size;

    let numWithDependencies = _.mapValues(this.mapOfDependencies, node => node.size);

    while (s.length !== 0) {
      let n = s.shift();
      l.push(n);
      --unsorted;
      let dependentsOfN = this.mapOfDependents[n];

      if (dependentsOfN) {
        for (let dependentOfN of dependentsOfN) {
          if (--numWithDependencies[dependentOfN] === 0) {
            s.push(dependentOfN);
          }
        }

        ;
      }
    }

    if (unsorted !== 0) {
      let circular = [];

      for (let node in numWithDependencies) {
        if (numWithDependencies[node] !== 0) {
          circular.push(node);
        }
      }

      throw new Error('At least 1 circular dependency in nodes: \n\n' + circular.join('\n') + '\n\nGraph cannot be sorted!');
    }

    return l;
  }

}

module.exports = TopoSort;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIi4uL3NyYy9Ub3BvU29ydC5qcyJdLCJuYW1lcyI6WyJfIiwicmVxdWlyZSIsIlRvcG9Tb3J0IiwibWFwT2ZEZXBlbmRlbnRzIiwibWFwT2ZEZXBlbmRlbmNpZXMiLCJhZGQiLCJkZXBlbmRlbmN5IiwibmV3RGVwZW5kZW50cyIsIkFycmF5IiwiaXNBcnJheSIsImRlcGVuZGVudHMiLCJmb3JFYWNoIiwiZGVwZW5kZW50IiwiZGVwZW5kZW5jaWVzIiwiU2V0IiwiaGFzRGVwZW5kZW5jeSIsIm5vZGUiLCJzaXplIiwiaGFzRGVwZW5kZW50Iiwic29ydCIsImwiLCJub2Rlc1dpdGhEZXBlbmRlbnRzIiwiT2JqZWN0Iiwia2V5cyIsIm5vZGVzV2l0aERlcGVuZGVuY2llcyIsImluaXRpYWxOb2RlcyIsIm5vZGVIYXNEZXBlbmRlbmN5IiwiZGVsZXRlIiwicyIsImFsbE5vZGVzIiwiY29uY2F0IiwidW5zb3J0ZWQiLCJudW1XaXRoRGVwZW5kZW5jaWVzIiwibWFwVmFsdWVzIiwibGVuZ3RoIiwibiIsInNoaWZ0IiwicHVzaCIsImRlcGVuZGVudHNPZk4iLCJkZXBlbmRlbnRPZk4iLCJjaXJjdWxhciIsIkVycm9yIiwiam9pbiIsIm1vZHVsZSIsImV4cG9ydHMiXSwibWFwcGluZ3MiOiJBQUFBOzs7O0FBRUEsTUFBTTtBQUFFQSxFQUFBQTtBQUFGLElBQVFDLE9BQU8sQ0FBQyxVQUFELENBQXJCOztBQUtBLE1BQU1DLFFBQU4sQ0FBZTtBQUFBO0FBQUEsU0FLWEMsZUFMVyxHQUtPLEVBTFA7QUFBQSxTQVdYQyxpQkFYVyxHQVdTLEVBWFQ7QUFBQTs7QUFrQlhDLEVBQUFBLEdBQUcsQ0FBQ0MsVUFBRCxFQUFhQyxhQUFiLEVBQTRCO0FBRTNCQSxJQUFBQSxhQUFhLEdBQUdDLEtBQUssQ0FBQ0MsT0FBTixDQUFjRixhQUFkLElBQStCQSxhQUEvQixHQUErQyxDQUFFQSxhQUFGLENBQS9EO0FBR0EsUUFBSUcsVUFBVSxHQUFHLEtBQUtQLGVBQUwsQ0FBcUJHLFVBQXJC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c0M7QUFDbEMsWUFBSUEsbUJBQW1CLENBQUNoQixJQUFELENBQW5CLEtBQThCLENBQWxDLEVBQW9DO0FBQ2hDd0IsVUFBQUEsUUFBUSxDQUFDSCxJQUFULENBQWNyQixJQUFkO0FBQ0g7QUFDSjs7QUFFRCxZQUFNLElBQUl5QixLQUFKLENBQVUsa0RBQWtERCxRQUFRLENBQUNFLElBQVQsQ0FBYyxJQUFkLENBQWxELEdBQXdFLDZCQUFsRixDQUFOO0FBQ0g7O0FBRUQsV0FBT3RCLENBQVA7QUFDSDs7QUF0SFU7O0FBeUhmdUIsTUFBTSxDQUFDQyxPQUFQLEdBQWlCMUMsUUFBakIiLCJzb3VyY2VzQ29udGVudCI6WyJcInVzZSBzdHJpY3RcIjtcblxuY29uc3QgeyBfIH0gPSByZXF1aXJlKCdyay11dGlscycpO1xuXG4vKipcbiAqIEBjbGFzc1xuICovXG5jbGFzcyBUb3BvU29ydCB7ICAgIFxuICAgIC8qKlxuICAgICAqIE1hcCBvZiBub2RlcyB0byBhIHNldCBvZiBub2RlcyBhcyBkZXBlbmRlbnRzLCA8c3RyaW5nLCBTZXQuPHN0cmluZz4+XG4gICAgICogQG1lbWJlciB7b2JqZWN0fVxuICAgICAqL1xuICAgIG1hcE9mRGVwZW5kZW50cyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogTWFwIG9mIG5vZGVzIHRvIGEgc2V0IG9mIG5vZGVzIGFzIGRlcGVuZGVuY2llcywgPHN0cmluZywgU2V0LjxzdHJpbmc+PlxuICAgICAqIEBtZW1iZXIge29iamVjdH1cbiAgICAgKi9cbiAgICBtYXBPZkRlcGVuZGVuY2llcyA9IHt9O1xuXG4gICAgLyoqXG4gICAgICogQWRkIGVkZ2VzKG9yIG9uZSBlZGdlLCBpZiB2YWx1ZXMgaXMgbm9uLWFycmF5KS5cbiAgICAgKiBAcGFyYW0ge3N0cmluZ30gZGVwZW5kZW5jeSAtIEluY29taW5nIG5vZGUgKGRlcGVuZGVuY3kpXG4gICAgICogQHBhcmFtIHtzdHJpbmd8YXJyYXl9IGRlcGVuZGVudHMgLSBPdXRnb2luZyBub2RlIG9yIG5vZGVzXG4gICAgICovXG4gICAgYWRkKGRlcGVuZGVuY3ksIG5ld0RlcGVuZGVudHMpIHtcbiAgICAgICAgLy9jYXN0IHRvIGFycmF5XG4gICAgICAgIG5ld0RlcGVuZGVudHMgPSBBcnJheS5pc0FycmF5KG5ld0RlcGVuZGVudHMpID8gbmV3RGVwZW5kZW50cyA6IFsgbmV3RGVwZW5kZW50cyBdO1xuXG4gICAgICAgIC8vZ2V0IHRoZSBleGlzdGluZyBkZXBlbmRlbnRzXG4gICAgICAgIGxldCBkZXBlbmRlbnRzID0gdGhpcy5tYXBPZkRlcGVuZGVudHNbZGVwZW5kZW5jeV07XG5cbiAgICAgICAgbmV3RGVwZW5kZW50cy5mb3JFYWNoKGRlcGVuZGVudCA9PiB7XG4gICAgICAgICAgICAvL2dldCB0aGUgZXhpc3RpbmcgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICBsZXQgZGVwZW5kZW5jaWVzID0gdGhpcy5tYXBPZkRlcGVuZGVuY2llc1tkZXBlbmRlbnRdO1xuICAgICAgICAgICAgaWYgKCFkZXBlbmRlbmNpZXMpIHtcbiAgICAgICAgICAgICAgICAvL25ldyBzZXQgb2YgZGVwZW5kZW5jaWVzXG4gICAgICAgICAgICAgICAgdGhpcy5tYXBPZkRlcGVuZGVuY2llc1tkZXBlbmRlbnRdID0gbmV3IFNldChbIGRlcGVuZGVuY3kgXSk7IFxuICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICBkZXBlbmRlbmNpZXMuYWRkKGRlcGVuZGVuY3kpO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICBpZiAoZGVwZW5kZW50cykge1xuICAgICAgICAgICAgICAgIGRlcGVuZGVudHMuYWRkKGRlcGVuZGVudCk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuXG4gICAgICAgIGlmICghZGVwZW5kZW50cykge1xuICAgICAgICAgICAgLy9uZXcgc2V0IG9mIGRlcGVuZGVudHNcbiAgICAgICAgICAgIHRoaXMubWFwT2ZEZXBlbmRlbnRzW2RlcGVuZGVuY3ldID0gbmV3IFNldChuZXdEZXBlbmRlbnRzKTtcbiAgICAgICAgfVxuICAgIH1cblxuICAgIGhhc0RlcGVuZGVuY3kobm9kZSkge1xuICAgICAgICByZXR1cm4gKHRoaXMubWFwT2ZEZXBlbmRlbmNpZXNbbm9kZV0gJiYgdGhpcy5tYXBPZkRlcGVuZGVuY2llc1tub2RlXS5zaXplID4gMCkgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgaGFzRGVwZW5kZW50KG5vZGUpIHtcbiAgICAgICAgcmV0dXJuICh0aGlzLm1hcE9mRGVwZW5kZW50c1tub2RlXSAmJiB0aGlzLm1hcE9mRGVwZW5kZW50c1tub2RlXS5zaXplID4gMCkgfHwgZmFsc2U7XG4gICAgfVxuXG4gICAgLyoqXG4gICAgICogU29ydCB0aGUgZ3JhcGguIENpcmN1bGFyIGdyYXBoIHRocm93IGFuIGVycm9yIHdpdGggdGhlIGNpcmN1bGFyIG5vZGVzIGluZm8uXG4gICAgICogSW1wbGVtZW50YXRpb24gb2YgaHR0cDovL2VuLndpa2lwZWRpYS5vcmcvd2lraS9Ub3BvbG9naWNhbF9zb3J0aW5nI0FsZ29yaXRobXNcbiAgICAgKiBSZWZlcmVuY2U6IGh0dHA6Ly9jb3Vyc2VzLmNzLndhc2hpbmd0b24uZWR1L2NvdXJzZXMvY3NlMzI2LzAzd2kvbGVjdHVyZXMvUmFvTGVjdDIwLnBkZlxuICAgICAqIEByZXR1cm4ge0FycmF5fSBTb3J0ZWQgbGlzdFxuICAgICAqL1xuICAgIHNvcnQoKSB7ICAgICAgICBcbiAgICAgICAgLy8gVGhlIGxpc3QgY29udGFpbnMgdGhlIGZpbmFsIHNvcnRlZCBub2Rlcy5cbiAgICAgICAgbGV0IGwgPSBbXTtcblxuICAgICAgICAvLyBGaW5kIGFsbCB0aGUgaW5pdGlhbCAwIGluY29taW5nIGVkZ2Ugbm9kZXMuIElmIG5vdCBmb3VuZCwgdGhpcyBpcyBpcyBhIGNpcmN1bGFyIGdyYXBoLCBjYW5ub3QgYmUgc29ydGVkLiAgICAgICAgIFxuICAgICAgICBsZXQgbm9kZXNXaXRoRGVwZW5kZW50cyA9IE9iamVjdC5rZXlzKHRoaXMubWFwT2ZEZXBlbmRlbnRzKTtcbiAgICAgICAgbGV0IG5vZGVzV2l0aERlcGVuZGVuY2llcyA9IE9iamVjdC5rZXlzKHRoaXMubWFwT2ZEZXBlbmRlbmNpZXMpO1xuXG4gICAgICAgIGxldCBpbml0aWFsTm9kZXMgPSBuZXcgU2V0KG5vZGVzV2l0aERlcGVuZGVudHMpO1xuICAgICAgICBub2Rlc1dpdGhEZXBlbmRlbmNpZXMuZm9yRWFjaChub2RlSGFzRGVwZW5kZW5jeSA9PiBpbml0aWFsTm9kZXMuZGVsZXRlKG5vZGVIYXNEZXBlbmRlbmN5KSk7XG5cbiAgICAgICAgLy8gTGlzdCBvZiBub2RlcyB3aXRoIG5vIHVuc29ydGVkIGRlcGVuZGVuY2llc1xuICAgICAgICBsZXQgcyA9IFsuLi5pbml0aWFsTm9kZXNdO1xuXG4gICAgICAgIGxldCBhbGxOb2RlcyA9IG5ldyBTZXQobm9kZXNXaXRoRGVwZW5kZW50cy5jb25jYXQobm9kZXNXaXRoRGVwZW5kZW5jaWVzKSk7XG5cbiAgICAgICAgLy8gbnVtYmVyIG9mIHVuc29ydGVkIG5vZGVzLiBJZiBpdCBpcyBub3QgemVybyBhdCB0aGUgZW5kLCB0aGlzIGdyYXBoIGlzIGEgY2lyY3VsYXIgZ3JhcGggYW5kIGNhbm5vdCBiZSBzb3J0ZWQuXG4gICAgICAgIGxldCB1bnNvcnRlZCA9IGFsbE5vZGVzLnNpemU7XG5cbiAgICAgICAgbGV0IG51bVdpdGhEZXBlbmRlbmNpZXMgPSBfLm1hcFZhbHVlcyh0aGlzLm1hcE9mRGVwZW5kZW5jaWVzLCBub2RlID0+IG5vZGUuc2l6ZSk7XG5cbiAgICAgICAgd2hpbGUgKHMubGVuZ3RoICE9PSAwKXtcbiAgICAgICAgICAgIGxldCBuID0gcy5zaGlmdCgpO1xuICAgICAgICAgICAgbC5wdXNoKG4pO1xuXG4gICAgICAgICAgICAvLyBkZWNyZWFzZSB1bnNvcnRlZCBjb3VudCwgbm9kZSBuIGhhcyBiZWVuIHNvcnRlZC5cbiAgICAgICAgICAgIC0tdW5zb3J0ZWQ7XG5cbiAgICAgICAgICAgIC8vIG4gbm9kZSBtaWdodCBoYXZlIG5vIGRlcGVuZGVuY3ksIHNvIGhhdmUgdG8gY2hlY2sgaXQuXG4gICAgICAgICAgICBsZXQgZGVwZW5kZW50c09mTiA9IHRoaXMubWFwT2ZEZXBlbmRlbnRzW25dO1xuICAgICAgICAgICAgaWYgKGRlcGVuZGVudHNPZk4pIHtcbiAgICAgICAgICAgICAgICBcbiAgICAgICAgICAgICAgICAvLyBkZWNlYXNlIG4ncyBhZGphY2VudCBub2RlcycgaW5jb21pbmcgZWRnZXMgY291bnQuIElmIGFueSBvZiB0aGVtIGhhcyAwIGluY29taW5nIGVkZ2VzLCBwdXNoIHRoZW0gaW50byBzIGdldCB0aGVtIHJlYWR5IGZvciBkZXRhY2hpbmcgZnJvbSB0aGUgZ3JhcGguXG4gICAgICAgICAgICAgICAgZm9yIChsZXQgZGVwZW5kZW50T2ZOIG9mIGRlcGVuZGVudHNPZk4pIHsgICAgICAgICAgICAgICAgICAgIFxuXG4gICAgICAgICAgICAgICAgICAgIGlmICgtLW51bVdpdGhEZXBlbmRlbmNpZXNbZGVwZW5kZW50T2ZOXSA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9ubyB1bnNvcnRlZCBkZXBlbmRlbmNpZXNcbiAgICAgICAgICAgICAgICAgICAgICAgIHMucHVzaChkZXBlbmRlbnRPZk4pO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIC8vIElmIHRoZXJlIGFyZSB1bnNvcnRlZCBub2RlcyBsZWZ0LCB0aGlzIGdyYXBoIGlzIGEgY2lyY3VsYXIgZ3JhcGggYW5kIGNhbm5vdCBiZSBzb3J0ZWQuXG4gICAgICAgIC8vIEF0IGxlYXN0IDEgY2lyY3VsYXIgZGVwZW5kZW5jeSBleGlzdCBpbiB0aGUgbm9kZXMgd2l0aCBub24temVybyBpbmNvbWluZyBlZGdlcy5cbiAgICAgICAgaWYgKHVuc29ydGVkICE9PSAwKSB7XG4gICAgICAgICAgICBsZXQgY2lyY3VsYXIgPSBbXTtcbiAgICAgICAgICAgIFxuICAgICAgICAgICAgZm9yIChsZXQgbm9kZSBpbiBudW1XaXRoRGVwZW5kZW5jaWVzKSB7XG4gICAgICAgICAgICAgICAgaWYgKG51bVdpdGhEZXBlbmRlbmNpZXNbbm9kZV0gIT09IDApe1xuICAgICAgICAgICAgICAgICAgICBjaXJjdWxhci5wdXNoKG5vZGUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdBdCBsZWFzdCAxIGNpcmN1bGFyIGRlcGVuZGVuY3kgaW4gbm9kZXM6IFxcblxcbicgKyBjaXJjdWxhci5qb2luKCdcXG4nKSArICdcXG5cXG5HcmFwaCBjYW5ub3QgYmUgc29ydGVkIScpO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIGw7XG4gICAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFRvcG9Tb3J0OyJdfQ==