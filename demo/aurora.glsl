vec3 A = iResolution, p;
float u, R, o, r, a = time;
for (O *= u; u++ < 44.;)

        p = R * normalize(vec3(F+F-A.xy, A.y)),
        
        p.z -= 2., r = length(p), p /= r*.1,
        
        p.xz *= mat2(cos(a*.2 + vec4(0,33,11,0))),
        R += o = min(r - .3, texture(iChannel3, F/1024.).r*.1) + .1,
        
        O += .05 / (.4 + o) 
             * mix( smoothstep(.5,.7,sin(p.x+cos(p.y)*cos(p.z))*sin(p.z+sin(p.y)*cos(p.x+a))), 
                    1., .15/r/r ) 
             * smoothstep(5., 0., r)
             * (1. + cos(R*3. + vec4(0,1,2,0)));