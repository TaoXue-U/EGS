#ifndef _COLORTRIANGLE_H_
#define _COLORTRIANGLE_H_

#include "ModalInterface.h"

class ShaderProgramOperator;

class ColorTriangle : public BaseModal
{
public:
	ColorTriangle();
	~ColorTriangle();

	void render();
protected:
	virtual void initData();
	virtual void initShaderCode();

private:
	GLuint m_colorBuffer;
	GLuint m_colorLoc;

};

#endif // !_COLORTRIANGLE_H_
