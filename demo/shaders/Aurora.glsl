void fragment() {  

    float ratio = XY.x / XY.y;
    float g = 0.2;
    vec2 F = UV.xy - vec2(0.35, 0.35);
    vec4 O = vec4(0.0);

    vec2 res = vec2(0.3);
    vec3 A = vec3(res.xy, res.x);
    vec3 p;
    float u = 0.0,
          R = 0.0,
          o = 0.0,
          r = 0.0,
          a = time;

    for (; u < 60.0; u++) {
        p = R * normalize(vec3(F + F - A.xy, A.y));
        
        p.z -= 2.0;
        r = length(p);
        p /= r * 0.1;
        
        p.xz *= mat2(cos(a * 0.2 + vec4(0, 33, 11, 0)));
        // R += o = min(r - 0.3, texture(u_texture, F / 1024.0).r * 0.1) + 0.1;
        R += o = min(r - 0.3, 0.0 * 0.1) + 0.1;
        
        O += 0.05 / (0.4 + o) 
             * mix(smoothstep(0.5, 0.7, sin(p.x + cos(p.y) * cos(p.z)) * sin(p.z + sin(p.y) * cos(p.x + a))), 
                   1.0, 0.15 / r / r) 
             * smoothstep(5.0, 0.0, r)
             * (1.0 + cos(R * 3.0 + vec4(0, 1, 2, 0)));
    }

    FOut = O;
}