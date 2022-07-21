
#ifdef GL_FRAGMENT_PRECISION_HIGH
    precision highp float;
#else
    precision mediump float;
#endif
varying vec2 vTexCood;
uniform sampler2D sTexture;      
uniform sampler2D sSampTex;      

void main()
{
    vec3 src = texture2D(sTexture, vTexCood).rgb;
    vec3 dst;

    float r  = texture2D(sSampTex, vec2(src.r, 0.0)).r;
    float g  = texture2D(sSampTex, vec2(src.g, 0.0)).g;
    float b  = texture2D(sSampTex, vec2(src.b, 0.0)).b;
                
    dst = vec3(r, g, b); 
    gl_FragColor = vec4(dst, 1.0);
}