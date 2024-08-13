vec2 uv = UV
vec2 uv0 = uv;
vec3 finalColor = vec3(0.0);

for (float i = 0.0; i < 4.0; i++) {
    uv = fract(uv * 1.5) - 0.5;

    float d = length(uv) * exp(-length(uv0));

    vec3 col = palette(length(uv0) + i*.4 + time*.4);

    d = sin(d*8. + time)/8.;
    d = abs(d);

    d = pow(0.01 / d, 1.2);

    finalColor += col * d;
}
    
FOut = vec4(finalColor, 1.0);