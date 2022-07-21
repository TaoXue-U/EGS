#include "ColorTriangle.h"
#include "ShaderOperator.h"

ColorTriangle::ColorTriangle() : BaseModal()
{
}

ColorTriangle::~ColorTriangle()
{
}

void ColorTriangle::initShaderCode()
{
	vsCode = SHADER_STRING(
			attribute vec3 v3Position;
	attribute vec3 av3Color;
	varying vec3 vv3Color;
			void main(void){
				vv3Color = av3Color;
				gl_Position = vec4(v3Position, 1.0);
			}
		);

	fsCode = SHADER_STRING(
			precision mediump float;
			varying vec3 vv3Color;
			void main(void)
			{
				gl_FragColor = vec4(vv3Color, 1.0);
			}
		);

}

void ColorTriangle::initData()
{
	BaseModal::initData();

	float colorData[9] = {1.0f, 0.0f,  0.0f, 0.0f, 1.0f, 0.0f, 0.0f, 0.0f, 1.0f};
	glGenBuffers(1, &m_colorBuffer);
	if(m_colorBuffer  == 0)
	{
		printf("vertex error");
		return;
	}
	glBindBuffer(GL_ARRAY_BUFFER, m_colorBuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(colorData), colorData, GL_STATIC_DRAW);


	m_colorLoc  = m_shaderProgram->attributeLocation("av3Color");
	m_shaderProgram->bindAttributeLocation("av3Color", m_colorLoc);
}

void ColorTriangle::render()
{
	if(m_shaderProgram != NULL)
	{
		m_shaderProgram->useProgram();

		glBindBuffer(GL_ARRAY_BUFFER, m_vertexBuffer);
		glEnableVertexAttribArray(m_posAttribLocation);
		glVertexAttribPointer(m_posAttribLocation, 3, GL_FLOAT, false, 0, 0);
		glBindBuffer(GL_ARRAY_BUFFER, 0);

		glBindBuffer(GL_ARRAY_BUFFER, m_colorBuffer);
		glEnableVertexAttribArray(m_colorLoc);
		glVertexAttribPointer(m_colorLoc, 3, GL_FLOAT, false, 0, 0);
		glBindBuffer(GL_ARRAY_BUFFER, 0);


		glDrawArrays(GL_TRIANGLES, 0, 3);
	}
}


