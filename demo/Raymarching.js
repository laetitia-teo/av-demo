class Raymarching {
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

        fetch('demo/shaders/Raymarching.glsl')
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.text();
            })
            .then(data => {
                this.fragmentShader = data;
            })
            .catch(error => {
                console.error('There has been a problem with your fetch operation:', error);
            });
    }

    frame(glsl, params) {
        if (!this.analyser) return;
        // console.log(this.sliders)
        this.analyser.getByteFrequencyData(this.frequencyArray);
        const n = this.frequencyArray.length;
        const histLen = 256;
        const spectro = glsl({}, {size:[n, 1], format:'r8', data:this.frequencyArray, tag:'spectro'});
        const history = glsl({spectro, FP:'I.y>0 ? Src(I-ivec2(0,1)) : spectro(ivec2(I.x,0))'},
                             {size:[n,histLen], story:2, wrap:'edge', tag:'history'});
        const sliders = glsl({}, {size:[8, 1], format:'r8', data:params.sliders, tag:'sliders'})
        const knobs = glsl({}, {size:[8, 1], format:'r8', data:params.knobs, tag:'knobs'})
        glsl({...params, Aspect:'cover', spectro, sliders, knobs, n, FP: this.fragmentShader})
    }

    free() {
        if (!this.input) return;
        this.input.mediaStream.getTracks().forEach(tr=>tr.stop());
        this.audioCtx.close();
    }
}