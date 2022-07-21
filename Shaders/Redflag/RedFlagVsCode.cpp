uniform mat4 uMVPMatrix;
uniform float maxLength;
uniform float startAngle;


attribute vec3 aPosition;
attribute vec2 texCood;
varying vec2 vTexCood;

void main()
{

	float totalAngle = 4.0 * 3.141592653;
	float startX = -maxLength / 2.0;

	float currentAngle = startAngle + (aPosition.x - startX)/maxLength*totalAngle;
	float finalz = sin(currentAngle)*0.2;

	gl_Position = uMVPMatrix * vec4(aPosition.x, aPosition.y, finalz, 1);
	vTexCood = texCood;
}
