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

void Test::add(int a, int b)
{
	return a + b;
}