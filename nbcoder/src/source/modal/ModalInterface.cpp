#include "ModalInterface.h"
#include "ShaderOperator.h"


ModalInterface::ModalInterface()
{

}

ModalInterface::~ModalInterface()
{

}


//爱的分界线
//////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////

BaseModal::BaseModal()
{
	
}

BaseModal::~BaseModal()
{
	this->release();
}

void BaseModal::initShaderCode()
{
	vsCode = SHADER_STRING(
			attribute vec3 v3Position;
			void main(void)
			{
				gl_Position = vec4(v3Position, 1.0);
			}
		);

	fsCode = SHADER_STRING(
			void main(void)
			{
				gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
			}
		);
}

void BaseModal::initData()
{
	float sVertexDataCommon[9] = {-1.0f, 0.0f,  0.0f,0.0f, 1.0f, 0.0f,1.0f, 0.0f, 0.0f};
	glGenBuffers(1, &m_vertexBuffer);
	if(m_vertexBuffer  == 0)
	{
		printf("vertex error");
		return;
	}
	glBindBuffer(GL_ARRAY_BUFFER, m_vertexBuffer);
	glBufferData(GL_ARRAY_BUFFER, sizeof(sVertexDataCommon), sVertexDataCommon, GL_STATIC_DRAW);
	glBindBuffer(GL_ARRAY_BUFFER, 0);

	m_posAttribLocation = m_shaderProgram->attributeLocation("v3Position");;
	m_shaderProgram->bindAttributeLocation("v3Position", m_posAttribLocation);

}

void BaseModal::initProgram()
{
	initShaderCode();

	m_shaderProgram = new ShaderProgramOperator();
	m_shaderProgram->initWithShaderCode(vsCode, fsCode);

	if(!m_shaderProgram->linkShader())
	{
		printf("link error!");
		return;
	}
	m_shaderProgram->useProgram();
	initData();
}

void BaseModal::render()
{
	if(m_shaderProgram != NULL)
	{
		m_shaderProgram->useProgram();

		glBindBuffer(GL_ARRAY_BUFFER, m_vertexBuffer);
		glEnableVertexAttribArray(m_posAttribLocation);
		glVertexAttribPointer(m_posAttribLocation, 3, GL_FLOAT, false, 0, 0);
		glDrawArrays(GL_TRIANGLES, 0, 3);
	}
}



void BaseModal::rotate(float v)
{

}

void BaseModal::roateTo(float v)
{

}

void BaseModal::translate(float dx, float dy, float dz)
{

}

void BaseModal::translateTo(float x, float y, float z)
{

}

void BaseModal::scale(float s)
{

}

void BaseModal::release()
{
	m_shaderProgram->release();
}