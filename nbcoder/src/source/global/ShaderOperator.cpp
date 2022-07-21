#include "ShaderOperator.h"

ShaderObject::ShaderObject()
	: m_shaderId(0), m_shaderType(GL_FALSE)
{
}

ShaderObject::ShaderObject(GLenum shaderType)
	: m_shaderType(shaderType)
{
	m_shaderId = glCreateShader(shaderType);
}

ShaderObject::ShaderObject(GLenum shaderType, const char* shaderCode) 
	: m_shaderId(0), m_shaderType(shaderType)
{
	m_shaderId = glCreateShader(shaderType);
	initShaderFromString(shaderCode);
}

ShaderObject::~ShaderObject()
{

}


bool ShaderObject::createShader(GLenum shaderType)
{
	if(m_shaderId == 0)
		m_shaderId = glCreateShader(shaderType);

	return m_shaderId != 0;
}

void ShaderObject::release()
{
	if (m_shaderId == 0)
		return;
	glDeleteShader(m_shaderId);
	m_shaderId = 0;
	m_shaderType = GL_FALSE;
}

bool ShaderObject::initShaderFromString(const char* shaderCode)
{
	if(m_shaderId == 0)
	{
		m_shaderId = glCreateShader(m_shaderType);

		if(m_shaderId == 0)
		{
			perror("create shader error");
		}
	}

	glShaderSource(m_shaderId, 1, (const GLchar**)&shaderCode, NULL);
	glCompileShader(m_shaderId);

	GLint compiled = 0;
	glGetShaderiv(m_shaderId, GL_COMPILE_STATUS, &compiled);
	if(compiled == GL_TRUE) return true;

	GLint logLen;
	glGetShaderiv(m_shaderId, GL_INFO_LOG_LENGTH, &logLen);
	if(logLen > 0)
	{
		char *buf = new char[logLen];
		if(buf != NULL)
		{
			glGetShaderInfoLog(m_shaderId, logLen, &logLen, buf);
			printf("Shader %d compile faild: \n%s\n", m_shaderId	, buf);
			delete[] buf;
		}
	}

	return false;
}




//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

ShaderProgramOperator::ShaderProgramOperator()
{
	m_programId = glCreateProgram();
	m_vShaderObj = new ShaderObject(GL_VERTEX_SHADER);
	m_fShaderObj = new ShaderObject(GL_FRAGMENT_SHADER);
}

ShaderProgramOperator::~ShaderProgramOperator()
{
	
}

bool ShaderProgramOperator::initWithShaderCode(const char* vsh, const char* fsh)
{
	if(vsh == NULL || fsh == NULL)
		return false;

	return m_vShaderObj->initShaderFromString(vsh) && m_fShaderObj->initShaderFromString(fsh);
}

bool ShaderProgramOperator::linkShader()
{
	
	if(m_programId != 0)
	{
		GLuint attachedShaders[32];
		int numAttachedShaders;
		glGetAttachedShaders(m_programId, 32, &numAttachedShaders, attachedShaders);
		for(int i = 0; i < numAttachedShaders; ++i)
		{
			glDetachShader(m_programId, attachedShaders[i]);
		}
		perror("Detach Shaders in useProgram");
	}
	else
	{
		m_programId = glCreateProgram();
	}
	GLint programStatus;
	glAttachShader(m_programId, m_vShaderObj->shaderId());
	glAttachShader(m_programId, m_fShaderObj->shaderId());
	printf("Attach Shaders in useProgram");
	glLinkProgram(m_programId);
	glGetProgramiv(m_programId, GL_LINK_STATUS, &programStatus);

	if(programStatus != GL_TRUE)
	{
		GLint logLen = 0;
		glGetProgramiv(m_programId, GL_INFO_LOG_LENGTH, &logLen);
		if(logLen != 0)
		{
			char *buf = new char[logLen];
			if(buf != NULL)
			{
				glGetProgramInfoLog(m_programId, logLen, &logLen, buf);
				printf("Failed to link the program!\n%s", buf);
				delete[] buf;
			}
		}
		printf("LINK %d Failed\n", m_programId);
		return false;
	}
	perror("Link Program");
	return true;
}

void ShaderProgramOperator::release()
{
	if(m_programId != 0){
		glDeleteProgram(m_programId);
		m_vShaderObj->release();
		m_fShaderObj->release();
		m_vShaderObj = NULL;
		m_fShaderObj = NULL;
		m_programId = 0;
	}
}



//////////////////////////////////////////////////////////////////////////////////////////////////
//////////////////////////////////////////////////////////////////////////////////////////////////

Texture2d::Texture2d()
{
}

Texture2d::~Texture2d()
{
}

GLuint Texture2d::initTexByImageBuffer(const void* bufferData, GLint w, GLint h, GLenum channelFmt, GLenum dataFmt, GLint channel, GLint bindId, GLenum texFilter, GLenum texWrap)
{
	GLuint tex;

	static GLenum eArr[] = { GL_LUMINANCE, GL_LUMINANCE_ALPHA, GL_RGB, GL_RGBA};
	if(channel <=0 || channel > 4)
		return 0;

	GLenum internalFormat = eArr[channel - 1];
	glActiveTexture(GL_TEXTURE0 + bindId);
	glGenTextures(1, &tex);
	glBindTexture(GL_TEXTURE_2D, tex);
	glTexImage2D(GL_TEXTURE_2D, 0, internalFormat, w, h, 0, channelFmt, dataFmt, bufferData);
	
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MIN_FILTER, texFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_MAG_FILTER, texFilter);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_S, texWrap);
	glTexParameteri(GL_TEXTURE_2D, GL_TEXTURE_WRAP_T, texWrap);

	return tex;
}

void Texture2d::release()
{
	glDeleteTextures(1, &m_texId);
	m_texId = 0;
}






