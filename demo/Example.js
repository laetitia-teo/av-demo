/** @license 
  * Copyright 2023 Google LLC.
  * SPDX-License-Identifier: Apache-2.0 
  */

// Based on "μNCA: Texture Generation with Ultra-Compact Neural Cellular Automata"
// https://arxiv.org/abs/2111.13545
class Example {
    static Tags = ['2d', 'ca'];
    constructor() {
      this.W = new Float32Array([
        -67,1,2,44,-13,-59,4,30,-1,16,-57,9,-10,-4,-2,-41,    19,-18,-1,8,-4,35,8,0,-4,-4,-1,0,34,31,21,-25,
        4,13,18,-57,-79,-22,-25,71,-12,-11,24,27,-17,-8,-7,6, 11,10,4,0,4,1,2,7,-26,-33,-15,-3,22,27,20,-34]);
      this.b = new Float32Array([2,-5,-14,9]);
    }
    frame(glsl, {DPR}) {
        glsl({FP:`
        for(O*=i; i++ < 44.;) {
          p = t * rd;
          p.z -= 2.;
          l = length(p);
          p /= l * .1;
          t += d = min(l - .3, T * .1) + .1;
          O += .05 / (.4 + d) * mix(
              S(.5, .7, sin(p.x + cos(p.y) * cos(p.z)) * sin(p.z + sin(p.y) * cos(p.x + T))),
              1.,
              .15 / l / l
          ) * S(5., 0., l) * (1. + cos(t * 3. + vec4(0, 1, 2, 0)));
        }
        FOut = O;`}, {story:2, scale:1/4/DPR, tag:'state'});
        // glsl({tex:state[0], FP:`tex(UV)*2.-.5`});
    }
}
