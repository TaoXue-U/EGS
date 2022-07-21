precision mediump float;

uniform sampler2D sTexture;
varying vec2 vTexCood;

void main()
{
	gl_FragColor = texture2D(sTexture, vTexCood);
}