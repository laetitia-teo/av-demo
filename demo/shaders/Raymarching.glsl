// This scene is taken from my second tutorial about shader coding,
// which introduces the concept of raymarching as well as some useful
// transforms and space-bending techniques.
// 
//     Mouse interactive!
//                            Video URL: https://youtu.be/khblXafu7iA

// 2D rotation function
mat2 rot2D(float a) {
    return mat2(cos(a), -sin(a), sin(a), cos(a));
}

// Custom gradient - https://iquilezles.org/articles/palettes/
// vec3 palette(float t) {
//     return .5+.5*cos(6.28318*(t+vec3(.3,.416,.557)));
// }

vec3 palette(float t, float r) {
{
    vec3 a1 = vec3( 0.8, 0.5, 0.4 );
    vec3 b1 = vec3( 0.2, 0.4, 0.2 );
    vec3 c1 = vec3( 2.0, 1.0, 1.0 );
    vec3 d1 = vec3( 0.00, 0.25, 0.25 );

    vec3 a2 = vec3( 0.5, 0.5, 0.5 );
    vec3 b2 = vec3( 0.5, 0.5, 0.5 );
    vec3 c2 = vec3( 1.0, 1.0, 1.0 );
    vec3 d2 = vec3( .3,.416,.557 );

    vec3 a = r * a1 + (1. - r) * a2;
    vec3 b = r * b1 + (1. - r) * b2;
    vec3 c = r * c1 + (1. - r) * c2;
    vec3 d = r * d1 + (1. - r) * d2;
    return a + b*cos( 6.28318*(c*t+d) );
}
}

// Octahedron SDF - https://iquilezles.org/articles/distfunctions/
float sdOctahedron(vec3 p, float s) {
    p = abs(p);
    return (p.x+p.y+p.z-s)*0.57735027;
}

// Scene distance
float map(vec3 p, float r1, float r2, float r3) {
    p.z += time * .4 * r3; // Forward movement
    
    // Space repetition
    p.xy = fract(p.xy) - .5;     // spacing: 1
    r2 = 0.001 + r2 * 0.5;
    p.z =  mod(p.z, r2) - .125; // spacing: .25
    
    // return sdOctahedron(p, .3 * r); // Octahedron
    return sdOctahedron(p, r1); // Octahedron
}

void fragment() {
    float pi = 3.14159;

    // midi slider inputs
    float s0 = sliders(ivec2(0,0)).x;
    float s1 = sliders(ivec2(1,0)).x;
    float s2 = sliders(ivec2(2,0)).x;
    float s3 = sliders(ivec2(3,0)).x;
    float s4 = sliders(ivec2(4,0)).x;
    float s5 = sliders(ivec2(5,0)).x;
    float s6 = sliders(ivec2(6,0)).x;
    float s7 = sliders(ivec2(7,0)).x;

    float k0 = knobs(ivec2(0,0)).x;
    float k1 = knobs(ivec2(1,0)).x;
    float k2 = knobs(ivec2(2,0)).x;
    float k3 = knobs(ivec2(3,0)).x;
    float k4 = knobs(ivec2(4,0)).x;
    float k5 = knobs(ivec2(5,0)).x;
    float k6 = knobs(ivec2(6,0)).x;
    float k7 = knobs(ivec2(7,0)).x;

    // Default circular motion if mouse not clicked
    // if (iMouse.z <= 0.) m = vec2(cos(time*.2), sin(time*.2));
    // vec2 m = vec2(cos(time*.2), sin(time*.2));
    vec2 m = vec2(1.);

    // Initialization
    vec3 ro = vec3(0, 0, -3);         // ray origin
    vec3 rd = normalize(vec3(XY + vec2(0., k2 * 2.), 1)); // ray direction
    vec3 col = vec3(0);               // final pixel color

    float t = 0.; // total distance travelled

    int i; // Raymarching
    for (i = 0; i < 80; i++) {
        vec3 p = ro + rd * t; // position along the ray
        
        p.xy *= rot2D(t*.15 * s1 * 2. * pi * k0 * 4.);     // rotate ray around z-axis
        p.y += sin(t*(m.y+5.*(0.-s0))*.5*time*0.2)*.35;  // wiggle ray
        float d = map(p, s2, s4, s5);     // current distance to the scene
        t += d * k1 * 2.;               // "march" the ray
        if (d < .00001 || t > 1000.) break; // early stop
    }

    // Coloring

    col = palette(t*.04 + float(i)*.005, s3);

    FOut = vec4(col, 1);
}