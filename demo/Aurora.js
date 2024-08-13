class Aurora {
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

        fetch('demo/shaders/Aurora.glsl')
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

        this.resolution = new Uint8Array(8)
        // TODO: add texture
    }

    frame(glsl, params) {
        if (!this.analyser) return;
        this.analyser.getByteFrequencyData(this.frequencyArray);
        const canvas = document.getElementById('c');
        this.resolution[0] = canvas.clientWidth;
        this.resolution[1] = canvas.clientHeight;
        const Res = glsl({}, {size:[2, 1], format:'r8', 
            data:this.resolution, tag:'Res'})

        // const n = this.frequencyArray.length;
        // const histLen = 256;
        // const history = glsl({spectro, FP:'I.y>0 ? Src(I-ivec2(0,1)) : spectro(ivec2(I.x,0))'},
        // const spectro = glsl({}, {size:[n, 1], format:'r8', data:this.frequencyArray, tag:'spectro'});
        //                      {size:[n,histLen], story:2, wrap:'edge', tag:'history'});
        // const knobs = glsl({}, {size:[8, 1], format:'r8', data:params.knobs, tag:'knobs'})
        glsl({...params, Res, 
            Aspect:'cover', FP: this.fragmentShader})
    }

    free() {
        if (!this.input) return;
        this.input.mediaStream.getTracks().forEach(tr=>tr.stop());
        this.audioCtx.close();
    }
}