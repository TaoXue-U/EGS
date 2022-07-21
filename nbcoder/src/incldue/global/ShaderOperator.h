#ifndef _SHADEROPERATOR_H_
#define _SHADEROPERATOR_H_

#include "ComonInclude.h"


class ShaderObject
{
public:
	ShaderObject();
	ShaderObject(GLenum shaderType);
	ShaderObject(GLenum shaderType, const char* shaderCode);
	~ShaderObject();

	bool createShader(GLenum shaderType);
	void release();
	bool initShaderFromString(const char* shaderCode);

	GLint shaderId(){return m_shaderId;}
	GLenum shaderType(){return m_shaderType;}

private:
	GLenum m_shaderType;
	GLint m_shaderId;
};

class ShaderProgramOperator
{
public:
	ShaderProgramOperator();
	~ShaderProgramOperator();

	void release();
	bool initWithShaderCode(const char* vsh, const char* fsh);
	bool linkShader();

	inline void useProgram(){glUseProgram(m_programId);}

private:
	ShaderObject* m_vShaderObj;
	ShaderObject* m_fShaderObj;

	GLint m_programId;

protected:
	 GLint _uniformLocation(const char* name)
	{
		GLint uniform = glGetUniformLocation(m_programId, name);
		if(uniform < 0)
			printf("unifrom name %d does not exist!");

		return uniform;
	}

public:
	inline GLuint attributeLocation(const char* attributeName)
	{
		return glGetAttribLocation(m_programId, attributeName);
	}

	inline GLuint uniformLocation(const char* name)
	{
		return glGetUniformLocation(m_programId, name);
	}

	inline void bindAttributeLocation(const char* name, GLint location)
	{
		glBindAttribLocation(m_programId, location, name);
	}

	inline void setUniform1f(const char* name, GLfloat v)
	{
		GLint location = _uniformLocation(name);
		glUniform1f(location, v);
	}

	inline void setUniform2f(const char* name, GLfloat v1, GLfloat v2)
	{
		GLint location = _uniformLocation(name);
		glUniform2f(location, v1, v2);
	}

	inline void setUniform3f(const char* name, GLfloat v1, GLfloat v2, GLfloat v3)
	{
		GLint location = _uniformLocation(name);
		glUniform3f(location, v1, v2, v3);
	}

	inline void setUniform4f(const char* name, GLfloat v1, GLfloat v2, GLfloat v3, GLfloat v4)
	{
		GLint location = _uniformLocation(name);
		glUniform4f(location, v1, v2, v3, v4);
	}

	inline void setUnifrom1i(const char* name, GLint v)
	{
		GLint location = _uniformLocation(name);
		glUniform1i(location, v);
	}

	inline void setUniform2i(const char* name, GLint v1, GLint v2)
	{
		GLint location = _uniformLocation(name);
		glUniform2i(location, v1, v2);
	}

	inline void setUniform3i(const char* name, GLint v1, GLint v2, GLint v3)
	{
		GLint location = _uniformLocation(name);
		glUniform3i(location, v1, v2, v3);
	}

	inline void setUniform4i(const char* name, GLint v1, GLint v2, GLint v3, GLint v4)
	{
		GLint location = _uniformLocation(name);
		glUniform4f(location, v1, v2, v3, v4);
	}

	inline void setUnifomrMat2(const char* name,int count, GLboolean transpose, const GLfloat* matrix)
	{
		GLint location = _uniformLocation(name);
		glUniformMatrix2fv(location, count, transpose, matrix);
	}

	inline void setUnifomrMat3(const char* name,int count, GLboolean transpose, const GLfloat* matrix)
	{
		GLint location = _uniformLocation(name);
		glUniformMatrix3fv(location, count, transpose, matrix);
	}

	inline void setUnifomrMat4(const char* name,int count, GLboolean transpose, const GLfloat* matrix)
	{
		GLint location = _uniformLocation(name);
		glUniformMatrix4fv(location, count, transpose, matrix);
	}
};

class Texture2d
{
public:
	Texture2d();
	//Texture2d();
	~Texture2d();

	GLuint initTexByImageBuffer(const void* bufferData, GLint w, GLint h, GLenum channelFmt, GLenum datFmt, GLint channel, GLint bindId, GLenum texFilter, GLenum texWrap);
	void release();


	int width(){return w;}
	int height(){return h;}
	GLuint texId(){return m_texId;}

private:
	GLuint m_texId;
	int w;
	int h;
};

#endif // !_SHADEROPERATOR_H_

