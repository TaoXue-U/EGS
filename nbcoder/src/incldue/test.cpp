#ifdef QT_OPENGL_ES_2
#include <QOpenGLFunctions_ES2>
#else
#include <QGLFunctions>
#endif

#include <qgl.h>

#include "test.h"

Test::Test()
{
	
}

Test::~Test()
{

}

int Test::add(int a, int b)
{
	glViewport(0,0,100,100);
	return a + b;
}