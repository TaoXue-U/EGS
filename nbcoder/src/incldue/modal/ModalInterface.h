#ifndef _MODALINTERFACE_H_
#define _MODALINTERFACE_H_

#include "ComonInclude.h"

class ShaderProgramOperator;

class ModalInterface
{
public:
	ModalInterface();
	virtual ~ModalInterface();

	virtual void render(){}

	virtual void rotate(float v){}

	virtual void roateTo(float v){}

	virtual void translate(float dx, float dy, float dz){}

	virtual void translateTo(float x, float y, float z){}

	virtual void scale(float s){}
};

//这里的旋转和缩放，暂时不支持绕某个特定向量旋转和缩放
class BaseModal : public ModalInterface
{
public:
	BaseModal();
	virtual ~BaseModal();

	virtual void render();

	virtual void rotate(float v);

	virtual void roateTo(float v);

	virtual void translate(float dx, float dy, float dz);

	virtual void translateTo(float x, float y, float z);

	virtual void scale(float s);

	virtual void release();
	
	void initProgram();
protected:
	virtual void initShaderCode();

	virtual void initData();

protected:
	char* vsCode;
	char* fsCode;

	GLuint m_posAttribLocation;
	GLuint m_vertexBuffer;
	ShaderProgramOperator* m_shaderProgram;
};

#endif // !_MODALINTERFACE_H_
