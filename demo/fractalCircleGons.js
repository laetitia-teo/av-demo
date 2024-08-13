class FractalCircleGon {
    // static Tags = ['3d', 'data'];
    
    constructor(glsl, gui) {
        navigator.mediaDevices.getUserMedia({audio: true}).then(stream=>{
            this.audioCtx = new AudioContext();
            this.input = this.audioCtx.createMediaStreamSource(stream);
            this.analyser = this.audioCtx.createAnalyser();
            this.analyser.smoothingTimeConstant = 0.5;
            this.input.connect(this.analyser);
            this.frequencyArray = new Uint8Array(this.analyser.frequencyBinCount);
            console.log('mic activated, frequencyBinCount:', this.analyser.frequencyBinCount);
        }).catch(e=>console.error('Error getting microphone:', e));
    }

    frame(glsl, params) {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(this.frequencyArray);
        const n = this.frequencyArray.length;
        const histLen = 256;
        const spectro = glsl({}, {size:[n, 1], format:'r8', data:this.frequencyArray, tag:'spectro'});
        const history = glsl({spectro, FP:'I.y>0 ? Src(I-ivec2(0,1)) : spectro(ivec2(I.x,0))'},
                             {size:[n,histLen], story:2, wrap:'edge', tag:'history'});
        const sliders = glsl({}, {size:[8, 1], format:'r8', data:params.sliders, tag:'sliders'})
        glsl({...params, Aspect:'cover', spectro, sliders, n, FP:`
        vec3 palette( float t ) {
            vec3 a = vec3(0.5, 0.5, 0.5);
            vec3 b = vec3(0.5, 0.5, 0.5);
            vec3 c = vec3(1.0, 1.0, 1.0);
            vec3 d = vec3(0.263,0.416,0.557);

            return a + b*cos( 6.28318*(c*t+d) );
        }

        float sdHexagon( in vec2 p, in float r )
        {
            const vec3 k = vec3(-0.866025404,0.5,0.577350269);
            p = abs(p);
            p -= 2.0*min(dot(k.xy,p),0.0)*k.xy;
            p -= vec2(clamp(p.x, -k.z*r, k.z*r), r);
            return length(p)*sign(p.y);
        }

        float sdCircle( vec2 p, float r )
        {
            return length(p) - r;
        }

        void fragment() {
            vec4 highfreq = spectro(ivec2(900,0));
            vec4 lowfreq = spectro(ivec2(20,0));

            float slider0 = sliders(ivec2(0,0)).x * 0.5;
            float slider1 = sliders(ivec2(1,0)).x * 0.5;
            float s2 = sliders(ivec2(2,0)).x;
            float s3 = sliders(ivec2(3,0)).x;
            float s4 = sliders(ivec2(4,0)).x * 0.5;
            // float slider0 = 1.;

            vec2 uv = XY;
            vec2 uv0 = uv;
            vec3 finalColor = vec3(0.0);
            for (float i = 0.0; i < 4.0; i++) {
                uv = fract(uv * 1.5) - 0.5;
                // float d = sdCircle(uv, 0.) * exp(-length(uv0)) + slider0;
                float d = (1. - s3) * sdCircle(uv, s2) + s3 * sdHexagon(uv, s2);
                d = d * exp(-length(uv0)) + slider0;
                vec3 col = palette(length(uv0) + i*.4 + time*.4) + highfreq.x;
                d = sin(d*8. + time)/8.;
                d = abs(d + slider1);
                d = pow(0.01 / d, 1.2);
                d = d;
                finalColor += col * d;
            }
            // FOut = vec4(1.0) * r;
            // FOut = vec4(r.x,1.0,1.0,1.0);
            // r = vec4(r.xxx,1);
            FOut = vec4(finalColor, 1.0);
            // FOut = r;
        }`})
    }

    free() {
        if (!this.input) return;
        this.input.mediaStream.getTracks().forEach(tr=>tr.stop());
        this.audioCtx.close();
    }
}